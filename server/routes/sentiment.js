const express = require("express");
const { protect } = require("../middleware/auth");
const sentimentController = require("../controllers/sentimentController");

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * Sentiment Analysis Routes
 */

// Analyze single text
router.post("/analyze", sentimentController.analyzeSentiment);

// Analyze multiple reviews
router.post("/analyze-reviews", sentimentController.analyzeReviews);

// Calculate trust score from reviews
router.post("/trust-score", sentimentController.calculateTrustScore);

// Analyze campaign description
router.post("/campaign-description", sentimentController.analyzeCampaignDescription);

// Analyze investor feedback
router.post("/investor-feedback", sentimentController.analyzeInvestorFeedback);

module.exports = router;
