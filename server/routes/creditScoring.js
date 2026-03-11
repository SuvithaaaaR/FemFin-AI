const express = require("express");
const router = express.Router();

// AI Credit Scoring Algorithm
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
  const repeatRate = (repeatCustomers / activeCustomers) * 100;
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
  else financialScore += 5;

  // Monthly Revenue (40 points)
  if (monthlyRevenue >= 1000000) financialScore += 40;
  else if (monthlyRevenue >= 500000) financialScore += 30;
  else if (monthlyRevenue >= 200000) financialScore += 20;
  else if (monthlyRevenue >= 100000) financialScore += 10;

  // Revenue Consistency (20 points)
  const expectedAnnual = monthlyRevenue * 12;
  const consistency = (annualRevenue / expectedAnnual) * 100;
  if (consistency >= 90 && consistency <= 110) financialScore += 20;
  else if (consistency >= 80 && consistency <= 120) financialScore += 15;
  else if (consistency >= 70 && consistency <= 130) financialScore += 10;

  // GST Registration (15 points)
  if (gstRegistered === "Yes") financialScore += 15;

  scores.financialHealth = Math.min(financialScore, 100);

  // Calculate Total Score (weighted average)
  // Digital: 25%, Business Activity: 30%, Social Trust: 20%, Financial: 25%
  const weightedScore =
    scores.digitalTransactions * 0.25 +
    scores.businessActivity * 0.3 +
    scores.socialTrust * 0.2 +
    scores.financialHealth * 0.25;

  // Scale to 900
  scores.totalScore = Math.round(weightedScore * 9);

  return scores;
};

// POST /api/credit-scoring/analyze
router.post("/analyze", async (req, res) => {
  try {
    const userData = req.body;

    // Validate required fields
    if (
      !userData.businessName ||
      !userData.ownerName ||
      !userData.monthlyRevenue
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Calculate credit score using AI algorithm
    const creditScore = calculateCreditScore(userData);

    // Additional insights
    const insights = {
      strengths: [],
      improvements: [],
    };

    if (creditScore.digitalTransactions >= 75) {
      insights.strengths.push("Strong digital payment adoption");
    } else {
      insights.improvements.push("Increase digital transaction usage");
    }

    if (creditScore.businessActivity >= 75) {
      insights.strengths.push("Excellent customer engagement");
    } else {
      insights.improvements.push("Focus on customer retention strategies");
    }

    if (creditScore.socialTrust >= 75) {
      insights.strengths.push("Strong online reputation");
    } else {
      insights.improvements.push(
        "Build social media presence and gather customer reviews",
      );
    }

    if (creditScore.financialHealth >= 75) {
      insights.strengths.push("Solid financial performance");
    } else {
      insights.improvements.push("Work on revenue growth and consistency");
    }

    res.json({
      success: true,
      message: "Credit score calculated successfully",
      creditScore,
      insights,
    });
  } catch (error) {
    console.error("Error calculating credit score:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate credit score",
      error: error.message,
    });
  }
});

// GET /api/credit-scoring/loan-eligibility/:score
router.get("/loan-eligibility/:score", async (req, res) => {
  try {
    const score = parseInt(req.params.score);

    let eligibility = {};

    if (score >= 750) {
      eligibility = {
        maxLoanAmount: 2000000,
        interestRate: 8.5,
        tenure: 60,
        approved: true,
        category: "Excellent",
      };
    } else if (score >= 650) {
      eligibility = {
        maxLoanAmount: 1000000,
        interestRate: 10.5,
        tenure: 48,
        approved: true,
        category: "Good",
      };
    } else if (score >= 550) {
      eligibility = {
        maxLoanAmount: 500000,
        interestRate: 12.5,
        tenure: 36,
        approved: true,
        category: "Fair",
      };
    } else {
      eligibility = {
        maxLoanAmount: 250000,
        interestRate: 15,
        tenure: 24,
        approved: true,
        category: "Needs Improvement",
      };
    }

    res.json({
      success: true,
      eligibility,
    });
  } catch (error) {
    console.error("Error fetching loan eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch loan eligibility",
      error: error.message,
    });
  }
});

module.exports = router;
