const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: [true, "Please provide a business name"],
      trim: true,
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },
    businessIdea: {
      type: String,
      required: [true, "Please provide a business idea"],
      maxlength: [1000, "Business idea cannot exceed 1000 characters"],
    },
    industryType: {
      type: String,
      required: [true, "Please select an industry type"],
      enum: [
        "Technology",
        "Healthcare",
        "Education",
        "Retail",
        "Manufacturing",
        "Services",
        "Agriculture",
        "Other",
      ],
    },
    businessStage: {
      type: String,
      required: [true, "Please select a business stage"],
      enum: [
        "Idea Stage",
        "Prototype/MVP",
        "Early Stage",
        "Growth Stage",
        "Established",
      ],
    },
    budgetRequired: {
      type: Number,
      required: [true, "Please provide budget required"],
      min: [0, "Budget cannot be negative"],
    },
    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },
    registrationDetails: {
      isRegistered: {
        type: Boolean,
        default: false,
      },
      registrationType: {
        type: String,
        enum: [
          "Sole Proprietorship",
          "Partnership",
          "LLP",
          "Private Limited",
          "Not Registered",
        ],
      },
      registrationNumber: String,
      gstNumber: String,
    },
    financials: {
      monthlyRevenue: {
        type: Number,
        default: 0,
      },
      yearlyRevenue: {
        type: Number,
        default: 0,
      },
      profitMargin: {
        type: Number,
        min: -100,
        max: 100,
      },
      bankStatements: [String], // URLs to uploaded documents
    },
    documents: {
      businessPlan: String,
      pitchDeck: String,
      financialProjections: String,
      otherDocs: [String],
    },
    fundingHistory: [
      {
        source: String,
        amount: Number,
        date: Date,
        type: {
          type: String,
          enum: ["Grant", "Loan", "Investment", "Crowdfunding"],
        },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Closed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
businessSchema.index({ owner: 1, createdAt: -1 });
businessSchema.index({ industryType: 1, businessStage: 1 });

module.exports = mongoose.model("Business", businessSchema);
