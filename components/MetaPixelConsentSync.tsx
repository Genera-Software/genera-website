"use client";

import { useConsentManager } from "@c15t/nextjs";
import { useEffect } from "react";
import { META_PIXEL_ID } from "@/lib/analytics/meta-pixel-id";

/**
 * Loads the Meta pixel only after the visitor accepts marketing cookies, and revokes it if
 * they later withdraw.
 *
 * Also mirrors that choice into a `genera_ad_consent` cookie on .generasoftware.com.
 * People register on app.generasoftware.com, which has no banner of its own and reads
 * this cookie before loading its own pixel or sending the server-side registration event.
 * The app's reader is lib/meta/pixel.ts in the genera repo; keep the name and values in step.
 */
const AD_CONSENT_COOKIE = "genera_ad_consent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function writeConsentCookie(granted: boolean) {
  const { hostname, protocol } = window.location;
  // Shared with the app subdomain in production; host-only on localhost and previews.
  const domain =
    hostname === "generasoftware.com" || hostname.endsWith(".generasoftware.com")
      ? "; Domain=.generasoftware.com"
      : "";
  const secure = protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AD_CONSENT_COOKIE}=${granted ? "granted" : "denied"}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${domain}${secure}`;
}

// Meta's base code, unminified. Queues calls until fbevents.js arrives. Client-side
// navigations are tracked as PageViews by the pixel itself.
function installPixel() {
  if (window.fbq) return;
  const fbq: any = (...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  };
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

export default function MetaPixelConsentSync() {
  const { consents } = useConsentManager();
  const marketing = Boolean(consents.marketing);

  useEffect(() => {
    writeConsentCookie(marketing);
    if (marketing) {
      if (window.fbq) window.fbq("consent", "grant");
      else installPixel();
    } else if (window.fbq) {
      window.fbq("consent", "revoke");
    }
  }, [marketing]);

  return null;
}
