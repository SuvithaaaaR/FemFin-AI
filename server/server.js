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

// Connect to database (optional)
connectDB();

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

app.use("/api/auth", authRoutes);
app.use("/api/fund-recommendations", fundRecommendationRoutes);
app.use("/api/crowdfunding", crowdfundingRoutes);
app.use("/api/credit-scoring", creditScoringRoutes);

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
    },
  });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FemFin AI Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API documentation: http://localhost:${PORT}/api`);
});

module.exports = app;
