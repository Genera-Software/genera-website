"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself, so it
 * has to render its own <html>/<body>. Styling stays mostly inline because the
 * layout (and its Typekit font link) never gets a chance to run.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          background: "linear-gradient(135deg, #003E45 0%, #005060 60%, #007080 100%)",
          color: "#fff",
          fontFamily:
            "'niveau-grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/genera-svg.svg"
          alt="Genera paw logo"
          width={44}
          height={44}
          style={{ marginBottom: "1.5rem" }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.75rem, 3.2vw, 2.4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#fff",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            maxWidth: "460px",
            margin: "1.25rem auto 0",
            fontSize: "1.0625rem",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Genera hit an unexpected error. Please try again in a moment — if it
          keeps happening, email us at info@generasoftware.com
          {error.digest ? ` (reference ${error.digest})` : ""}.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1.75rem",
            padding: "1rem 2.2rem",
            border: "none",
            borderRadius: "9999px",
            background: "#FFA800",
            color: "#111827",
            fontSize: "1.0625rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 18px rgba(255,168,0,0.35)",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
