const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  targetAmount: {
    type: Number,
    required: true,
  },
  deadline: Date,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Failed"],
    default: "Pending",
  },
  completedAt: Date,
});

const investmentSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionHash: {
    type: String, // For blockchain transactions
  },
  investedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Released", "Refunded"],
    default: "Pending",
  },
});

const campaignSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    title: {
      type: String,
      required: [true, "Please provide a campaign title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a campaign description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Technology",
        "Healthcare",
        "Education",
        "Retail",
        "Manufacturing",
        "Services",
        "Agriculture",
        "Social Impact",
        "Other",
      ],
    },
    targetAmount: {
      type: Number,
      required: [true, "Please provide a target amount"],
      min: [1000, "Target amount must be at least 1000"],
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    minInvestment: {
      type: Number,
      default: 1000,
    },
    deadline: {
      type: Date,
      required: [true, "Please provide a deadline"],
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Deadline must be in the future",
      },
    },
    milestones: [milestoneSchema],
    investments: [investmentSchema],
    images: [String],
    video: String,
    documents: [String],
    status: {
      type: String,
      enum: ["Draft", "Active", "Funded", "Closed", "Failed"],
      default: "Draft",
    },
    blockchain: {
      contractAddress: String,
      network: {
        type: String,
        enum: ["Ethereum", "Polygon", "Binance Smart Chain"],
        default: "Polygon",
      },
      transactionHash: String,
    },
    rewards: [
      {
        amount: Number,
        reward: String,
        description: String,
      },
    ],
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      backers: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Virtual field for funding percentage
campaignSchema.virtual("fundingPercentage").get(function () {
  return (this.currentAmount / this.targetAmount) * 100;
});

// Update backers count automatically
campaignSchema.pre("save", function (next) {
  if (this.isModified("investments")) {
    this.stats.backers = this.investments.length;
  }
  next();
});

// Index for faster queries
campaignSchema.index({ creator: 1, createdAt: -1 });
campaignSchema.index({ status: 1, deadline: 1 });
campaignSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("Campaign", campaignSchema);
