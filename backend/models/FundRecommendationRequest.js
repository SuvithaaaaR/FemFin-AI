const mongoose = require("mongoose");

const recommendationItemSchema = new mongoose.Schema(
  {
    name: String,
    matchScore: Number,
    fundingRange: String,
    timeline: String,
    comparisonText: String,
  },
  { _id: false },
);

const fundRecommendationRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    businessIdea: {
      type: String,
      required: true,
      trim: true,
    },
    budgetRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    industryType: {
      type: String,
      required: true,
      trim: true,
    },
    businessStage: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    teamSize: {
      type: String,
      trim: true,
    },
    recommendations: {
      governmentSchemes: [recommendationItemSchema],
      angelInvestors: [recommendationItemSchema],
      vcFunds: [recommendationItemSchema],
      grants: [recommendationItemSchema],
    },
  },
  {
    timestamps: true,
  },
);

fundRecommendationRequestSchema.index({ createdAt: -1 });
fundRecommendationRequestSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model(
  "FundRecommendationRequest",
  fundRecommendationRequestSchema,
);
