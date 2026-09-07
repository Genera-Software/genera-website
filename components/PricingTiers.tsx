import StartTrialLink from "@/components/StartTrialLink";
import { PRICING_TIERS, TRIAL_DAYS, money, seatLine } from "@/lib/pricing";

/** Grey, never red — a tier boundary is not an error. */
function Cross() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[3px] h-[15px] w-[15px] shrink-0 text-ink-soft/35"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Tick({ gold }: { gold?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-[3px] h-[15px] w-[15px] shrink-0 ${gold ? "text-gold" : "text-forest"}`}
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const GUARANTEES = [
  "Protected by the Direct Debit Guarantee",
  "Change or cancel any time",
  "No setup fee, no contract",
];

type Props = {
  /** Anchor target. The homepage owns `#pricing`; /pricing uses `#plans` under its own hero. */
  id?: string;
  /** /pricing states the pitch in its hero, so the cards there run without a second one. */
  showHeader?: boolean;
  /** /pricing sits on flat cream; the homepage band gradients into the section below it. */
  background?: string;
};

export default function PricingTiers({
  id = "pricing",
  showHeader = true,
  background = "bg-gradient-to-b from-cream to-teal-soft",
}: Props = {}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-6 py-13 md:px-8 md:py-22 ${background}`}
    >
      <div className="mx-auto max-w-[1160px]">
        {showHeader && (
          <div className="rev mb-6 text-center md:mb-12">
            <p className="eyebrow">Simple pricing</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              One subscription.
              <br />
              Everything your business runs on.
            </h2>
            <p className="mx-auto mt-2 max-w-[560px] text-meta text-ink-soft md:mt-3 md:text-body-lg">
              Priced by the size of your setting — not by how much you use it.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-teal-mid bg-white px-4 py-1.5 text-meta font-semibold text-forest md:mt-4">
              <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
              {TRIAL_DAYS}-day free trial &nbsp;·&nbsp; no card needed to start
            </p>
          </div>
        )}

        <div className="grid items-start gap-3.5 md:grid-cols-3 md:gap-6">
          {PRICING_TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className={`rev d${i + 1} relative flex flex-col rounded-2xl bg-white p-5 transition-transform hover:-translate-y-1 md:p-7 ${
                tier.featured
                  ? "border-2 border-gold shadow-[0_12px_32px_rgba(0,62,69,0.12)]"
                  : "border border-teal-mid shadow-[0_4px_18px_rgba(0,62,69,0.06)]"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-5 rounded-full bg-gold px-3 py-[3px] text-eyebrow font-bold uppercase tracking-wide text-ink md:left-7">
                  Recommended
                </span>
              )}

              <h3 className="font-massilia text-lg font-bold text-forest md:text-xl">
                {tier.name}
              </h3>
              <p className="mt-1.5 min-h-[3rem] text-meta leading-snug text-ink-soft">
                {tier.tagline}
              </p>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-massilia text-figure-md font-bold leading-none text-forest">
                  {money(tier.monthlyPrice)}
                </span>
                <span className="text-meta font-semibold text-ink-soft">
                  /month
                </span>
              </div>

              <ul className="mt-4 flex flex-grow flex-col gap-2 border-t border-cream-dark pt-4">
                <li className="flex items-start gap-2">
                  <Tick gold={tier.featured} />
                  <span className="text-meta leading-snug text-ink">
                    {seatLine(tier.staffLimit)}
                  </span>
                </li>
                {tier.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2">
                    {f.included ? <Tick gold={tier.featured} /> : <Cross />}
                    <span
                      className={`text-meta leading-snug ${
                        f.included ? "text-ink" : "text-ink-soft/60"
                      }`}
                    >
                      {f.label}
                      {f.note && (
                        <span className="text-ink-soft/60"> ({f.note})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <StartTrialLink
                tierId={tier.id}
                className={`btn mt-5 w-full justify-center ${
                  tier.featured ? "btn-gold" : "btn-outline-d"
                }`}
              >
                Start free trial
              </StartTrialLink>
            </div>
          ))}
        </div>

        <ul className="mx-auto mt-7 flex max-w-[920px] flex-wrap justify-center gap-x-7 gap-y-2 md:mt-9">
          {GUARANTEES.map((text) => (
            <li
              key={text}
              className="flex items-center gap-2 text-meta text-ink-soft"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-forest"
                aria-hidden
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
