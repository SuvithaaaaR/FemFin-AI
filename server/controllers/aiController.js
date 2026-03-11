const { asyncHandler } = require("../middleware/errorHandler");
const xaiService = require("../services/xaiService");

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

  const recommendations =
    await xaiService.generateFundRecommendations(businessProfile);

  res.status(200).json({
    success: true,
    data: recommendations,
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
