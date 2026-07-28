"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * A repo analysis runs for minutes on Anthropic's side. Refreshing the ticket
 * page re-runs the server-side reconcile, so a quiet poll is all that is needed
 * to have the result appear on its own — no webhook to register.
 */
export default function AiAnalysisPoller({
  intervalMs = 8000,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);

  return null;
}
