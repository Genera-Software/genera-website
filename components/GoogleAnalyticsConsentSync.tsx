"use client";

import { useConsentManager } from "@c15t/nextjs";
import { useEffect } from "react";

/**
 * Mirrors c15t cookie categories into Google Consent Mode v2 so gtag respects
 * measurement vs marketing choices after the GA4 tag is configured in the root layout.
 */
export default function GoogleAnalyticsConsentSync() {
  const { consents } = useConsentManager();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const gtag = window.gtag;
    if (typeof gtag !== "function") return;

    gtag("consent", "update", {
      analytics_storage: consents.measurement ? "granted" : "denied",
      ad_storage: consents.marketing ? "granted" : "denied",
      ad_user_data: consents.marketing ? "granted" : "denied",
      ad_personalization: consents.marketing ? "granted" : "denied",
    });
  }, [
    consents.measurement,
    consents.marketing,
    consents.necessary,
    consents.functionality,
    consents.experience,
  ]);

  return null;
}
