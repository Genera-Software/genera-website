import {
  SAMPLE_MONTH,
  TOP_TIER,
  invoiceMoney,
  money,
} from "@/lib/pricing";

/**
 * The money point, given its own forest band between the tier cards and the story.
 *
 * The card is a mock of the monthly subscription invoice: the plan is the only line that
 * carries a figure, and everything a percentage model would meter sits underneath at zero.
 * Pure presentation — the real invoice comes from the app's billing org. It shows the
 * dearest tier on purpose, so the "this is all we charge" claim is made at its worst case.
 */
export default function WhatYouKeep() {
  // Dated to the month it's viewed in, so it never reads as a stale sample. The page
  // revalidates every 60s, so it rolls over on its own.
  const invoiceMonth = new Intl.DateTimeFormat("en-GB", {
    month: "long",
  }).format(new Date());

  const notOnYourBill = [
    `Commission on ${money(SAMPLE_MONTH.invoicedToOwners)} invoiced to owners`,
    `${SAMPLE_MONTH.bookings} bookings`,
    `${SAMPLE_MONTH.appPayments} payments owners made in the app`,
    `${SAMPLE_MONTH.pets} pets, ${SAMPLE_MONTH.owners} owners`,
  ];

  return (
    <section
      id="what-you-keep"
      className="relative overflow-hidden bg-forest-dark px-6 py-13 text-white md:px-8 md:py-22"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-120px] h-[520px] w-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,168,0,0.16), rgba(0,40,48,0))",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-[1160px] items-center gap-7 md:grid-cols-2 md:gap-14">
        <div className="rev">
          <p className="eyebrow !text-gold-soft">What you keep</p>
          <h2 className="text-section-h !text-white md:text-[length:inherit]">
            This is the whole bill.
          </h2>
          <p className="mt-2.5 max-w-[62ch] text-meta text-white/75 md:mt-4 md:text-base">
            One line. Genera charges for the software and nothing else — no
            commission on what you invoice, no fee per booking, nothing extra
            when an owner pays through the app, no charge per pet or per owner.
            A record month costs you exactly what a quiet one does.
          </p>
          <p className="mt-4 text-fine leading-relaxed text-white/60 md:mt-5">
            Sample month, {TOP_TIER.name} shown. Your payment provider bills
            their processing fee separately, as with any system — Genera takes
            no share of it.
          </p>
        </div>

        <div
          className="rev d2 flex w-full max-w-[440px] flex-col rounded-2xl border border-teal-mid bg-white px-5 pb-5 pt-6 text-ink shadow-[0_12px_40px_rgba(0,0,0,0.18)] md:px-7 md:justify-self-end"
          aria-label={`Sample ${TOP_TIER.name} invoice for ${invoiceMonth}`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-cream-dark pb-4">
            <div>
              <p className="font-massilia text-base font-bold leading-tight text-forest">
                Genera · {TOP_TIER.name}
              </p>
              <p className="text-fine text-ink-soft">{invoiceMonth}</p>
            </div>
            <span className="shrink-0 rounded-full border border-teal-mid bg-teal-soft px-2.5 py-1 text-eyebrow font-bold uppercase tracking-wide text-forest">
              Paid by Direct Debit
            </span>
          </div>

          <div className="flex items-baseline justify-between border-b border-cream-dark pb-3.5 pt-4">
            <span className="text-base font-medium">{TOP_TIER.name} plan</span>
            <span className="font-massilia text-body-lg font-bold text-forest">
              {invoiceMoney(TOP_TIER.monthlyPrice)}
            </span>
          </div>

          <p className="mb-1.5 mt-3.5 text-eyebrow font-bold uppercase tracking-wide text-ink-soft">
            Not on your bill
          </p>
          <ul className="flex flex-col">
            {notOnYourBill.map((label, i) => (
              <li
                key={label}
                className={`flex items-baseline justify-between gap-4 py-[9px] ${
                  i < notOnYourBill.length - 1
                    ? "border-b border-dashed border-cream-dark"
                    : ""
                }`}
              >
                <span className="text-fine text-ink-soft">{label}</span>
                <span className="shrink-0 text-fine font-bold text-ink-soft">
                  {invoiceMoney(0)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-baseline justify-between border-t-2 border-forest pt-4">
            <span className="font-massilia text-base font-bold text-forest">
              Total
            </span>
            <span className="font-massilia text-figure-md font-bold leading-none tracking-tight text-forest">
              {invoiceMoney(TOP_TIER.monthlyPrice)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
