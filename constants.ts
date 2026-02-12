
import { NewsItem, KPI, ChartData, Publication, SignalData, ScienceTopic, ScientificPublication, DocumentItem } from './types';

export const THEME = {
  colors: {
    darkBg: '#00314E',
    cyan: '#01BEFF',
    green: '#5ED500',
    teal: '#4DB6AC',
    navy: '#1E3A5F',
    blue: '#3B82F6',
    orange: '#F97316',
    pink: '#EC4899',
  }
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    date: '2024-04-12',
    entryType: 'News',
    type: 'Partnership',
    subType: 'Licensing Agreement',
    title: 'AstraZeneca Enters Exclusive Licensing Agreement for Ac-225 Candidate',
    summary: 'AstraZeneca has secured global rights to Fusion Pharmaceuticals\' key Ac-225 asset. The deal is valued at up to $2B pending regulatory milestones.',
    tumorType: 'Prostate Cancer',
    target: 'PSMA',
    isotope: '225Ac',
    isotopeType: 'Alpha',
    region: 'Global',
    sourceName: 'AstraZeneca IR',
    sourceUrl: 'https://astrazeneca.com',
    aiSummary: true,
    isHumanReviewed: true,
    isBreaking: true,
    ciNote: 'High Impact: Marks significant big-pharma entry into Alpha-emitters. Likely to accelerate competitor consolidation in the Ac-225 supply chain.',
    companies: ['AstraZeneca', 'Fusion Pharmaceuticals'],
    assets: ['FPI-2265'],
    assetFocus: 'Therapeutic',
    lineOfTherapy: 'mCRPC',
    phase: 'Phase 2',
    priority: 'Key',
    reviewer: 'John Doe'
  },
  {
    id: '2',
    date: '2024-04-10',
    entryType: 'News',
    type: 'Clinical',
    subType: 'Trial Initiation',
    title: 'Curium Doses First Patient in Phase 1b Trial for Glioblastoma',
    summary: 'Curium has announced the first patient dosed in their ECLIPSE trial evaluating Pb-212 labeled agents for recurrent glioblastoma multiforme.',
    tumorType: 'Glioblastoma',
    target: 'SSTR2',
    isotope: '212Pb',
    isotopeType: 'Alpha',
    region: 'North America',
    sourceName: 'ClinicalTrials.gov',
    sourceUrl: 'https://clinicaltrials.gov',
    aiSummary: true,
    isHumanReviewed: true,
    ciNote: 'Monitor: Pb-212 supply chain stability remains the primary risk factor for this program. Efficacy data expected Q4 2024.',
    companies: ['Curium', 'RadioMedix'],
    assets: ['Cu-212-DOTATATE'],
    assetFocus: 'Therapeutic',
    phase: 'Phase 1b',
    trialId: 'NCT05551234',
    priority: 'Key',
    reviewer: 'Sarah Chen'
  },
  {
    id: '3',
    date: '2024-04-08',
    entryType: 'News',
    type: 'Regulatory',
    subType: 'Expedited Designation',
    title: 'FDA Grants Fast Track Designation to Novel Lu-177 Radioligand',
    summary: 'The FDA has granted Fast Track designation for a novel Lu-177 candidate targeting neuroendocrine tumors, expediting the review process.',
    tumorType: 'Neuroendocrine Tumors',
    target: 'SSTR',
    isotope: '177Lu',
    isotopeType: 'Beta',
    region: 'North America',
    sourceName: 'FDA Press',
    sourceUrl: '#',
    aiSummary: false,
    isHumanReviewed: true,
    ciNote: 'Regulatory tailwinds for Lu-177 continue. This lowers the barrier for entry for follow-on compounds in the NET space.',
    companies: ['Novartis', 'Point Biopharma'],
    assets: ['PNT2002'],
    assetFocus: 'Theranostic',
    phase: 'Pre-registration',
    priority: 'Other',
    reviewer: 'John Doe'
  },
  {
    id: '4',
    date: '2024-04-05',
    entryType: 'Internal CI',
    type: 'Funding',
    subType: 'Series C',
    title: 'Mariana Oncology Raises $175M to Advance Radiopharmaceutical Pipeline',
    summary: 'Oversubscribed Series C financing will support the advancement of lead candidate MC-339 into clinical trials for small cell lung cancer.',
    tumorType: 'Small Cell Lung Cancer',
    target: 'Novel',
    isotope: '225Ac',
    isotopeType: 'Alpha',
    region: 'North America',
    sourceName: 'Fierce Biotech',
    sourceUrl: '#',
    aiSummary: true,
    isHumanReviewed: false,
    ciNote: 'Strong validation of the peptidic radioligand approach. Adds pressure on Bristol Myers Squibb to accelerate their RayzeBio integration.',
    companies: ['Mariana Oncology', 'Deep Track Capital'],
    assets: ['MC-339'],
    assetFocus: 'Therapeutic',
    phase: 'Pre-clinical',
    priority: 'Other',
    reviewer: 'System'
  },
  {
    id: '5',
    date: '2024-04-02',
    entryType: 'News',
    type: 'Market Access',
    subType: 'Reimbursement',
    title: 'CMS Updates Payment Model for Diagnostic Radiopharmaceuticals',
    summary: 'New CMS proposal aims to unbundle payments for high-cost diagnostic radiopharmaceuticals, potentially improving hospital adoption rates.',
    tumorType: 'General Oncology',
    target: 'N/A',
    isotope: '68Ga',
    region: 'North America',
    sourceName: 'CMS.gov',
    sourceUrl: '#',
    aiSummary: true,
    isHumanReviewed: true,
    ciNote: 'Critical commercial catalyst. Unbundling could increase diagnostic utilization by 40% in community hospital settings.',
    companies: ['Lantheus', 'Telix'],
    assets: ['Illuccix', 'Locametz'],
    assetFocus: 'Diagnostic',
    priority: 'Key',
    reviewer: 'Mike Ross'
  }
];

export const KPIS: KPI[] = [
  { label: 'Regulatory Approvals', value: '+12%', change: 'this month', trend: 'up' },
  { label: 'Clinical Trials Active', value: '81', change: 'Global radiotherapeutic', trend: 'up' },
  { label: 'Funding Raised', value: '$295M', change: 'Across 11 rounds', trend: 'up' }
];

export const MARKET_DATA: ChartData[] = [
  { name: 'Commercial', value: 45, color: '#01BEFF' },
  { name: 'Clinical', value: 30, color: '#3B82F6' },
  { name: 'Regulatory', value: 15, color: '#5ED500' },
  { name: 'Research', value: 10, color: '#14B8A6' },
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'vision-trial-2021',
    category: 'Clinical',
    title: 'Lutetium-177–PSMA-617 for Metastatic Castration-Resistant Prostate Cancer',
    description: 'The landmark VISION trial establishing the standard of care.'
  },
  {
    id: 'tat-review-2023',
    category: 'Review',
    title: 'Targeted Alpha Therapy: The Next Frontier',
    description: 'Comprehensive comparison of Ac-225 vs Pb-212.'
  },
  {
    id: 'market-outlook',
    category: 'Market',
    title: 'Emerging Radiopharmaceutical Therapies Market Report 2024',
    description: 'Growth projections and supply chain bottleneck analysis.'
  }
];

export const SIGNAL_DATA: SignalData[] = [
  { date: 'Oct', lutetium: 240, actinium: 150, lead: 100 },
  { date: 'Nov', lutetium: 300, actinium: 200, lead: 120 },
  { date: 'Dec', lutetium: 280, actinium: 250, lead: 180 },
  { date: 'Jan', lutetium: 400, actinium: 280, lead: 200 },
  { date: 'Feb', lutetium: 380, actinium: 350, lead: 240 },
  { date: 'Mar', lutetium: 500, actinium: 400, lead: 280 },
];

// --- NEW SCIENCE CONTENT ---

export const SCIENCE_TOPICS: ScienceTopic[] = [
  {
    id: 'lutetium-177',
    title: 'The Standard: Lutetium-177',
    shortDesc: 'Understanding the Beta-emitter that launched the modern era of radioligand therapy.',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    color: 'from-blue-500 to-cyan-500',
    sections: [
      {
        heading: 'Overview',
        content: 'Lutetium-177 (Lu-177) is a beta-emitting radioisotope with a half-life of 6.7 days. It is the workhorse of current commercial radioligand therapies (RLT), including Pluvicto and Lutathera. Its decay releases a beta particle (electron) that travels approximately 1-2mm in tissue, making it effective for treating medium-to-large tumor lesions while sparing surrounding healthy tissue.',
        keyPoints: ['Half-life: 6.7 days', 'Emission: Beta (medium energy)', 'Range: ~2mm', 'Commercial Status: Established']
      },
      {
        heading: 'Mechanism of Action',
        content: 'Lu-177 is chelated to a targeting molecule (like PSMA-617 or DOTATATE). Once the molecule binds to the receptor on the cancer cell surface, the complex is internalized. The Lu-177 then decays, releasing cytotoxic radiation that causes single-strand DNA breaks. Because beta particles rely on oxygen free radicals to cause damage, they are most effective in well-oxygenated tumors.',
      },
      {
        heading: 'Supply Chain',
        content: 'Lu-177 is primarily produced in nuclear reactors via two routes: direct activation (Lu-176 target) or indirect carrier-free (Yb-176 target). The carrier-free (n.c.a.) method is preferred for medical use due to higher specific activity. Major global suppliers include ITM and Curium.',
      }
    ]
  },
  {
    id: 'actinium-225',
    title: 'The Future: Actinium-225',
    shortDesc: 'Why Alpha-emitters are considered the "sniper rifles" of oncology.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
    color: 'from-green-500 to-emerald-500',
    sections: [
      {
        heading: 'Overview',
        content: 'Actinium-225 (Ac-225) is an alpha-emitting radioisotope with a 10-day half-life. Unlike beta emitters, alpha particles (helium nuclei) are extremely heavy and energetic but travel a very short distance (only a few cell diameters, ~50-80 microns). This allows for potent "double-strand" DNA breaks that are difficult for cells to repair.',
        keyPoints: ['Half-life: 10 days', 'Emission: Alpha (high energy)', 'Range: <0.1mm', 'Commercial Status: Emerging']
      },
      {
        heading: 'Clinical Advantage',
        content: 'Ac-225 is often referred to as a "magic bullet" because its high linear energy transfer (LET) kills cells effectively regardless of the cell cycle or oxygenation status (overcoming hypoxia resistance). It is particularly promising for micrometastases that are too small for Beta-emitters to treat effectively.',
      },
      {
        heading: 'The Supply Bottleneck',
        content: 'Currently, the global supply of Ac-225 is severely limited, primarily derived from decaying Thorium stockpiles. Novel production methods via cyclotrons and linacs are being developed by companies like TerraPower, NorthStar, and Fusion to meet the anticipated demand.',
      }
    ]
  },
  {
    id: 'theranostics',
    title: 'Theranostics: See it, Treat it',
    shortDesc: 'The pairing of diagnostic imaging and therapeutic treatment.',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    color: 'from-indigo-500 to-purple-500',
    sections: [
      {
        heading: 'The Concept',
        content: 'Theranostics combines therapy and diagnostics. A patient is first imaged with a diagnostic isotope (like Ga-68 or F-18) attached to a targeting molecule. If the scan shows high uptake in tumors (they "light up"), the patient is deemed eligible. They are then treated with the therapeutic isotope (Lu-177 or Ac-225) attached to the exact same or similar molecule.',
      },
      {
        heading: 'Precision Medicine',
        content: 'This approach removes the guesswork from oncology. Instead of treating based on average statistics, clinicians treat based on the specific molecular expression of the patient\'s individual tumor burden.',
      }
    ]
  },
  {
    id: 'lead-212',
    title: 'Lead-212: The Next Wave',
    shortDesc: 'Overcoming the supply chain limitations of Actinium.',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    color: 'from-orange-500 to-red-500',
    sections: [
      {
        heading: 'Overview',
        content: 'Lead-212 (Pb-212) is an alpha-emitter acting as an "in vivo generator." It has a relatively short half-life (10.6 hours), but it decays into Bi-212 and Po-212, which release alpha particles. Its chemistry allows for chelation with different linkers than Actinium.',
      },
      {
        heading: 'Supply Chain Advantage',
        content: 'Unlike Ac-225, Pb-212 can be generated from Ra-224 generators, which can be distributed to hospitals. This decentralized "generator-based" supply chain mimics the successful Tc-99m model used in diagnostics, potentially solving the logistics hurdle of alpha therapy.',
      }
    ]
  }
];

export const DETAILED_PUBLICATIONS: ScientificPublication[] = [
  {
    id: 'vision-trial-2021',
    category: 'Clinical',
    title: 'Lutetium-177–PSMA-617 for Metastatic Castration-Resistant Prostate Cancer (VISION)',
    authors: 'Sartor O, de Bono J, Chi KN, et al.',
    journal: 'New England Journal of Medicine (NEJM)',
    date: 'June 23, 2021',
    doi: '10.1056/NEJMoa2107322',
    abstract: 'In this open-label, phase 3 trial, we evaluated 177Lu-PSMA-617 in patients with metastatic castration-resistant prostate cancer previously treated with at least one androgen-receptor–pathway inhibitor and one or two taxane regimens.',
    visualSummary: {
      objective: 'To determine if 177Lu-PSMA-617 plus standard of care increases overall survival compared to standard of care alone.',
      design: 'Randomized, open-label, Phase 3. n=831 patients. 2:1 randomization.',
      results: [
        { label: 'Overall Survival', value: '15.3 vs 11.3 mo', description: 'Median OS favored the treatment arm significantly.', isPositive: true },
        { label: 'rPFS', value: '8.7 vs 3.4 mo', description: 'Radiographic progression-free survival was more than doubled.', isPositive: true },
        { label: 'Adverse Events', value: '52.7% (Grade 3+)', description: 'Higher rate of bone marrow suppression and dry mouth in treatment arm.', isPositive: false }
      ],
      conclusion: 'Treatment with 177Lu-PSMA-617 prolonged imaging-based progression-free survival and overall survival when added to standard care.'
    },
    marketImplication: 'This is the foundational trial that led to the FDA approval of Pluvicto, validating the commercial viability of PSMA-targeted radioligands and setting the benchmark for all future competitors.'
  },
  {
    id: 'tat-review-2023',
    category: 'Review',
    title: 'Targeted Alpha Therapy: State of the Art and Future Trends',
    authors: 'Weber W, Nelson B, et al.',
    journal: 'Journal of Nuclear Medicine',
    date: 'Jan 15, 2023',
    doi: '10.2967/jnumed.122.264882',
    abstract: 'A comprehensive review of the emerging landscape of alpha-emitters, focusing on the clinical transition of Ac-225 and Pb-212.',
    visualSummary: {
      objective: 'Compare efficacy and logistics of Alpha vs Beta emitters.',
      design: 'Literature Review & Meta-analysis of Phase 1/2 data.',
      results: [
        { label: 'DNA Damage', value: 'Double-strand', description: 'Alphas cause irreparable DNA breaks vs reparable single-strand breaks from Betas.', isPositive: true },
        { label: 'Range', value: '50-80 µm', description: 'Limits toxicity to surrounding bone marrow compared to longer range Lu-177.', isPositive: true },
        { label: 'Supply Risk', value: 'High', description: 'Current global Ac-225 supply meets <5% of projected demand.', isPositive: false }
      ],
      conclusion: 'Alpha therapy represents a paradigm shift for micrometastatic disease, but supply chain maturity is the rate-limiting step.'
    },
    marketImplication: 'Highlights the urgent investment need in actinium production (cyclotrons). Suggests Pb-212 as a viable near-term alternative due to generator availability.'
  },
  {
    id: 'market-outlook',
    category: 'Market',
    title: 'Global Radiopharmaceutical Market Trajectory 2024-2030',
    authors: 'Intelligence Unit',
    journal: 'Internal CI Report',
    date: 'March 1, 2024',
    doi: 'INTERNAL-2024-03',
    abstract: 'Analysis of market size, CAGR, and M&A activity in the radioligand space following recent big-pharma acquisitions.',
    visualSummary: {
      objective: 'Forecast market growth and identify consolidation trends.',
      design: 'Financial modeling & Pipeline analysis.',
      results: [
        { label: 'CAGR', value: '14.2%', description: 'Projected growth rate through 2030.', isPositive: true },
        { label: 'M&A Volume', value: '$12.5B', description: 'Total deal value in last 12 months (BMS, AstraZeneca, Lilly).', isPositive: true },
        { label: 'Key Bottleneck', value: 'Manufacturing', description: 'CDMO capacity is fully booked for next 24 months.', isPositive: false }
      ],
      conclusion: 'The market is shifting from "scientific curiosity" to a central pillar of oncology. Supply chain resilience will determine the winners.'
    },
    marketImplication: 'Companies must verticalize their supply chain (own the isotope) to compete. Reliance on third-party suppliers is now a strategic risk.'
  }
];

export const DOCUMENTS_LIBRARY: DocumentItem[] = [
  {
    id: 'doc-001',
    title: 'SNMMI 2025: Conference Intelligence Summary',
    type: 'Conference Coverage',
    date: '2025-06-25',
    format: 'PPT',
    fileSize: '45 MB',
    author: ['CI Team', 'Medical Affairs'],
    uploadedBy: 'Medical Affairs',
    tags: ['SNMMI', 'Ac-225', 'Clinical Data', 'Lantheus', 'Novartis'],
    userGroup: 'All Users',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=600',
    executiveSummary: 'Executive overview of key data presented at SNMMI 2025 in Toronto. Highlights include Phase 2 results for FPI-2265, initial safety data for Pb-212 conjugates, and competitor booth analysis.'
  },
  {
    id: 'doc-002',
    title: 'Q1 2025 Radioligand Competitive Landscape Report',
    type: 'Internal Report',
    date: '2025-04-15',
    format: 'PPT',
    fileSize: '12 MB',
    author: ['John Doe', 'Sarah Chen'],
    uploadedBy: 'CI Team',
    tags: ['Competitive Landscape', 'Strategy', 'Market Share', 'Pipeline'],
    userGroup: 'Executive Leadership',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    executiveSummary: 'Quarterly update on the TRT market. Focus on the shift from Beta to Alpha therapies, new entrants in the CDMO space, and updated peak sales forecasts for Pluvicto competitors.'
  },
  {
    id: 'doc-003',
    title: 'Ac-225 Global Supply Chain Deep Dive',
    type: 'Internal Report',
    date: '2025-03-10',
    format: 'PDF',
    fileSize: '5.2 MB',
    author: ['Supply Chain Unit'],
    uploadedBy: 'Manufacturing Strategy',
    tags: ['Actinium-225', 'Supply Chain', 'Logistics', 'Manufacturing'],
    userGroup: 'Commercial Team',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    executiveSummary: 'Detailed analysis of current and projected Ac-225 capacity. Risk assessment of cyclotron vs. generator production methods and implications for our clinical pipeline timeline.'
  },
  {
    id: 'doc-004',
    title: 'Pb-212 Alpha Therapy: Efficacy & Safety Review',
    type: 'Scientific Publication',
    date: '2025-02-28',
    format: 'PDF',
    fileSize: '2.4 MB',
    author: ['Dr. Emily Weiss'],
    uploadedBy: 'R&D',
    tags: ['Lead-212', 'Alpha Therapy', 'Pre-clinical', 'Safety'],
    userGroup: 'All Users',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600',
    executiveSummary: 'A comprehensive review of the physical properties and clinical potential of Lead-212. Comparison with Ac-225 regarding recoil energy and renal toxicity profiles.'
  },
  {
    id: 'doc-005',
    title: 'Market Share Analysis: Novartis vs. BMS vs. AstraZeneca',
    type: 'Internal Report',
    date: '2025-05-20',
    format: 'XLSX',
    fileSize: '1.5 MB',
    author: ['Financial Analysis Team'],
    uploadedBy: 'Commercial Strategy',
    tags: ['Market Share', 'Financials', 'Forecast', 'M&A'],
    userGroup: 'Executive Leadership',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    executiveSummary: 'Consolidated financial model projecting market share shifts through 2030 following the recent acquisitions of Fusion and RayzeBio. Includes sensitivity analysis on pricing.'
  },
  {
    id: 'doc-006',
    title: 'TRT Monthly Intelligence Brief: March 2025',
    type: 'Newsletter',
    date: '2025-03-31',
    format: 'PDF',
    fileSize: '1.8 MB',
    author: ['Commercial Strategy'],
    uploadedBy: 'CI Team',
    tags: ['Newsletter', 'Market Updates', 'Regulatory', 'News'],
    userGroup: 'All Users',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=600',
    executiveSummary: 'Monthly roundup of critical events in the radioligand space. Topics: FDA feedback on novel endpoints for mCRPC, European reimbursement updates, and key personnel moves.'
  }
];
