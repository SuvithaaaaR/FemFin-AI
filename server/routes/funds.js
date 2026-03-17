const express = require('express');
const router = express.Router();
const { fund } = require('../controllers');
const { protect } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');

/**
 * @route   GET /api/funds
 * @desc    Get all funds with optional filters
 * @access  Public
 */
router.get('/', fund.getFunds);

/**
 * @route   GET /api/funds/categories
 * @desc    Get all fund categories
 * @access  Public
 */
router.get('/categories', fund.getFundCategories);

/**
 * @route   POST /api/funds/seed
 * @desc    Seed initial funds data
 * @access  Private/Admin
 */
router.post('/seed', protect, fund.seedFunds);

/**
 * @route   GET /api/funds/:id
 * @desc    Get single fund by ID
 * @access  Public
 */
router.get('/:id', fund.getFund);

/**
 * @route   POST /api/funds
 * @desc    Create new fund
 * @access  Private/Admin
 */
router.post('/', protect, createLimiter, fund.createFund);

/**
 * @route   PUT /api/funds/:id
 * @desc    Update fund
 * @access  Private/Admin
 */
router.put('/:id', protect, fund.updateFund);

/**
 * @route   DELETE /api/funds/:id
 * @desc    Delete fund
 * @access  Private/Admin
 */
router.delete('/:id', protect, fund.deleteFund);

module.exports = router;
