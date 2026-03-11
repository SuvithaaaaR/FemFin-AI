const axios = require("axios");

/**
 * Calculate credit score based on financial data
 * @param {Object} financialData - User's financial information
 * @returns {Object} - Credit score and breakdown
 */
function calculateCreditScore(financialData) {
  const {
    paymentHistory = [],
    creditUtilization = 0,
    creditAge = 0,
    accountTypes = [],
    recentInquiries = 0,
    totalDebt = 0,
    income = 0,
    savingsBalance = 0,
  } = financialData;

  let score = 300; // Base score
  const factors = {};

  // 1. Payment History (35% weight)
  const paymentScore = calculatePaymentHistoryScore(paymentHistory);
  score += paymentScore * 0.35;
  factors.paymentHistory = {
    score: Math.round(paymentScore),
    weight: "35%",
    impact: paymentScore > 60 ? "positive" : "negative",
  };

  // 2. Credit Utilization (30% weight)
  const utilizationScore = calculateUtilizationScore(creditUtilization);
  score += utilizationScore * 0.3;
  factors.creditUtilization = {
    score: Math.round(utilizationScore),
    percentage: creditUtilization,
    weight: "30%",
    impact: utilizationScore > 60 ? "positive" : "negative",
  };

  // 3. Credit Age (15% weight)
  const ageScore = calculateCreditAgeScore(creditAge);
  score += ageScore * 0.15;
  factors.creditAge = {
    score: Math.round(ageScore),
    years: creditAge,
    weight: "15%",
    impact: ageScore > 60 ? "positive" : "negative",
  };

  // 4. Account Mix (10% weight)
  const mixScore = calculateAccountMixScore(accountTypes);
  score += mixScore * 0.1;
  factors.accountMix = {
    score: Math.round(mixScore),
    types: accountTypes.length,
    weight: "10%",
    impact: mixScore > 60 ? "positive" : "neutral",
  };

  // 5. Recent Inquiries (10% weight)
  const inquiryScore = calculateInquiryScore(recentInquiries);
  score += inquiryScore * 0.1;
  factors.recentInquiries = {
    score: Math.round(inquiryScore),
    count: recentInquiries,
    weight: "10%",
    impact: inquiryScore > 60 ? "positive" : "negative",
  };

  // Bonus factors
  const debtToIncomeRatio = income > 0 ? (totalDebt / income) * 100 : 100;
  if (debtToIncomeRatio < 30) {
    score += 10;
    factors.debtToIncomeBonus = {
      ratio: debtToIncomeRatio.toFixed(2),
      bonus: 10,
    };
  }

  if (savingsBalance > income * 3) {
    score += 10;
    factors.savingsBonus = { amount: savingsBalance, bonus: 10 };
  }

  // Ensure score is within 300-850 range
  score = Math.max(300, Math.min(850, Math.round(score)));

  return {
    score: score,
    rating: getCreditRating(score),
    factors: factors,
    recommendations: generateRecommendations(score, factors),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calculate payment history score
 */
function calculatePaymentHistoryScore(paymentHistory) {
  if (!paymentHistory || paymentHistory.length === 0) {
    return 50; // Neutral score for no history
  }

  const onTimePayments = paymentHistory.filter(
    (p) => p.status === "on-time" || p.onTime === true,
  ).length;
  const latePayments = paymentHistory.filter(
    (p) => p.status === "late" || p.late === true,
  ).length;
  const missedPayments = paymentHistory.filter(
    (p) => p.status === "missed" || p.missed === true,
  ).length;

  const totalPayments = paymentHistory.length;
  const onTimeRate = onTimePayments / totalPayments;

  let score = onTimeRate * 100;

  // Penalties
  score -= latePayments * 5;
  score -= missedPayments * 15;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate credit utilization score
 */
function calculateUtilizationScore(utilization) {
  if (utilization <= 10) return 100;
  if (utilization <= 30) return 90;
  if (utilization <= 50) return 70;
  if (utilization <= 75) return 50;
  return 30;
}

/**
 * Calculate credit age score
 */
function calculateCreditAgeScore(years) {
  if (years >= 10) return 100;
  if (years >= 7) return 90;
  if (years >= 5) return 80;
  if (years >= 3) return 70;
  if (years >= 1) return 60;
  return 40;
}

/**
 * Calculate account mix score
 */
function calculateAccountMixScore(accountTypes) {
  const uniqueTypes = new Set(accountTypes);
  const typeCount = uniqueTypes.size;

  if (typeCount >= 4) return 100;
  if (typeCount === 3) return 85;
  if (typeCount === 2) return 70;
  if (typeCount === 1) return 50;
  return 30;
}

/**
 * Calculate inquiry score
 */
function calculateInquiryScore(inquiries) {
  if (inquiries === 0) return 100;
  if (inquiries <= 2) return 90;
  if (inquiries <= 4) return 70;
  if (inquiries <= 6) return 50;
  return 30;
}

/**
 * Get credit rating based on score
 */
function getCreditRating(score) {
  if (score >= 800) return "Exceptional";
  if (score >= 740) return "Very Good";
  if (score >= 670) return "Good";
  if (score >= 580) return "Fair";
  return "Poor";
}

/**
 * Generate recommendations to improve credit score
 */
function generateRecommendations(score, factors) {
  const recommendations = [];

  if (factors.paymentHistory.impact === "negative") {
    recommendations.push({
      priority: "high",
      category: "Payment History",
      action:
        "Make all payments on time. Set up automatic payments to avoid late payments.",
      potentialImpact: "+50 points",
    });
  }

  if (factors.creditUtilization.percentage > 30) {
    recommendations.push({
      priority: "high",
      category: "Credit Utilization",
      action: `Pay down credit card balances to below 30% utilization. Currently at ${factors.creditUtilization.percentage}%.`,
      potentialImpact: "+40 points",
    });
  }

  if (factors.creditAge.years < 5) {
    recommendations.push({
      priority: "medium",
      category: "Credit Age",
      action: "Keep older accounts open to increase average account age.",
      potentialImpact: "+20 points",
    });
  }

  if (factors.accountMix.types < 3) {
    recommendations.push({
      priority: "low",
      category: "Account Mix",
      action:
        "Consider diversifying with different types of credit (installment, revolving).",
      potentialImpact: "+15 points",
    });
  }

  if (factors.recentInquiries.count > 3) {
    recommendations.push({
      priority: "medium",
      category: "Credit Inquiries",
      action: "Avoid applying for new credit in the next 6-12 months.",
      potentialImpact: "+10 points",
    });
  }

  return recommendations;
}

/**
 * Fetch transaction data from external source (mock implementation)
 * In production, this would connect to banking APIs
 * @param {string} userId - User ID
 * @param {Object} options - API options
 * @returns {Promise<Array>} - Transaction data
 */
async function fetchTransactionData(userId, options = {}) {
  try {
    // Mock implementation - Replace with actual API call
    // Example: Plaid, Yodlee, or banking API
    const mockTransactions = generateMockTransactions();

    // In production, use axios to fetch from real APIs:
    // const response = await axios.get(`${API_URL}/transactions/${userId}`, {
    //   headers: { Authorization: `Bearer ${API_KEY}` },
    //   params: options
    // });
    // return response.data;

    return mockTransactions;
  } catch (error) {
    console.error("Error fetching transaction data:", error.message);
    throw new Error("Failed to fetch transaction data");
  }
}

/**
 * Analyze transaction patterns for credit scoring
 * @param {Array} transactions - Array of transactions
 * @returns {Object} - Transaction analysis
 */
function analyzeTransactionPatterns(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalTransactions: 0,
      averageMonthlySpending: 0,
      savingsRate: 0,
      paymentConsistency: "unknown",
    };
  }

  const totalSpending = transactions
    .filter((t) => t.type === "debit" || t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = transactions
    .filter((t) => t.type === "credit" || t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const billPayments = transactions.filter(
    (t) =>
      t.category === "bill" ||
      t.category === "loan" ||
      t.description?.toLowerCase().includes("payment"),
  );

  const onTimeBills = billPayments.filter((b) => b.onTime !== false).length;
  const paymentConsistency =
    billPayments.length > 0 ? (onTimeBills / billPayments.length) * 100 : 0;

  return {
    totalTransactions: transactions.length,
    totalSpending: totalSpending.toFixed(2),
    totalIncome: totalIncome.toFixed(2),
    averageMonthlySpending: (totalSpending / 12).toFixed(2),
    savingsRate:
      totalIncome > 0
        ? (((totalIncome - totalSpending) / totalIncome) * 100).toFixed(2)
        : 0,
    paymentConsistency:
      paymentConsistency >= 95
        ? "Excellent"
        : paymentConsistency >= 80
          ? "Good"
          : paymentConsistency >= 60
            ? "Fair"
            : "Poor",
    billPayments: {
      total: billPayments.length,
      onTime: onTimeBills,
      rate: paymentConsistency.toFixed(2) + "%",
    },
  };
}

/**
 * Generate mock transactions for testing
 */
function generateMockTransactions() {
  const transactions = [];
  const categories = [
    "bill",
    "groceries",
    "utilities",
    "loan",
    "income",
    "entertainment",
  ];

  for (let i = 0; i < 50; i++) {
    transactions.push({
      id: `txn_${i}`,
      date: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      amount:
        Math.random() > 0.3
          ? -(Math.random() * 500 + 50)
          : Math.random() * 2000 + 500,
      type: Math.random() > 0.3 ? "debit" : "credit",
      category: categories[Math.floor(Math.random() * categories.length)],
      description: "Mock transaction",
      onTime: Math.random() > 0.1,
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Comprehensive credit score calculation with transaction data
 * @param {string} userId - User ID
 * @param {Object} userFinancialData - User's financial data
 * @returns {Promise<Object>} - Complete credit assessment
 */
async function calculateComprehensiveCreditScore(userId, userFinancialData) {
  try {
    // Fetch transaction data
    const transactions = await fetchTransactionData(userId);

    // Analyze transaction patterns
    const transactionAnalysis = analyzeTransactionPatterns(transactions);

    // Calculate credit score
    const creditScore = calculateCreditScore(userFinancialData);

    // Combine all data
    return {
      ...creditScore,
      transactionAnalysis: transactionAnalysis,
      dataPoints: {
        transactionsAnalyzed: transactions.length,
        dateRange: {
          from: transactions[transactions.length - 1]?.date,
          to: transactions[0]?.date,
        },
      },
    };
  } catch (error) {
    console.error(
      "Error calculating comprehensive credit score:",
      error.message,
    );
    throw error;
  }
}

module.exports = {
  calculateCreditScore,
  fetchTransactionData,
  analyzeTransactionPatterns,
  calculateComprehensiveCreditScore,
  getCreditRating,
};
