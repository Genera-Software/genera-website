import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuideShell from "@/components/guides/GuideShell";
import { Ext, Figures, GuideSection, Note, P, Rule } from "@/components/guides/GuideParts";
import { getGuide } from "@/lib/guides";
import { createMetadata } from "@/lib/seo";

const SLUG = "unlicensed-dog-boarding-enforcement";
const guide = getGuide(SLUG);

const WOKINGHAM_FOI =
  "https://www.wokingham.gov.uk/foi/investigations-unlicensed-dog-boarding-kennels-2021-2025";
const RCT =
  "https://www.rctcbc.gov.uk/EN/Newsroom/PressReleases/2026/March/UnlicensedAberdareDogBoarderProsecuted.aspx";
const YAPPILY = "https://yappily.co.uk/pulse/";
const COTTRELL = "https://www.bailii.org/uk/cases/UKFTT/GRC/2026/458.html";
const EFRA = "https://publications.parliament.uk/pa/cm5804/cmselect/cmenvfru/161/summary.html";
const AWA_13 = "https://www.legislation.gov.uk/ukpga/2006/45/section/13";
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
  { id: "offence", label: "What the offence is" },
  { id: "wokingham", label: "One council's five years, in numbers" },
  { id: "wales", label: "A £393 fine after two dog attacks" },
  { id: "advert", label: "A Facebook advert is enough to start an investigation" },
  { id: "licensed", label: "Who actually gets held to the rules" },
  { id: "why", label: "Why enforcement is thin" },
  { id: "petitions", label: "The two petitions" },
];

export default function Page() {
  if (!guide) notFound();

  return (
    <GuideShell guide={guide} contents={CONTENTS}>
      <GuideSection id="offence" title="What the offence is">
        <Rule
          quote="Anyone who carries out or carries on with any of the licensable activities without a licence is committing an offence."
          cite="Animal activity licensing process: statutory guidance, citing section 13 of the Animal Welfare Act 2006"
          href={AWA_13}
        >
          In England, providing or arranging boarding for dogs is a licensable activity
          under the 2018 Regulations. That covers kennels, home boarding and day care.
          Doing it without a licence is a criminal offence under section 13(6) of the
          Animal Welfare Act 2006, with the penalty set by section 32. Wales still
          licenses boarding under the Animal Boarding Establishments Act 1963, which is
          the Act in the Welsh case below.
        </Rule>
        <P>
          The offence is clear. What follows is how often anyone is actually prosecuted
          for it. There is no national figure, so the only way to know is to ask a
          council, which somebody did.
        </P>
      </GuideSection>

      <GuideSection id="wokingham" title="One council's five years, in numbers">
        <P>
          Freedom of Information request 20902 asked Wokingham Borough Council about
          investigations into unlicensed dog boarding establishments between 2021 and
          2025. It was received on 3 December 2025 and answered on 5 January 2026.
        </P>
        <Figures
          caption="Wokingham Borough Council, FOI 20902"
          head={["Question", "Answer"]}
          rows={[
            [
              "Prosecutions 2021 to 2025",
              "One, brought in 2023, in connection with unlicensed animal activities. The council says it was the only prosecution of this nature recorded during the period. The same case carried fraud and unfair trading charges. Outcome: a suspended custodial sentence, a rehabilitation activity requirement, compensation and costs.",
            ],
            ["Complaints in 2025", "One complaint relating to a suspected unlicensed dog boarding establishment."],
            ["Complaints 2021 to 2024", "No year-by-year figure given."],
            [
              "Pending matters",
              "One tribunal about a refused licence, details withheld under section 31(1)(g) of the Freedom of Information Act 2000.",
            ],
          ]}
        />
        <Rule
          quote="We recorded one complaint in 2025 relating to a suspected unlicensed dog boarding establishment."
          cite="Wokingham Borough Council, FOI response 20902"
          href={WOKINGHAM_FOI}
        >
          One complaint does not mean one unlicensed boarder in the borough. It means one
          got reported. Wokingham is not worse than anyone else; it is the one council
          there is a number for, because somebody asked. Ask yours.
        </Rule>
      </GuideSection>

      <GuideSection id="wales" title="A £393 fine after two dog attacks">
        <P>
          Rhondda Cynon Taf Council prosecuted a home boarder whose licence covered a
          previous address only. Licences do not transfer when a business moves. The
          boarder carried on at a farm in Llwydcoed without applying for a new one.
        </P>
        <Figures
          caption="Rhondda Cynon Taf Council press release, 19 March 2026"
          head={["When", "What happened"]}
          rows={[
            ["Early October 2024", "A complaint that a dog had been attacked and injured while being boarded at the farm."],
            ["Later October 2024", "An unannounced visit by a licensing officer. The boarder was told in writing there was no valid licence for the premises."],
            ["July 2025", "A second complaint: a different dog attacked at the same unlicensed farm."],
            ["11 February 2026", "Guilty plea at Merthyr Magistrates' Court to boarding dogs without a licence under the Animal Boarding Establishments Act 1963."],
            ["Penalty", "Fines totalling £393."],
          ]}
        />
        <P>
          The system worked in the end, if two separate dog attacks a year apart and an
          ignored written warning count as working. For comparison, a new day care
          licence in Elmbridge costs £432. The fine for boarding without one, after all
          that, was less than the licence. Source:{" "}
          <Ext href={RCT}>the council&rsquo;s press release</Ext>.
        </P>
      </GuideSection>

      <GuideSection id="advert" title="A Facebook advert is enough to start an investigation">
        <P>
          The common excuse for not acting on an unlicensed boarder is that nobody
          complained. In September 2026, Yappily Pulse, a research community for licensed
          dog businesses, put six questions to councils about using social media to
          investigate suspected unlicensed home boarding and published the answers in
          the Licensed Canine Businesses Discussion and Support UK group.
        </P>
        <Figures
          caption="Council answers as reported by Yappily Pulse, Study 002"
          head={["Council", "What it confirmed in writing"]}
          rows={[
            [
              "East Riding of Yorkshire",
              "A publicly visible advert can be used as the start of an investigation and as evidence. An advert alone can be enough to begin preliminary enquiries. Officers can contact advertisers directly, including by private message on social media. Covert work is subject to RIPA. Entrapment was not identified as a reason an advert could not be investigated. The council has a published Public Protection Enforcement Policy that mentions social media.",
            ],
            ["East Suffolk", "Gave the first response and also confirmed public adverts can be used."],
          ]}
        />
        <Note>
          Two councils answered. That is not every council, and these answers are as
          reported by Yappily, not seen first hand. What they establish is that the
          barrier is not legal: a council does not need a complaint, and an advert is
          enough. The gap is that it rarely happens, not that it cannot. The study is at{" "}
          <Ext href={YAPPILY}>yappily.co.uk/pulse</Ext>.
        </Note>
      </GuideSection>

      <GuideSection id="licensed" title="Who actually gets held to the rules">
        <Rule
          quote="Regard must be had to the Statutory Guidance unless there is good reason not to do so."
          cite="Cottrell v Wokingham Borough Council [2026] UKFTT 458 (GRC), paragraph 44"
          href={COTTRELL}
        >
          The same council that brought one prosecution in five years refused to renew a
          licensed kennel&rsquo;s licence in June 2025 because the holder would not
          require leptospirosis vaccination, and won at tribunal on 25 March 2026. That
          is the shape of enforcement in this industry: the businesses that volunteered
          to be inspected are inspected, and held to the guidance line by line. The
          businesses that never applied are investigated when somebody rings.
        </Rule>
      </GuideSection>

      <GuideSection id="why" title="Why enforcement is thin">
        <Rule
          quote="constrained by a lack of specialist knowledge and training, and inadequate funding and resources"
          cite="House of Commons Environment, Food and Rural Affairs Committee, Pet welfare and abuse, April 2024, on local authorities' ability to enforce"
          href={EFRA}
        >
          The committee found the result is an inconsistent approach nationally and
          recommended a central unit of trained inspectors that councils could draw on.
          The process guidance already tells councils they may charge licence holders for
          enforcement against unlicensed businesses, so the licensed pay for the
          investigations, when they happen, into the unlicensed.
        </Rule>
        <P>
          The guidance also says councils should publish a list of licensed businesses
          and their ratings on their websites (
          <Ext href={PROCESS_GUIDANCE}>process guidance</Ext>). Should, not must, and
          there is no national register, so an owner has no single place to check a
          boarder before handing over a dog.
        </P>
      </GuideSection>

      <GuideSection id="petitions" title="The two petitions">
        <P>
          Two petitions to Parliament are open asking for this to change. Both ask for
          dog walkers and sitters to be brought into licensing, one standard of
          enforcement across the country, and a way for owners to check a licence before
          they book. A UK Parliament petition needs 10,000 signatures for a government
          response and 100,000 to be considered for a debate.
        </P>
        <Figures
          caption="Signatures on 15 September 2026"
          head={["Petition", "Opened", "Signatures"]}
          rows={[
            [
              <Ext key="p1" href="https://petition.parliament.uk/petitions/770225">
                770225, Review regulation of animal boarding and licensing conditions (Molly&rsquo;s Law)
              </Ext>,
              "19 June 2026",
              "1,167",
            ],
            [
              <Ext key="p2" href="https://petition.parliament.uk/petitions/776716">
                776716, Introduce stronger welfare regulations for pet care services
              </Ext>,
              "24 August 2026",
              "1,746",
            ],
          ]}
        />
        <P>
          Molly&rsquo;s Law is named for a dog who died in the care of an unlicensed
          carer. Its text calls enforcement a &ldquo;postcode lottery&rdquo;, which is
          the polite version of the numbers above. A near-identical petition in
          September 2025 closed with 2,302 signatures. Whether the fix is new law or
          enforcing the law that exists is the argument; the numbers on this page are
          the evidence for the second view. For what the licence itself requires, see{" "}
          <Link
            href="/guides/dog-daycare-licence-england"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            the dog daycare licence in England
          </Link>
          .
        </P>
      </GuideSection>
    </GuideShell>
  );
}
