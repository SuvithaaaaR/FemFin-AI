const mongoose = require("mongoose");

const creditScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    // Digital Transaction Score (25%)
    digitalTransactions: {
      upiTransactions: {
        type: Number,
        default: 0,
      },
      onlinePayments: {
        type: Number,
        default: 0,
      },
      averageTransactionValue: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    // Business Activity Score (30%)
    businessActivity: {
      yearsInBusiness: {
        type: Number,
        default: 0,
      },
      monthlyRevenue: {
        type: Number,
        default: 0,
      },
      consistencyScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      growthRate: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    // Social Trust Score (20%)
    socialTrust: {
      customerReviews: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      socialMediaPresence: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      businessReferences: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    // Financial Health Score (25%)
    financialHealth: {
      averageMonthlySales: {
        type: Number,
        default: 0,
      },
      profitMargin: {
        type: Number,
        default: 0,
      },
      debtToIncomeRatio: {
        type: Number,
        default: 0,
      },
      existingLoans: {
        type: Boolean,
        default: false,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    // Overall Credit Score (300-900 range like CIBIL)
    overallScore: {
      type: Number,
      min: 300,
      max: 900,
      required: true,
    },
    scoreBreakdown: {
      digitalWeight: {
        type: Number,
        default: 0.25,
      },
      businessWeight: {
        type: Number,
        default: 0.3,
      },
      socialWeight: {
        type: Number,
        default: 0.2,
      },
      financialWeight: {
        type: Number,
        default: 0.25,
      },
    },
    // Loan Eligibility
    loanEligibility: {
      isEligible: {
        type: Boolean,
        default: false,
      },
      maxLoanAmount: {
        type: Number,
        default: 0,
      },
      recommendedInterestRate: {
        type: Number,
        default: 0,
      },
      riskLevel: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "High",
      },
    },
    // Historical tracking
    scoreHistory: [
      {
        score: Number,
        calculatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastCalculated: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: function () {
        // Score valid for 3 months
        const date = new Date();
        date.setMonth(date.getMonth() + 3);
        return date;
      },
    },
  },
  {
    timestamps: true,
  },
);

// Method to check if score is valid
creditScoreSchema.methods.isScoreValid = function () {
  return new Date() < this.validUntil;
};

// Method to calculate risk level based on score
creditScoreSchema.methods.calculateRiskLevel = function () {
  if (this.overallScore >= 750) return "Low";
  if (this.overallScore >= 600) return "Medium";
  return "High";
};

// Pre-save middleware to update risk level
creditScoreSchema.pre("save", function (next) {
  this.loanEligibility.riskLevel = this.calculateRiskLevel();
  next();
});

// Index for faster queries
creditScoreSchema.index({ user: 1, lastCalculated: -1 });
creditScoreSchema.index({ overallScore: -1 });

module.exports = mongoose.model("CreditScore", creditScoreSchema);
