const Sentiment = require("sentiment");
const sentiment = new Sentiment();

/**
 * Analyze sentiment of text (reviews, feedback, etc.)
 * @param {string} text - Text to analyze
 * @returns {Object} - Sentiment analysis result
 */
function analyzeSentiment(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required for sentiment analysis");
  }

  const result = sentiment.analyze(text);

  // Determine sentiment category
  let category;
  if (result.score > 0) {
    category = "positive";
  } else if (result.score < 0) {
    category = "negative";
  } else {
    category = "neutral";
  }

  return {
    score: result.score,
    comparative: result.comparative,
    category: category,
    positiveWords: result.positive,
    negativeWords: result.negative,
    wordCount: result.words.length,
  };
}

/**
 * Analyze multiple reviews and get aggregate sentiment
 * @param {Array} reviews - Array of review texts
 * @returns {Object} - Aggregate sentiment analysis
 */
function analyzeMultipleReviews(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    throw new Error("Reviews array is required");
  }

  const results = reviews.map((review) => analyzeSentiment(review));

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const averageScore = totalScore / results.length;

  const positiveCount = results.filter((r) => r.category === "positive").length;
  const negativeCount = results.filter((r) => r.category === "negative").length;
  const neutralCount = results.filter((r) => r.category === "neutral").length;

  return {
    totalReviews: reviews.length,
    averageScore: averageScore,
    averageComparative:
      results.reduce((sum, r) => sum + r.comparative, 0) / results.length,
    sentiment: {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount,
    },
    percentages: {
      positive: ((positiveCount / reviews.length) * 100).toFixed(2),
      negative: ((negativeCount / reviews.length) * 100).toFixed(2),
      neutral: ((neutralCount / reviews.length) * 100).toFixed(2),
    },
    overallSentiment:
      averageScore > 0 ? "positive" : averageScore < 0 ? "negative" : "neutral",
  };
}

/**
 * Analyze business reviews and calculate trust score
 * @param {Array} reviews - Array of review objects with text property
 * @returns {Object} - Trust score and sentiment analysis
 */
function calculateTrustScore(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      trustScore: 0,
      sentiment: "insufficient_data",
      message: "Not enough reviews to calculate trust score",
    };
  }

  const reviewTexts = reviews.map((r) => r.text || r.review || r.comment || "");
  const analysis = analyzeMultipleReviews(reviewTexts);

  // Calculate trust score (0-100)
  // Based on positive sentiment percentage and review count
  const positiveRatio = analysis.sentiment.positive / analysis.totalReviews;
  const volumeBonus = Math.min(analysis.totalReviews / 100, 0.2); // Max 20% bonus for volume

  const trustScore = Math.min(
    100,
    positiveRatio * 80 + volumeBonus * 100,
  ).toFixed(2);

  return {
    trustScore: parseFloat(trustScore),
    totalReviews: analysis.totalReviews,
    sentimentBreakdown: analysis.sentiment,
    percentages: analysis.percentages,
    overallSentiment: analysis.overallSentiment,
    averageScore: analysis.averageScore.toFixed(2),
    recommendation:
      trustScore >= 75
        ? "Highly Trustworthy"
        : trustScore >= 50
          ? "Generally Trustworthy"
          : trustScore >= 25
            ? "Moderately Trustworthy"
            : "Requires Caution",
  };
}

/**
 * Analyze campaign description sentiment
 * @param {string} description - Campaign description
 * @returns {Object} - Sentiment analysis with recommendations
 */
function analyzeCampaignDescription(description) {
  const analysis = analyzeSentiment(description);

  return {
    ...analysis,
    isEngaging: analysis.score > 0 && analysis.wordCount > 50,
    recommendation:
      analysis.score > 0
        ? "Description has positive sentiment - good for attracting investors"
        : analysis.score < 0
          ? "Consider revising to use more positive language"
          : "Description is neutral - consider adding more compelling language",
  };
}

/**
 * Analyze investor feedback sentiment
 * @param {Array} feedbacks - Array of feedback texts
 * @returns {Object} - Feedback sentiment analysis
 */
function analyzeInvestorFeedback(feedbacks) {
  if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
    return {
      message: "No feedback available",
      overallSentiment: "neutral",
    };
  }

  const analysis = analyzeMultipleReviews(feedbacks);

  return {
    ...analysis,
    insights: {
      investorConfidence:
        analysis.sentiment.positive > analysis.sentiment.negative
          ? "High"
          : "Low",
      concerns:
        analysis.sentiment.negative > 0
          ? "Some negative feedback detected"
          : "No major concerns",
      recommendation:
        analysis.overallSentiment === "positive"
          ? "Strong investor sentiment - continue current strategy"
          : "Consider addressing investor concerns",
    },
  };
}

module.exports = {
  analyzeSentiment,
  analyzeMultipleReviews,
  calculateTrustScore,
  analyzeCampaignDescription,
  analyzeInvestorFeedback,
};
