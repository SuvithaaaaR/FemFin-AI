const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");

/**
 * AI-powered fund recommendation algorithm
 */
const analyzeFundRecommendations = (userData) => {
  const {
    businessIdea,
    budgetRequired,
    industryType,
    businessStage,
    experience,
  } = userData;

  // Mock AI analysis - in production, this would use actual AI/ML models
  const recommendations = {
    governmentSchemes: [],
    angelInvestors: [],
    vcFunds: [],
    grants: [],
  };

  // Government Schemes
  if (businessStage === "Idea Stage" || businessStage === "Prototype/MVP") {
    recommendations.governmentSchemes.push({
      name: "Startup India Seed Fund",
      description:
        "Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization",
      fundingRange: "20L - 50L",
      timeline: "3-6 months",
      matchScore: 95,
      eligibility: [
        "Business less than 2 years old",
        "Innovative business idea",
        "DPIIT recognized startup",
      ],
    });
  }

  if (industryType === "Technology" || industryType === "Manufacturing") {
    recommendations.governmentSchemes.push({
      name: "MUDRA Loan Scheme",
      description: "Loans up to 10 lakh for micro and small businesses",
      fundingRange: "50K - 10L",
      timeline: "1-2 months",
      matchScore: 88,
      eligibility: [
        "Registered business entity",
        "No collateral required",
        "For business expansion",
      ],
    });
  }

  if (budgetRequired <= 2500000) {
    recommendations.governmentSchemes.push({
      name: "SBI Stree Shakti Package",
      description:
        "Women entrepreneur-focused SBI package for retail, services, professionals, and SSI segments.",
      fundingRange: "50K - 25L",
      timeline: "15-30 days",
      matchScore: 97,
      eligibility: [
        "Minimum 51% women ownership",
        "Business in retail/services/professional/SSI segment",
        "MSME/Udyam and business documentation",
      ],
      applyNote:
        "Apply at SBI branch or SBI SME loans portal with MSME registration and ownership proof.",
      integrationPrompt:
        "Retail/Service: 50K-2L, SSI/Professional: up to 25L, ensure 51% women ownership.",
    });
  }

  // Angel Investors
  if (budgetRequired >= 1000000 && budgetRequired <= 10000000) {
    recommendations.angelInvestors.push({
      name: "Indian Angel Network",
      description:
        "Early stage venture fund investing in innovative businesses",
      fundingRange: "10L - 1Cr",
      timeline: "2-4 months",
      matchScore: 92,
      eligibility: [
        "Scalable business model",
        "Strong founding team",
        "Clear revenue path",
      ],
    });

    recommendations.angelInvestors.push({
      name: "Women Entrepreneurs India",
      description: "Angel network focused on women-led startups",
      fundingRange: "5L - 50L",
      timeline: "1-3 months",
      matchScore: 96,
      eligibility: [
        "Woman entrepreneur",
        "Innovative solution",
        "Social impact potential",
      ],
    });
  }

  // VC Funds
  if (businessStage === "Growth Stage" && budgetRequired >= 5000000) {
    recommendations.vcFunds.push({
      name: "Sequoia Capital India",
      description:
        "Leading venture capital firm investing in high-growth companies",
      fundingRange: "50L - 10Cr+",
      timeline: "4-8 months",
      matchScore: 85,
      eligibility: [
        "Proven business model",
        "Strong market traction",
        "Experienced team",
      ],
    });

    recommendations.vcFunds.push({
      name: "Kalaari Capital",
      description: "Early to growth stage VC firm",
      fundingRange: "1Cr - 20Cr",
      timeline: "3-6 months",
      matchScore: 82,
      eligibility: [
        "Tech-enabled business",
        "Revenue generating",
        "Large market opportunity",
      ],
    });
  }

  // Women Entrepreneur Grants
  recommendations.grants.push({
    name: "Stand Up India Scheme",
    description: "Loans for women entrepreneurs for greenfield enterprises",
    fundingRange: "10L - 1Cr",
    timeline: "2-3 months",
    matchScore: 94,
    eligibility: [
      "Woman entrepreneur",
      "New business venture",
      "Manufacturing or services sector",
    ],
  });

  recommendations.grants.push({
    name: "TREAD Scheme",
    description:
      "Trade Related Entrepreneurship Assistance and Development for women",
    fundingRange: "1L - 30L",
    timeline: "1-2 months",
    matchScore: 90,
    eligibility: [
      "Women entrepreneurs",
      "Trade-based business",
      "Group or individual",
    ],
  });

  if (industryType === "Technology") {
    recommendations.grants.push({
      name: "WEP (Women Entrepreneurship Platform)",
      description:
        "Support for women to realize their entrepreneurial aspirations",
      fundingRange: "5L - 25L",
      timeline: "2-4 months",
      matchScore: 93,
      eligibility: [
        "Woman entrepreneur",
        "Innovative business idea",
        "Technology or services",
      ],
    });
  }

  return recommendations;
};

/**
 * @desc    Analyze business and get fund recommendations
 * @route   POST /api/fund-recommendations/analyze
 * @access  Public (can be Private with auth)
 */
exports.analyzeFunds = asyncHandler(async (req, res, next) => {
  const userData = req.body;

  // Validate required fields
  if (
    !userData.businessIdea ||
    !userData.budgetRequired ||
    !userData.industryType ||
    !userData.businessStage
  ) {
    return next(new ErrorResponse("Missing required fields", 400));
  }

  // Generate AI recommendations
  const recommendations = analyzeFundRecommendations(userData);

  res.status(200).json({
    success: true,
    message: "Analysis completed successfully",
    recommendations,
  });
});

/**
 * @desc    Get all available funding sources
 * @route   GET /api/fund-recommendations/sources
 * @access  Public
 */
exports.getFundingSources = asyncHandler(async (req, res, next) => {
  const fundingSources = {
    governmentSchemes: [
      "Startup India Seed Fund",
      "MUDRA Loan Scheme",
      "SBI Stree Shakti Package",
      "Stand Up India Scheme",
      "TREAD Scheme",
      "Women Entrepreneurship Platform",
    ],
    angelInvestors: [
      "Indian Angel Network",
      "Women Entrepreneurs India",
      "Mumbai Angels",
      "Chennai Angels",
    ],
    vcFunds: [
      "Sequoia Capital India",
      "Kalaari Capital",
      "Accel India",
      "Matrix Partners India",
    ],
  };

  res.status(200).json({
    success: true,
    data: fundingSources,
  });
});
