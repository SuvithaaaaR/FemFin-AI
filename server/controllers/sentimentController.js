const { asyncHandler } = require("../middleware/errorHandler");
const sentimentService = require("../services/sentimentService");

/**
 * @desc    Analyze sentiment of text
 * @route   POST /api/sentiment/analyze
 * @access  Private
 */
exports.analyzeSentiment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Text is required for sentiment analysis",
    });
  }

  const result = sentimentService.analyzeSentiment(text);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Analyze multiple reviews
 * @route   POST /api/sentiment/analyze-reviews
 * @access  Private
 */
exports.analyzeReviews = asyncHandler(async (req, res) => {
  const { reviews } = req.body;

  if (!reviews || !Array.isArray(reviews)) {
    return res.status(400).json({
      success: false,
      message: "Reviews array is required",
    });
  }

  const result = sentimentService.analyzeMultipleReviews(reviews);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Calculate trust score from business reviews
 * @route   POST /api/sentiment/trust-score
 * @access  Private
 */
exports.calculateTrustScore = asyncHandler(async (req, res) => {
  const { reviews } = req.body;

  if (!reviews || !Array.isArray(reviews)) {
    return res.status(400).json({
      success: false,
      message: "Reviews array is required",
    });
  }

  const result = sentimentService.calculateTrustScore(reviews);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Analyze campaign description sentiment
 * @route   POST /api/sentiment/campaign-description
 * @access  Private
 */
exports.analyzeCampaignDescription = asyncHandler(async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({
      success: false,
      message: "Campaign description is required",
    });
  }

  const result = sentimentService.analyzeCampaignDescription(description);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Analyze investor feedback
 * @route   POST /api/sentiment/investor-feedback
 * @access  Private
 */
exports.analyzeInvestorFeedback = asyncHandler(async (req, res) => {
  const { feedbacks } = req.body;

  if (!feedbacks || !Array.isArray(feedbacks)) {
    return res.status(400).json({
      success: false,
      message: "Feedbacks array is required",
    });
  }

  const result = sentimentService.analyzeInvestorFeedback(feedbacks);

  res.status(200).json({
    success: true,
    data: result,
  });
});
