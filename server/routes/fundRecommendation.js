const express = require("express");
const router = express.Router();
const { fundRecommendation } = require("../controllers");
const { aiLimiter, optionalAuth, protect } = require("../middleware");

/**
 * @route   POST /api/fund-recommendations/analyze
 * @desc    Analyze business and get AI fund recommendations
 * @access  Public
 */
router.post(
  "/analyze",
  aiLimiter,
  optionalAuth,
  fundRecommendation.analyzeFunds,
);

/**
 * @route   GET /api/fund-recommendations/sources
 * @desc    Get all available funding sources
 * @access  Public
 */
router.get("/sources", fundRecommendation.getFundingSources);

/**
 * @route   GET /api/fund-recommendations/history
 * @desc    Get saved recommendation submissions for logged-in user
 * @access  Private
 */
router.get("/history", protect, fundRecommendation.getRecommendationHistory);

module.exports = router;
