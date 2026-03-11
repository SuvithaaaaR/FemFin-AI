const express = require("express");
const router = express.Router();

// In-memory storage for campaigns (use database in production)
let campaigns = [];
let campaignIdCounter = 1;

// POST /api/crowdfunding/create
router.post("/create", async (req, res) => {
  try {
    const {
      title,
      description,
      targetAmount,
      duration,
      category,
      milestone1,
      milestone1Amount,
      milestone2,
      milestone2Amount,
      milestone3,
      milestone3Amount,
    } = req.body;

    if (!title || !description || !targetAmount || !duration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const milestones = [];
    if (milestone1 && milestone1Amount) {
      milestones.push({
        title: milestone1,
        amount: milestone1Amount,
        status: "pending",
      });
    }
    if (milestone2 && milestone2Amount) {
      milestones.push({
        title: milestone2,
        amount: milestone2Amount,
        status: "pending",
      });
    }
    if (milestone3 && milestone3Amount) {
      milestones.push({
        title: milestone3,
        amount: milestone3Amount,
        status: "pending",
      });
    }

    const newCampaign = {
      id: campaignIdCounter++,
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      raisedAmount: 0,
      duration: parseInt(duration),
      category,
      milestones,
      investors: [],
      createdAt: new Date(),
      status: "active",
      verified: false, // Would be verified through blockchain
    };

    campaigns.push(newCampaign);

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.message,
    });
  }
});

// GET /api/crowdfunding/campaigns
router.get("/campaigns", async (req, res) => {
  try {
    res.json({
      success: true,
      campaigns: campaigns.filter((c) => c.status === "active"),
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.message,
    });
  }
});

// POST /api/crowdfunding/invest/:campaignId
router.post("/invest/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { amount, investorName, email } = req.body;

    if (!amount || !investorName || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const campaign = campaigns.find((c) => c.id === parseInt(campaignId));

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // In production, this would integrate with blockchain smart contracts
    const investment = {
      investorName,
      email,
      amount: parseFloat(amount),
      timestamp: new Date(),
      txHash: `0x${Math.random().toString(36).substring(2, 15)}`, // Mock transaction hash
    };

    campaign.investors.push(investment);
    campaign.raisedAmount += parseFloat(amount);

    // Check if campaign reached its target
    if (campaign.raisedAmount >= campaign.targetAmount) {
      campaign.status = "funded";
    }

    res.json({
      success: true,
      message: "Investment successful",
      investment,
      campaign: {
        id: campaign.id,
        raisedAmount: campaign.raisedAmount,
        targetAmount: campaign.targetAmount,
        status: campaign.status,
      },
    });
  } catch (error) {
    console.error("Error processing investment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process investment",
      error: error.message,
    });
  }
});

// GET /api/crowdfunding/campaign/:campaignId
router.get("/campaign/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = campaigns.find((c) => c.id === parseInt(campaignId));

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign",
      error: error.message,
    });
  }
});

module.exports = router;
