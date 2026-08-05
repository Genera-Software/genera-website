"use client";

/**
 * SupportWidget — drop into app.generasoftware.com layout.
 *
 *   <SupportWidget appVersion={process.env.NEXT_PUBLIC_APP_VERSION ?? "dev"} account={{ id, email, name }} />
 *
 * Posts to your own server proxy at /api/support/proxy (see supportProxyRoute.ts),
 * which forwards to the Genera admin with a server-side bearer token.
 */

import { useEffect, useRef, useState } from "react";

type Category = "technical" | "billing" | "feature_request" | "account" | "other";

const CATEGORIES: Array<{ value: Category; label: string }> = [
  { value: "technical", label: "Technical issue" },
  { value: "billing", label: "Billing" },
  { value: "feature_request", label: "Feature request" },
  { value: "account", label: "Account" },
  { value: "other", label: "Something else" },
];

type ConsoleError = {
  message: string;
  source?: string;
  line?: number;
  column?: number;
  stack?: string;
  timestamp: string;
};

// Module-level ring buffer so errors fired before the widget mounts are still captured.
const ERROR_BUFFER: ConsoleError[] = [];
const ERROR_BUFFER_MAX = 10;
let listenersInstalled = false;

function installErrorListeners() {
  if (listenersInstalled || typeof window === "undefined") return;
  listenersInstalled = true;

  window.addEventListener("error", (e) => {
    ERROR_BUFFER.push({
      message: String(e.message ?? "Unknown error"),
      source: e.filename,
      line: e.lineno,
      column: e.colno,
      stack: e.error?.stack?.slice(0, 4000),
      timestamp: new Date().toISOString(),
    });
    if (ERROR_BUFFER.length > ERROR_BUFFER_MAX) ERROR_BUFFER.shift();
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    ERROR_BUFFER.push({
      message: `Unhandled promise rejection: ${
        reason?.message ?? String(reason).slice(0, 500)
      }`,
      stack: reason?.stack?.slice(0, 4000),
      timestamp: new Date().toISOString(),
    });
    if (ERROR_BUFFER.length > ERROR_BUFFER_MAX) ERROR_BUFFER.shift();
  });
}

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  return "Unknown";
}

function detectOS(ua: string): string {
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

type DocSuggestion = {
  title: string;
  section: string;
  href: string;
  snippet: string;
};

export type SupportWidgetProps = {
  appVersion: string;
  account?: {
    id?: string;
    email?: string;
    name?: string;
    metadata?: Record<string, unknown>;
  };
  /** Override the proxy endpoint if you mount it somewhere other than /api/support/proxy. */
  endpoint?: string;
  /**
   * Origin serving /docs and the suggestions API. Called directly (no proxy) —
   * it is a public, CORS-open, read-only endpoint. Set to "" to turn docs
   * suggestions off entirely.
   */
  docsOrigin?: string;
};

export default function SupportWidget({
  appVersion,
  account,
  endpoint = "/api/support/proxy",
  docsOrigin = "https://www.generasoftware.com",
}: SupportWidgetProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"category" | "form" | "sent">("category");
  const [category, setCategory] = useState<Category>("technical");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(account?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<DocSuggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(false);
  const subjectRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    installErrorListeners();
  }, []);

  useEffect(() => {
    if (open && step === "form") subjectRef.current?.focus();
  }, [open, step]);

  // Look for a docs page that already answers this, as they type. Debounced so
  // it fires on a pause rather than per keystroke, and aborted on each change
  // so a slow earlier response can't overwrite a newer one.
  useEffect(() => {
    if (!docsOrigin || dismissedSuggestions || step !== "form") return;

    const query = `${subject} ${description}`.trim();
    if (query.length < 12) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${docsOrigin}/api/support/suggest?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { suggestions?: DocSuggestion[] };
        setSuggestions(data.suggestions ?? []);
      } catch {
        // Offline, blocked, or aborted — suggestions are a bonus, never a
        // blocker. The ticket form carries on regardless.
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [subject, description, step, docsOrigin, dismissedSuggestions]);

  function reset() {
    setStep("category");
    setCategory("technical");
    setSubject("");
    setDescription("");
    setError(null);
    setSuggestions([]);
    setDismissedSuggestions(false);
  }

  async function submit() {
    if (!subject.trim() || !description.trim()) {
      setError("Please add a subject and description.");
      return;
    }
    // Signed-out users type their own address. Without it the ticket lands in
    // the admin with nobody to reply to, so don't let it through.
    const contactEmail = (account?.email ?? email).trim();
    if (!contactEmail) {
      setError("Please add your email so we can reply.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      setError("That email doesn't look right.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const ua = navigator.userAgent;
    const payload = {
      category,
      subject: subject.trim(),
      description: description.trim(),
      account_id: account?.id ?? null,
      account_email: contactEmail,
      account_name: account?.name ?? null,
      account_metadata: account?.metadata ?? {},
      page_url: window.location.href,
      app_version: appVersion,
      user_agent: ua,
      browser: detectBrowser(ua),
      os: detectOS(ua),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      console_errors: category === "technical" ? ERROR_BUFFER.slice() : [],
      source: "app",
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not send your ticket");
      }
      setStep("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (open) reset();
        }}
        aria-label="Open support"
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 60,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: "#003E45",
          color: "white",
          border: "none",
          boxShadow: "0 8px 24px rgba(0,62,69,0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          )}
        </svg>
      </button>

      {/* Popup */}
      {open && (
        <div
          role="dialog"
          aria-label="Contact support"
          style={{
            position: "fixed",
            right: 20,
            bottom: 88,
            zIndex: 60,
            width: 360,
            maxWidth: "calc(100vw - 40px)",
            maxHeight: "70vh",
            background: "white",
            borderRadius: 16,
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: "#111827",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              background: "#003E45",
              color: "white",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>How can we help?</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
              Genera support — typically replies within a day
            </div>
          </div>

          <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
            {step === "category" && (
              <>
                <div
                  style={{
                    fontSize: 14,
                    color: "#4B5563",
                    marginBottom: 12,
                  }}
                >
                  What's this about?
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        setCategory(c.value);
                        setStep("form");
                      }}
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid #E5E7EB",
                        background: "white",
                        cursor: "pointer",
                        fontSize: 14,
                        color: "#111827",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "form" && (
              <>
                <button
                  type="button"
                  onClick={() => setStep("category")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4B5563",
                    fontSize: 12,
                    cursor: "pointer",
                    padding: 0,
                    marginBottom: 12,
                  }}
                >
                  ← {CATEGORIES.find((c) => c.value === category)?.label}
                </button>

                {!account?.email && (
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    style={inputStyle}
                  />
                )}
                <input
                  ref={subjectRef}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  maxLength={200}
                  style={inputStyle}
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what's happening…"
                  rows={5}
                  maxLength={5000}
                  style={{ ...inputStyle, resize: "vertical" }}
                />

                {category === "technical" && ERROR_BUFFER.length > 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#4B5563",
                      marginTop: -8,
                      marginBottom: 12,
                    }}
                  >
                    We'll attach {ERROR_BUFFER.length} recent error
                    {ERROR_BUFFER.length === 1 ? "" : "s"} and your page details
                    automatically.
                  </div>
                )}

                {suggestions.length > 0 && !dismissedSuggestions && (
                  <div
                    style={{
                      border: "1px solid #D7CDBA",
                      background: "#FBF8F1",
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#003E45",
                        marginBottom: 8,
                      }}
                    >
                      This might already answer it
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                      {suggestions.map((s) => (
                        <a
                          key={s.href}
                          href={`${docsOrigin}${s.href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block",
                            padding: "8px 10px",
                            borderRadius: 8,
                            background: "white",
                            border: "1px solid #E7E0D2",
                            textDecoration: "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#003E45",
                            }}
                          >
                            {s.title}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#4B5563",
                              marginTop: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {s.section} · {s.snippet}
                          </div>
                        </a>
                      ))}
                    </div>

                    {/* Dismissing keeps the panel closed for the rest of this
                        ticket, so it can't reappear over the send button as
                        they keep typing. */}
                    <button
                      type="button"
                      onClick={() => {
                        setDismissedSuggestions(true);
                        setSuggestions([]);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4B5563",
                        fontSize: 11,
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: 0,
                        marginTop: 8,
                      }}
                    >
                      None of these — carry on with my ticket
                    </button>
                  </div>
                )}

                {error && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#B91C1C",
                      marginBottom: 12,
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "#003E45",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting
                    ? "Sending…"
                    : suggestions.length > 0
                      ? "Still need help — send ticket"
                      : "Send ticket"}
                </button>
              </>
            )}

            {step === "sent" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                  Got it — we'll be in touch.
                </div>
                <div style={{ fontSize: 13, color: "#4B5563", marginBottom: 16 }}>
                  Our team will reply by email shortly.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setOpen(false);
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #E5E7EB",
  fontSize: 14,
  marginBottom: 12,
  fontFamily: "inherit",
  color: "#111827",
  background: "white",
  boxSizing: "border-box",
};
