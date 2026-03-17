const mongoose = require("mongoose");
const { Fund } = require("../models");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");
const { FALLBACK_FUNDS, applyFallbackFilters } = require("../data/fundCatalog");

/**
 * @desc    Get all funds
 * @route   GET /api/funds
 * @access  Public
 */
exports.getFunds = asyncHandler(async (req, res) => {
  const { category, stage, industry, minAmount, maxAmount, search } = req.query;

  if (mongoose.connection.readyState !== 1) {
    const data = applyFallbackFilters(FALLBACK_FUNDS, req.query);
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
      source: "fallback",
      message: "Database unavailable. Returning fallback funds from server.",
    });
  }

  let query = { status: "Active" };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by business stage
  if (stage) {
    query.businessStageApplicable = stage;
  }

  // Filter by industry
  if (industry) {
    query.industryFocus = industry;
  }

  // Filter by funding range
  if (minAmount || maxAmount) {
    query["fundingRange.min"] = {};
    if (minAmount) query["fundingRange.min"].$gte = parseInt(minAmount);
    if (maxAmount) query["fundingRange.max"].$lte = parseInt(maxAmount);
  }

  // Search by name or description
  if (search) {
    query.$text = { $search: search };
  }

  let funds;
  try {
    funds = await Fund.find(query).sort({ createdAt: -1 }).select("-__v");
  } catch (error) {
    const data = applyFallbackFilters(FALLBACK_FUNDS, req.query);
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
      source: "fallback",
      message: "Database query failed. Returning fallback funds from server.",
    });
  }

  res.status(200).json({
    success: true,
    count: funds.length,
    data: funds,
  });
});

/**
 * @desc    Get single fund by ID
 * @route   GET /api/funds/:id
 * @access  Public
 */
exports.getFund = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const fallbackFund = FALLBACK_FUNDS.find(
      (item) => item._id === req.params.id,
    );

    if (!fallbackFund) {
      throw new ErrorResponse("Fund not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: fallbackFund,
      source: "fallback",
    });
  }

  const fund = await Fund.findById(req.params.id);

  if (!fund) {
    throw new ErrorResponse("Fund not found", 404);
  }

  res.status(200).json({
    success: true,
    data: fund,
  });
});

/**
 * @desc    Create new fund
 * @route   POST /api/funds
 * @access  Private/Admin
 */
exports.createFund = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    throw new ErrorResponse(
      "Database is not connected. Cannot create fund right now.",
      503,
    );
  }

  // Add user to req.body
  req.body.createdBy = req.user?._id;

  const fund = await Fund.create(req.body);

  res.status(201).json({
    success: true,
    data: fund,
  });
});

/**
 * @desc    Update fund
 * @route   PUT /api/funds/:id
 * @access  Private/Admin
 */
exports.updateFund = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    throw new ErrorResponse(
      "Database is not connected. Cannot update fund right now.",
      503,
    );
  }

  let fund = await Fund.findById(req.params.id);

  if (!fund) {
    throw new ErrorResponse("Fund not found", 404);
  }

  fund = await Fund.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: fund,
  });
});

/**
 * @desc    Delete fund
 * @route   DELETE /api/funds/:id
 * @access  Private/Admin
 */
exports.deleteFund = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    throw new ErrorResponse(
      "Database is not connected. Cannot delete fund right now.",
      503,
    );
  }

  const fund = await Fund.findById(req.params.id);

  if (!fund) {
    throw new ErrorResponse("Fund not found", 404);
  }

  await fund.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Get fund categories
 * @route   GET /api/funds/categories
 * @access  Public
 */
exports.getFundCategories = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const categories = [
      ...new Set(FALLBACK_FUNDS.map((item) => item.category)),
    ];
    return res.status(200).json({
      success: true,
      data: categories,
      source: "fallback",
    });
  }

  const categories = await Fund.distinct("category");

  res.status(200).json({
    success: true,
    data: categories,
  });
});

/**
 * @desc    Seed initial funds data
 * @route   POST /api/funds/seed
 * @access  Private/Admin
 */
exports.seedFunds = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    throw new ErrorResponse(
      "Database is not connected. Cannot seed funds right now.",
      503,
    );
  }

  const initialFunds = [
    {
      name: "Startup India Seed Fund",
      category: "Government Scheme",
      description:
        "Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization",
      fundingRange: { min: 2000000, max: 5000000 },
      timeline: "3-6 months",
      eligibility: [
        "Business less than 2 years old",
        "Innovative business idea",
        "DPIIT recognized startup",
      ],
      targetAudience: ["Early Stage", "All"],
      businessStageApplicable: ["Idea Stage", "Prototype/MVP"],
      industryFocus: ["Technology", "Manufacturing", "Healthcare"],
      website:
        "https://www.startupindia.gov.in/content/sih/en/startup-scheme.html",
      features: [
        "No equity dilution",
        "Mentorship support",
        "Networking opportunities",
      ],
      status: "Active",
      successRate: 35,
    },
    {
      name: "MUDRA Loan Scheme",
      category: "Loan",
      description:
        "Loans up to 10 lakh for micro and small businesses without collateral",
      fundingRange: { min: 50000, max: 1000000 },
      timeline: "1-2 months",
      eligibility: [
        "Registered business entity",
        "No collateral required",
        "For business expansion",
      ],
      targetAudience: ["Women Entrepreneurs", "Early Stage", "All"],
      businessStageApplicable: [
        "Early Stage (Pre-revenue)",
        "Revenue Generating",
        "Growth Stage",
      ],
      industryFocus: [
        "Manufacturing",
        "Agriculture",
        "Education",
        "Technology",
      ],
      interestRate: "8-12% per annum",
      repaymentTerms: "Up to 7 years",
      website: "https://www.mudra.org.in/",
      features: ["No collateral", "Quick processing", "Flexible repayment"],
      status: "Active",
      successRate: 68,
    },
    {
      name: "Indian Angel Network",
      category: "Angel Investor",
      description:
        "Early stage venture fund investing in innovative businesses with high growth potential",
      fundingRange: { min: 1000000, max: 10000000 },
      timeline: "2-4 months",
      eligibility: [
        "Scalable business model",
        "Strong founding team",
        "Clear revenue path",
      ],
      targetAudience: ["Early Stage", "Growth Stage", "Technology"],
      businessStageApplicable: [
        "Prototype/MVP",
        "Revenue Generating",
        "Growth Stage",
      ],
      industryFocus: ["Technology", "Healthcare", "Education"],
      equityStake: "10-25%",
      website: "https://www.indianangelnetwork.com/",
      features: ["Mentorship", "Network access", "Follow-on funding"],
      status: "Active",
      successRate: 42,
    },
    {
      name: "Women Entrepreneurs India",
      category: "Angel Investor",
      description:
        "Angel network focused exclusively on women-led startups with social impact",
      fundingRange: { min: 500000, max: 5000000 },
      timeline: "1-3 months",
      eligibility: [
        "Woman entrepreneur as founder/co-founder",
        "Innovative solution",
        "Social impact potential",
      ],
      targetAudience: ["Women Entrepreneurs", "Early Stage"],
      businessStageApplicable: [
        "Idea Stage",
        "Prototype/MVP",
        "Early Stage (Pre-revenue)",
      ],
      industryFocus: ["Healthcare", "Education", "Agriculture", "Technology"],
      equityStake: "5-20%",
      features: [
        "Women-focused mentorship",
        "Community support",
        "Networking events",
      ],
      status: "Active",
      successRate: 58,
    },
    {
      name: "Sequoia Capital India",
      category: "VC Fund",
      description:
        "Leading venture capital firm investing in high-growth companies across sectors",
      fundingRange: { min: 5000000, max: 100000000 },
      timeline: "4-8 months",
      eligibility: [
        "Proven business model",
        "Strong market traction",
        "Experienced team",
        "Significant revenue growth",
      ],
      targetAudience: ["Growth Stage", "Technology"],
      businessStageApplicable: [
        "Revenue Generating",
        "Growth Stage",
        "Established",
      ],
      industryFocus: ["Technology", "Healthcare", "Education"],
      equityStake: "15-30%",
      website: "https://www.sequoiacap.com/india/",
      features: ["Strategic guidance", "Global network", "Follow-on rounds"],
      status: "Active",
      successRate: 28,
    },
    {
      name: "Stand Up India Scheme",
      category: "Government Scheme",
      description:
        "Loans between 10 lakh to 1 crore for SC/ST and women entrepreneurs",
      fundingRange: { min: 1000000, max: 10000000 },
      timeline: "2-3 months",
      eligibility: [
        "Woman entrepreneur or SC/ST category",
        "First-time entrepreneur",
        "Manufacturing or service sector business",
      ],
      targetAudience: ["Women Entrepreneurs", "Early Stage"],
      businessStageApplicable: [
        "Idea Stage",
        "Prototype/MVP",
        "Early Stage (Pre-revenue)",
      ],
      industryFocus: ["Manufacturing", "Agriculture", "Education"],
      interestRate: "Base rate + 3% + tenor premium",
      repaymentTerms: "7 years with 18-month moratorium",
      website: "https://www.standupmitra.in/",
      features: ["Credit guarantee", "Handholding support", "Mentorship"],
      status: "Active",
      successRate: 52,
    },
    {
      name: "SBI Stree Shakti Package",
      category: "Loan",
      description:
        "SBI Stree Shakti Package (Stree Shakti Yojana), launched in October 2000, supports women entrepreneurs in retail, business services, professionals, and SSI segments with concessional terms.",
      fundingRange: { min: 50000, max: 2500000 },
      timeline: "15-30 days",
      eligibility: [
        "Minimum 51% ownership by women entrepreneur(s)",
        "Applicable to proprietary, partnership, or company entities",
        "Retail, services, professional practices, and SSI units eligible",
        "Age 18+ (no upper age limit)",
        "Entrepreneurship Development Program certificate preferred",
      ],
      targetAudience: ["Women Entrepreneurs", "Early Stage", "Growth Stage"],
      businessStageApplicable: [
        "Idea Stage",
        "Prototype/MVP",
        "Early Stage (Pre-revenue)",
        "Revenue Generating",
        "Growth Stage",
      ],
      industryFocus: [
        "Technology",
        "Manufacturing",
        "Agriculture",
        "Education",
        "Healthcare",
        "Professional Services",
      ],
      interestRate:
        "Floating, linked to SBI benchmark rates (approximately 9.5% to 11.5%)",
      repaymentTerms:
        "Up to 7 years including moratorium, based on business cash flow",
      website: "https://sbi.co.in/web/business/sme/sme-loans",
      contactPhone: "1800-1234",
      applicationProcess:
        "Visit SBI branch or SME loans portal, submit Stree Shakti application form with business plan and required documents. Approval typically in 15-30 days.",
      requirements: [
        "Aadhaar and PAN (or equivalent identity documents)",
        "Address proof",
        "MSME/Udyam registration details",
        "Business plan and projected cash flow",
        "Ownership proof showing minimum 51% women stake",
        "Bank statements and ITR where applicable",
      ],
      features: [
        "Lower margin requirements",
        "Processing fee concessions",
        "Collateral-free options up to eligible limits",
        "Working capital and term loan support",
      ],
      schemeDetails: {
        fullName: "SBI Stree Shakti Package",
        launchedBy: "State Bank of India (SBI)",
        launchedOn: "October 2000",
        purpose:
          "Financial package for women entrepreneurs to start or expand businesses in retail, services, manufacturing, and SSI units.",
        loanAmountBySegment: [
          { segment: "Retail Traders", min: 50000, max: 200000 },
          { segment: "Business Enterprises", min: 50000, max: 200000 },
          {
            segment: "Professionals (Doctors, CAs, Architects)",
            min: 50000,
            max: 2500000,
          },
          { segment: "SSI Units", min: 50000, max: 2500000 },
        ],
        maxLoanAmount: 2500000,
        terms: {
          floatingRateNote:
            "Floating rate linked to SBI base/benchmark rate. Typical range is around 9.5% to 11.5% depending on profile and prevailing policy.",
          concessionalMargin:
            "Concessional margin and lower equity contribution for eligible women-led businesses.",
          noCollateralUpto: 1000000,
          collateralCondition:
            "Collateral may be required for high-risk cases or very large exposures as per SBI norms.",
          tenure:
            "Up to 7 years including moratorium, based on project cash flows.",
          exampleEmi:
            "Example: 5 lakh at 10% for 5 years is approximately INR 8,500 per month.",
        },
        requiredDocuments: [
          {
            title: "Identity Proof",
            details: "Aadhaar, PAN, Voter ID, or equivalent KYC documents.",
          },
          {
            title: "Address Proof",
            details: "Ration card, utility bill, or valid address document.",
          },
          {
            title: "Business Proof",
            details:
              "MSME/Udyam registration and business constitution documents.",
          },
          {
            title: "Financials",
            details:
              "ITR and bank statements (typically 1 to 3 years where applicable).",
          },
          {
            title: "Project Documents",
            details:
              "Business plan, proof of concept, and projected cash flows.",
          },
          {
            title: "Ownership Proof",
            details:
              "Partnership deed, MoA, or equivalent showing 51%+ women ownership.",
          },
        ],
        applicationSteps: [
          { step: "Visit SBI branch or open SBI SME loans portal." },
          { step: "Select and fill Stree Shakti Package application form." },
          {
            step: "Submit KYC, business, ownership, and financial documents with business plan.",
          },
          {
            step: "Add EDP certificate if available (preferred but optional).",
          },
          {
            step: "Wait for appraisal and approval (typically 15 to 30 days).",
          },
          { step: "Receive disbursal directly into approved account." },
        ],
        currentStatus: {
          isActive: true,
          updatedAsOf: "March 2026",
          disbursalNote:
            "Scheme remains active with cumulative disbursals noted in public references.",
          relatedSchemes: [
            "SBI Asmita (collateral-free up to eligible limits)",
          ],
        },
        examples: [
          {
            text: "Suvitha Ramesh as 100% owner of an AI AgriTech app is eligible.",
            eligible: true,
          },
          {
            text: "Three women holding 60% in a partnership firm are eligible.",
            eligible: true,
          },
          {
            text: "Husband-wife business where woman ownership is below 51% is not eligible.",
            eligible: false,
          },
        ],
        integrationPrompt:
          "When recommending Stree Shakti: Retail/Service up to 2L, SSI/Professional up to 25L, apply via SBI branch + MSME registration, and enforce 51% women ownership eligibility.",
      },
      status: "Active",
      successRate: 61,
    },
    {
      name: "SBI Asmita (Women Entrepreneur Loan)",
      category: "Loan",
      description:
        "Digital loan product for women entrepreneurs with collateral-free options for eligible MSMEs",
      fundingRange: { min: 100000, max: 2500000 },
      timeline: "2-4 weeks",
      eligibility: [
        "Women-led MSME entity",
        "Satisfactory banking track record",
        "Business viability and repayment capacity",
      ],
      targetAudience: ["Women Entrepreneurs", "Growth Stage"],
      businessStageApplicable: [
        "Early Stage (Pre-revenue)",
        "Revenue Generating",
        "Growth Stage",
      ],
      industryFocus: [
        "Technology",
        "Manufacturing",
        "Education",
        "Healthcare",
        "Agriculture",
      ],
      interestRate: "As per SBI MSME lending norms and borrower profile",
      repaymentTerms: "Structured based on loan type and tenure",
      website:
        "https://sbi.bank.in/web/business/sme/sme-loans/sme-loan-to-women-entrepreneur-sbi-asmita",
      applicationProcess:
        "Apply through SBI MSME channels with business profile, financial statements, and KYC documents.",
      requirements: [
        "KYC documents",
        "MSME registration documents",
        "Financial statements and bank details",
        "Business ownership and constitution proof",
      ],
      features: [
        "Women-centric underwriting",
        "Digital-friendly process",
        "Collateral-free support for eligible applicants",
      ],
      status: "Active",
      successRate: 56,
    },
  ];

  // Clear existing funds (optional - remove if you want to keep existing)
  // await Fund.deleteMany({});

  const funds = await Fund.insertMany(initialFunds);

  res.status(201).json({
    success: true,
    count: funds.length,
    data: funds,
  });
});
