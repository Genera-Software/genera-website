"use client";

import { useConsentManager } from "@c15t/nextjs";
import { useEffect } from "react";
import { ANALYTICS_CONSENT_COOKIE } from "@/lib/analytics/ga-measurement-id";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function writeConsentCookie(granted: boolean) {
  const { hostname, protocol } = window.location;
  // Shared with the app subdomain in production; host-only on localhost and previews.
  const domain =
    hostname === "generasoftware.com" || hostname.endsWith(".generasoftware.com")
      ? "; Domain=.generasoftware.com"
      : "";
  const secure = protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${granted ? "granted" : "denied"}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${domain}${secure}`;
}

/**
 * Mirrors c15t cookie categories into Google Consent Mode v2 so gtag respects
 * measurement vs marketing choices after the GA4 tag is configured in the root layout.
 *
 * Also mirrors the measurement choice into ANALYTICS_CONSENT_COOKIE for the app subdomain.
 */
export default function GoogleAnalyticsConsentSync() {
  const { consents } = useConsentManager();

  useEffect(() => {
    if (typeof window === "undefined") return;
    writeConsentCookie(Boolean(consents.measurement));

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
