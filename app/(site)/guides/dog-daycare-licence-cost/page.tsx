import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuideShell from "@/components/guides/GuideShell";
import { Figures, GuideSection, Note, P, Rule, Sum } from "@/components/guides/GuideParts";
import { getGuide } from "@/lib/guides";
import { createMetadata } from "@/lib/seo";

const SLUG = "dog-daycare-licence-cost";
const guide = getGuide(SLUG);

const DAYCARE_GUIDANCE =
  "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities";
const PROCESS_GUIDANCE =
  "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/animal-activity-licensing-process-statutory-guidance-for-local-authorities";

export const metadata: Metadata = guide
  ? createMetadata({
      title: guide.title,
      description: guide.description,
      path: `/guides/${SLUG}`,
    })
  : {};

const CONTENTS = [
  { id: "fees", label: "The council fee" },
  { id: "vet", label: "The vet inspection some councils add" },
  { id: "qualification", label: "The Level 3 qualification" },
  { id: "holiday", label: "Holiday cover under the staff ratio" },
  { id: "five-stars", label: "What five stars costs" },
  { id: "space", label: "The space ceiling" },
];

export default function Page() {
  if (!guide) notFound();

  return (
    <GuideShell guide={guide} contents={CONTENTS}>
      <GuideSection id="fees" title="The council fee">
        <P>
          Each council sets its own fee. The process guidance lets them charge for
          considering the application including inspections, compliance checks on
          existing licence holders, and enforcement against unlicensed businesses, and
          tells them fees must be &ldquo;fair and reasonable&rdquo;. In practice the
          same licence costs very different amounts depending on where the building is.
        </P>
        <Figures
          caption="Dog day care licence fees from 1 April 2026"
          head={["Council", "New licence", "Renewal", "Notes"]}
          rows={[
            [
              "Elmbridge",
              "£432",
              "£380",
              "Five dogs or fewer. £316 on application, £116 on grant. Vet inspections where required charged separately.",
            ],
            ["Test Valley", "£331", "", "Non-domestic day care. Vet inspections charged separately where required."],
            ["Liverpool", "£325", "", "No separate vet line. Fee taken once documents are complete."],
            [
              "Bromley",
              "£159 admin + £488 or £666 vet + £75 to £223 grant",
              "£159 admin + £400 or £488 vet + grant",
              "Vet fee depends on under or over 10 dogs. Grant fee £75 (1 year), £150 (2 years), £223 (3 years). Mid-term unannounced vet visit £311.",
            ],
          ]}
        />
        <P>
          So a new three-year licence for more than ten dogs in Bromley is £159 + £666 +
          £223 = £1,048 before the mid-term visit, against £325 in Liverpool for the same
          activity. The difference is entirely whether the council sends a vet and passes
          the bill on.
        </P>
      </GuideSection>

      <GuideSection id="vet" title="The vet inspection some councils add">
        <Rule
          quote="Once a local authority receives an application to grant or renew a licence, it must appoint a suitably qualified inspector... A suitably qualified person... has a Level 3 certificate (or equivalent) granted by a body recognised and regulated by... Ofqual."
          cite="Animal activity licensing process: statutory guidance"
          href={PROCESS_GUIDANCE}
        >
          The guidance requires a vet for the first inspection of a dog breeder and for
          every inspection of a horse hiring business. It does not require one for dog
          day care. A council that sends a vet is buying in expertise it does not hold
          itself, and the licence holder pays for it. That is a choice, not a rule, which
          is why it is worth asking your council what its fee actually includes before
          you apply.
        </Rule>
      </GuideSection>

      <GuideSection id="qualification" title="The Level 3 qualification">
        <Rule
          quote="There must be a member of permanent, full-time staff with an appropriate Ofqual regulated Level 3 qualification."
          cite="Dog day care licensing: statutory guidance, higher standard"
          href={DAYCARE_GUIDANCE}
        >
          This is a higher standard, not a requirement to hold a licence, but without it
          a business cannot reach the higher standards and so cannot get a three-year
          licence. One example course, the IMDT Ofqual Level 3 Professional Day Care and
          Boarding award, was listed at £340 plus VAT and about 60 hours of study over
          two months in September 2026. The holder must be permanent and full-time, so a
          course paid for a part-timer does not count.
        </Rule>
      </GuideSection>

      <GuideSection id="holiday" title="Holiday cover under the staff ratio">
        <P>
          Every employer pays statutory holiday. What makes it dearer in a dog daycare
          is condition 4.1: each member of staff should have 10 dogs or less to care for.
          A shop can run one person short for a week. A daycare at ten to one cannot,
          because the ratio is on the licence. So every day someone is away, a second
          person is paid to stand in.
        </P>
        <Sum
          title="One full-time member of staff on the 2026 National Living Wage"
          lines={[
            ["Statutory holiday (Working Time Regulations 1998)", "5.6 weeks, capped at 28 days"],
            ["On a 40-hour week", "224 hours"],
            ["At £12.71 an hour (from 1 April 2026)", "£2,847"],
            ["Employer National Insurance, 15% above £5,000 a year", "about £427"],
            ["Minimum employer pension contribution, 3%", "about £85"],
            ["Holiday pay for the person away", "about £3,360"],
            ["Paying someone to stand in for the same 224 hours", "about £6,700 a year"],
          ]}
          note="Two full-time staff is 56 shifts of cover a year, about £13,400 if every shift is paid cover. The NI figure applies the 15% rate to the £2,847 of holiday pay; the actual amount depends on the person's full salary."
        />
        <P>
          Nobody puts that line in the business plan. It is not a licence fee, but it is
          a licence cost, and it is bigger than the fee every year.
        </P>
      </GuideSection>

      <GuideSection id="five-stars" title="What five stars costs">
        <Rule
          quote="There must be at least one full-time member of staff per 8 dogs."
          cite="Dog day care licensing: statutory guidance, higher standard, section 4.0"
          href={DAYCARE_GUIDANCE}
        >
          The required standard is ten dogs per member of staff. The higher standard,
          needed for the stars that give a three-year licence, is eight. That is two
          fewer paying dogs for every person on the floor.
        </Rule>
        <Sum
          title="Two dogs per member of staff, at an example day rate of £30"
          lines={[
            ["2 dogs x £30", "£60 a day"],
            ["x 5 days", "£300 a week"],
            ["x 48 weeks", "£14,400 a year per member of staff"],
            ["Three staff on the floor", "£43,200 a year"],
          ]}
          note="Turnover the ratio removes, not profit. Put your own day rate in. In return a five-star licence lasts three years instead of one, with at least one unannounced visit in that time instead of one a year."
        />
        <Note>
          The stars measure compliance with the standards, not accident rates. A five-star
          daycare meets more of the standards; it is not evidence that it is safer.
        </Note>
      </GuideSection>

      <GuideSection id="space" title="The space ceiling">
        <Rule
          quote="each dog must have 6 square metres of space available to them within the premises - this can include inside and outside space"
          cite="Dog day care licensing: statutory guidance, condition 4.1"
          href={DAYCARE_GUIDANCE}
        >
          Total space available to the dogs, inside and out, divided by six is the most
          dogs the premises can ever hold. The council can license fewer than that for
          staffing or layout reasons, and often does. It cannot license more.
        </Rule>
        <Sum
          title="A 120 square metre premises"
          lines={[
            ["120 square metres ÷ 6", "20 dogs maximum"],
            ["Staff needed at 10 to 1", "2 on every shift"],
            ["Staff needed at 8 to 1 (five stars)", "3 on every shift"],
            ["20 dogs x £30 x 5 days x 48 weeks", "£144,000 a year at full occupancy"],
          ]}
          note="No daycare runs at full occupancy every day. The point is that the ceiling is fixed by the building: a daycare can only grow by building, and more building is a planning application."
        />
        <P>
          Genera holds a daily capacity for each service and turns bookings past it into
          waitlist requests, so the licensed number is never crossed by accident. That
          is the one part of this page the software can do for you; the rest is the
          building and the wage bill. See{" "}
          <Link
            href="/dog-daycare-software"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            Genera for dog daycares
          </Link>
          .
        </P>
      </GuideSection>
    </GuideShell>
  );
}
