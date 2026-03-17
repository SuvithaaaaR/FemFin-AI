const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Fund name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Fund category is required"],
      enum: [
        "Government Scheme",
        "Angel Investor",
        "VC Fund",
        "Grant",
        "Loan",
        "Crowdfunding",
        "Incubator",
        "Accelerator",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    fundingRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    timeline: {
      type: String,
      required: true,
    },
    eligibility: [
      {
        type: String,
      },
    ],
    targetAudience: [
      {
        type: String,
        enum: [
          "Women Entrepreneurs",
          "Early Stage",
          "Growth Stage",
          "Technology",
          "Manufacturing",
          "Agriculture",
          "Healthcare",
          "Education",
          "All",
        ],
      },
    ],
    applicationProcess: {
      type: String,
    },
    website: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    industryFocus: [
      {
        type: String,
      },
    ],
    businessStageApplicable: [
      {
        type: String,
        enum: [
          "Idea Stage",
          "Prototype/MVP",
          "Early Stage (Pre-revenue)",
          "Revenue Generating",
          "Growth Stage",
          "Established",
        ],
      },
    ],
    interestRate: {
      type: String,
    },
    repaymentTerms: {
      type: String,
    },
    equityStake: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Closed"],
      default: "Active",
    },
    features: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    schemeDetails: {
      fullName: String,
      launchedBy: String,
      launchedOn: String,
      purpose: String,
      loanAmountBySegment: [
        {
          segment: String,
          min: Number,
          max: Number,
        },
      ],
      maxLoanAmount: Number,
      terms: {
        floatingRateNote: String,
        concessionalMargin: String,
        noCollateralUpto: Number,
        collateralCondition: String,
        tenure: String,
        exampleEmi: String,
      },
      requiredDocuments: [
        {
          title: String,
          details: String,
        },
      ],
      applicationSteps: [
        {
          step: String,
        },
      ],
      currentStatus: {
        isActive: Boolean,
        updatedAsOf: String,
        disbursalNote: String,
        relatedSchemes: [String],
      },
      examples: [
        {
          text: String,
          eligible: Boolean,
        },
      ],
      integrationPrompt: String,
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    averageTicketSize: {
      type: Number,
    },
    totalFunded: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Index for search
fundSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Fund", fundSchema);
