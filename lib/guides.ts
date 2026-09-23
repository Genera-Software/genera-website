// The reference guides: dated, cited pages on UK dog daycare licensing built from
// primary sources (gov.uk statutory guidance, legislation.gov.uk, council FOI
// responses and press releases, a tribunal judgment).
//
// They exist because Google indexed only 6 of the 24 blog posts (21 Sep 2026): the
// six with information only Genera holds. Generic guides were crawled and dropped.
// These pages hold material gov.uk does not, so they are the pages an AI answer
// can cite. Every figure carries the date it was checked; when a fact changes,
// change it here and bump `checkedOn`, do not add an addendum.

export type GuideFaq = { q: string; a: string };

export type GuideSource = {
  label: string;
  href: string;
  /** What was taken from it, so a reader can check the exact claim. */
  note?: string;
};

export type Guide = {
  slug: string;
  /** Page <title> and h1. A question or a plain statement, never a teaser. */
  title: string;
  /** Meta description and the index card. */
  description: string;
  eyebrow: string;
  /** The date every figure on the page was last checked against its source. */
  checkedOn: string;
  /** First published. */
  publishedOn: string;
  /**
   * The short answer. Two to four plain sentences that stand alone, so an answer
   * engine can lift them whole. Rendered in the box under the title.
   */
  shortAnswer: string;
  /**
   * Three or four numbers this page exists to answer, shown as a strip under
   * the short answer. They break up what is otherwise a wall of prose, and
   * they are the bit a reader photographs.
   */
  keyFigures?: { figure: string; label: string; note: string }[];
  faqs: GuideFaq[];
  sources: GuideSource[];
};

export const GUIDES: Guide[] = [
  {
    slug: "dog-daycare-licence-england",
    eyebrow: "Licensing",
    title: "The dog daycare licence in England: every rule in one place",
    description:
      "Who needs a dog day care licence in England, what the 2018 Regulations require, the numbers in the statutory guidance (staff ratio, space, fencing, vaccinations), star ratings, licence lengths and what the licence does not ask for. Checked against gov.uk.",
    checkedOn: "2026-09-21",
    publishedOn: "2026-09-21",
    shortAnswer:
      "In England, a business that looks after other people's dogs during the day at a fixed premises needs a dog day care licence from its local council under the Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018. Dog walkers and dog sitters who work in the owner's home are not covered, and looking after dogs in your own home needs a home boarding licence instead. The licence carries a star rating from 1 to 5, lasts one, two or three years, and comes with conditions on staff numbers, space, fencing, temperature, vaccinations and records.",
    keyFigures: [
      { figure: "10", label: "Dogs per staff member", note: "8 for the higher standard" },
      { figure: "6m²", label: "Space per dog", note: "Inside and outside combined" },
      { figure: "2 wks", label: "After the last jab", note: "Before a first day" },
      { figure: "1 to 3", label: "Years per licence", note: "By star rating" },
    ],
    faqs: [
      {
        q: "Do I need a licence to run a dog daycare in England?",
        a: "Yes, if it is a commercial business looking after other people's dogs during the day at a fixed premises. The licence comes from your local council under the Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018. Running it without one is an offence under section 13 of the Animal Welfare Act 2006.",
      },
      {
        q: "How many dogs can one member of staff look after in a dog daycare?",
        a: "The statutory guidance's required standard is that each member of staff should have 10 dogs or less to care for. The higher standard, which counts towards a better star rating, is at least one full-time member of staff per 8 dogs.",
      },
      {
        q: "How much space does each dog need in a dog daycare?",
        a: "Each dog must have 6 square metres of space available to them within the premises. Inside and outside space both count towards the figure.",
      },
      {
        q: "How long does a dog daycare licence last?",
        a: "One year for a 1 or 2 star rating, two years for 3 or 4 stars, and three years for 5 stars. New applicants are automatically rated high risk, so a first licence is one or two years. Every licence gets at least one unannounced visit.",
      },
      {
        q: "Does a dog daycare need a vet inspection to get a licence?",
        a: "No. The process guidance requires a vet for the first inspection of a dog breeder and for hiring out horses. For dog day care, the inspector needs a Level 3 certificate from an Ofqual-regulated body. Some councils still choose to send a vet and charge the applicant for it.",
      },
      {
        q: "Does a dog daycare licence require public liability insurance?",
        a: "The dog day care conditions do not require the business to hold insurance. The only mention of insurance is the record you must keep of each dog's own insurance. Councils often ask for a public liability certificate on their own application form, which is a local requirement rather than a licence condition.",
      },
    ],
    sources: [
      {
        label: "Dog day care licensing: statutory guidance for local authorities (Defra, updated 1 June 2026)",
        href: "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities",
        note: "Scope and exclusions, conditions 4.1, 5.1, 5.2, 7.2, 9.4, 20.1 and 25.1.",
      },
      {
        label: "Animal activity licensing process: statutory guidance for local authorities (Defra, updated 1 June 2026)",
        href: "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/animal-activity-licensing-process-statutory-guidance-for-local-authorities",
        note: "Star ratings, licence lengths, unannounced visits, inspector qualifications, vet appointments, fees, the public list and licence display.",
      },
      {
        label: "The Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018, SI 2018/486",
        href: "https://www.legislation.gov.uk/uksi/2018/486/contents",
        note: "Regulation 3 and Schedule 1 (the licensable activities); Schedule 2 paragraph 9(4) (infectious disease).",
      },
      {
        label: "Animal Welfare Act 2006, section 13",
        href: "https://www.legislation.gov.uk/ukpga/2006/45/section/13",
        note: "Carrying on a licensable activity without a licence is an offence.",
      },
      {
        label: "Cottrell v Wokingham Borough Council [2026] UKFTT 458 (GRC), 25 March 2026",
        href: "https://www.bailii.org/uk/cases/UKFTT/GRC/2026/458.html",
        note: "Paragraphs 44 and 46 on the weight a council must give the statutory guidance.",
      },
    ],
  },
  {
    slug: "dog-daycare-licence-cost",
    eyebrow: "Costs",
    title: "What a dog daycare licence costs in England, and the costs it hides",
    description:
      "Real 2026 council fees for a dog day care licence (Elmbridge, Bromley, Liverpool, Test Valley), what a vet inspection adds, the Level 3 qualification, and the costs the licence conditions create: holiday cover under the staff ratio, the two dogs a five-star rating removes, and the space ceiling.",
    checkedOn: "2026-09-21",
    publishedOn: "2026-09-21",
    shortAnswer:
      "A dog day care licence in England costs between about £325 and £500 in council fees for most applicants in 2026, and over £1,000 where the council sends a vet and charges for it. The fee is the small part. The licence conditions set a staff ratio of one person to ten dogs and six square metres per dog, and those two numbers decide your wage bill, your holiday cover and the most dogs you can ever take.",
    keyFigures: [
      { figure: "£325", label: "Cheapest fee we found", note: "Liverpool, 2026" },
      { figure: "£1,048", label: "Dearest, with a vet", note: "Bromley, three years" },
      { figure: "£6,700", label: "Holiday cover, per person", note: "Pay plus a stand-in" },
      { figure: "£14,400", label: "What two fewer dogs cost", note: "Per staff member, a year" },
    ],
    faqs: [
      {
        q: "How much is a dog daycare licence in the UK?",
        a: "It is set by each council. Examples from 1 April 2026: Elmbridge £432 for a new licence and £380 for a renewal (five dogs or fewer), Test Valley £331, Liverpool £325. Bromley charges £159 admin plus a vet inspection of £488 or £666 plus a grant fee of £75 to £223 depending on licence length, so a three-year licence for more than ten dogs comes to £1,048 before a mid-term visit.",
      },
      {
        q: "Why does holiday cover cost a dog daycare more than other businesses?",
        a: "Because the staff ratio is a licence condition. A shop can run one person short for a week. A daycare at one person to ten dogs cannot, so every day of holiday is paid twice: once to the person away and once to the person standing in. At the 2026 National Living Wage that is about £6,700 a year per full-time member of staff.",
      },
      {
        q: "Does a five-star dog daycare licence cost more to run?",
        a: "Yes. The higher standard is one full-time member of staff per eight dogs instead of ten, so every member of staff on the floor is paired with two fewer paying dogs. At £30 a day, five days a week, 48 weeks a year, that is £14,400 of turnover per member of staff. In return a five-star licence lasts three years instead of one.",
      },
      {
        q: "How many dogs can a dog daycare take?",
        a: "The space rule sets the ceiling: total space available to the dogs, inside and outside, divided by six square metres. A 120 square metre premises works out at 20 dogs. The council can license fewer than the space allows, and the staff ratio then decides how many people you need on each shift.",
      },
    ],
    sources: [
      {
        label: "Elmbridge Borough Council, animal licensing fees from 1 April 2026",
        href: "https://www.elmbridge.gov.uk/licensing/animal-welfare-licences/animal-welfare-licence-fees",
        note: "Day care for dogs, five or fewer: £432 new (£316 on application, £116 on grant), £380 renewal. Veterinary inspections where required charged separately.",
      },
      {
        label: "London Borough of Bromley, animal licensing fees 1 April 2026 to 31 March 2027",
        href: "https://www.bromley.gov.uk/licences/animal-welfare-licensing-fees/3",
        note: "Admin £159; vet inspection on new application £488 (fewer than 10 dogs) or £666 (more than 10); on renewal £400 or £488; grant £75 (1 year), £150 (2 years), £223 (3 years); mid-term unannounced vet visit £311.",
      },
      {
        label: "Liverpool City Council, animal activity licence fees 2026",
        href: "https://liverpool.gov.uk/business/licences-and-permits/animal-licences/dog-day-care/",
        note: "£325 with no separate vet line.",
      },
      {
        label: "Test Valley Borough Council, animal licensing fees 2026/27",
        href: "https://testvalley.gov.uk/assets/attach/25104/2026-27-Charges-for-Animal-Licences.pdf",
        note: "£331; veterinary inspections charged separately where required.",
      },
      {
        label: "Dog day care licensing: statutory guidance for local authorities (Defra, updated 1 June 2026)",
        href: "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities",
        note: "Condition 4.1 (staff ratio and six square metres), the higher standards, condition 5.1 (fencing).",
      },
      {
        label: "Animal activity licensing process: statutory guidance for local authorities (Defra, updated 1 June 2026)",
        href: "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/animal-activity-licensing-process-statutory-guidance-for-local-authorities",
        note: "What councils may charge for, the fair and reasonable fees line, inspector qualifications, vet appointments, licence lengths.",
      },
      {
        label: "National Living Wage from 1 April 2026 (Low Pay Commission, confirmed at the Autumn Budget, 26 November 2025)",
        href: "https://www.gov.uk/national-minimum-wage-rates",
        note: "£12.71 an hour for workers aged 21 and over.",
      },
      {
        label: "Working Time Regulations 1998, regulations 13 and 13A",
        href: "https://www.legislation.gov.uk/uksi/1998/1833/regulation/13",
        note: "5.6 weeks' statutory holiday, capped at 28 days.",
      },
      {
        label: "IMDT, Ofqual Level 3 Professional Day Care and Boarding course",
        href: "https://www.imdt.uk.com/",
        note: "£340 plus VAT, about 60 hours over two months, as listed in September 2026.",
      },
    ],
  },
  {
    slug: "unlicensed-dog-boarding-enforcement",
    eyebrow: "Enforcement",
    title: "How often unlicensed dog boarding actually gets prosecuted",
    description:
      "What the numbers say about enforcement against unlicensed dog boarders and daycares: one council's FOI response (one prosecution in five years), a £393 fine after two dog attacks, the councils that say a Facebook advert is enough to open an investigation, and the two petitions asking for change.",
    checkedOn: "2026-09-21",
    publishedOn: "2026-09-21",
    shortAnswer:
      "Rarely. Boarding or day-caring dogs without a licence in England is a criminal offence under section 13 of the Animal Welfare Act 2006, but enforcement is left to each council. Wokingham Borough Council told a Freedom of Information request that it brought one prosecution between 2021 and 2025 and logged one complaint in 2025. In Wales, a home boarder whose unlicensed farm saw two separate dog attacks a year apart was fined a total of £393. Two councils have confirmed in writing that a public social media advert is enough to start an investigation without a complaint.",
    keyFigures: [
      { figure: "1", label: "Prosecution in five years", note: "Wokingham, 2021 to 2025" },
      { figure: "1", label: "Complaint logged in 2025", note: "In the same borough" },
      { figure: "£393", label: "Fine after two attacks", note: "A Welsh home boarder" },
      { figure: "2", label: "Councils confirming in writing", note: "An advert can start it" },
    ],
    faqs: [
      {
        q: "Is it illegal to board dogs without a licence in the UK?",
        a: "In England, yes. Providing or arranging boarding for dogs, including day care and home boarding, is a licensable activity under the 2018 Regulations, and carrying on a licensable activity without a licence is an offence under section 13 of the Animal Welfare Act 2006. Wales still licenses boarding under the Animal Boarding Establishments Act 1963, and Scotland has its own rules.",
      },
      {
        q: "How many people are prosecuted for unlicensed dog boarding?",
        a: "There is no national figure. Wokingham Borough Council's answer to FOI request 20902 was one prosecution between 2021 and 2025, brought in 2023 in connection with unlicensed animal activities, and one complaint recorded in 2025.",
      },
      {
        q: "Can a council investigate a dog boarder from a Facebook advert?",
        a: "Two councils have said yes in writing. East Riding of Yorkshire Council said a publicly visible advert can be used as the start of an investigation and as evidence, that an advert alone can be enough to begin preliminary enquiries, and that officers can contact advertisers directly, including by private message. East Suffolk Council also confirmed public adverts can be used.",
      },
      {
        q: "How do I check whether a dog daycare or boarder is licensed?",
        a: "Ask to see the licence, which the guidance says should be displayed at the business with its star rating, or check your council's website. Councils are told they should maintain a list of licensed businesses and their ratings online. There is no single national register.",
      },
    ],
    sources: [
      {
        label: "Wokingham Borough Council, FOI response 20902, investigations into unlicensed dog boarding and kennels 2021 to 2025 (answered 5 January 2026)",
        href: "https://www.wokingham.gov.uk/foi/investigations-unlicensed-dog-boarding-kennels-2021-2025",
        note: "One prosecution in 2023 in connection with unlicensed animal activities, the only one recorded in the period; one complaint in 2025.",
      },
      {
        label: "Rhondda Cynon Taf Council press release, Unlicensed Aberdare dog boarder prosecuted (19 March 2026)",
        href: "https://www.rctcbc.gov.uk/EN/Newsroom/PressReleases/2026/March/UnlicensedAberdareDogBoarderProsecuted.aspx",
        note: "Complaints in October 2024 and July 2025, each after a dog was attacked; guilty plea at Merthyr Magistrates' Court on 11 February 2026; fines totalling £393 under the Animal Boarding Establishments Act 1963.",
      },
      {
        label: "Yappily Pulse, Study 002: councils' use of social media in unlicensed home boarding investigations (September 2026)",
        href: "https://www.yappily.co.uk/pulse",
        note: "Written answers from East Riding of Yorkshire Council and East Suffolk Council, as reported by Yappily Pulse in the Licensed Canine Businesses Discussion and Support UK group.",
      },
      {
        label: "Cottrell v Wokingham Borough Council [2026] UKFTT 458 (GRC), 25 March 2026",
        href: "https://www.bailii.org/uk/cases/UKFTT/GRC/2026/458.html",
        note: "A kennel boarding renewal refused over leptospirosis vaccination; appeal dismissed.",
      },
      {
        label: "House of Commons EFRA Committee, Pet welfare and abuse (April 2024)",
        href: "https://publications.parliament.uk/pa/cm5804/cmselect/cmenvfru/161/summary.html",
        note: "Councils' ability to enforce is constrained by a lack of specialist knowledge and training, and inadequate funding and resources.",
      },
      {
        label: "Petition 770225, Review regulation of animal boarding and licensing conditions (Molly's Law)",
        href: "https://petition.parliament.uk/petitions/770225",
        note: "Opened 19 June 2026. 1,167 signatures on 15 September 2026.",
      },
      {
        label: "Petition 776716, Introduce stronger welfare regulations for pet care services",
        href: "https://petition.parliament.uk/petitions/776716",
        note: "Opened 24 August 2026. 1,746 signatures on 15 September 2026.",
      },
      {
        label: "Animal Welfare Act 2006, section 13",
        href: "https://www.legislation.gov.uk/ukpga/2006/45/section/13",
      },
    ],
  },
  {
    slug: "do-dog-walkers-need-a-licence",
    eyebrow: "Dog walkers",
    title: "Do dog walkers need a licence in England?",
    description:
      "No licence exists for dog walking in England. What does apply: the Animal Welfare Act duty of care, council public space orders that cap dogs per person in parks, the six-dog limit that binds licensed daycares on a walk, and the petitions asking for walkers and sitters to be licensed.",
    checkedOn: "2026-09-21",
    publishedOn: "2026-09-21",
    shortAnswer:
      "No. Dog walking is not a licensable activity in England. The 2018 Regulations list the activities that need a licence, and the dog day care guidance excludes dog walkers and dog sitters by name. A walker is still bound by the Animal Welfare Act's duty of care and by any council public space order that caps the number of dogs one person may have in a park. The six-dog limit people quote applies to licensed daycares and boarders when they take dogs off the premises, not to independent walkers.",
    keyFigures: [
      { figure: "0", label: "Licences for dog walking", note: "None exists in England" },
      { figure: "6", label: "Dogs on a licensed walk", note: "Condition 7.2, daycares only" },
      { figure: "4", label: "Dogs in some parks", note: "Tower Hamlets, by order" },
      { figure: "2,913", label: "Petition signatures", note: "Across both, 15 Sep 2026" },
    ],
    faqs: [
      {
        q: "Is there a legal limit on how many dogs a dog walker can walk in the UK?",
        a: "Not nationally. Some councils cap dogs per person in public places with a public spaces protection order; Tower Hamlets sets four unless the walker holds the council's professional dog walker licence. Those orders cover public places only. Licensed day care and boarding businesses are limited to six dogs per walker under condition 7.2 of the statutory guidance.",
      },
      {
        q: "Do dog walkers need insurance by law?",
        a: "No law requires it. Public liability insurance is a commercial decision, and most owners and many landlords of hired fields ask for it.",
      },
      {
        q: "Does a hired dog field need a licence?",
        a: "Hiring out a field for dogs is not one of the licensable activities in Schedule 1 of the 2018 Regulations. A hired field is private land, so council public space orders for parks do not reach it either.",
      },
      {
        q: "Are dog walkers going to be licensed in future?",
        a: "Two petitions to Parliament are asking for it. Petition 770225 (Molly's Law) and petition 776716 (the Pet Care Regulations Bill) both ask for walkers and sitters to be brought into licensing. On 15 September 2026 they had 2,913 signatures between them; each needs 10,000 for a government response and 100,000 to be considered for a debate.",
      },
    ],
    sources: [
      {
        label: "The Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018, Schedule 1",
        href: "https://www.legislation.gov.uk/uksi/2018/486/schedule/1",
        note: "The licensable activities: selling animals as pets, providing or arranging boarding for cats or dogs, hiring out horses, dog breeding, keeping or training animals for exhibition.",
      },
      {
        label: "Dog day care licensing: statutory guidance for local authorities (Defra, updated 1 June 2026)",
        href: "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities",
        note: "Exclusion of dog sitters and dog walkers; condition 7.2, no more than six dogs walked at the same time.",
      },
      {
        label: "Animal Welfare Act 2006, section 9",
        href: "https://www.legislation.gov.uk/ukpga/2006/45/section/9",
        note: "Duty of a person responsible for an animal to ensure its welfare.",
      },
      {
        label: "London Borough of Tower Hamlets, Public Spaces Protection Order (dog control), Part 5",
        href: "https://www.towerhamlets.gov.uk/lgnl/environment_and_waste/animal_welfare/Public-Space-Protection-Order-Dog-Control.aspx",
        note: "Part 5: no person shall oversee more than four dogs in any public place unless they hold the council's professional dog walker licence, which allows six. In force from 1 October 2025; the licence costs £240 from 1 April 2026.",
      },
      {
        label: "Petition 770225, Review regulation of animal boarding and licensing conditions (Molly's Law)",
        href: "https://petition.parliament.uk/petitions/770225",
      },
      {
        label: "Petition 776716, Introduce stronger welfare regulations for pet care services",
        href: "https://petition.parliament.uk/petitions/776716",
      },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

export const formatGuideDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
