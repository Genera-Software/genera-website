import { AdminFormStatusButton } from "../../_components/AdminBusyButton";
import { askClaude } from "../actions";
import AiAnalysisPoller from "./AiAnalysisPoller";
import type { TicketAnalysis } from "@/lib/support/ai-analysis";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
        Claude code analysis
      </h2>
      {children}
    </div>
  );
}

export default function AiAnalysisSection({
  ticketId,
  analysis,
  configured,
}: {
  ticketId: string;
  analysis: TicketAnalysis;
  configured: boolean;
}) {
  const running = analysis.status === "running";

  const askForm = (label: string) => (
    <form
      action={async () => {
        "use server";
        await askClaude(ticketId);
      }}
    >
      <AdminFormStatusButton
        type="submit"
        variant="forestSm"
        pendingLabel="Starting…"
        disabled={!configured || running}
      >
        {label}
      </AdminFormStatusButton>
    </form>
  );

  return (
    <section className="rounded-2xl border border-teal-mid bg-white p-6">
      <Header>
        {analysis.status === "ready" && analysis.completedAt && (
          <span className="text-xs text-ink-soft">
            Ran {formatDate(analysis.completedAt)}
          </span>
        )}
      </Header>

      {!configured ? (
        <p className="text-sm text-ink-soft">
          Not configured on this deployment. Set{" "}
          <code className="font-mono text-xs">ANTHROPIC_API_KEY</code>,{" "}
          <code className="font-mono text-xs">ANTHROPIC_SUPPORT_AGENT_ID</code>,{" "}
          <code className="font-mono text-xs">ANTHROPIC_SUPPORT_ENV_ID</code>,{" "}
          <code className="font-mono text-xs">SUPPORT_REPO_URL</code> and{" "}
          <code className="font-mono text-xs">SUPPORT_REPO_TOKEN</code> — see{" "}
          <code className="font-mono text-xs">anthropic/README.md</code>.
        </p>
      ) : running ? (
        <>
          <AiAnalysisPoller />
          <div className="flex items-center gap-3 rounded-lg border border-cream-dark bg-cream/40 px-4 py-3">
            <span
              className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-teal-mid/50 border-t-forest"
              aria-hidden
            />
            <p className="text-sm text-ink">
              Reading the repo — this usually takes a few minutes. The result
              appears here on its own; you can leave the page.
            </p>
          </div>
        </>
      ) : analysis.status === "ready" && analysis.suggestion ? (
        <>
          <p className="mb-3 text-xs text-ink-soft">
            Internal engineering aid only — verify before acting, and never send
            this to a customer verbatim.
          </p>
          <div className="max-h-[36rem] overflow-y-auto rounded-lg border border-cream-dark bg-cream/40 p-4">
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-ink">
              {analysis.suggestion}
            </pre>
          </div>
          <div className="mt-3 flex justify-end">{askForm("Run again")}</div>
        </>
      ) : analysis.status === "failed" ? (
        <>
          <p className="mb-3 text-sm text-red-700">
            {analysis.error ?? "The analysis failed."}
          </p>
          <div className="flex justify-end">{askForm("Try again")}</div>
        </>
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-soft">
            Clone the app repo into a sandbox and have Claude trace this ticket
            through the source. Customer identity is stripped before the ticket
            is sent.
          </p>
          <div className="flex justify-end">{askForm("Ask Claude")}</div>
        </>
      )}
    </section>
  );
}
