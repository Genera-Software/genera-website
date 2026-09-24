import "server-only";
import postgres from "postgres";

/**
 * Read-only SQL against the **app's** database, for the support assistant.
 *
 * `SUPPORT_DB_URL` must be a connection string for a dedicated role that only
 * has SELECT grants (see `scripts/support-reader-role.sql`). On top of that
 * role, every query here is:
 *   - wrapped as a subquery, so only a single SELECT / WITH can run — stacked
 *     statements and data-modifying CTEs are syntax errors;
 *   - run inside a READ ONLY transaction with a short statement timeout;
 *   - capped at MAX_ROWS rows.
 * The role is the real guarantee; the rest is so a mistake fails loudly.
 */

const MAX_ROWS = 50;
const STATEMENT_TIMEOUT = "5s";

/**
 * Placeholders the model may use in place of values it is never shown. They are
 * sent to Postgres as bound parameters, so the value never enters the prompt.
 */
export type QueryParams = { customer_email: string | null };

export function isAppDbConfigured(): boolean {
  return Boolean(process.env.SUPPORT_DB_URL);
}

function connect() {
  const url = process.env.SUPPORT_DB_URL;
  if (!url) throw new Error("SUPPORT_DB_URL is not set.");
  // One short-lived connection per call: this runs in a serverless function,
  // and `prepare: false` keeps it compatible with Supabase's transaction pooler.
  return postgres(url, {
    max: 1,
    prepare: false,
    connect_timeout: 5,
    idle_timeout: 1,
    onnotice: () => {},
  });
}

function normalise(query: string): string {
  const trimmed = query.trim().replace(/;+\s*$/, "");
  if (!/^(select|with)\b/i.test(trimmed)) {
    throw new Error("Only a single SELECT (or WITH … SELECT) query is allowed.");
  }
  return trimmed;
}

export async function runReadOnlyQuery(
  query: string,
  params: QueryParams,
): Promise<{ rows: Record<string, unknown>[]; truncated: boolean }> {
  const inner = normalise(query);

  const values: string[] = [];
  const bound = inner.replace(/(?<!:):customer_email\b/g, () => {
    if (!params.customer_email) {
      throw new Error("This ticket has no customer email, so :customer_email is unavailable.");
    }
    values.push(params.customer_email);
    return `$${values.length}`;
  });

  const sql = connect();
  try {
    const rows = await sql.begin("read only", async (tx) => {
      await tx.unsafe(`set local statement_timeout = '${STATEMENT_TIMEOUT}'`);
      return tx.unsafe(
        `select * from (\n${bound}\n) as support_query limit ${MAX_ROWS + 1}`,
        values,
      );
    });
    const list = [...rows] as Record<string, unknown>[];
    return {
      rows: list.slice(0, MAX_ROWS),
      truncated: list.length > MAX_ROWS,
    };
  } finally {
    await sql.end({ timeout: 1 });
  }
}

/** Tables and columns the reader role can see, compact enough for a prompt. */
export async function describeSchema(tableFilter?: string): Promise<string> {
  const sql = connect();
  try {
    const rows = await sql.begin("read only", async (tx) => {
      return tx<{ table_name: string; column_name: string; data_type: string }[]>`
        select table_name, column_name, data_type
        from information_schema.columns
        where table_schema = 'public'
          and (${tableFilter ?? null}::text is null or table_name ilike '%' || ${tableFilter ?? null}::text || '%')
        order by table_name, ordinal_position
      `;
    });
    if (!rows.length) return "No tables visible to the support reader role.";
    const byTable = new Map<string, string[]>();
    for (const r of rows) {
      const cols = byTable.get(r.table_name) ?? [];
      cols.push(`${r.column_name} ${r.data_type}`);
      byTable.set(r.table_name, cols);
    }
    return [...byTable]
      .map(([table, cols]) => `${table}(${cols.join(", ")})`)
      .join("\n");
  } finally {
    await sql.end({ timeout: 1 });
  }
}
