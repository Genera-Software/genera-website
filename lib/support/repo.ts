import "server-only";

/**
 * Read-only access to the app repo over the GitHub REST API. The token only
 * needs `Contents: Read-only` on that one repo — nothing here can write.
 */

const API = "https://api.github.com";
const TIMEOUT_MS = 10_000;

/** Enough of a file to reason about without flooding the model's context. */
const MAX_LINES = 400;

export function isRepoConfigured(): boolean {
  return Boolean(process.env.SUPPORT_REPO_URL && process.env.SUPPORT_REPO_TOKEN);
}

function repoConfig() {
  const url = process.env.SUPPORT_REPO_URL;
  const token = process.env.SUPPORT_REPO_TOKEN;
  if (!url || !token) {
    throw new Error("SUPPORT_REPO_URL and SUPPORT_REPO_TOKEN must be set.");
  }
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  if (!match) throw new Error(`SUPPORT_REPO_URL is not a GitHub URL: ${url}`);
  return {
    owner: match[1],
    repo: match[2],
    token,
    branch: process.env.SUPPORT_REPO_BRANCH ?? "main",
  };
}

async function gh(path: string, accept = "application/vnd.github+json") {
  const { token } = repoConfig();
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub ${res.status}: ${body.slice(0, 200)}`);
  }
  return res;
}

/** Every file path on the branch whose path contains `query` (case-insensitive). */
export async function findFiles(query: string): Promise<string> {
  const { owner, repo, branch } = repoConfig();
  const res = await gh(
    `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
  );
  const data = (await res.json()) as {
    tree: { path: string; type: string }[];
  };
  const needle = query.toLowerCase();
  const hits = data.tree
    .filter((e) => e.type === "blob" && e.path.toLowerCase().includes(needle))
    .filter((e) => !e.path.includes("node_modules/"))
    .map((e) => e.path);
  if (!hits.length) return `No file paths contain "${query}".`;
  const shown = hits.slice(0, 80);
  const more = hits.length > shown.length ? `\n… and ${hits.length - shown.length} more` : "";
  return shown.join("\n") + more;
}

/**
 * GitHub code search. It only indexes the default branch and can lag a push by
 * a few minutes, so the prompt treats it as a pointer, not the final word.
 */
export async function searchCode(query: string): Promise<string> {
  const { owner, repo } = repoConfig();
  const q = encodeURIComponent(`${query} repo:${owner}/${repo}`);
  const res = await gh(
    `/search/code?q=${q}&per_page=20`,
    "application/vnd.github.text-match+json",
  );
  const data = (await res.json()) as {
    total_count: number;
    items: {
      path: string;
      text_matches?: { fragment: string }[];
    }[];
  };
  if (!data.items.length) return `No code matches "${query}".`;
  return data.items
    .map((item) => {
      const frag = item.text_matches?.[0]?.fragment?.trim();
      return frag ? `${item.path}\n  ${frag.replace(/\n/g, "\n  ")}` : item.path;
    })
    .join("\n\n");
}

/** File contents with line numbers, optionally a slice. */
export async function readFile(
  path: string,
  startLine = 1,
  endLine?: number,
): Promise<string> {
  const { owner, repo, branch } = repoConfig();
  const clean = path.replace(/^\/+/, "");
  const res = await gh(
    `/repos/${owner}/${repo}/contents/${clean
      .split("/")
      .map(encodeURIComponent)
      .join("/")}?ref=${encodeURIComponent(branch)}`,
    "application/vnd.github.raw+json",
  );
  const lines = (await res.text()).split("\n");
  const from = Math.max(1, startLine);
  const to = Math.min(lines.length, endLine ?? from + MAX_LINES - 1, from + MAX_LINES - 1);
  const body = lines
    .slice(from - 1, to)
    .map((line, i) => `${String(from + i).padStart(5)}  ${line}`)
    .join("\n");
  const tail =
    to < lines.length
      ? `\n… file has ${lines.length} lines; read from line ${to + 1} for more.`
      : "";
  return `${clean} (lines ${from}-${to} of ${lines.length})\n${body}${tail}`;
}

/** The latest commits on the branch, optionally only those touching `path`. */
export async function recentCommits(path?: string): Promise<string> {
  const { owner, repo, branch } = repoConfig();
  const params = new URLSearchParams({ sha: branch, per_page: "15" });
  if (path) params.set("path", path);
  const res = await gh(`/repos/${owner}/${repo}/commits?${params}`);
  const data = (await res.json()) as {
    sha: string;
    commit: { message: string; author: { date: string } | null };
  }[];
  if (!data.length) return "No commits found.";
  return data
    .map(
      (c) =>
        `${c.sha.slice(0, 7)}  ${c.commit.author?.date.slice(0, 10) ?? "?"}  ${c.commit.message.split("\n")[0]}`,
    )
    .join("\n");
}
