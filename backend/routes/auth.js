const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { auth } = require("../controllers");
const { validate, authLimiter, registerLimiter } = require("../middleware");

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  "/register",
  registerLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phoneNumber")
      .optional()
      .matches(/^[0-9]{10}$/)
      .withMessage("Please provide a valid 10-digit phone number"),
  ],
  validate,
  auth.register,
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  auth.login,
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", require("../middleware").protect, auth.getMe);

/**
 * @route   PUT /api/auth/updatedetails
 * @desc    Update user details
 * @access  Private
 */
router.put(
  "/updatedetails",
  require("../middleware").protect,
  auth.updateDetails,
);

/**
 * @route   PUT /api/auth/updatepassword
 * @desc    Update password
 * @access  Private
 */
router.put(
  "/updatepassword",
  require("../middleware").protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  validate,
  auth.updatePassword,
);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.get("/logout", require("../middleware").protect, auth.logout);

module.exports = router;
