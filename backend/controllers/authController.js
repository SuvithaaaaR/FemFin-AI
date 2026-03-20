const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getSupabase } = require("../config/supabase");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "FemFin_AI_JWT_2026_Production_Ready_Key_At_Least_32_Chars";

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

const normalizeUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  creditScore: row.credit_score,
  phoneNumber: row.phone_number,
  profile: row.profile,
});

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phoneNumber, role } = req.body;
  const supabase = getSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    throw new ErrorResponse(existingError.message, 500);
  }

  if (existing) {
    return next(new ErrorResponse("User already exists", 400));
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { data: created, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash: passwordHash,
      phone_number: phoneNumber,
      role: role || "entrepreneur",
    })
    .select("id, name, email, role, credit_score")
    .single();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  const token = signToken(created.id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: normalizeUser(created),
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const supabase = getSupabase();

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role, credit_score, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password_hash || "");

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Generate token
  const token = signToken(user.id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: normalizeUser(user),
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const supabase = getSupabase();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role, phone_number, profile, credit_score")
    .eq("id", req.user.id)
    .maybeSingle();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: normalizeUser(user),
  });
});

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const supabase = getSupabase();
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phoneNumber,
    profile: req.body.profile,
  };

  const { data: user, error } = await supabase
    .from("users")
    .update(fieldsToUpdate)
    .eq("id", req.user.id)
    .select("id, name, email, role, phone_number, profile, credit_score")
    .single();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: normalizeUser(user),
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const supabase = getSupabase();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, password_hash")
    .eq("id", req.user.id)
    .maybeSingle();

  if (error) {
    throw new ErrorResponse(error.message, 500);
  }

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Check current password
  if (!(await bcrypt.compare(req.body.currentPassword, user.password_hash))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  const newHash = await bcrypt.hash(req.body.newPassword, 12);
  const { error: updateError } = await supabase
    .from("users")
    .update({ password_hash: newHash })
    .eq("id", req.user.id);

  if (updateError) {
    throw new ErrorResponse(updateError.message, 500);
  }

  const token = signToken(req.user.id);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    token,
  });
});

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
