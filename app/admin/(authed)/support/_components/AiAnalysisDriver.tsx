"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { advanceSupportAssistant } from "../actions";

/**
 * Drives a running support assistant one step per request — each step is a
 * model turn or a batch of tool calls, short enough for a serverless request.
 * Leaving the page pauses the run; coming back picks it up where it stopped.
 */
export default function AiAnalysisDriver({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [activity, setActivity] = useState("Reading the ticket");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        while (!cancelled) {
          const progress = await advanceSupportAssistant(ticketId);
          if (cancelled) return;
          if (progress.status !== "running") break;
          if (progress.activity) setActivity(progress.activity);
        }
      } catch {
        // A dropped request leaves the run resumable; the refresh below shows
        // whatever state was last saved.
      }
      if (!cancelled) router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [ticketId, router]);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-cream-dark bg-cream/40 px-4 py-3">
      <span
        className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-teal-mid/50 border-t-forest"
        aria-hidden
      />
      <p className="text-sm text-ink" aria-live="polite">
        {activity}…
      </p>
    </div>
  );
}
