const express = require("express");
const router = express.Router();
const { crowdfunding } = require("../controllers");
const { protect, createLimiter } = require("../middleware");

/**
 * @route   GET /api/crowdfunding/campaigns
 * @desc    Get all campaigns
 * @access  Public
 */
router.get("/campaigns", crowdfunding.getCampaigns);

/**
 * @route   POST /api/crowdfunding/campaigns
 * @desc    Create new campaign
 * @access  Private
 */
router.post("/campaigns", protect, createLimiter, crowdfunding.createCampaign);

/**
 * @route   GET /api/crowdfunding/campaigns/:id
 * @desc    Get single campaign
 * @access  Public
 */
router.get("/campaigns/:id", crowdfunding.getCampaign);

/**
 * @route   PUT /api/crowdfunding/campaigns/:id
 * @desc    Update campaign
 * @access  Private (Owner only)
 */
router.put("/campaigns/:id", protect, crowdfunding.updateCampaign);

/**
 * @route   DELETE /api/crowdfunding/campaigns/:id
 * @desc    Delete campaign
 * @access  Private (Owner only)
 */
router.delete("/campaigns/:id", protect, crowdfunding.deleteCampaign);

/**
 * @route   POST /api/crowdfunding/campaigns/:id/invest
 * @desc    Invest in a campaign
 * @access  Private
 */
router.post("/campaigns/:id/invest", protect, crowdfunding.investInCampaign);

/**
 * @route   GET /api/crowdfunding/my-campaigns
 * @desc    Get user's campaigns
 * @access  Private
 */
router.get("/my-campaigns", protect, crowdfunding.getMyCampaigns);

/**
 * @route   GET /api/crowdfunding/my-investments
 * @desc    Get user's investments
 * @access  Private
 */
router.get("/my-investments", protect, crowdfunding.getMyInvestments);

module.exports = router;
