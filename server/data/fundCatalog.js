const FALLBACK_FUNDS = [
  {
    _id: "fallback-stree-shakti",
    name: "SBI Stree Shakti Package",
    category: "Loan",
    description:
      "SBI Stree Shakti Package supports women entrepreneurs in retail, services, professionals, and SSI segments.",
    fundingRange: { min: 50000, max: 2500000, currency: "INR" },
    timeline: "15-30 days",
    eligibility: [
      "Minimum 51% ownership by women entrepreneur(s)",
      "Applicable to proprietary, partnership, or company entities",
      "Retail, services, professional practices, and SSI units eligible",
      "Age 18+ (no upper age limit)",
    ],
    industryFocus: [
      "Technology",
      "Manufacturing",
      "Agriculture",
      "Education",
      "Healthcare",
      "Professional Services",
    ],
    businessStageApplicable: [
      "Idea Stage",
      "Prototype/MVP",
      "Early Stage (Pre-revenue)",
      "Revenue Generating",
      "Growth Stage",
    ],
    status: "Active",
  },
  {
    _id: "fallback-mudra",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    category: "Loan",
    status: "Active",
    description:
      "Flagship refinance window that offers collateral-light working capital and term loans up to Rs. 10 lakh for non-corporate, non-farm micro enterprises.",
    facilityType: "Working Capital and Term Loan",
    purpose:
      "Business expansion, capacity augmentation, modernization, and allied agricultural services",
    targetAudience:
      "Manufacturing, trading, and services micro units including allied agri activities",
    fundingRange: { min: 50000, max: 1000000, currency: "INR" },
    loanCategories: [
      {
        name: "Shishu",
        amountRange: "Up to Rs. 50,000",
        description: "Infancy-stage working capital needs",
      },
      {
        name: "Kishore",
        amountRange: "Rs. 50,001 to Rs. 5,00,000",
        description: "Growth and stabilization capital",
      },
      {
        name: "Tarun",
        amountRange: "Rs. 5,00,001 to Rs. 10,00,000",
        description: "Expansion and scaling requirements",
      },
    ],
    timeline: "Sanction and disbursal typically within 4-8 weeks",
    eligibility: [
      "Non-corporate, non-farm micro enterprises with viable business plans",
      "Applicants can approach Commercial Banks, RRBs, SFBs, Cooperative Banks, MFIs, or NBFCs",
      "Online applications available via JanSamarth portal",
    ],
    beneficiaries: [
      "Manufacturing, trading, and service-sector micro units",
      "Allied agricultural activities that are not crop cultivation",
    ],
    industryFocus: ["Manufacturing", "Agriculture", "Services", "Trading"],
    businessStageApplicable: [
      "Early Stage (Pre-revenue)",
      "Revenue Generating",
      "Growth Stage",
    ],
    margin: {
      shishu: "Nil up to Rs. 50,000",
      kishoreTarun: "20% for Rs. 50,001 to Rs. 10 lakh",
    },
    pricing: "Competitive pricing linked to EBLR with bank-specific spreads",
    repaymentGuidelines: [
      "TL/Dropline OD below Rs. 5 lakh: up to 5 years with max 6-month moratorium",
      "TL/Dropline OD Rs. 5-10 lakh: up to 7 years with max 12-month moratorium",
    ],
    processingFee:
      "Nil for Shishu/Kishore MSE units; Tarun attracts 0.50% (+tax) of loan amount",
    portal: {
      name: "JanSamarth Portal",
      url: "https://www.jansamarth.in",
    },
    applicationLink: "https://jansamarth.in/apply/sbi",
    features: [
      "Available through banks, RRBs, SFBs, cooperative banks, MFIs, and NBFCs",
      "Refinance support provided by MUDRA Ltd",
      "Categorized into Shishu, Kishore, Tarun for structured graduation",
    ],
  },
  {
    _id: "fallback-startup-india",
    name: "Startup India Seed Fund",
    category: "Government Scheme",
    description:
      "Financial assistance to startups for proof of concept, prototype development, product trials, and market entry.",
    fundingRange: { min: 2000000, max: 5000000, currency: "INR" },
    timeline: "3-6 months",
    eligibility: [
      "Business less than 2 years old",
      "Innovative business idea",
      "DPIIT recognized startup",
    ],
    industryFocus: ["Technology", "Manufacturing", "Healthcare"],
    businessStageApplicable: ["Idea Stage", "Prototype/MVP"],
    status: "Active",
  },
  {
    _id: "fallback-pmegp",
    name: "PRIME MINISTER EMPLOYMENT GENERATION PROGRAMME (PMEGP)",
    category: "Government Scheme",
    description:
      "To generate employment opportunities in rural as well as urban areas of the country through setting up of new self-employment ventures/projects/micro enterprises.",
    objectives: [
      "Generate employment opportunities in rural and urban areas by promoting new self-employment ventures",
      "Enable traditional artisans and unemployed youth to access self-employment closer to their homes",
      "Increase wage-earning capacity and accelerate rural and urban employment growth",
    ],
    implementingMinistry: "Khadi and Village Industries Commission (KVIC)",
    portal: {
      name: "PMEGP e-Portal",
      url: "https://www.kviconline.gov.in/pmegpeportal/jsp/portal/index.jsp",
    },
    beneficiaries: [
      "Any individual above 18 years of age",
      "Projects above Rs. 10 lakh (manufacturing) or Rs. 5 lakh (services) require minimum eighth standard pass",
      "Only new projects sanctioned specifically under PMEGP are eligible",
      "Self Help Groups, including BPL groups that have not availed other scheme benefits",
      "Institutions under Societies Registration Act, production co-operatives, and charitable trusts",
      "Existing units or beneficiaries that already received subsidy under other schemes are ineligible",
    ],
    targetAudience:
      "Individuals (18+), SHGs, registered societies, production co-ops, and charitable trusts launching new PMEGP projects",
    purpose: "For creation of employment through micro enterprises",
    fundingRange: { min: 0, max: 5000000, currency: "INR" },
    loanQuantum: {
      manufacturingMax: 5000000,
      businessServiceMax: 2000000,
      manufacturingUpgradationMax: 10000000,
    },
    margin: {
      generalCategory: "10%",
      specialCategory:
        "5% (SC/ST/OBC, women, minorities, NER, aspirational districts)",
    },
    repaymentPeriod: "3 to 7 years",
    interestRate: "EBLR + 3.25% (presently 12.15% p.a. effective 15 Feb 2025)",
    interestSubvention:
      "Subsidy of 15% to 35% of project cost provided through KVIC/KVIB/DIC",
    creditGuarantee:
      "CGFMU coverage up to Rs. 10 lakh; CGTMSE coverage above Rs. 10 lakh",
    timeline: "Sanction to disbursal typically 4-12 weeks",
    eligibility: [
      "Age 18+ with required minimum education for higher-value projects",
      "Only new PMEGP-sanctioned projects; existing units not eligible",
      "SHGs, registered societies, production co-ops, and charitable trusts can apply",
    ],
    industryFocus: ["Manufacturing", "Agriculture", "Education", "Technology"],
    businessStageApplicable: [
      "Idea Stage",
      "Prototype/MVP",
      "Early Stage (Pre-revenue)",
      "Revenue Generating",
      "Growth Stage",
    ],
    features: [
      "Subsidy routed through KVIC with monitoring by district task forces",
      "Collateral-free window through CGFMU/CGTMSE based on ticket size",
      "Margin money support and bank-linked credit",
    ],
    requiredDocuments: [
      "Detailed project report",
      "KYC and address proof",
      "Category/eligibility certificates (SC/ST/OBC/PH/Minority/NER)",
      "Educational qualification proof (VIII pass where applicable)",
    ],
    applicationLink:
      "https://www.kviconline.gov.in/pmegpeportal/jsp/portal/index.jsp",
    status: "Active",
    contactInfo: "support@ruralher.org",
  },
  {
    _id: "fallback-cgs1",
    name: "Credit Guarantee Scheme-I (CGTMSE)",
    category: "Credit Guarantee",
    status: "Active",
    description:
      "Guarantee cover for collateral-free credit up to Rs. 10 crore extended by eligible Member Lending Institutions to micro and small enterprises.",
    implementingMinistry:
      "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    purpose:
      "Enable MLIs to sanction collateral-free working capital and term loans by providing guarantee cover on eligible exposures.",
    beneficiaries: [
      "Micro and Small Enterprises engaged in eligible manufacturing, services, and trading activities",
      "Borrowers availing up to Rs. 10 crore with compulsory Udyam registration",
    ],
    eligibility: [
      "MSEs as per MSME Ministry definition (manufacturing, services, trading)",
      "Loans up to Rs. 10 crore extended by CGTMSE member lending institutions",
      "Mandatory Udyam Registration Number",
    ],
    ineligibleFacilities: [
      "Facilities already covered by DICGC/RBI risk cover",
      "Credit additionally covered by government, insurer, or other guarantee entities",
      "Facilities covered under NCGTC",
      "Facilities inconsistent with laws or RBI directives",
      "Borrowers with invoked guarantees under CGTMSE/other schemes and unsettled dues",
      "Facilities fully secured by collateral/third-party guarantee beyond hybrid security allowance",
    ],
    hybridSecurity:
      "Hybrid Security model permits MLIs to secure part of the exposure while covering the unsecured portion under CGTMSE up to Rs. 10 crore.",
    fundingRange: { min: 0, max: 100000000, currency: "INR" },
    loanQuantum: {
      workingCapitalMax: 100000000,
      termLoanMax: 100000000,
    },
    guaranteeFeeStructure: {
      effectiveFrom: "1 April 2025",
      slabs: [
        { range: "0 - 10 lakh", rate: "0.37%" },
        { range: "Above 10 - 50 lakh", rate: "0.55%" },
        { range: "Above 50 lakh - 1 crore", rate: "0.60%" },
        { range: "Above 1 - 2 crore", rate: "0.85%" },
        { range: "Above 2 - 5 crore", rate: "1.00%" },
        { range: "Above 5 - 8 crore", rate: "1.10%" },
        { range: "Above 8 - 10 crore", rate: "1.20%" },
      ],
      notes: [
        "Annual guarantee fee payable upfront for the first year and annually thereafter",
        "Concessions available for select borrower categories, regions, and ZED-certified units",
      ],
    },
    annualGuaranteeFeeNote:
      "Annual Guarantee Fee due upfront at commencement and annually for continuation of cover; refer scheme guidelines for concessions.",
    features: [
      "Guarantee cover on collateral-free working capital and term loans",
      "Covers facilities sanctioned on/after 1 June 2000 via CGTMSE member lenders",
      "Supports trading activity exposures as per revised eligibility",
    ],
    requiredDocuments: [
      "Sanction letter and appraisal note",
      "Udyam Registration Number",
      "MSE KYC and compliance documents",
    ],
    contactInfo: "https://www.cgtmse.in",
    applicationLink: "https://www.cgtmse.in",
  },
  {
    _id: "fallback-standup",
    name: "Stand-Up India",
    category: "Government Scheme",
    status: "Active",
    description:
      "Facilitates bank loans between Rs. 10 lakh and Rs. 1 crore for SC/ST and women entrepreneurs to launch new greenfield enterprises in manufacturing, services, trading, and allied agriculture activities.",
    implementingMinistry:
      "Department of Financial Services, Ministry of Finance",
    portal: {
      name: "Stand-Up Mitra Portal",
      url: "https://www.standupmitra.in/",
    },
    targetAudience:
      "At least one SC/ST borrower and one woman borrower per bank branch",
    beneficiaries: [
      "Scheduled Caste (SC) entrepreneurs",
      "Scheduled Tribe (ST) entrepreneurs",
      "Women entrepreneurs launching new ventures",
    ],
    objectives: [
      "Promote entrepreneurship among SC/ST and women sub-segments",
      "Ensure each bank branch supports at least one SC/ST and one woman borrower",
    ],
    purpose:
      "Set up new greenfield enterprises in manufacturing, trading, services, or allied agriculture sectors",
    fundingRange: { min: 1000000, max: 10000000, currency: "INR" },
    loanQuantum: {
      compositeLoanMin: 1000000,
      compositeLoanMax: 10000000,
    },
    margin:
      "Margin money up to 15% of project cost (minimum mandatory margin 10% even with subsidy assistance)",
    repaymentPeriod: "Up to 7 years with a maximum moratorium of 18 months",
    interestRate: "EBLR + 3.25% (approx. 12.15% effective 15 Feb 2025)",
    interestSubvention: "Nil",
    creditGuarantee:
      "CGSSI coverage through NCGTC; guarantee fee computed per account and recovered from borrower (up to 80%)",
    features: [
      "Composite loan covering term loan and working capital",
      "Mandatory Udyam registration encouraged for MSME classification",
      "Handholding support via Stand-Up Mitra portal",
    ],
    requiredDocuments: [
      "Standard SME documentation for SME-segment loans",
      "Scheme-specific documentation for allied agriculture activities",
    ],
    applicationLink: "https://www.standupmitra.in/",
    contactInfo: "https://www.standupmitra.in/",
  },
];

const applyFallbackFilters = (funds, queryParams) => {
  const { category, stage, industry, minAmount, maxAmount, search } =
    queryParams;

  return funds.filter((fund) => {
    if (category && fund.category !== category) return false;
    if (stage && !fund.businessStageApplicable?.includes(stage)) return false;
    if (industry && !fund.industryFocus?.includes(industry)) return false;

    if (minAmount && (fund.fundingRange?.min ?? 0) < parseInt(minAmount, 10)) {
      return false;
    }
    if (
      maxAmount &&
      (fund.fundingRange?.max ?? Number.MAX_SAFE_INTEGER) >
        parseInt(maxAmount, 10)
    ) {
      return false;
    }

    if (search) {
      const haystack =
        `${fund.name || ""} ${fund.description || ""}`.toLowerCase();
      if (!haystack.includes(String(search).toLowerCase())) return false;
    }

    return (fund.status || "Active") === "Active";
  });
};

module.exports = {
  FALLBACK_FUNDS,
  applyFallbackFilters,
};
