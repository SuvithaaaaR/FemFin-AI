const CreditScore = require("../models/CreditScore");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");

/**
 * AI Credit Scoring Algorithm
 */
const calculateCreditScore = (userData) => {
  let scores = {
    digitalTransactions: 0,
    businessActivity: 0,
    socialTrust: 0,
    financialHealth: 0,
    totalScore: 0,
  };

  const {
    yearsInBusiness,
    monthlyRevenue,
    annualRevenue,
    upiTransactions,
    onlineSales,
    digitalPayments,
    activeCustomers,
    repeatCustomers,
    averageOrderValue,
    socialMediaPresence,
    googleRating,
    totalReviews,
    gstRegistered,
  } = userData;

  // 1. Digital Transactions Score (out of 100)
  let digitalScore = 0;

  // UPI Transactions (40 points)
  if (upiTransactions >= 500) digitalScore += 40;
  else if (upiTransactions >= 300) digitalScore += 30;
  else if (upiTransactions >= 150) digitalScore += 20;
  else if (upiTransactions >= 50) digitalScore += 10;

  // Digital Payment Percentage (35 points)
  if (digitalPayments >= 80) digitalScore += 35;
  else if (digitalPayments >= 60) digitalScore += 25;
  else if (digitalPayments >= 40) digitalScore += 15;
  else if (digitalPayments >= 20) digitalScore += 8;

  // Online Sales (25 points)
  if (onlineSales >= 500000) digitalScore += 25;
  else if (onlineSales >= 200000) digitalScore += 18;
  else if (onlineSales >= 100000) digitalScore += 12;
  else if (onlineSales >= 50000) digitalScore += 6;

  scores.digitalTransactions = Math.min(digitalScore, 100);

  // 2. Business Activity Score (out of 100)
  let activityScore = 0;

  // Active Customers (40 points)
  if (activeCustomers >= 1000) activityScore += 40;
  else if (activeCustomers >= 500) activityScore += 30;
  else if (activeCustomers >= 200) activityScore += 20;
  else if (activeCustomers >= 50) activityScore += 10;

  // Repeat Customer Rate (35 points)
  const repeatRate =
    activeCustomers > 0 ? (repeatCustomers / activeCustomers) * 100 : 0;
  if (repeatRate >= 50) activityScore += 35;
  else if (repeatRate >= 30) activityScore += 25;
  else if (repeatRate >= 15) activityScore += 15;
  else if (repeatRate >= 5) activityScore += 8;

  // Average Order Value (25 points)
  if (averageOrderValue >= 5000) activityScore += 25;
  else if (averageOrderValue >= 2000) activityScore += 18;
  else if (averageOrderValue >= 1000) activityScore += 12;
  else if (averageOrderValue >= 500) activityScore += 6;

  scores.businessActivity = Math.min(activityScore, 100);

  // 3. Social Trust Score (out of 100)
  let socialScore = 0;

  // Social Media Presence (30 points)
  const presenceMap = {
    Excellent: 30,
    Strong: 24,
    Moderate: 18,
    Basic: 10,
    None: 0,
  };
  socialScore += presenceMap[socialMediaPresence] || 0;

  // Google Rating (40 points)
  if (googleRating >= 4.5) socialScore += 40;
  else if (googleRating >= 4.0) socialScore += 30;
  else if (googleRating >= 3.5) socialScore += 20;
  else if (googleRating >= 3.0) socialScore += 10;

  // Total Reviews (30 points)
  if (totalReviews >= 500) socialScore += 30;
  else if (totalReviews >= 200) socialScore += 22;
  else if (totalReviews >= 100) socialScore += 15;
  else if (totalReviews >= 50) socialScore += 8;

  scores.socialTrust = Math.min(socialScore, 100);

  // 4. Financial Health Score (out of 100)
  let financialScore = 0;

  // Years in Business (25 points)
  if (yearsInBusiness >= 5) financialScore += 25;
  else if (yearsInBusiness >= 3) financialScore += 20;
  else if (yearsInBusiness >= 2) financialScore += 15;
  else if (yearsInBusiness >= 1) financialScore += 10;

  // Monthly Revenue (35 points)
  if (monthlyRevenue >= 500000) financialScore += 35;
  else if (monthlyRevenue >= 200000) financialScore += 28;
  else if (monthlyRevenue >= 100000) financialScore += 20;
  else if (monthlyRevenue >= 50000) financialScore += 12;

  // GST Registration (20 points)
  if (gstRegistered) financialScore += 20;

  // Business Consistency (20 points based on revenue pattern)
  if (annualRevenue >= monthlyRevenue * 10) financialScore += 20;
  else if (annualRevenue >= monthlyRevenue * 8) financialScore += 15;
  else if (annualRevenue >= monthlyRevenue * 6) financialScore += 10;

  scores.financialHealth = Math.min(financialScore, 100);

  // Calculate weighted total score (300-900 range like CIBIL)
  const weightedScore =
    scores.digitalTransactions * 0.25 +
    scores.businessActivity * 0.3 +
    scores.socialTrust * 0.2 +
    scores.financialHealth * 0.25;

  // Scale to 300-900 range
  scores.totalScore = Math.round(300 + (weightedScore / 100) * 600);

  // Calculate loan eligibility
  let maxLoanAmount = 0;
  let recommendedInterestRate = 0;
  let isEligible = false;

  if (scores.totalScore >= 750) {
    maxLoanAmount = Math.min(annualRevenue * 0.5, 5000000);
    recommendedInterestRate = 10.5;
    isEligible = true;
  } else if (scores.totalScore >= 650) {
    maxLoanAmount = Math.min(annualRevenue * 0.3, 2000000);
    recommendedInterestRate = 12.5;
    isEligible = true;
  } else if (scores.totalScore >= 550) {
    maxLoanAmount = Math.min(annualRevenue * 0.2, 1000000);
    recommendedInterestRate = 15;
    isEligible = true;
  }

  return {
    scores,
    loanEligibility: {
      isEligible,
      maxLoanAmount,
      recommendedInterestRate,
    },
  };
};

/**
 * @desc    Calculate credit score
 * @route   POST /api/credit-scoring/calculate
 * @access  Public (can be Private with auth)
 */
exports.calculateScore = asyncHandler(async (req, res, next) => {
  const userData = req.body;

  // Validate required fields
  const requiredFields = [
    "yearsInBusiness",
    "monthlyRevenue",
    "annualRevenue",
    "upiTransactions",
    "digitalPayments",
    "activeCustomers",
    "socialMediaPresence",
  ];

  const missingFields = requiredFields.filter((field) => !userData[field]);

  if (missingFields.length > 0) {
    return next(
      new ErrorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400,
      ),
    );
  }

  // Calculate credit score
  const result = calculateCreditScore(userData);

  // If user is authenticated, save to database
  if (req.user) {
    const creditScoreData = {
      user: req.user.id,
      business: req.body.businessId,
      digitalTransactions: {
        upiTransactions: userData.upiTransactions,
        onlinePayments: userData.digitalPayments,
        averageTransactionValue: userData.averageOrderValue || 0,
        score: result.scores.digitalTransactions,
      },
      businessActivity: {
        yearsInBusiness: userData.yearsInBusiness,
        monthlyRevenue: userData.monthlyRevenue,
        consistencyScore: result.scores.businessActivity,
        growthRate: 0,
        score: result.scores.businessActivity,
      },
      socialTrust: {
        customerReviews: userData.googleRating || 0,
        socialMediaPresence:
          userData.socialMediaPresence === "Excellent" ? 100 : 50,
        businessReferences: userData.totalReviews || 0,
        score: result.scores.socialTrust,
      },
      financialHealth: {
        averageMonthlySales: userData.monthlyRevenue,
        profitMargin: 0,
        debtToIncomeRatio: 0,
        existingLoans: false,
        score: result.scores.financialHealth,
      },
      overallScore: result.scores.totalScore,
      loanEligibility: result.loanEligibility,
      scoreHistory: [
        {
          score: result.scores.totalScore,
          calculatedAt: new Date(),
        },
      ],
    };

    await CreditScore.create(creditScoreData);
  }

  res.status(200).json({
    success: true,
    message: "Credit score calculated successfully",
    data: {
      overallScore: result.scores.totalScore,
      breakdown: {
        digitalTransactions: {
          score: result.scores.digitalTransactions,
          weight: "25%",
        },
        businessActivity: {
          score: result.scores.businessActivity,
          weight: "30%",
        },
        socialTrust: {
          score: result.scores.socialTrust,
          weight: "20%",
        },
        financialHealth: {
          score: result.scores.financialHealth,
          weight: "25%",
        },
      },
      loanEligibility: result.loanEligibility,
    },
  });
});

/**
 * @desc    Get user's credit score history
 * @route   GET /api/credit-scoring/history
 * @access  Private
 */
exports.getCreditScoreHistory = asyncHandler(async (req, res, next) => {
  const scores = await CreditScore.find({ user: req.user.id })
    .populate("business", "businessName")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: scores.length,
    data: scores,
  });
});

/**
 * @desc    Get latest credit score
 * @route   GET /api/credit-scoring/latest
 * @access  Private
 */
exports.getLatestScore = asyncHandler(async (req, res, next) => {
  const creditScore = await CreditScore.findOne({ user: req.user.id })
    .populate("business", "businessName")
    .sort("-createdAt");

  if (!creditScore) {
    return next(new ErrorResponse("No credit score found", 404));
  }

  res.status(200).json({
    success: true,
    data: creditScore,
  });
});
