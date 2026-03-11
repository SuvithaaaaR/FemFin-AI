const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log environment
if (process.env.NODE_ENV === "development") {
  console.log("🔧 Running in development mode");
}

// Routes
const fundRecommendationRoutes = require("./routes/fundRecommendation");
const crowdfundingRoutes = require("./routes/crowdfunding");
const creditScoringRoutes = require("./routes/creditScoring");

app.use("/api/fund-recommendations", fundRecommendationRoutes);
app.use("/api/crowdfunding", crowdfundingRoutes);
app.use("/api/credit-scoring", creditScoringRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "FemFin AI Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});
// Error handling middleware
app.use((err, req, res, next) => {  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FemFin AI Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
