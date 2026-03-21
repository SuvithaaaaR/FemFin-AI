const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { getSupabase } = require("../config/supabase");
const { asyncHandler, ErrorResponse } = require("../middleware/errorHandler");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "FemFin_AI_JWT_2026_Production_Ready_Key_At_Least_32_Chars";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = new OAuth2Client();

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
  return next(
    new ErrorResponse(
      "Email/password register is disabled. Use Google sign-in.",
      403,
    ),
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  return next(
    new ErrorResponse(
      "Email/password login is disabled. Use Google sign-in.",
      403,
    ),
  );
});

/**
 * @desc    Login/Register using Google Sign-In
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleAuth = asyncHandler(async (req, res, next) => {
  const { idToken, role } = req.body;
  const supabase = getSupabase();

  if (!GOOGLE_CLIENT_ID) {
    return next(new ErrorResponse("Google auth is not configured", 500));
  }

  if (!idToken) {
    return next(new ErrorResponse("Google idToken is required", 400));
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    return next(new ErrorResponse("Invalid Google token", 401));
  }

  if (!payload?.email || payload.email_verified !== true) {
    return next(new ErrorResponse("Google account email is not verified", 401));
  }

  const email = String(payload.email).toLowerCase();
  const name = payload.name || email.split("@")[0];

  const { data: existingUser, error: existingError } = await supabase
    .from("users")
    .select("id, name, email, role, credit_score, phone_number, profile")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    throw new ErrorResponse(existingError.message, 500);
  }

  let user = existingUser;
  let isNewUser = false;

  if (!user) {
    const passwordHash = await bcrypt.hash(`google-oauth-${payload.sub}`, 12);
    const { data: createdUser, error: createError } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password_hash: passwordHash,
        role: role || "entrepreneur",
        profile: {
          authProvider: "google",
          googleSub: payload.sub,
          picture: payload.picture || null,
        },
      })
      .select("id, name, email, role, credit_score, phone_number, profile")
      .single();

    if (createError) {
      throw new ErrorResponse(createError.message, 500);
    }

    user = createdUser;
    isNewUser = true;
  }

  const token = signToken(user.id);

  res.status(200).json({
    success: true,
    message: isNewUser ? "Google sign-up successful" : "Google login successful",
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
