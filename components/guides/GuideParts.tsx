import type { ReactNode } from "react";

/* ============================================================
   Building blocks for the reference guides. Each one is a
   shape an answer engine can lift: a quoted rule with its
   citation attached, a figures table, a worked sum. Keep the
   citation on the same element as the claim so nothing can
   be quoted without its source.
   ============================================================ */

/**
 * A section with an anchor for the in-page contents list. Each one opens with a
 * paw rule rather than running straight on from the last, so a long reference
 * page reads as parts instead of one column of prose.
 */
export function GuideSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-5 flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-teal-mid" />
        <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none text-gold" fill="currentColor">
          <circle cx="5.5" cy="11" r="2.2" />
          <circle cx="9.5" cy="6" r="2.2" />
          <circle cx="14.5" cy="6" r="2.2" />
          <circle cx="18.5" cy="11" r="2.2" />
          <path d="M12 11.5c-3 0-5.5 2.5-5.5 5.5 0 1.5 1 3 2.5 3.5 1 0 2-.5 3-.5s2 .5 3 .5c1.5-.5 2.5-2 2.5-3.5 0-3-2.5-5.5-5.5-5.5z" />
        </svg>
        <span className="h-px flex-1 bg-teal-mid" />
      </div>
      <h2 className="mb-4 font-massilia text-[1.6rem] font-bold leading-[var(--leading-title)] text-forest md:text-[1.85rem]">
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-body-lg leading-[1.7] text-ink-soft">{children}</p>;
}

/**
 * A rule quoted from its source, with the citation on the block. `quote` is
 * verbatim; anything paraphrased goes in `children` underneath.
 */
export function Rule({
  quote,
  cite,
  href,
  children,
}: {
  quote: ReactNode;
  cite: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <figure className="rounded-2xl border border-cream-dark bg-white p-5 md:p-6">
      <blockquote className="border-l-4 border-gold pl-4 text-[1.1rem] leading-[1.6] text-ink">
        {quote}
      </blockquote>
      <figcaption className="mt-3 text-meta text-ink-soft">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            {cite}
          </a>
        ) : (
          <span className="font-semibold text-forest">{cite}</span>
        )}
      </figcaption>
      {children && (
        <div className="mt-4 text-body-lg leading-[1.65] text-ink-soft">{children}</div>
      )}
    </figure>
  );
}

/** Figures table. First column is the label; keep cells short. */
export function Figures({
  caption,
  head,
  rows,
}: {
  caption?: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-cream-dark bg-white">
      <table className="w-full border-collapse text-left text-[0.98rem]">
        {caption && (
          <caption className="border-b border-cream-dark px-5 py-3 text-left font-massilia text-base font-bold text-forest">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="bg-teal-soft/60 text-eyebrow font-bold uppercase tracking-wider text-forest">
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-cream-dark align-top">
              {r.map((c, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? "px-5 py-3 font-semibold text-forest"
                      : "px-5 py-3 text-ink-soft"
                  }
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A worked sum. Each line is [label, value]; the last line is the total. */
export function Sum({
  title,
  lines,
  note,
}: {
  title: string;
  lines: [string, string][];
  note?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-forest p-5 text-white md:p-6">
      <p className="font-massilia text-base font-bold text-gold-soft">{title}</p>
      <dl className="mt-3 divide-y divide-white/10">
        {lines.map(([k, v], i) => {
          const last = i === lines.length - 1;
          return (
            <div
              key={k}
              className={`flex items-baseline justify-between gap-4 py-2 ${last ? "font-bold text-gold" : "text-white/85"}`}
            >
              <dt className="text-[0.98rem]">{k}</dt>
              <dd className="anim-tabular text-right text-[1.05rem]">{v}</dd>
            </div>
          );
        })}
      </dl>
      {note && <p className="mt-3 text-fine leading-relaxed text-white/70">{note}</p>}
    </div>
  );
}

/** A plain warning or clarification. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-gold/60 bg-gold-light/60 px-5 py-4 text-[1.02rem] leading-[1.6] text-ink">
      {children}
    </div>
  );
}

/** Inline link to an outside source. */
export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
    >
      {children}
    </a>
  );
}
