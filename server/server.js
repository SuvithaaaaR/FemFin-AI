const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const {
  errorHandler,
  notFound,
  requestLogger,
  addRequestId,
  apiLimiter,
  sanitizeInput,
} = require("./middleware");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addRequestId); // Add unique ID to each request
app.use(requestLogger); // Log all requests
app.use(sanitizeInput); // Sanitize input to prevent XSS

// Apply rate limiting to all API routes
if (process.env.ENABLE_RATE_LIMIT !== "false") {
  app.use("/api/", apiLimiter);
}

// Log environment
if (process.env.NODE_ENV === "development") {
  console.log("🔧 Running in development mode");
}

// API Routes
const authRoutes = require("./routes/auth");
const fundRecommendationRoutes = require("./routes/fundRecommendation");
const crowdfundingRoutes = require("./routes/crowdfunding");
const creditScoringRoutes = require("./routes/creditScoring");
const aiRoutes = require("./routes/ai");
const sentimentRoutes = require("./routes/sentiment");
const fundRoutes = require("./routes/funds");

app.use("/api/auth", authRoutes);
app.use("/api/fund-recommendations", fundRecommendationRoutes);
app.use("/api/crowdfunding", crowdfundingRoutes);
app.use("/api/credit-scoring", creditScoringRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/sentiment", sentimentRoutes);
app.use("/api/funds", fundRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FemFin AI Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database:
      require("mongoose").connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to FemFin AI API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        updateDetails: "PUT /api/auth/updatedetails",
        updatePassword: "PUT /api/auth/updatepassword",
      },
      fundRecommendations: {
        analyze: "POST /api/fund-recommendations/analyze",
        sources: "GET /api/fund-recommendations/sources",
      },
      funds: {
        getAll: "GET /api/funds",
        getById: "GET /api/funds/:id",
        create: "POST /api/funds",
        update: "PUT /api/funds/:id",
        delete: "DELETE /api/funds/:id",
        categories: "GET /api/funds/categories",
        seed: "POST /api/funds/seed",
      },
      crowdfunding: {
        getCampaigns: "GET /api/crowdfunding/campaigns",
        createCampaign: "POST /api/crowdfunding/campaigns",
        getCampaign: "GET /api/crowdfunding/campaigns/:id",
        invest: "POST /api/crowdfunding/campaigns/:id/invest",
        myCampaigns: "GET /api/crowdfunding/my-campaigns",
        myInvestments: "GET /api/crowdfunding/my-investments",
      },
      creditScoring: {
        calculate: "POST /api/credit-scoring/calculate",
        history: "GET /api/credit-scoring/history",
        latest: "GET /api/credit-scoring/latest",
      },
      ai: {
        financialAdvice: "POST /api/ai/financial-advice",
        analyzeBusinessPlan: "POST /api/ai/analyze-business-plan",
        fundRecommendations: "POST /api/ai/fund-recommendations",
        creditScoreTips: "POST /api/ai/credit-score-tips",
        analyzePitch: "POST /api/ai/analyze-pitch",
        chat: "POST /api/ai/chat",
        query: "POST /api/ai/query",
      },
      sentiment: {
        analyze: "POST /api/sentiment/analyze",
        analyzeReviews: "POST /api/sentiment/analyze-reviews",
        trustScore: "POST /api/sentiment/trust-score",
        campaignDescription: "POST /api/sentiment/campaign-description",
        investorFeedback: "POST /api/sentiment/investor-feedback",
      },
    },
  });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 FemFin AI Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Unable to start server: ", error.message);
    console.error(
      "   Ensure MongoDB is reachable and MONGODB_URI is configured.",
    );
    process.exit(1);
  }
};

startServer();

module.exports = app;
