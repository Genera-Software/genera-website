import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuideShell from "@/components/guides/GuideShell";
import { Ext, Figures, GuideSection, Note, P, Rule } from "@/components/guides/GuideParts";
import { getGuide } from "@/lib/guides";
import { createMetadata } from "@/lib/seo";

const SLUG = "dog-daycare-licence-england";
const guide = getGuide(SLUG);

const DAYCARE_GUIDANCE =
  "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities";
const PROCESS_GUIDANCE =
  "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/animal-activity-licensing-process-statutory-guidance-for-local-authorities";
const REGS = "https://www.legislation.gov.uk/uksi/2018/486/contents";
const AWA_13 = "https://www.legislation.gov.uk/ukpga/2006/45/section/13";
const COTTRELL = "https://www.bailii.org/uk/cases/UKFTT/GRC/2026/458.html";

export const metadata: Metadata = guide
  ? createMetadata({
      title: guide.title,
      description: guide.description,
      path: `/guides/${SLUG}`,
    })
  : {};

const CONTENTS = [
  { id: "who", label: "Who needs the licence" },
  { id: "layers", label: "The law and the guidance are two layers" },
  { id: "numbers", label: "The numbers on the licence" },
  { id: "stars", label: "Stars, licence length and inspections" },
  { id: "not-required", label: "What the licence does not ask for" },
  { id: "check", label: "How to check a licence" },
  { id: "offence", label: "Running without one" },
];

export default function Page() {
  if (!guide) notFound();

  return (
    <GuideShell guide={guide} contents={CONTENTS}>
      <GuideSection id="who" title="Who needs the licence">
        <P>
          This page covers England. The 2018 Regulations apply to England only. Wales
          still licenses boarding under the Animal Boarding Establishments Act 1963, and
          Scotland has its own scheme.
        </P>
        <Rule
          quote="All dog day care activities need a licence if they're carried out as a commercial business."
          cite="Dog day care licensing: statutory guidance, introduction"
          href={DAYCARE_GUIDANCE}
        />
        <Rule
          quote="The premises must be a fixed location."
          cite="Dog day care licensing: statutory guidance, condition 20.1"
          href={DAYCARE_GUIDANCE}
        >
          The licence is written for a building. A business that works from a van and a
          hired field has no premises for a council to inspect, so the day care licence
          as written does not reach it. Some councils license those businesses anyway and
          some of those businesses hold a licence, so this is a gap in the drafting, not
          a rule that they are exempt.
        </Rule>
        <Rule
          quote={
            <>
              The guidance excludes &ldquo;businesses that look after dogs in their
              owner&rsquo;s homes, such as, dog sitters and dog walkers&rdquo; and
              &ldquo;a business that looks after dogs in a business owner&rsquo;s own
              home&rdquo;, which is licensed as home boarding instead.
            </>
          }
          cite="Dog day care licensing: statutory guidance, introduction"
          href={DAYCARE_GUIDANCE}
        >
          So three things sit outside this licence: dog walking, dog sitting in the
          owner&rsquo;s home, and looking after dogs in your own home during the day.
          The first two need no licence at all in England. The third needs a home
          boarding licence. See{" "}
          <Link
            href="/guides/do-dog-walkers-need-a-licence"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            Do dog walkers need a licence in England?
          </Link>
        </Rule>
      </GuideSection>

      <GuideSection id="layers" title="The law and the guidance are two layers">
        <P>
          Most arguments about dog daycare rules come from mixing up two documents. The
          Regulations are the law. The statutory guidance is what councils use to apply
          it, and it is where every specific number lives.
        </P>
        <Rule
          quote="All reasonable precautions must be taken to prevent and control the spread among the animals and people of infectious diseases, pathogens and parasites."
          cite="Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018, Schedule 2, paragraph 9(4)"
          href={REGS}
        >
          That is the binding rule on disease. It names no vaccine and no timescale. The
          two-week vaccination rule, the leptospirosis requirement and every other
          specific come from the guidance, which fills the paragraph in.
        </Rule>
        <Rule
          quote={
            <>
              &ldquo;Regard must be had to the Statutory Guidance unless there is good
              reason not to do so.&rdquo; &hellip; &ldquo;The Statutory Guidance is
              formulated on the basis of expert advice and must be given due
              weight.&rdquo;
            </>
          }
          cite="Cottrell v Wokingham Borough Council [2026] UKFTT 458 (GRC), paragraphs 44 and 46"
          href={COTTRELL}
        >
          This is the case that settled the status of the guidance. A kennel boarding
          licence was refused renewal in June 2025 because the holder would not require
          leptospirosis vaccination. She argued that the Regulations bind but the guidance
          does not. The tribunal dismissed the appeal on 25 March 2026. The practical
          answer: a council can depart from the guidance, but only with a good reason,
          and disagreeing with a vaccine is not one.
        </Rule>
        <Note>
          The guidance mirrors the Schedule, so guidance section 9.4 and Regulation
          Schedule 2 paragraph 9(4) are numbered almost identically. They are not the
          same document. If someone quotes &ldquo;9.4&rdquo; at you, ask which one.
        </Note>
      </GuideSection>

      <GuideSection id="numbers" title="The numbers on the licence">
        <P>
          These are the figures from the dog day care guidance, updated 1 June 2026. The
          required standard is the minimum to hold a licence. The higher standard counts
          towards a better star rating. Section numbers are the guidance&rsquo;s own.
        </P>
        <Figures
          caption="Dog day care conditions with a number in them"
          head={["Condition", "Required standard", "Higher standard", "Section"]}
          rows={[
            [
              "Staff to dogs",
              "Each member of staff should have 10 dogs or less to care for",
              "At least one full-time member of staff per 8 dogs",
              "4.1 and 4.0",
            ],
            [
              "Space per dog",
              "6 square metres available to each dog within the premises, inside and outside space combined",
              "Layout gives dogs a choice of areas",
              "4.1",
            ],
            [
              "Sleeping area temperature",
              "Above an absolute minimum of 10°C and below a maximum of 26°C",
              "",
              "5.2",
            ],
            [
              "Fencing",
              "Square mesh no larger than 50mm by 50mm; chain link no larger than 75mm by 50mm; wire at least 2mm in diameter; dig proof; at least 2 secure physical barriers between a dog and any exit",
              "",
              "5.1",
            ],
            [
              "Dogs on a walk",
              "A dog walker may walk no more than 6 dogs at the same time; the owner must consent and the dogs must be familiarised first",
              "",
              "7.2",
            ],
            [
              "Vaccinations",
              "Primary vaccination courses completed at least 2 weeks before acceptance; a recent protective titre test certificate may be accepted instead of a booster",
              "",
              "9.4",
            ],
            [
              "Records per dog",
              "The dog's normal vet and details of any insurance relating to the dog, among other records",
              "",
              "25.1",
            ],
            [
              "Level 3 qualification",
              "",
              "A permanent, full-time member of staff with an appropriate Ofqual-regulated Level 3 qualification",
              "Higher standard",
            ],
          ]}
        />
        <P>
          The fencing condition does not set a fence height. It says &ldquo;sufficient
          height&rdquo;. The numbers are mesh size and wire gauge. And the two barriers
          are two doors or gates between a dog and the way out, not two fence lines.
        </P>
        <P>
          The puppy timeline follows from 9.4: first jab at about 8 weeks, second at 10 to
          12 weeks to complete the primary course, then a further 2 weeks before the
          first day. Most puppies can start at 12 to 14 weeks. A titre test does not
          cover leptospirosis or kennel cough, so it replaces a booster, not the course.
        </P>
      </GuideSection>

      <GuideSection id="stars" title="Stars, licence length and inspections">
        <P>
          The inspector scores the business against the required and higher standards
          and gives it a star rating. To reach the higher standards a business must meet
          all of the required higher standards and at least half of the optional ones.
          The rating sets how long the licence lasts and how often the council comes back.
        </P>
        <Figures
          caption="Licence length by rating"
          head={["Rating", "Licence length", "Unannounced visits"]}
          rows={[
            ["1 star", "1 year", "At least 1 within 12 months"],
            ["2 stars (high risk)", "1 year", "At least 1 within 12 months"],
            ["3 stars (low risk)", "2 years", "At least 1 within 24 months"],
            ["4 stars (high risk)", "2 years", "At least 1 within 24 months"],
            ["5 stars (low risk)", "3 years", "At least 1 within 36 months"],
          ]}
        />
        <P>
          New applicants are automatically rated high risk, so a first licence is one or
          two years whatever the standards met. A five-star business renews, and pays,
          a third as often as a one-star one.
        </P>
        <Rule
          quote="The star rating must be added to the licence and the licence should be displayed by the applicant's business."
          cite="Animal activity licensing process: statutory guidance"
          href={PROCESS_GUIDANCE}
        />
      </GuideSection>

      <GuideSection id="not-required" title="What the licence does not ask for">
        <P>Two things people assume are conditions are not.</P>
        <Rule
          quote={
            <>
              &ldquo;A vet must be appointed for the initial inspection for the licensed
              application for the breeding of dogs.&rdquo; For hiring out horses,
              &ldquo;a listed vet must be appointed for the initial inspection, for a
              renewal inspection, and for the annual inspection.&rdquo;
            </>
          }
          cite="Animal activity licensing process: statutory guidance"
          href={PROCESS_GUIDANCE}
        >
          There is no vet requirement for dog day care, kennel boarding or home
          boarding. The inspector needs a Level 3 certificate from an Ofqual-regulated
          body for that type of activity. Some councils choose to send a vet anyway and
          charge the applicant, which is why the same licence can cost £325 in one
          borough and over £1,000 in another. See{" "}
          <Link
            href="/guides/dog-daycare-licence-cost"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            what a dog daycare licence costs
          </Link>
          .
        </Rule>
        <Rule
          quote="the name and contact details of the dog's normal vet and details of any insurance relating to the dog"
          cite="Dog day care licensing: statutory guidance, condition 25.1(d)"
          href={DAYCARE_GUIDANCE}
        >
          That is the only mention of insurance in the day care guidance, and it is the
          dog&rsquo;s insurance, recorded by you. No condition requires the business to
          hold public liability or any other cover. The hiring out horses guidance does
          require it, so it is a choice that was made for one activity and not this one.
          Councils commonly ask for a public liability certificate on their own
          application form; that is a local requirement, not a licence condition.
        </Rule>
      </GuideSection>

      <GuideSection id="check" title="How to check a licence">
        <Rule
          quote="Local authorities should maintain a list of licensed businesses and their associated ratings on their websites."
          cite="Animal activity licensing process: statutory guidance"
          href={PROCESS_GUIDANCE}
        >
          Should, not must, and there is no national register. Many councils publish a
          list; some publish a PDF that is months old; some publish nothing. The
          reliable check is to ask to see the licence, which should be displayed at the
          business with its star rating, and then ring the council named on it.
        </Rule>
      </GuideSection>

      <GuideSection id="offence" title="Running without one">
        <Rule
          quote="Anyone who carries out or carries on with any of the licensable activities without a licence is committing an offence."
          cite="Animal activity licensing process: statutory guidance, citing section 13 of the Animal Welfare Act 2006"
          href={AWA_13}
        >
          Day care for dogs is a licensable activity under regulation 3 and Schedule 1
          of the 2018 Regulations, which makes it a specified activity for section 13.
          The penalty is set by section 32 of the Act. How often that is actually
          enforced is a different question, answered with numbers in{" "}
          <Link
            href="/guides/unlicensed-dog-boarding-enforcement"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            how often unlicensed dog boarding gets prosecuted
          </Link>
          .
        </Rule>
        <P>
          For the full text, the Regulations are on{" "}
          <Ext href={REGS}>legislation.gov.uk</Ext> and the guidance on{" "}
          <Ext href={DAYCARE_GUIDANCE}>gov.uk</Ext>.
        </P>
      </GuideSection>
    </GuideShell>
  );
}
