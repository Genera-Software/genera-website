"use client";

import type { ReactNode } from "react";
import { ConsentManagerProvider } from "@c15t/nextjs";
import { getConsentOptions } from "@/lib/consent/get-consent-options";
import GoogleAnalyticsConsentSync from "@/components/GoogleAnalyticsConsentSync";

export default function ConsentProvider({ children }: { children: ReactNode }) {
  return (
    <ConsentManagerProvider options={getConsentOptions()}>
      {children}
      <GoogleAnalyticsConsentSync />
    </ConsentManagerProvider>
  );
}
