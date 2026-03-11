const express = require("express");
const router = express.Router();
const { creditScoring } = require("../controllers");
const { aiLimiter, optionalAuth, protect } = require("../middleware");

/**
 * @route   POST /api/credit-scoring/calculate
 * @desc    Calculate AI credit score without collateral
 * @access  Public (saves to DB if authenticated)
 */
router.post("/calculate", aiLimiter, optionalAuth, creditScoring.calculateScore);

/**
 * @route   GET /api/credit-scoring/history
 * @desc    Get user's credit score history
 * @access  Private
 */
router.get("/history", protect, creditScoring.getCreditScoreHistory);

/**
 * @route   GET /api/credit-scoring/latest
 * @desc    Get user's latest credit score
 * @access  Private
 */
router.get("/latest", protect, creditScoring.getLatestScore);

module.exports = router;
