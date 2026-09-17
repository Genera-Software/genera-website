/** Public GA4 measurement ID (gtag / Measurement ID). */
export const GA_MEASUREMENT_ID = "G-B1NT2G0G7X";

/**
 * The only hosts that report to GA. Netlify deploy previews, branch deploys and localhost
 * run the same layout but must not send traffic into the production property.
 */
export const GA_HOSTNAMES = ["www.generasoftware.com", "generasoftware.com"];

/**
 * Mirrors the banner's measurement choice onto .generasoftware.com so
 * app.generasoftware.com (no banner of its own) can grant analytics_storage.
 * The app's reader is lib/analytics/google.ts in the genera repo; keep the name and values in step.
 */
export const ANALYTICS_CONSENT_COOKIE = "genera_analytics_consent";
