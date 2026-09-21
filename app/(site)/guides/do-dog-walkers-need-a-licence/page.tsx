import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuideShell from "@/components/guides/GuideShell";
import { Ext, Figures, GuideSection, Note, P, Rule } from "@/components/guides/GuideParts";
import { getGuide } from "@/lib/guides";
import { createMetadata } from "@/lib/seo";

const SLUG = "do-dog-walkers-need-a-licence";
const guide = getGuide(SLUG);

const SCHEDULE_1 = "https://www.legislation.gov.uk/uksi/2018/486/schedule/1";
const DAYCARE_GUIDANCE =
  "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities";
const AWA_9 = "https://www.legislation.gov.uk/ukpga/2006/45/section/9";
const TOWER_HAMLETS =
  "https://www.towerhamlets.gov.uk/lgnl/environment_and_waste/animal_welfare/Public-Space-Protection-Order-Dog-Control.aspx";

export const metadata: Metadata = guide
  ? createMetadata({
      title: guide.title,
      description: guide.description,
      path: `/guides/${SLUG}`,
    })
  : {};

const CONTENTS = [
  { id: "no-licence", label: "There is no licence for dog walking" },
  { id: "what-applies", label: "What does apply to a walker" },
  { id: "six-dogs", label: "Where the six-dog limit comes from" },
  { id: "fields", label: "Vans, hired fields and public parks" },
  { id: "change", label: "Will this change?" },
];

export default function Page() {
  if (!guide) notFound();

  return (
    <GuideShell guide={guide} contents={CONTENTS}>
      <GuideSection id="no-licence" title="There is no licence for dog walking">
        <P>
          The Animal Welfare (Licensing of Activities Involving Animals) (England)
          Regulations 2018 list every activity that needs a licence. Dog walking is not
          on the list.
        </P>
        <Figures
          caption="The licensable activities, Schedule 1 of the 2018 Regulations"
          head={["Activity", "Licensed?"]}
          rows={[
            ["Selling animals as pets", "Yes"],
            ["Providing or arranging boarding for cats or dogs (kennels, home boarding, day care)", "Yes"],
            ["Hiring out horses", "Yes"],
            ["Dog breeding", "Yes"],
            ["Keeping or training animals for exhibition", "Yes"],
            ["Dog walking", "No"],
            ["Dog sitting in the owner's home", "No"],
            ["Hiring out a field for dogs", "No"],
            ["Grooming", "No"],
          ]}
        />
        <Rule
          quote={
            <>
              The day care guidance excludes &ldquo;businesses that look after dogs in
              their owner&rsquo;s homes, such as, dog sitters and dog walkers&rdquo;.
            </>
          }
          cite="Dog day care licensing: statutory guidance, introduction"
          href={DAYCARE_GUIDANCE}
        >
          So a walker is left out twice: not in the Schedule, and named as an exclusion
          in the guidance for the nearest licence. Full text at{" "}
          <Ext href={SCHEDULE_1}>legislation.gov.uk</Ext>.
        </Rule>
      </GuideSection>

      <GuideSection id="what-applies" title="What does apply to a walker">
        <Rule
          quote="A person commits an offence if he does not take such steps as are reasonable in all the circumstances to ensure that the needs of an animal for which he is responsible are met to the extent required by good practice."
          cite="Animal Welfare Act 2006, section 9(1)"
          href={AWA_9}
        >
          The duty of care applies to anyone responsible for a dog, anywhere, including a
          walker with the lead in their hand. It sets no number of dogs, no ratio and no
          inspection. It is enforced after something goes wrong, not before.
        </Rule>
        <Rule
          quote="no person shall oversee more than four dogs in any Public Place"
          cite="London Borough of Tower Hamlets, Public Spaces Protection Order (dog control), Part 5, in force from 1 October 2025"
          href={TOWER_HAMLETS}
        >
          Some councils cap dogs per person in their parks with a public spaces
          protection order. Tower Hamlets sets four, or six for a walker who holds the
          council&rsquo;s professional dog walker licence, which costs £240 from 1 April
          2026 and asks for evidence of insurance and experience. A PSPO covers public
          places in that borough only. Check your own council; most have no cap.
        </Rule>
        <P>
          Insurance is not required by any law. Public liability cover is a commercial
          decision, and most owners, and the landlords of most hired fields, ask for it.
        </P>
      </GuideSection>

      <GuideSection id="six-dogs" title="Where the six-dog limit comes from">
        <Rule
          quote="A dog walker may walk no more than 6 dogs at the same time. The owner must consent to their dog being walked with others. Dogs must be familiarised with each other beforehand."
          cite="Dog day care licensing: statutory guidance, condition 7.2"
          href={DAYCARE_GUIDANCE}
        >
          This is the line people quote as &ldquo;the law says six&rdquo;. It is a
          condition on a dog day care licence. It binds a licensed daycare or boarder
          when it takes dogs off the premises for a walk, and an inspector checks it. It
          does not bind an independent walker, because an independent walker holds no
          licence for it to be a condition of.
        </Rule>
        <Note>
          A licensed daycare carries two numbers: ten dogs to one member of staff on its
          own premises (condition 4.1) and six to one person on a walk (condition 7.2).
          A walker carries neither. The only people in dog care with a number on them
          are the ones who applied to be checked.
        </Note>
      </GuideSection>

      <GuideSection id="fields" title="Vans, hired fields and public parks">
        <P>
          The day care licence covers &ldquo;daytime housing&rdquo; at a fixed premises.
          A business that collects dogs in a van and runs them in a hired field has no
          premises for the licence to attach to. Hiring out a field is not a licensable
          activity either. And a hired field is private land, so a council&rsquo;s park
          PSPO does not reach it.
        </P>
        <P>
          None of that makes a field business illegal or unsafe. Some councils license
          them anyway, some field businesses hold a licence, and some have better fencing
          than a licensed building. What is missing is a ratio, a licence and an
          inspector, because nobody wrote one for them. The licence conditions a building
          has to meet are in{" "}
          <Link
            href="/guides/dog-daycare-licence-england"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            the dog daycare licence in England
          </Link>
          .
        </P>
      </GuideSection>

      <GuideSection id="change" title="Will this change?">
        <P>
          Two petitions to Parliament ask for dog walkers and sitters to be licensed:{" "}
          <Ext href="https://petition.parliament.uk/petitions/770225">
            770225, Molly&rsquo;s Law
          </Ext>{" "}
          (opened 19 June 2026) and{" "}
          <Ext href="https://petition.parliament.uk/petitions/776716">
            776716, the Pet Care Regulations Bill
          </Ext>{" "}
          (opened 24 August 2026). On 15 September 2026 they had 1,167 and 1,746
          signatures, 2,913 between them. Each needs 10,000 for a government response
          and 100,000 to be considered for a debate. A near-identical petition closed in
          September 2025 with 2,302.
        </P>
        <P>
          Until that changes, the honest answer to &ldquo;how many dogs is your walker
          allowed?&rdquo; is that there is no number for them. How often the rules that
          do exist get enforced is in{" "}
          <Link
            href="/guides/unlicensed-dog-boarding-enforcement"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            how often unlicensed dog boarding gets prosecuted
          </Link>
          .
        </P>
      </GuideSection>
    </GuideShell>
  );
}
