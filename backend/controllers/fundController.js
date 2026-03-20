const { getSupabase } = require("../config/supabase");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");
const { FALLBACK_FUNDS, applyFallbackFilters } = require("../data/fundCatalog");

const normalizeFund = (row) => ({
  ...row,
  _id: row.id,
});

const fetchAllFunds = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("funds")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeFund);
};

/**
 * @desc    Get all funds
 * @route   GET /api/funds
 * @access  Public
 */
exports.getFunds = asyncHandler(async (req, res) => {
  try {
    const funds = await fetchAllFunds();
    const activeFunds = funds.filter(
      (item) => (item.status || "Active") === "Active",
    );
    const filtered = applyFallbackFilters(activeFunds, req.query);

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      source: "supabase",
    });
  } catch (error) {
    const data = applyFallbackFilters(FALLBACK_FUNDS, req.query);
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
      source: "fallback",
      message: "Supabase unavailable. Returning fallback funds from server.",
    });
  }
});

/**
 * @desc    Get single fund by ID
 * @route   GET /api/funds/:id
 * @access  Public
 */
exports.getFund = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("funds")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  if (!data) {
    const fallbackFund = FALLBACK_FUNDS.find(
      (item) => item._id === req.params.id,
    );

    if (!fallbackFund) {
      throw new ErrorResponse("Fund not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: fallbackFund,
      source: "fallback",
    });
  }

  res.status(200).json({
    success: true,
    data: normalizeFund(data),
  });
});

/**
 * @desc    Create new fund
 * @route   POST /api/funds
 * @access  Private/Admin
 */
exports.createFund = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const payload = {
    ...req.body,
    created_by: req.user?.id || null,
  };

  const { data, error } = await supabase
    .from("funds")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  res.status(201).json({
    success: true,
    data: normalizeFund(data),
  });
});

/**
 * @desc    Update fund
 * @route   PUT /api/funds/:id
 * @access  Private/Admin
 */
exports.updateFund = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("funds")
    .update(req.body)
    .eq("id", req.params.id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  if (!data) {
    throw new ErrorResponse("Fund not found", 404);
  }

  res.status(200).json({
    success: true,
    data: normalizeFund(data),
  });
});

/**
 * @desc    Delete fund
 * @route   DELETE /api/funds/:id
 * @access  Private/Admin
 */
exports.deleteFund = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("funds")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Get fund categories
 * @route   GET /api/funds/categories
 * @access  Public
 */
exports.getFundCategories = asyncHandler(async (req, res) => {
  try {
    const funds = await fetchAllFunds();
    const categories = [
      ...new Set(funds.map((item) => item.category).filter(Boolean)),
    ];

    return res.status(200).json({
      success: true,
      data: categories,
      source: "supabase",
    });
  } catch (error) {
    const categories = [
      ...new Set(FALLBACK_FUNDS.map((item) => item.category)),
    ];
    return res.status(200).json({
      success: true,
      data: categories,
      source: "fallback",
    });
  }
});

/**
 * @desc    Seed initial funds data
 * @route   POST /api/funds/seed
 * @access  Private/Admin
 */
exports.seedFunds = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const seedPayload = FALLBACK_FUNDS.map((item) => ({
    ...item,
    id: undefined,
    _id: undefined,
    created_by: req.user?.id || null,
  }));

  const { data, error } = await supabase
    .from("funds")
    .upsert(seedPayload, { onConflict: "name" })
    .select("*");

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  res.status(201).json({
    success: true,
    count: (data || []).length,
    data: (data || []).map(normalizeFund),
    source: "supabase",
  });
});
