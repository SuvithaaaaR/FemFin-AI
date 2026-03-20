const { asyncHandler } = require("../middleware/errorHandler");
const { FALLBACK_FUNDS } = require("../data/fundCatalog");
const { getSupabase } = require("../config/supabase");
const xaiService = require("../services/xaiService");

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const formatInr = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return `₹${INR_FORMATTER.format(value)}`;
};

const formatFundingRange = (fund) => {
  const min =
    fund?.fundingRange?.min ??
    fund?.loanQuantum?.compositeLoanMin ??
    fund?.loanQuantum?.manufacturingMax ??
    fund?.amount;
  const max =
    fund?.fundingRange?.max ??
    fund?.loanQuantum?.compositeLoanMax ??
    fund?.loanQuantum?.manufacturingMax ??
    fund?.amount;

  if (min && max) {
    return `${formatInr(min) || min} - ${formatInr(max) || max}`;
  }

  if (max) {
    return `Up to ${formatInr(max) || max}`;
  }

  if (min) {
    return `From ${formatInr(min) || min}`;
  }

  return "Not specified";
};

const sanitizeFundsForPrompt = (funds, limit = 12) =>
  funds
    .map((fund) =>
      typeof fund?.toObject === "function" ? fund.toObject() : fund,
    )
    .map((fund) => ({
      name: fund.name || fund.title,
      category: fund.category,
      description: fund.description,
      fundingRangeText: formatFundingRange(fund),
      industries: fund.industryFocus,
      stages: fund.businessStageApplicable,
      eligibility: fund.eligibility || fund.beneficiaries,
      timeline:
        fund.timeline || fund.repaymentPeriod || fund.loanTimeline || "N/A",
      targetAudience: fund.targetAudience,
      applicationLink: fund.applicationLink || fund.portal?.url,
    }))
    .filter((fund) => Boolean(fund.name))
    .slice(0, limit);

const buildFundCatalogContext = (funds) =>
  funds
    .map((fund, index) => {
      const eligibility = Array.isArray(fund.eligibility)
        ? fund.eligibility.slice(0, 3).join("; ")
        : fund.eligibility || "Eligibility not specified";
      const industries = Array.isArray(fund.industries)
        ? fund.industries.join(", ")
        : fund.industries || "All";
      const stages = Array.isArray(fund.stages)
        ? fund.stages.join(", ")
        : fund.stages || "All";
      return `${index + 1}. ${fund.name} [${fund.category || "General"}] - Funding: ${fund.fundingRangeText}. Industries: ${industries}. Stages: ${stages}. Timeline: ${fund.timeline}. Eligibility: ${eligibility}. Summary: ${fund.description || "No description"}.`;
    })
    .join("\n");

const fetchFundCatalogSnapshot = async (limit = 12) => {
  try {
    const supabase = getSupabase();
    const { data: liveFunds, error } = await supabase
      .from("funds")
      .select("*")
      .eq("status", "Active")
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    if (liveFunds && liveFunds.length) {
      return liveFunds;
    }
  } catch (error) {
    console.warn("AI fund catalog fallback used due to DB issue:", error);
  }

  return FALLBACK_FUNDS.slice(0, limit);
};

/**
 * @desc    Get financial advice from Grok AI
 * @route   POST /api/ai/financial-advice
 * @access  Private
 */
exports.getFinancialAdvice = asyncHandler(async (req, res) => {
  const {
    businessType,
    monthlyRevenue,
    creditScore,
    fundingNeed,
    businessStage,
  } = req.body;

  const userData = {
    businessType,
    monthlyRevenue,
    creditScore,
    fundingNeed,
    businessStage,
  };

  const advice = await xaiService.generateFinancialAdvice(userData);

  res.status(200).json({
    success: true,
    data: advice,
  });
});

/**
 * @desc    Analyze business plan with Grok AI
 * @route   POST /api/ai/analyze-business-plan
 * @access  Private
 */
exports.analyzeBusinessPlan = asyncHandler(async (req, res) => {
  const { businessPlan } = req.body;

  if (!businessPlan) {
    return res.status(400).json({
      success: false,
      message: "Please provide a business plan to analyze",
    });
  }

  const analysis = await xaiService.analyzeBusinessPlan(businessPlan);

  res.status(200).json({
    success: true,
    data: analysis,
  });
});

/**
 * @desc    Get fund recommendations from Grok AI
 * @route   POST /api/ai/fund-recommendations
 * @access  Private
 */
exports.getFundRecommendations = asyncHandler(async (req, res) => {
  const { industry, stage, fundingAmount, location, businessModel } = req.body;

  const businessProfile = {
    industry,
    stage,
    fundingAmount,
    location,
    businessModel,
  };

  const availableFunds = await fetchFundCatalogSnapshot(12);
  const fundSnapshot = sanitizeFundsForPrompt(availableFunds, 12);
  const catalogContext = buildFundCatalogContext(fundSnapshot);

  const recommendations = await xaiService.generateFundRecommendations(
    businessProfile,
    catalogContext,
  );

  res.status(200).json({
    success: true,
    data: recommendations,
    context: fundSnapshot,
  });
});

/**
 * @desc    Get credit score improvement tips from Grok AI
 * @route   POST /api/ai/credit-score-tips
 * @access  Private
 */
exports.getCreditScoreTips = asyncHandler(async (req, res) => {
  const {
    currentScore,
    paymentHistory,
    outstandingDebt,
    creditUtilization,
    yearsOfHistory,
  } = req.body;

  if (!currentScore) {
    return res.status(400).json({
      success: false,
      message: "Please provide current credit score",
    });
  }

  const financialHistory = {
    paymentHistory,
    outstandingDebt,
    creditUtilization,
    yearsOfHistory,
  };

  const tips = await xaiService.generateCreditScoreTips(
    currentScore,
    financialHistory,
  );

  res.status(200).json({
    success: true,
    data: tips,
  });
});

/**
 * @desc    Analyze investment pitch with Grok AI
 * @route   POST /api/ai/analyze-pitch
 * @access  Private
 */
exports.analyzePitch = asyncHandler(async (req, res) => {
  const { pitch } = req.body;

  if (!pitch) {
    return res.status(400).json({
      success: false,
      message: "Please provide a pitch to analyze",
    });
  }

  const feedback = await xaiService.analyzePitch(pitch);

  res.status(200).json({
    success: true,
    data: feedback,
  });
});

/**
 * @desc    Chat with Grok AI
 * @route   POST /api/ai/chat
 * @access  Private
 */
exports.chat = asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Please provide a message",
    });
  }

  const response = await xaiService.chatWithGrok(
    message,
    conversationHistory || [],
  );

  res.status(200).json({
    success: true,
    data: response,
  });
});

/**
 * @desc    Get general AI response from Grok
 * @route   POST /api/ai/query
 * @access  Private
 */
exports.query = asyncHandler(async (req, res) => {
  const { prompt, model } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please provide a prompt",
    });
  }

  const response = await xaiService.generateGrokResponse(prompt, model);

  res.status(200).json({
    success: true,
    data: response,
  });
});

/**
 * @desc    Get AI provider integration status
 * @route   GET /api/ai/status
 * @access  Public
 */
exports.getStatus = asyncHandler(async (req, res) => {
  const status = xaiService.getAiStatus();

  res.status(200).json({
    success: true,
    data: {
      provider: status.provider,
      ready: status.ready,
      model: status.model,
    },
  });
});
