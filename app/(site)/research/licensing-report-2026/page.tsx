import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Ext, Figures, GuideSection, Note, P, Rule, Sum } from "@/components/guides/GuideParts";
import { GUIDES, formatGuideDate } from "@/lib/guides";
import { FINDINGS, REPORT, SOURCES } from "@/lib/report";
import { AUTHOR_BIO, AUTHOR_NAME, AUTHOR_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo";

/* ============================================================
   The Genera Licensing Report 2026. One page a journalist can
   be sent: findings first, each with its number, then the
   evidence section by section, then the three changes we are
   asking for, then method and sources. Built from the same
   verified material as the /guides pages, with the Surrey fee
   comparison and the sentencing comparison added.
   ============================================================ */

export const metadata: Metadata = {
  title: `${REPORT.eyebrow}: ${REPORT.title}`,
  description: REPORT.description,
  alternates: { canonical: `${SITE_URL}${REPORT.path}` },
  openGraph: {
    title: `${REPORT.eyebrow}: ${REPORT.title}`,
    description: REPORT.description,
    url: `${SITE_URL}${REPORT.path}`,
    siteName: SITE_NAME,
    type: "article",
    locale: "en_GB",
  },
};

const DAYCARE_GUIDANCE =
  "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities";
const PROCESS_GUIDANCE =
  "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/animal-activity-licensing-process-statutory-guidance-for-local-authorities";

const CONTENTS = [
  { id: "fees", label: "The same licence, six prices" },
  { id: "surrey", label: "Surrey: five fee schedules become one in 2027" },
  { id: "inspection", label: "Who inspects, and whether a vet is needed" },
  { id: "enforcement", label: "Enforcement in numbers" },
  { id: "outside", label: "Who is outside the licence" },
  { id: "sentences", label: "What the sentence is when a dog dies" },
  { id: "five-stars", label: "What five stars costs the business" },
  { id: "petitions", label: "The two petitions" },
  { id: "asks", label: "Three changes we are asking for" },
  { id: "method", label: "Method and corrections" },
];

const petitionTotal = REPORT.petitions.mollysLaw + REPORT.petitions.petCareBill;
const fmt = (n: number) => n.toLocaleString("en-GB");

export default function Page() {
  const url = `${SITE_URL}${REPORT.path}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: `${REPORT.eyebrow}: ${REPORT.title}`,
    headline: REPORT.title,
    description: REPORT.description,
    datePublished: REPORT.publishedOn,
    dateModified: REPORT.checkedOn,
    inLanguage: "en-GB",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      description: AUTHOR_BIO,
      jobTitle: AUTHOR_TITLE,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/genera-svg.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    citation: SOURCES.map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-28 pb-14 text-white md:px-8 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[860px]">
          <span className="rounded-full bg-gold-light/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
            {REPORT.eyebrow}
          </span>
          <h1 className="mt-4 text-white [font-size:clamp(1.9rem,3.6vw,3.1rem)] leading-[1.08]">
            {REPORT.title}
          </h1>
          <p className="mt-5 max-w-[720px] text-white/85 text-[1.08rem] leading-[1.6]">
            Published by Genera Software and Duncan&apos;s Dog Co, a dog daycare licensed in
            Surrey since 2011. Every figure below is read from a council fee table, a
            statutory guidance page, a Freedom of Information answer or a court report, and
            each one is linked at the foot of the page.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/80">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-bold text-forest-dark">
              {AUTHOR_NAME.charAt(0)}
            </span>
            <span className="font-semibold text-white">{AUTHOR_NAME}</span>
            <span className="hidden h-3 w-px bg-white/30 sm:block" />
            <span>Published {formatGuideDate(REPORT.publishedOn)}</span>
            <span className="hidden h-3 w-px bg-white/30 sm:block" />
            <span>
              Figures checked{" "}
              <time dateTime={REPORT.checkedOn} className="font-semibold text-white">
                {formatGuideDate(REPORT.checkedOn)}
              </time>
            </span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 print:hidden">
            <a href={REPORT.pdfPath} className="btn btn-gold">
              Download the PDF
            </a>
            <a
              href="mailto:info@generasoftware.com?subject=Genera%20Licensing%20Report%202026"
              className="btn btn-outline-w"
            >
              Press enquiries
            </a>
          </div>
        </div>
      </section>

      {/* Findings */}
      <section className="bg-cream px-6 md:px-8">
        <div className="mx-auto -mt-8 max-w-[860px] md:-mt-10">
          <div className="rounded-2xl border-2 border-gold bg-white p-6 md:p-8">
            <p className="eyebrow">Eight findings</p>
            <ol className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
              {FINDINGS.map((f) => (
                <li key={f.figure} className="border-l-4 border-gold pl-4">
                  <span className="block font-massilia text-[1.5rem] font-bold leading-none text-forest">
                    {f.figure}
                  </span>
                  <span className="mt-2 block text-[0.98rem] leading-[1.55] text-ink-soft">
                    {f.line}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-cream px-6 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[860px]">
          <nav
            aria-label="On this page"
            className="mb-12 rounded-2xl border border-cream-dark bg-white/70 px-5 py-4 print:hidden"
          >
            <p className="text-eyebrow font-bold uppercase tracking-wider text-forest">
              In this report
            </p>
            <ol className="mt-2 grid gap-x-8 gap-y-1.5 text-[0.98rem] md:grid-cols-2">
              {CONTENTS.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="text-forest underline decoration-gold/70 underline-offset-2 hover:text-forest-mid"
                  >
                    {i + 1}. {c.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#sources"
                  className="text-forest underline decoration-gold/70 underline-offset-2 hover:text-forest-mid"
                >
                  {CONTENTS.length + 1}. Sources
                </a>
              </li>
            </ol>
          </nav>

          <div className="space-y-14">
            <GuideSection id="fees" title="The same licence, six prices">
              <P>
                A dog day care licence in England is one national licence, issued under
                the Animal Welfare (Licensing of Activities Involving Animals) (England)
                Regulations 2018 and inspected against the same Defra guidance everywhere.
                The fee is set by each council. The process guidance says fees must be
                &ldquo;fair and reasonable&rdquo; and may cover the application, the
                inspection, compliance checks and enforcement against unlicensed
                businesses. In practice the price depends on the postcode.
              </P>
              <Figures
                caption="What a new dog day care licence costs, 2026 fee tables"
                head={["Council", "New licence", "What is in the figure"]}
                rows={[
                  ["Mole Valley", "£286.50", "£166.50 application plus £120 licence. Lower tier, any size. Vet inspection extra where required."],
                  ["Tandridge", "£318", "£198 application plus £120 licence. Vet inspection invoiced after the visit where required."],
                  ["Liverpool", "£325", "One fee, no separate vet line."],
                  ["Elmbridge", "£432 or £510", "£432 for five dogs or fewer, £510 for more than five. Renewals £380 and £449. Vet inspection extra where required."],
                  ["Reigate and Banstead", "£501", "£381 plus £120 for up to ten dogs, then £53 per further ten dogs. The £120 is described as the recoverable enforcement cost."],
                  ["Spelthorne", "£600", "£468 application plus £132 grant. Up from £568 the year before."],
                  ["Epsom and Ewell", "£665 to £915", "£220 initial fee plus £445, £530 or £695 by licence length. The better the business is rated, the longer the licence and the more it pays up front."],
                  ["Bromley", "£1,048", "£159 admin, £666 vet inspection for more than ten dogs, £223 grant for three years. A mid-term vet visit is another £311."],
                ]}
              />
              <Note>
                Mole Valley and Epsom and Ewell share a border. The same licence for the
                same business costs £286.50 on one side of it and £915 on the other for a
                three-year term. From April 2027 the same council will issue both.
              </Note>
            </GuideSection>

            <GuideSection id="surrey" title="Surrey: five fee schedules become one in 2027">
              <P>
                On 1 April 2027 Surrey&apos;s eleven district and borough councils are
                replaced by two unitary authorities. East Surrey Council takes over
                Elmbridge, Epsom and Ewell, Mole Valley, Reigate and Banstead and
                Tandridge. West Surrey Council takes Guildford, Runnymede, Spelthorne,
                Surrey Heath, Waverley and Woking. Animal licensing moves with everything
                else.
              </P>
              <Figures
                caption="The five councils becoming East Surrey Council"
                head={["Council", "New day care licence", "Fee structure"]}
                rows={[
                  ["Mole Valley", "£286.50", "Flat two-part fee, any size"],
                  ["Tandridge", "£318", "Flat two-part fee, any size"],
                  ["Elmbridge", "£432 or £510", "Two size bands, five dogs"],
                  ["Reigate and Banstead", "£501 plus £53 per ten dogs", "Size bands of ten dogs"],
                  ["Epsom and Ewell", "£665 to £915", "Priced by licence length, one to three years"],
                ]}
              />
              <P>
                Five councils, four different ways of pricing the same licence, and a
                threefold difference in what a licensed daycare pays. Nobody has yet said
                which fee East Surrey Council will adopt, which inspectors it will use, or
                whether a business rated five stars by one council keeps that rating and
                its three-year licence when the council that issued it no longer exists.
                Those are the questions this report puts to the shadow authority.
              </P>
              {REPORT.surreyFoi.sentOn && (
                <>
                  <P>
                    On {formatGuideDate(REPORT.surreyFoi.sentOn)} we sent the same Freedom
                    of Information request to all eleven Surrey districts: licences in
                    force, complaints received, prosecutions brought and unannounced
                    inspections carried out for dog boarding and day care, 2021 to 2025.
                    Answers are added to this table as they arrive.
                  </P>
                  {REPORT.surreyFoi.rows.length > 0 && (
                    <Figures
                      caption="Surrey councils: enforcement 2021 to 2025 (FOI responses)"
                      head={["Council", "Licences", "Complaints", "Prosecutions", "Unannounced visits"]}
                      rows={REPORT.surreyFoi.rows.map((r) => [
                        r.council,
                        r.licences,
                        r.complaints,
                        r.prosecutions,
                        r.unannounced,
                      ])}
                    />
                  )}
                </>
              )}
            </GuideSection>

            <GuideSection id="inspection" title="Who inspects, and whether a vet is needed">
              <Rule
                quote="A vet must be appointed for the initial inspection for the licensed application for the breeding of dogs."
                cite="Animal activity licensing process: statutory guidance for local authorities, inspections. The same section lists the qualification for every other inspection: a Level 3 certificate from an Ofqual-regulated body, or a veterinary qualification."
                href={PROCESS_GUIDANCE}
              >
                A vet is not required to inspect a dog daycare. Some councils send one
                anyway and charge for it. Bromley charges £488 or £666 on a new
                application and £311 for a mid-term unannounced visit. Duncan&apos;s Dog
                Co has held a day care licence in Elmbridge since 2011 and has never been
                inspected by a vet. Both are within the guidance. The difference is
                several hundred pounds a year, decided by which side of a borough
                boundary the building stands.
              </Rule>
              <P>
                Every licence carries at least one unannounced visit. A five-star licence
                lasts three years, so a well-run daycare can go three years between
                unannounced inspections. A one-star licence lasts a year and is
                re-inspected, at full cost, every year. New applicants are automatically
                rated high risk and cannot receive a three-year licence at first
                application.
              </P>
            </GuideSection>

            <GuideSection id="enforcement" title="Enforcement in numbers">
              <P>
                Running a boarding or day care business without a licence is a criminal
                offence under section 13 of the Animal Welfare Act 2006. Whether anyone is
                prosecuted is left to each council. There is no national figure, so we
                asked one.
              </P>
              <Figures
                caption="What the public record shows"
                head={["Measure", "Figure", "Where it comes from"]}
                rows={[
                  ["Prosecutions for unlicensed animal activities, one council, 2021 to 2025", "1", "Wokingham Borough Council, FOI 20902, answered 5 January 2026"],
                  ["Complaints about unlicensed boarding logged by that council in 2025", "1", "Same response"],
                  ["Total fines for an unlicensed home boarder after two separate dog attacks a year apart", "£393", "Rhondda Cynon Taf Council press release, 19 March 2026 (Wales, 1963 Act)"],
                  ["Councils confirming in writing that a public Facebook advert is enough to open an investigation, without a complaint", "2", "East Riding of Yorkshire and East Suffolk, via Yappily Pulse Study 002"],
                  ["Cheapest licence in the table above", "£286.50", "Mole Valley"],
                ]}
              />
              <Note>
                The £393 fine is less than a licence costs in every Surrey council in this
                report. A business that pays for a licence pays more than one that is
                caught without one.
              </Note>
              <P>
                The House of Commons Environment, Food and Rural Affairs Committee said in
                April 2024 that councils&apos; ability to enforce animal licensing is
                constrained by a lack of specialist knowledge and training and by
                inadequate funding. Two councils have since confirmed that the tools exist:
                an advert on social media is enough to begin an investigation and officers
                may contact the advertiser directly. The gap is not the law or the tools.
                It is whether anyone is asked to use them.
              </P>
            </GuideSection>

            <GuideSection id="outside" title="Who is outside the licence">
              <Rule
                quote={<>Businesses that look after dogs in their owner&apos;s homes, &ldquo;such as, dog sitters and dog walkers&rdquo;, do not need a licence. Condition 7.2 for a licensed daycare: &ldquo;A dog walker may walk no more than 6 dogs at the same time.&rdquo;</>}
                cite="Dog day care licensing: statutory guidance for local authorities, scope and condition 7.2"
                href={DAYCARE_GUIDANCE}
              >
                The 2018 Regulations list the activities that need a licence. Boarding
                dogs, including day care at a fixed premises, is one. Walking them is not.
                Sitting them in the owner&apos;s home is not. Hiring out a field for dogs
                is not. A licensed daycare that takes its dogs off the premises is limited
                to six dogs per walker under condition 7.2; an independent walker with
                twelve dogs in a hired field is subject to no condition at all, because no
                licence reaches them.
              </Rule>
              <Figures
                caption="What binds a licensed daycare and what binds the alternative"
                head={["Requirement", "Licensed daycare", "Walker, sitter or hired field"]}
                rows={[
                  ["Staff to dogs on the premises", "One person to ten dogs (one to eight for the higher standard)", "None"],
                  ["Dogs per person on a walk", "Six", "None nationally; a few council park orders set four"],
                  ["Space per dog", "Six square metres", "None"],
                  ["Fencing", "Two secure barriers between a dog and the road", "None"],
                  ["Inspection", "At least one unannounced visit per licence", "None"],
                  ["A number the public can check", "Licence number and star rating, displayed", "None"],
                ]}
              />
              <P>
                Some field-based and walking businesses are licensed by choice, and some
                councils have moved on their own: Tower Hamlets caps walkers at four dogs
                in a public place unless they hold the council&apos;s £240 professional
                dog walker licence, which allows six. That order covers public places only
                and stops at the park gate. The only people in dog care with a number on
                them are the ones who volunteered to be checked.
              </P>
            </GuideSection>

            <GuideSection id="sentences" title="What the sentence is when a dog dies">
              <P>
                The Animal Welfare (Sentencing) Act 2021 raised the maximum sentence for
                the worst cruelty offences in England and Wales from six months to five
                years. Two professional dog walkers have since been sentenced after dogs
                in their care died in hot vehicles. Both pleaded guilty. Neither was
                licensed, because no licence exists for what they did.
              </P>
              <Figures
                caption="Three concluded cases, a dog left in heat"
                head={["Court", "What happened", "Sentence"]}
                rows={[
                  ["Southampton Magistrates' Court, March 2022", "Two clients' spaniels left in a car boot on 21 July 2021 at 29C by a professional dog walker. Both died.", "18 weeks' imprisonment, eight-year ban on owning animals"],
                  ["York Magistrates' Court, March 2023", "A client's cocker spaniel left in a professional dog walker's van for about five hours on 11 August 2022. Died of heatstroke.", "Twelve-month community order, three-year ban on dealing with and transporting dogs, £400 costs. No custody"],
                  ["St Clair County, Illinois, September 2026", "A Rottweiler left for hours in temperatures in the 90s Fahrenheit, then dragged from a vehicle by a chain and abandoned. Died the next day.", "Ten years, the state maximum, at least five to be served"],
                ]}
              />
              <P>
                We are not arguing for American sentences. The point is narrower. In
                England a professional dog walker meets the system only after a dog is
                dead, because nothing can be inspected, conditioned or taken away before
                that. A disqualification order is the only record that follows them, and
                there is no public register of disqualified people that a dog owner can
                check before handing over a lead.
              </P>
            </GuideSection>

            <GuideSection id="five-stars" title="What five stars costs the business">
              <P>
                The licence fee is the small part. The conditions set the wage bill. The
                required standard is one member of staff to ten dogs; the higher standard
                that earns a five-star rating is one to eight. Every person on the floor
                is paired with two fewer paying dogs.
              </P>
              <Sum
                title="Two dogs a person, over a year"
                lines={[
                  ["Dogs given up per staff member at the higher standard", "2"],
                  ["Day rate", "£30"],
                  ["Days a week, weeks a year", "5 × 48"],
                  ["Turnover given up per staff member per year", "£14,400"],
                ]}
                note="At £30 a day, five days a week, 48 weeks a year. In return a five-star licence lasts three years instead of one."
              />
              <Sum
                title="Holiday cover under the ratio"
                lines={[
                  ["Statutory holiday per full-time member of staff", "5.6 weeks, 224 hours"],
                  ["National Living Wage from April 2026", "£12.71 an hour"],
                  ["Paid to the person on holiday", "£2,847"],
                  ["Paid again to the person standing in", "£2,847"],
                  ["Cost of one full-timer's holiday, on a ratio that cannot drop", "£5,694"],
                ]}
                note="A shop can run one person short for a week. A daycare at one to ten cannot, so every day of holiday is paid twice. With employer's National Insurance and pension added to both, roughly £6,700."
              />
              <P>
                Space sets the ceiling: six square metres per dog, inside and outside
                counted together, divided into the total. A 120 square metre premises can
                never take more than twenty dogs whatever the demand. A Level 3
                qualification for the person in charge is about £340 plus VAT. None of
                this applies to a business the licence does not reach.
              </P>
            </GuideSection>

            <GuideSection id="petitions" title="The two petitions">
              <P>
                Two petitions to Parliament are asking for the rules to be reviewed and for
                walkers and sitters to be brought inside them. Petition 770225, Review
                regulation of animal boarding and licensing conditions, known as
                Molly&apos;s Law, opened on 19 June 2026. Petition 776716, Introduce
                stronger welfare regulations for pet care services, opened on 24 August
                2026. On {formatGuideDate(REPORT.petitions.readOn)} they had{" "}
                {fmt(REPORT.petitions.mollysLaw)} and {fmt(REPORT.petitions.petCareBill)}{" "}
                signatures, {fmt(petitionTotal)} between them. Each needs 10,000 for a
                government response and 100,000 to be considered for a debate.
              </P>
              <P>
                Duncan&apos;s Dog Co is a licensed business and supports both. A
                licence that costs its holders thousands a year in staffing and is
                enforced against almost nobody is worth less each year to the people who
                hold it and nothing at all to the dogs outside it.
              </P>
            </GuideSection>

            <GuideSection id="asks" title="Three changes we are asking for">
              <Figures
                head={["Change", "Why"]}
                rows={[
                  ["A national enforcement standard, with the numbers published", "Each council decides for itself whether to prosecute and none has to say how often it does. One council, one prosecution in five years, is the only figure on the public record because we asked for it."],
                  ["Licence dog walkers and dog sitters", "The six-dog limit, the ratio and the unannounced visit stop at the daycare gate. The businesses most often in the news for a dog's death are the ones no licence reaches."],
                  ["One place to check any licence", "Councils are told to keep a list online. Most do, in different formats, on different pages. A dog owner should be able to type a business name and see a number, a star rating and an expiry date."],
                ]}
              />
            </GuideSection>

            <GuideSection id="method" title="Method and corrections">
              <P>
                Fees were read from each council&apos;s published fee table or fees and
                charges schedule for 2026/27 on {formatGuideDate(REPORT.checkedOn)}. Where
                a council&apos;s page carries no fee year (Mole Valley, Tandridge) the
                figure is as listed on that date. The enforcement figures are one
                council&apos;s FOI answer and one council&apos;s press release, both
                linked. The court outcomes are from contemporaneous local press reports of
                the sentencing hearings; we have not named the defendants here. Petition
                counts are read from petition.parliament.uk on the date shown and will move.
              </P>
              <P>
                This report covers England unless it says otherwise. It is not legal
                advice. If a figure is wrong or has moved, email{" "}
                <a
                  href="mailto:info@generasoftware.com?subject=Licensing%20Report%20correction"
                  className="font-semibold text-forest underline decoration-gold underline-offset-2"
                >
                  info@generasoftware.com
                </a>{" "}
                and the page is corrected in place with the checked date updated. Nothing
                is appended.
              </P>
              <P>
                Journalists are welcome to quote any figure with a link to this page.
                Duncan is available for interview and the daycare in Cobham is open to
                visit.
              </P>
            </GuideSection>
          </div>

          {/* Sources */}
          <section id="sources" className="mt-14 scroll-mt-28">
            <h2 className="mb-4 font-massilia text-[1.6rem] font-bold leading-[var(--leading-title)] text-forest md:text-[1.85rem]">
              Sources
            </h2>
            <ol className="list-decimal space-y-3 pl-6 text-[0.98rem] leading-[1.6] text-ink-soft">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <Ext href={s.href}>{s.label}</Ext>
                  {s.note && <span className="block text-meta text-ink-soft">{s.note}</span>}
                </li>
              ))}
            </ol>
          </section>

          {/* Author */}
          <div className="mt-14 rounded-2xl border border-cream-dark bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-forest text-lg font-bold text-white">
                {AUTHOR_NAME.charAt(0)}
              </span>
              <div>
                <p className="font-massilia text-lg font-bold text-forest">{AUTHOR_NAME}</p>
                <p className="mb-2 text-sm font-semibold text-forest-mid">{AUTHOR_TITLE}</p>
                <p className="text-sm leading-relaxed text-ink-soft">{AUTHOR_BIO}</p>
              </div>
            </div>
          </div>

          {/* Guides */}
          <div className="mt-10 print:hidden">
            <p className="eyebrow">The guides behind this report</p>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="block rounded-2xl border border-cream-dark bg-white px-5 py-4 transition-colors hover:border-forest/40"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-mid">
                      {g.eyebrow}
                    </span>
                    <span className="mt-1 block font-massilia text-[1.05rem] font-bold leading-snug text-forest">
                      {g.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Soft product link */}
      <section className="bg-forest-dark px-6 py-16 text-center text-white md:px-8 md:py-20 print:hidden">
        <div className="rev mx-auto max-w-[680px]">
          <h2 className="text-heading-mid !text-white">Where Genera comes in</h2>
          <p className="mx-auto mt-4 text-white/80">
            Genera is the booking and invoicing software Duncan built to run his own
            licensed daycare. It holds you to the daily numbers on your licence, keeps
            every dog&apos;s vaccination dates where an inspector can see them, and
            invoices the month from the bookings you actually took.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/dog-daycare-software" className="btn btn-gold btn-lg">
              See it for daycares
            </Link>
            <Link href="/pricing" className="btn btn-outline-w btn-lg">
              Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
