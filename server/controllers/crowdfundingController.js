const Campaign = require("../models/Campaign");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");

/**
 * @desc    Get all campaigns
 * @route   GET /api/crowdfunding/campaigns
 * @access  Public
 */
exports.getCampaigns = asyncHandler(async (req, res, next) => {
  const { status, category, sort } = req.query;

  // Build query
  let query = {};
  if (status) query.status = status;
  if (category) query.category = category;

  // Execute query
  let campaigns = await Campaign.find(query)
    .populate("creator", "name email")
    .populate("business", "businessName industryType");

  // Sorting
  if (sort === "trending") {
    campaigns = campaigns.sort((a, b) => b.stats.views - a.stats.views);
  } else if (sort === "funded") {
    campaigns = campaigns.sort((a, b) => b.currentAmount - a.currentAmount);
  } else {
    campaigns = campaigns.sort((a, b) => b.createdAt - a.createdAt);
  }

  res.status(200).json({
    success: true,
    count: campaigns.length,
    data: campaigns,
  });
});

/**
 * @desc    Get single campaign
 * @route   GET /api/crowdfunding/campaigns/:id
 * @access  Public
 */
exports.getCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate("creator", "name email profile")
    .populate("business", "businessName industryType businessStage")
    .populate("investments.investor", "name email");

  if (!campaign) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  // Increment view count
  campaign.stats.views += 1;
  await campaign.save();

  res.status(200).json({
    success: true,
    data: campaign,
  });
});

/**
 * @desc    Create new campaign
 * @route   POST /api/crowdfunding/campaigns
 * @access  Private
 */
exports.createCampaign = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.creator = req.user.id;

  const campaign = await Campaign.create(req.body);

  res.status(201).json({
    success: true,
    message: "Campaign created successfully",
    data: campaign,
  });
});

/**
 * @desc    Update campaign
 * @route   PUT /api/crowdfunding/campaigns/:id
 * @access  Private (Owner only)
 */
exports.updateCampaign = asyncHandler(async (req, res, next) => {
  let campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  // Make sure user is campaign creator
  if (campaign.creator.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to update this campaign", 403),
    );
  }

  campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Campaign updated successfully",
    data: campaign,
  });
});

/**
 * @desc    Delete campaign
 * @route   DELETE /api/crowdfunding/campaigns/:id
 * @access  Private (Owner only)
 */
exports.deleteCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  // Make sure user is campaign creator
  if (campaign.creator.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to delete this campaign", 403),
    );
  }

  await campaign.deleteOne();

  res.status(200).json({
    success: true,
    message: "Campaign deleted successfully",
  });
});

/**
 * @desc    Invest in campaign
 * @route   POST /api/crowdfunding/campaigns/:id/invest
 * @access  Private
 */
exports.investInCampaign = asyncHandler(async (req, res, next) => {
  const { amount, transactionHash } = req.body;

  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  // Check if campaign is active
  if (campaign.status !== "Active") {
    return next(new ErrorResponse("Campaign is not active", 400));
  }

  // Check minimum investment
  if (amount < campaign.minInvestment) {
    return next(
      new ErrorResponse(`Minimum investment is ${campaign.minInvestment}`, 400),
    );
  }

  // Add investment
  campaign.investments.push({
    investor: req.user.id,
    amount,
    transactionHash,
    status: "Confirmed",
  });

  // Update current amount
  campaign.currentAmount += amount;

  // Check if target reached
  if (campaign.currentAmount >= campaign.targetAmount) {
    campaign.status = "Funded";
  }

  await campaign.save();

  res.status(200).json({
    success: true,
    message: "Investment successful",
    data: {
      campaignId: campaign._id,
      investedAmount: amount,
      totalRaised: campaign.currentAmount,
      fundingPercentage: (campaign.currentAmount / campaign.targetAmount) * 100,
    },
  });
});

/**
 * @desc    Get user's campaigns
 * @route   GET /api/crowdfunding/my-campaigns
 * @access  Private
 */
exports.getMyCampaigns = asyncHandler(async (req, res, next) => {
  const campaigns = await Campaign.find({ creator: req.user.id })
    .populate("business", "businessName")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: campaigns.length,
    data: campaigns,
  });
});

/**
 * @desc    Get user's investments
 * @route   GET /api/crowdfunding/my-investments
 * @access  Private
 */
exports.getMyInvestments = asyncHandler(async (req, res, next) => {
  const campaigns = await Campaign.find({
    "investments.investor": req.user.id,
  })
    .populate("creator", "name")
    .populate("business", "businessName");

  // Extract user's investment details from each campaign
  const investments = campaigns.map((campaign) => {
    const userInvestment = campaign.investments.find(
      (inv) => inv.investor.toString() === req.user.id,
    );
    return {
      campaign: {
        id: campaign._id,
        title: campaign.title,
        category: campaign.category,
        creator: campaign.creator,
      },
      investment: userInvestment,
      fundingStatus: {
        currentAmount: campaign.currentAmount,
        targetAmount: campaign.targetAmount,
        percentage: (campaign.currentAmount / campaign.targetAmount) * 100,
      },
    };
  });

  res.status(200).json({
    success: true,
    count: investments.length,
    data: investments,
  });
});
