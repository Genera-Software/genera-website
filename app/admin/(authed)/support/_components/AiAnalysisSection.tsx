import { AdminFormStatusButton } from "../../_components/AdminBusyButton";
import { startSupportAssistant } from "../actions";
import AiAnalysisDriver from "./AiAnalysisDriver";
import UseDraftReplyButton from "./UseDraftReplyButton";
import type { TicketAnalysis } from "@/lib/support/ai-analysis";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** The "Draft reply to the customer" section of the report, if it wrote one. */
function extractDraftReply(report: string): string | null {
  const match = report.match(
    /\*\*Draft reply to the customer\*\*[^\n]*\n([\s\S]*?)(?=\n\s*\*\*Confidence\*\*|$)/i,
  );
  const draft = match?.[1]?.trim();
  return draft || null;
}

function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
        Support assistant
      </h2>
      {children}
    </div>
  );
}

export default function AiAnalysisSection({
  ticketId,
  analysis,
  configured,
  canReply,
}: {
  ticketId: string;
  analysis: TicketAnalysis;
  configured: boolean;
  canReply: boolean;
}) {
  const running = analysis.status === "running";
  const draft =
    canReply && analysis.suggestion ? extractDraftReply(analysis.suggestion) : null;

  const askForm = (label: string) => (
    <form
      action={async () => {
        "use server";
        await startSupportAssistant(ticketId);
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
          <code className="font-mono text-xs">SUPPORT_LLM_API_KEY</code>,{" "}
          <code className="font-mono text-xs">SUPPORT_LLM_MODEL</code>,{" "}
          <code className="font-mono text-xs">SUPPORT_REPO_URL</code> and{" "}
          <code className="font-mono text-xs">SUPPORT_REPO_TOKEN</code> (plus{" "}
          <code className="font-mono text-xs">SUPPORT_DB_URL</code> for
          database access) — see the README.
        </p>
      ) : running ? (
        <AiAnalysisDriver ticketId={ticketId} />
      ) : analysis.status === "ready" && analysis.suggestion ? (
        <>
          <p className="mb-3 text-xs text-ink-soft">
            Read-only look at the app&rsquo;s data and code. Verify before
            acting, and edit the draft reply before sending.
          </p>
          <div className="max-h-[36rem] overflow-y-auto rounded-lg border border-cream-dark bg-cream/40 p-4">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-ink">
              {analysis.suggestion}
            </pre>
          </div>
          <div className="mt-3 flex items-center justify-end gap-4">
            {draft && <UseDraftReplyButton draft={draft} />}
            {askForm("Run again")}
          </div>
        </>
      ) : analysis.status === "failed" ? (
        <>
          <p className="mb-3 text-sm text-red-700">
            {analysis.error ?? "The assistant failed."}
          </p>
          <div className="flex justify-end">{askForm("Try again")}</div>
        </>
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-soft">
            A technical support agent checks this customer&rsquo;s data and the
            app code (read-only), then suggests a fix and drafts a reply. Takes
            about a minute; keep this page open while it runs. The customer&rsquo;s
            identity is withheld from the model.
          </p>
          <div className="flex justify-end">{askForm("Ask the assistant")}</div>
        </>
      )}
    </section>
  );
}
