const express = require("express");
const { protect } = require("../middleware/auth");
const aiController = require("../controllers/aiController");

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * AI Routes
 */

// Financial advice
router.post("/financial-advice", aiController.getFinancialAdvice);

// Business plan analysis
router.post("/analyze-business-plan", aiController.analyzeBusinessPlan);

// Fund recommendations
router.post("/fund-recommendations", aiController.getFundRecommendations);

// Credit score tips
router.post("/credit-score-tips", aiController.getCreditScoreTips);

// Pitch analysis
router.post("/analyze-pitch", aiController.analyzePitch);

// General chat
router.post("/chat", aiController.chat);

// General query
router.post("/query", aiController.query);

module.exports = router;
