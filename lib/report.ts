// The Genera Licensing Report 2026: one dated, cited page that pulls the licensing
// research behind the September series into a document the press can quote and
// link. It is the page a journalist is sent, so every figure carries the date it
// was checked and the source it came from. Update a figure in place and bump
// `checkedOn`; never append an "update" paragraph.
//
// The Surrey FOI table is added here when the eleven councils have answered.
// Until `surreyFoi.sentOn` is set, the page says nothing about it.

import type { GuideSource } from "@/lib/guides";

export const REPORT = {
  slug: "licensing-report-2026",
  path: "/research/licensing-report-2026",
  pdfPath: "/research/genera-licensing-report-2026.pdf",
  eyebrow: "Genera Licensing Report 2026",
  title: "What a dog daycare licence costs in England, who checks it, and who is outside it",
  description:
    "The Genera Licensing Report 2026. Council fees for the same dog day care licence from £286.50 to £1,048, five Surrey fee schedules merging into one authority in 2027, one prosecution in five years at one council, the businesses no licence reaches, and what five stars costs a daycare. Every figure dated and sourced.",
  publishedOn: "2026-09-22",
  checkedOn: "2026-09-22",
  /** Petition counts read from petition.parliament.uk on checkedOn. */
  petitions: {
    mollysLaw: 1174,
    petCareBill: 1768,
    readOn: "2026-09-22",
  },
  /**
   * The Surrey FOI round. Set `sentOn` when the requests have actually gone to all
   * eleven districts, and fill `rows` as answers come back. The page renders
   * nothing about it while `sentOn` is null.
   */
  surreyFoi: {
    sentOn: null as string | null,
    rows: [] as Array<{
      council: string;
      licences: string;
      complaints: string;
      prosecutions: string;
      unannounced: string;
    }>,
  },
};

/** The one-line findings at the top. Each must be traceable to a source below. */
export const FINDINGS: { figure: string; line: string }[] = [
  {
    figure: "£286.50 to £915",
    line: "The same dog day care licence costs £286.50 in Mole Valley and up to £915 in Epsom and Ewell, two councils that share a border and will be one authority in 2027.",
  },
  {
    figure: "£325 to £1,048",
    line: "Across England the spread is wider: £325 in Liverpool, £1,048 in Bromley for a three-year licence once the council's vet inspection is added.",
  },
  {
    figure: "5 into 1",
    line: "From 1 April 2027 five Surrey councils with five different fee structures become East Surrey Council. None has said which fee or which inspection regime survives.",
  },
  {
    figure: "0 vet visits",
    line: "The guidance does not require a vet to inspect a daycare. Duncan's Dog Co has held its licence for fifteen years without one. Bromley charges £666 a time.",
  },
  {
    figure: "1 in 5 years",
    line: "Wokingham Borough Council brought one prosecution for unlicensed animal activities between 2021 and 2025, and logged one complaint in 2025.",
  },
  {
    figure: "£393",
    line: "A Welsh home boarder whose unlicensed premises saw two separate dog attacks was fined £393 in total, less than a licence costs in most of Surrey.",
  },
  {
    figure: "6 dogs",
    line: "The six-dogs-per-walker limit binds only licensed daycares and boarders. An independent walker, a sitter or a hired field is outside the licence altogether.",
  },
  {
    figure: "10 years vs 18 weeks",
    line: "The maximum sentence in Illinois for one dog's death in heat. The two concluded English hot-vehicle cases against professional dog walkers ended in 18 weeks and in no custody.",
  },
];

export const SOURCES: GuideSource[] = [
  {
    label: "Mole Valley District Council, animal activities licensing, fees as listed on 22 September 2026",
    href: "https://www.molevalley.gov.uk/animal-activities-licensing/",
    note: "Lower tier (home boarding and day care for dogs): Part A application £166.50, Part B licence £120, total £286.50. Vet inspection, where required, charged in addition.",
  },
  {
    label: "Tandridge District Council, animal licences, fees as listed on 22 September 2026",
    href: "https://www.tandridge.gov.uk/Business-support-and-licensing/Licences/Animal-licenses",
    note: "Lower tier: Part A £198, Part B £120, total £318. Vet inspection invoiced after the visit where required.",
  },
  {
    label: "Elmbridge Borough Council, animal welfare licence fees from 1 April 2026",
    href: "https://www.elmbridge.gov.uk/licensing/animal-welfare-licences/animal-welfare-licence-fees",
    note: "Day care for dogs, five or fewer: £432 new, £380 renewal. Large day care centre, more than five dogs: £510 new, £449 renewal. Veterinary inspections where required charged separately.",
  },
  {
    label: "Reigate and Banstead Borough Council, animal licence fees 1 April 2026 to 31 March 2027",
    href: "https://www.reigate-banstead.gov.uk/info/20433/licences_for_animals/1647/apply_for_an_animal_licence",
    note: "Dog day care: £381 Part A plus £120 Part B, £501 new and £421 renewal for up to ten dogs, plus £53 per additional ten dogs. Part B is described as the recoverable enforcement cost. Vet inspection invoiced separately.",
  },
  {
    label: "Epsom and Ewell Borough Council, fees and charges 2026/27, Appendix 2 (licensing)",
    href: "https://democracy.epsom-ewell.gov.uk/documents/s39760/Fees%20and%20Charges%20202627%20Appendix%202.pdf",
    note: "Animal welfare (boarding, day care, breeding, kennels and catteries): initial fee £220 plus a licence fee by length, £445 for one year, £530 for two, £695 for three. A new three-year licence is therefore £915.",
  },
  {
    label: "Spelthorne Borough Council, fees and charges 2026/27",
    href: "https://www.spelthorne.gov.uk/sites/default/files/2026-06/Fees%20and%20Charges%202026-27.pdf",
    note: "Dog day care £600 (application £468, grant £132), up from £568 in 2025/26.",
  },
  {
    label: "Liverpool City Council, dog day care licence 2026",
    href: "https://liverpool.gov.uk/business/licences-and-permits/animal-licences/dog-day-care/",
    note: "£325, no separate vet line.",
  },
  {
    label: "London Borough of Bromley, animal welfare licensing fees 1 April 2026 to 31 March 2027",
    href: "https://www.bromley.gov.uk/licences/animal-welfare-licensing-fees/3",
    note: "Admin £159; vet inspection on a new application £488 (fewer than ten dogs) or £666 (more than ten); grant £75, £150 or £223 by licence length; mid-term unannounced vet visit £311. A three-year licence for more than ten dogs comes to £1,048.",
  },
  {
    label: "Surrey County Council, government confirms new East and West councils for Surrey",
    href: "https://www.surreycc.gov.uk/community/news/categories/your-council/government-lgr-confirmation",
    note: "East Surrey Council takes over Elmbridge, Epsom and Ewell, Mole Valley, Reigate and Banstead and Tandridge from 1 April 2027; West Surrey Council takes Guildford, Runnymede, Spelthorne, Surrey Heath, Waverley and Woking.",
  },
  {
    label: "Animal activity licensing process: statutory guidance for local authorities (Defra, updated 1 June 2026)",
    href: "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/animal-activity-licensing-process-statutory-guidance-for-local-authorities",
    note: "What councils may charge for and the fair and reasonable fees line; inspector qualifications; when a vet is required; star ratings and licence lengths; at least one unannounced visit per licence.",
  },
  {
    label: "Dog day care licensing: statutory guidance for local authorities (Defra, updated 1 June 2026)",
    href: "https://www.gov.uk/government/publications/animal-activities-licensing-guidance-for-local-authorities/dog-day-care-licensing-statutory-guidance-for-local-authorities",
    note: "Scope and the exclusion of dog walkers and sitters; condition 4.1 (one member of staff to ten dogs, six square metres per dog) and the higher standard of one to eight; condition 5.1 (two secure barriers); condition 7.2 (six dogs per walker).",
  },
  {
    label: "The Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018, Schedule 1",
    href: "https://www.legislation.gov.uk/uksi/2018/486/schedule/1",
    note: "The licensable activities. Dog walking, dog sitting and hiring out a field are not among them.",
  },
  {
    label: "Animal Welfare Act 2006, section 13",
    href: "https://www.legislation.gov.uk/ukpga/2006/45/section/13",
    note: "Carrying on a licensable activity without a licence is an offence.",
  },
  {
    label: "Wokingham Borough Council, FOI response 20902, investigations into unlicensed dog boarding and kennels 2021 to 2025 (answered 5 January 2026)",
    href: "https://www.wokingham.gov.uk/foi/investigations-unlicensed-dog-boarding-kennels-2021-2025",
    note: "One prosecution in 2023 in connection with unlicensed animal activities, the only one in the period; one complaint in 2025.",
  },
  {
    label: "Rhondda Cynon Taf Council, unlicensed Aberdare dog boarder prosecuted (19 March 2026)",
    href: "https://www.rctcbc.gov.uk/EN/Newsroom/PressReleases/2026/March/UnlicensedAberdareDogBoarderProsecuted.aspx",
    note: "Complaints in October 2024 and July 2025, each after a dog was attacked; guilty plea at Merthyr Magistrates' Court on 11 February 2026; fines totalling £393 under the Animal Boarding Establishments Act 1963.",
  },
  {
    label: "Yappily Pulse, Study 002: councils' use of social media in unlicensed home boarding investigations (September 2026)",
    href: "https://www.yappily.co.uk/pulse",
    note: "Written answers from East Riding of Yorkshire Council and East Suffolk Council: a public advert can start an investigation and be evidence, and officers may contact the advertiser directly.",
  },
  {
    label: "House of Commons EFRA Committee, Pet welfare and abuse (April 2024)",
    href: "https://publications.parliament.uk/pa/cm5804/cmselect/cmenvfru/161/summary.html",
    note: "Councils' ability to enforce is constrained by a lack of specialist knowledge and training, and inadequate funding and resources.",
  },
  {
    label: "London Borough of Tower Hamlets, Public Spaces Protection Order (dog control), Part 5",
    href: "https://www.towerhamlets.gov.uk/lgnl/environment_and_waste/animal_welfare/Public-Space-Protection-Order-Dog-Control.aspx",
    note: "No more than four dogs per person in a public place unless the walker holds the council's professional dog walker licence, which allows six. £240 from 1 April 2026.",
  },
  {
    label: "KMOV First Alert 4, man given maximum sentence for animal cruelty incident in Washington Park (17 September 2026)",
    href: "https://www.firstalert4.com/2026/09/17/man-given-maximum-sentence-animal-cruelty-incident-washington-park/",
    note: "St Clair County, Illinois. Ten years, the statutory maximum, after a jury conviction for animal torture, aggravated animal cruelty and animal cruelty. The dog was left in temperatures in the 90s Fahrenheit, dragged from a vehicle by a chain and abandoned; it died the next day.",
  },
  {
    label: "The News (Portsmouth), Hampshire professional dog walker jailed after two clients' dogs died in her car (March 2022)",
    href: "https://www.portsmouth.co.uk/news/crime/hampshire-professional-dog-walker-jailed-for-killing-two-of-her-clients-pets-by-leaving-them-in-a-car-on-hottest-day-of-the-year-3630868",
    note: "Southampton Magistrates' Court, 28 March 2022. Two spaniels left in a car boot on 21 July 2021 at 29C. Guilty plea to causing unnecessary suffering. Eighteen weeks' imprisonment and an eight-year ban on owning animals.",
  },
  {
    label: "Gazette & Herald, professional York dog walker caused spaniel's death in heatwave (March 2023)",
    href: "https://www.gazetteherald.co.uk/news/23362223.pam-fisher-caused-death-york-cocker-spaniel-heatwave/",
    note: "York Magistrates' Court, 3 March 2023. A cocker spaniel left in a van for about five hours on 11 August 2022. Guilty plea. Twelve-month community order, three-year ban on dealing with and transporting dogs, £400 costs and £95 surcharge. No custody.",
  },
  {
    label: "Animal Welfare (Sentencing) Act 2021",
    href: "https://www.legislation.gov.uk/ukpga/2021/21/contents",
    note: "In force 29 June 2021. Raised the maximum sentence for the worst animal cruelty offences in England and Wales from six months to five years.",
  },
  {
    label: "National Living Wage from 1 April 2026",
    href: "https://www.gov.uk/national-minimum-wage-rates",
    note: "£12.71 an hour for workers aged 21 and over.",
  },
  {
    label: "Working Time Regulations 1998, regulations 13 and 13A",
    href: "https://www.legislation.gov.uk/uksi/1998/1833/regulation/13",
    note: "5.6 weeks' statutory holiday, capped at 28 days.",
  },
  {
    label: "Petition 770225, Review regulation of animal boarding and licensing conditions (Molly's Law)",
    href: "https://petition.parliament.uk/petitions/770225",
    note: "Opened 19 June 2026. 1,174 signatures on 22 September 2026.",
  },
  {
    label: "Petition 776716, Introduce stronger welfare regulations for pet care services",
    href: "https://petition.parliament.uk/petitions/776716",
    note: "Opened 24 August 2026. 1,768 signatures on 22 September 2026.",
  },
];
