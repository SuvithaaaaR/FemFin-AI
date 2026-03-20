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
  {
    _id: "fallback-twees",
    name: "TWEES Scheme (Tamil Nadu Women Entrepreneurship Scheme)",
    category: "Government Scheme",
    status: "Active",
    description:
      "Supports women and transgender entrepreneurs in Tamil Nadu with subsidy-backed bank-linked project finance.",
    purpose: "New business setup in manufacturing, services, and trading",
    targetAudience:
      "Women and transgender entrepreneurs aged 18-55 residing in Tamil Nadu",
    fundingRange: { min: 100000, max: 1000000, currency: "INR" },
    margin: "Beneficiary contribution about 5% of project cost",
    interestSubvention: "Government subsidy about 25% (up to Rs. 2,00,000)",
    repaymentPeriod: "Around 5 to 7 years with optional moratorium",
    interestRate: "Typically around 8% to 12% based on bank norms",
    timeline: "Usually 2 to 3 months",
    eligibility: [
      "Women or transgender applicant",
      "Age 18 to 55",
      "Tamil Nadu domicile",
      "No strict income or education restriction",
    ],
    ineligibleFacilities: [
      "Agriculture-only projects",
      "Dairy-only projects",
      "Restricted/prohibited activities",
    ],
    industryFocus: ["Manufacturing", "Services", "Trading"],
    businessStageApplicable: ["Idea Stage", "Early Stage (Pre-revenue)"],
    requiredDocuments: [
      "Aadhaar",
      "PAN",
      "Bank passbook",
      "Passport-size photos",
      "Project report",
    ],
    features: [
      "Subsidy component does not require repayment",
      "Interest applies only on bank-loan component",
      "District-level scrutiny and interview before sanction",
    ],
  },
  {
    _id: "fallback-tread",
    name: "TREAD Scheme",
    category: "Government Scheme",
    status: "Active",
    description:
      "Trade Related Entrepreneurship Assistance and Development (TREAD) supports women through NGO-led training and bank-linked finance.",
    purpose:
      "Skill development plus credit access for women-led micro and small enterprises",
    targetAudience: "Women, especially low-income and rural beneficiaries",
    fundingRange: { min: 50000, max: 1000000, currency: "INR" },
    interestSubvention:
      "Government support about 30% of project cost via NGO (non-repayable)",
    repaymentPeriod: "Typically 3 to 7 years",
    interestRate: "Typically around 8% to 12%",
    timeline: "Usually 2 to 3 months",
    eligibility: [
      "Women applicants",
      "Preference to low-income and rural women",
      "No strict education requirement",
    ],
    industryFocus: ["Manufacturing", "Services", "Trading"],
    businessStageApplicable: ["Idea Stage", "Early Stage (Pre-revenue)"],
    requiredDocuments: [
      "Aadhaar",
      "PAN",
      "Bank details",
      "Passport-size photos",
      "Project report",
    ],
    features: [
      "NGO-assisted application and handholding",
      "Training support before loan processing",
      "Interest payable only on bank-loan component",
    ],
  },
  {
    _id: "fallback-mahila-coir",
    name: "Mahila Coir Yojana",
    category: "Government Scheme",
    status: "Active",
    description:
      "Promotes rural women entrepreneurs in coir-based manufacturing through training and machinery/subsidy support.",
    purpose: "Set up coir product manufacturing units",
    targetAudience: "Rural women interested in coir enterprise",
    fundingRange: { min: 25000, max: 300000, currency: "INR" },
    interestSubvention: "Subsidy support up to about 75% (as applicable)",
    repaymentPeriod: "Around 3 to 5 years where loan is availed",
    interestRate: "Typically around 7% to 10% (if loan component exists)",
    timeline: "Usually 1 to 2 months",
    eligibility: [
      "Women applicants (primarily rural)",
      "Willingness to engage in coir production activities",
    ],
    industryFocus: ["Manufacturing"],
    businessStageApplicable: ["Idea Stage", "Early Stage (Pre-revenue)"],
    requiredDocuments: ["Aadhaar", "PAN", "Passport-size photos", "Basic application form"],
    features: [
      "Training-linked support",
      "Machinery support under the scheme",
      "Low debt burden due to high subsidy component",
    ],
  },
  {
    _id: "fallback-orient-mahila-vikas",
    name: "Orient Mahila Vikas Yojana",
    category: "Loan",
    status: "Active",
    description:
      "Bank loan scheme for women-owned MSMEs with relatively concessional lending terms.",
    purpose: "Business setup and growth for women-owned MSMEs",
    targetAudience: "Women with at least 51% ownership in the business",
    fundingRange: { min: 100000, max: 2500000, currency: "INR" },
    interestSubvention: "No direct subsidy component",
    repaymentPeriod: "Around 5 to 7 years",
    interestRate: "Slightly lower than standard MSME lending rates",
    timeline: "Usually 1 to 2 months",
    eligibility: ["Women must hold minimum 51% ownership in enterprise"],
    industryFocus: ["Manufacturing", "Services", "Trading"],
    businessStageApplicable: ["Revenue Generating", "Growth Stage"],
    requiredDocuments: [
      "Aadhaar",
      "PAN",
      "Bank account details",
      "Project report",
    ],
    features: ["Direct bank loan", "No subsidy", "Suitable for MSME expansion"],
  },
  {
    _id: "fallback-sidbi-mahila-udyam",
    name: "SIDBI Mahila Udyam Nidhi",
    category: "Loan",
    status: "Active",
    description:
      "Financing support for women entrepreneurs to expand or modernize existing small-scale enterprises.",
    purpose: "Expansion and modernization of existing women-led enterprises",
    targetAudience: "Women entrepreneurs with operating businesses",
    fundingRange: { min: 100000, max: 1000000, currency: "INR" },
    interestSubvention: "No direct subsidy component",
    repaymentPeriod: "Up to 10 years",
    interestRate: "Moderate and lender-linked",
    timeline: "Usually 2 to 3 months",
    eligibility: [
      "Women entrepreneurs",
      "Primarily for existing business expansion",
    ],
    industryFocus: ["Manufacturing", "Services", "Trading"],
    businessStageApplicable: ["Revenue Generating", "Growth Stage"],
    requiredDocuments: [
      "Business proof",
      "Aadhaar",
      "PAN",
      "Project report",
    ],
    features: ["Long tenure reduces EMI pressure", "Useful for scale-up capital"],
  },
  {
    _id: "fallback-mahila-samriddhi",
    name: "Mahila Samriddhi Yojana",
    category: "Microfinance",
    status: "Active",
    description:
      "Small-ticket livelihood financing support for economically weaker women through micro-credit channels.",
    purpose: "Self-employment and nano-enterprise support",
    targetAudience: "Economically weaker women",
    fundingRange: { min: 10000, max: 300000, currency: "INR" },
    interestSubvention: "No direct subsidy",
    repaymentPeriod: "Around 1 to 3 years",
    interestRate: "Low to moderate",
    timeline: "Few days to a few weeks",
    eligibility: ["Low-income women"],
    industryFocus: ["Services", "Trading", "Home-based enterprise"],
    businessStageApplicable: ["Idea Stage", "Early Stage (Pre-revenue)"],
    requiredDocuments: ["Basic identity proof"],
    features: ["Small loan size", "Faster access", "Suitable for first-time borrowers"],
  },
  {
    _id: "fallback-tn-shg-corporation",
    name: "Tamil Nadu Corporation SHG Scheme",
    category: "Government Scheme",
    status: "Active",
    description:
      "Group-based support through Tamil Nadu women development institutions for SHG-linked enterprise loans.",
    purpose: "Rural and small business support through SHG-bank linkage",
    targetAudience: "Women in registered Self Help Groups in Tamil Nadu",
    fundingRange: { min: 10000, max: 500000, currency: "INR" },
    interestSubvention: "Subsidy may be available as per applicable program",
    repaymentPeriod: "Flexible based on bank/SHG cycle",
    interestRate: "Low",
    timeline: "Usually 1 to 2 months",
    eligibility: ["Women SHG members", "Active SHG participation"],
    industryFocus: ["Services", "Trading", "Rural manufacturing"],
    businessStageApplicable: ["Idea Stage", "Early Stage (Pre-revenue)"],
    requiredDocuments: ["Basic ID proof", "SHG membership records"],
    features: ["Group guarantee model", "Easy access to small loans", "Rural-focused support"],
  },
  {
    _id: "fallback-shg-bank-linkage",
    name: "SHG Bank Linkage Programme",
    category: "Government Scheme",
    status: "Active",
    description:
      "NABARD-promoted SHG-bank linkage model enabling women groups to build credit history and scale borrowing over time.",
    purpose: "Progressive group lending for women-led enterprises",
    targetAudience: "Women SHGs with 10 to 20 members",
    fundingRange: { min: 10000, max: 1000000, currency: "INR" },
    interestSubvention: "Subsidy support may be available in select linked programs",
    repaymentPeriod: "Flexible and bank-linked",
    interestRate: "Low",
    timeline: "Usually 1 to 3 months",
    eligibility: ["Women group with regular savings records", "Bank linkage readiness"],
    industryFocus: ["Services", "Trading", "Rural enterprise"],
    businessStageApplicable: ["Idea Stage", "Early Stage (Pre-revenue)", "Revenue Generating"],
    requiredDocuments: ["SHG records", "Member ID proof", "Bank linkage documents"],
    features: ["Start small and scale credit", "Community-backed lending model", "Lower-risk pathway"],
  },
  {
    _id: "fallback-microfinance-loans",
    name: "Microfinance Loans (NBFC/MFI)",
    category: "Microfinance",
    status: "Active",
    description:
      "Fast small-ticket business loans from NBFCs and MFIs for micro-enterprises without heavy collateral requirements.",
    purpose: "Quick access working capital for very small businesses",
    targetAudience: "Individuals and micro-entrepreneurs needing fast credit",
    fundingRange: { min: 10000, max: 200000, currency: "INR" },
    interestSubvention: "No subsidy",
    repaymentPeriod: "About 1 to 3 years",
    interestRate: "Higher than mainstream bank loans",
    timeline: "Typically 1 to 7 days",
    eligibility: ["Basic KYC", "Credit profile as per lender policy"],
    industryFocus: ["Services", "Trading", "Home enterprise"],
    businessStageApplicable: ["Idea Stage", "Early Stage (Pre-revenue)", "Revenue Generating"],
    requiredDocuments: ["Basic identity proof", "Address proof", "Bank details"],
    features: ["Quick disbursal", "Minimal collateral", "Suitable for urgent small-ticket needs"],
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
