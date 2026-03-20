const { getSupabase } = require("../config/supabase");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");

const normalizeCampaign = (row) => ({
  ...row,
  _id: row.id,
  creator: row.creator_id,
  currentAmount: row.current_amount,
  targetAmount: row.target_amount,
  minInvestment: row.min_investment,
  endDate: row.end_date,
  milestones: row.milestones || [],
  investments: row.investments || [],
  stats: row.stats || { views: 0 },
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * @desc    Get all campaigns
 * @route   GET /api/crowdfunding/campaigns
 * @access  Public
 */
exports.getCampaigns = asyncHandler(async (req, res) => {
  const { status, category, sort } = req.query;
  const supabase = getSupabase();

  let query = supabase.from("campaigns").select("*");
  if (status) query = query.eq("status", status);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  let campaigns = (data || []).map(normalizeCampaign);

  if (sort === "trending") {
    campaigns = campaigns.sort(
      (a, b) => (b.stats?.views || 0) - (a.stats?.views || 0),
    );
  } else if (sort === "funded") {
    campaigns = campaigns.sort(
      (a, b) => (b.currentAmount || 0) - (a.currentAmount || 0),
    );
  } else {
    campaigns = campaigns.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
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
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  if (!data) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  const stats = { ...(data.stats || {}) };
  stats.views = (stats.views || 0) + 1;

  await supabase.from("campaigns").update({ stats }).eq("id", req.params.id);

  res.status(200).json({
    success: true,
    data: normalizeCampaign({ ...data, stats }),
  });
});

/**
 * @desc    Create new campaign
 * @route   POST /api/crowdfunding/campaigns
 * @access  Private
 */
exports.createCampaign = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const payload = {
    ...req.body,
    creator_id: req.user.id,
    target_amount: req.body.targetAmount || 0,
    current_amount: req.body.currentAmount || 0,
    min_investment: req.body.minInvestment || 1000,
    end_date: req.body.endDate || null,
    milestones: req.body.milestones || [],
    investments: req.body.investments || [],
    stats: req.body.stats || { views: 0 },
  };

  const { data, error } = await supabase
    .from("campaigns")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  res.status(201).json({
    success: true,
    message: "Campaign created successfully",
    data: normalizeCampaign(data),
  });
});

/**
 * @desc    Update campaign
 * @route   PUT /api/crowdfunding/campaigns/:id
 * @access  Private (Owner only)
 */
exports.updateCampaign = asyncHandler(async (req, res, next) => {
  const supabase = getSupabase();
  const { data: existing, error: fetchError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (fetchError) {
    throw new ErrorResponse(fetchError.message, 500);
  }

  if (!existing) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  if (existing.creator_id !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to update this campaign", 403),
    );
  }

  const payload = {
    ...req.body,
    target_amount: req.body.targetAmount,
    current_amount: req.body.currentAmount,
    min_investment: req.body.minInvestment,
    end_date: req.body.endDate,
  };

  const { data, error } = await supabase
    .from("campaigns")
    .update(payload)
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  res.status(200).json({
    success: true,
    message: "Campaign updated successfully",
    data: normalizeCampaign(data),
  });
});

/**
 * @desc    Delete campaign
 * @route   DELETE /api/crowdfunding/campaigns/:id
 * @access  Private (Owner only)
 */
exports.deleteCampaign = asyncHandler(async (req, res, next) => {
  const supabase = getSupabase();
  const { data: existing, error: fetchError } = await supabase
    .from("campaigns")
    .select("id, creator_id")
    .eq("id", req.params.id)
    .maybeSingle();

  if (fetchError) {
    throw new ErrorResponse(fetchError.message, 500);
  }

  if (!existing) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  if (existing.creator_id !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to delete this campaign", 403),
    );
  }

  const { error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

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
  const supabase = getSupabase();

  const { data: campaign, error: fetchError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (fetchError) {
    throw new ErrorResponse(fetchError.message, 500);
  }

  if (!campaign) {
    return next(new ErrorResponse("Campaign not found", 404));
  }

  if (campaign.status !== "Active") {
    return next(new ErrorResponse("Campaign is not active", 400));
  }

  if (Number(amount) < Number(campaign.min_investment || 0)) {
    return next(
      new ErrorResponse(
        `Minimum investment is ${campaign.min_investment}`,
        400,
      ),
    );
  }

  const investments = [...(campaign.investments || [])];
  investments.push({
    investor: req.user.id,
    amount: Number(amount),
    transactionHash,
    status: "Confirmed",
    investedAt: new Date().toISOString(),
  });

  const currentAmount =
    Number(campaign.current_amount || 0) + Number(amount || 0);
  const status =
    currentAmount >= Number(campaign.target_amount || 0)
      ? "Funded"
      : campaign.status;

  const { error: updateError } = await supabase
    .from("campaigns")
    .update({
      investments,
      current_amount: currentAmount,
      status,
    })
    .eq("id", req.params.id);

  if (updateError) {
    throw new ErrorResponse(updateError.message, 500);
  }

  res.status(200).json({
    success: true,
    message: "Investment successful",
    data: {
      campaignId: campaign.id,
      investedAmount: Number(amount),
      totalRaised: currentAmount,
      fundingPercentage:
        (currentAmount / Number(campaign.target_amount || 1)) * 100,
    },
  });
});

/**
 * @desc    Get user's campaigns
 * @route   GET /api/crowdfunding/my-campaigns
 * @access  Private
 */
exports.getMyCampaigns = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("creator_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  const campaigns = (data || []).map(normalizeCampaign);

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
exports.getMyInvestments = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("campaigns").select("*");

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  const investments = (data || [])
    .map((campaign) => {
      const userInvestment = (campaign.investments || []).find(
        (inv) => inv.investor === req.user.id,
      );

      if (!userInvestment) {
        return null;
      }

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
          category: campaign.category,
          creator: campaign.creator_id,
        },
        investment: userInvestment,
        fundingStatus: {
          currentAmount: campaign.current_amount,
          targetAmount: campaign.target_amount,
          percentage:
            (Number(campaign.current_amount || 0) /
              Number(campaign.target_amount || 1)) *
            100,
        },
      };
    })
    .filter(Boolean);

  res.status(200).json({
    success: true,
    count: investments.length,
    data: investments,
  });
});
