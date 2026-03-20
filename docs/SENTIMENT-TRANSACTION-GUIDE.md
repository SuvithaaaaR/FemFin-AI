# 📊 Sentiment Analysis & Transaction Data Integration

Complete guide for sentiment analysis and transaction data features in FemFin AI.

---

## 📦 Installed Packages

```bash
npm install axios cheerio sentiment
```

**Packages:**

- `axios` (v1.x) - HTTP client for fetching transaction data from APIs
- `cheerio` (v1.x) - HTML parsing for web scraping
- `sentiment` (v5.x) - Natural language sentiment analysis

---

## 🎯 Features Overview

### 1. **Sentiment Analysis**

- Analyze reviews and feedback sentiment
- Calculate trust scores from business reviews
- Evaluate campaign descriptions
- Assess investor confidence

### 2. **Transaction Data Analysis**

- Fetch transaction data from banking APIs
- Analyze spending patterns
- Calculate payment consistency
- Determine savings rates

### 3. **Enhanced Credit Scoring**

- Traditional credit factors
- Transaction pattern analysis
- Payment history evaluation
- Comprehensive financial assessment

---

## 🔐 Authentication

All endpoints require JWT authentication. Include token in headers:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 Sentiment Analysis Endpoints

### 1. Analyze Text Sentiment

**Endpoint**: `POST /api/sentiment/analyze`

**Request Body**:

```json
{
  "text": "This business has excellent customer service and delivery is always on time!"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "score": 8,
    "comparative": 0.8,
    "category": "positive",
    "positiveWords": ["excellent", "always"],
    "negativeWords": [],
    "wordCount": 12
  }
}
```

**Sentiment Categories:**

- `positive` - Score > 0
- `negative` - Score < 0
- `neutral` - Score = 0

---

### 2. Analyze Multiple Reviews

**Endpoint**: `POST /api/sentiment/analyze-reviews`

**Request Body**:

```json
{
  "reviews": [
    "Great product and fast delivery!",
    "Excellent customer service",
    "Good quality but a bit expensive",
    "Not satisfied with the packaging"
  ]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "totalReviews": 4,
    "averageScore": 2.5,
    "averageComparative": 0.25,
    "sentiment": {
      "positive": 3,
      "negative": 1,
      "neutral": 0
    },
    "percentages": {
      "positive": "75.00",
      "negative": "25.00",
      "neutral": "0.00"
    },
    "overallSentiment": "positive"
  }
}
```

---

### 3. Calculate Trust Score

**Endpoint**: `POST /api/sentiment/trust-score`

**Request Body**:

```json
{
  "reviews": [
    { "text": "Amazing experience, highly recommend!" },
    { "text": "Professional and reliable service" },
    { "text": "Good product quality" },
    { "text": "Fast shipping and good communication" }
  ]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "trustScore": 82.5,
    "totalReviews": 4,
    "sentimentBreakdown": {
      "positive": 4,
      "negative": 0,
      "neutral": 0
    },
    "percentages": {
      "positive": "100.00",
      "negative": "0.00",
      "neutral": "0.00"
    },
    "overallSentiment": "positive",
    "averageScore": "5.25",
    "recommendation": "Highly Trustworthy"
  }
}
```

**Trust Score Ratings:**

- **75-100**: Highly Trustworthy
- **50-74**: Generally Trustworthy
- **25-49**: Moderately Trustworthy
- **0-24**: Requires Caution

---

### 4. Analyze Campaign Description

**Endpoint**: `POST /api/sentiment/campaign-description`

**Request Body**:

```json
{
  "description": "We are building an innovative platform to empower women entrepreneurs with access to funding and resources. Join us in creating positive change!"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "score": 6,
    "comparative": 0.3,
    "category": "positive",
    "positiveWords": ["innovative", "empower", "positive"],
    "negativeWords": [],
    "wordCount": 20,
    "isEngaging": true,
    "recommendation": "Description has positive sentiment - good for attracting investors"
  }
}
```

---

### 5. Analyze Investor Feedback

**Endpoint**: `POST /api/sentiment/investor-feedback`

**Request Body**:

```json
{
  "feedbacks": [
    "Strong business model with clear growth potential",
    "Impressive team and execution strategy",
    "Concerned about market competition",
    "Excellent presentation and vision"
  ]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "totalReviews": 4,
    "averageScore": 3.5,
    "sentiment": {
      "positive": 3,
      "negative": 1,
      "neutral": 0
    },
    "overallSentiment": "positive",
    "insights": {
      "investorConfidence": "High",
      "concerns": "Some negative feedback detected",
      "recommendation": "Strong investor sentiment - continue current strategy"
    }
  }
}
```

---

## 💳 Credit Score with Transaction Data

### Enhanced Credit Scoring Service

**File**: `backend/services/creditScoreService.js`

**Functions:**

1. `calculateCreditScore(financialData)` - Traditional credit score calculation
2. `fetchTransactionData(userId)` - Fetch transactions from banking APIs
3. `analyzeTransactionPatterns(transactions)` - Analyze spending/income patterns
4. `calculateComprehensiveCreditScore(userId, financialData)` - Complete assessment

---

### Credit Score Calculation

**Factors (300-850 range):**

1. **Payment History (35%)**
   - On-time payment rate
   - Late payment penalties
   - Missed payment penalties

2. **Credit Utilization (30%)**
   - Percentage of credit used
   - Ideal: < 30%

3. **Credit Age (15%)**
   - Length of credit history
   - Longer history = better score

4. **Account Mix (10%)**
   - Variety of credit types
   - Revolving, installment, etc.

5. **Recent Inquiries (10%)**
   - Hard credit checks
   - Fewer = better

---

### Transaction Pattern Analysis

**Analyzed Metrics:**

- Total transaction count
- Average monthly spending
- Total income vs spending
- Savings rate percentage
- Bill payment consistency
- On-time payment rate

---

### Example: Calculate Credit Score with Transactions

```javascript
const creditScoreService = require("./services/creditScoreService");

const financialData = {
  paymentHistory: [
    { status: "on-time", amount: 500 },
    { status: "on-time", amount: 500 },
    { status: "late", amount: 500 },
  ],
  creditUtilization: 25, // 25%
  creditAge: 5, // 5 years
  accountTypes: ["credit-card", "loan", "mortgage"],
  recentInquiries: 2,
  totalDebt: 50000,
  income: 100000,
  savingsBalance: 30000,
};

// Calculate comprehensive score
const result = await creditScoreService.calculateComprehensiveCreditScore(
  "user-id-123",
  financialData,
);

console.log(result);
// Output:
// {
//   score: 720,
//   rating: "Good",
//   factors: { ... },
//   transactionAnalysis: { ... },
//   recommendations: [ ... ]
// }
```

---

## 🔍 Use Cases

### 1. **Business Trust Verification**

```javascript
// Collect business reviews from Google, Yelp, etc.
const reviews = [
  { text: "Great service!" },
  { text: "Professional and reliable" },
  // ... more reviews
];

// Calculate trust score
POST /api/sentiment/trust-score
{
  "reviews": reviews
}

// Use trust score in:
// - Loan approval decisions
// - Campaign verification
// - Investor confidence metrics
```

---

### 2. **Campaign Quality Assessment**

```javascript
// Analyze campaign description before publishing
POST /api/sentiment/campaign-description
{
  "description": "Your campaign description here..."
}

// Get recommendations to improve:
// - Language positivity
// - Engagement potential
// - Investor appeal
```

---

### 3. **Credit Score Enhancement**

```javascript
// Traditional credit factors + Transaction data
const comprehensiveScore = await calculateComprehensiveCreditScore(
  userId,
  {
    paymentHistory: [...],
    creditUtilization: 25,
    creditAge: 5,
    // ... other factors
  }
);

// Get detailed breakdown:
// - Score: 720
// - Rating: Good
// - Transaction patterns
// - Improvement recommendations
```

---

### 4. **Investor Sentiment Tracking**

```javascript
// Track investor feedback over time
POST /api/sentiment/investor-feedback
{
  "feedbacks": [
    "Impressed with the pitch",
    "Strong team",
    "Market fit looks good"
  ]
}

// Monitor:
// - Investor confidence trends
// - Concern detection
// - Success indicators
```

---

## 📊 Integration Examples

### Frontend React Component

```javascript
import React, { useState } from "react";
import { Button, Textarea, Paper, Text, Progress } from "@mantine/core";
import axios from "axios";

function TrustScoreChecker() {
  const [reviews, setReviews] = useState("");
  const [trustScore, setTrustScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeTrust = async () => {
    setLoading(true);
    try {
      const reviewArray = reviews.split("\n").filter((r) => r.trim());
      const reviewObjects = reviewArray.map((text) => ({ text }));

      const response = await axios.post(
        "/api/sentiment/trust-score",
        { reviews: reviewObjects },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setTrustScore(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md">
      <Textarea
        label="Enter Reviews (one per line)"
        placeholder="Great service!&#10;Fast delivery&#10;..."
        rows={6}
        value={reviews}
        onChange={(e) => setReviews(e.target.value)}
      />

      <Button onClick={analyzeTrust} loading={loading} mt="md">
        Calculate Trust Score
      </Button>

      {trustScore && (
        <Paper p="md" mt="md" withBorder>
          <Text size="xl" weight={700}>
            Trust Score: {trustScore.trustScore}%
          </Text>
          <Progress value={trustScore.trustScore} mt="xs" mb="md" />

          <Text weight={500}>{trustScore.recommendation}</Text>

          <Text size="sm" mt="md">
            Positive: {trustScore.percentages.positive}% | Negative:{" "}
            {trustScore.percentages.negative}%
          </Text>
        </Paper>
      )}
    </Paper>
  );
}

export default TrustScoreChecker;
```

---

## 🔗 External API Integration

### Banking/Transaction APIs (Production)

Replace mock data with real API integrations:

**Popular APIs:**

- **Plaid** - Banking and transaction data
- **Yodlee** - Financial aggregation
- **Finicity** - Credit and banking data
- **TrueLayer** - Open banking API

**Example: Plaid Integration**

```javascript
const axios = require("axios");

async function fetchTransactionData(userId, accessToken) {
  try {
    const response = await axios.post(
      "https://development.plaid.com/transactions/get",
      {
        access_token: accessToken,
        start_date: "2025-01-01",
        end_date: "2026-03-11",
      },
      {
        headers: {
          "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
          "PLAID-SECRET": process.env.PLAID_SECRET,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
```

---

## 📈 Performance Tips

1. **Cache Sentiment Results**

   ```javascript
   // Cache frequently analyzed texts
   const cache = new Map();

   function analyzeSentimentCached(text) {
     if (cache.has(text)) return cache.get(text);
     const result = analyzeSentiment(text);
     cache.set(text, result);
     return result;
   }
   ```

2. **Batch Analysis**

   ```javascript
   // Analyze multiple items in one request
   POST / api / sentiment / analyze - reviews;
   // Instead of calling /api/sentiment/analyze multiple times
   ```

3. **Async Processing**

   ```javascript
   // For large datasets, use background jobs
   const bull = require("bull");
   const sentimentQueue = new bull("sentiment-analysis");

   sentimentQueue.process(async (job) => {
     return analyzeSentiment(job.data.text);
   });
   ```

---

## 🛠️ Testing

### Test Sentiment Analysis

```bash
# Login first
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token')

# Test sentiment analysis
curl -X POST http://localhost:5000/api/sentiment/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"text":"This is an excellent product with amazing quality!"}'
```

### Test Trust Score

```bash
curl -X POST http://localhost:5000/api/sentiment/trust-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "reviews": [
      {"text": "Great service!"},
      {"text": "Professional team"},
      {"text": "Fast delivery"}
    ]
  }'
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Empty Sentiment Results**

```
Issue: Score is always 0
Solution: Ensure text contains recognizable sentiment words
```

**2. Transaction Data Not Loading**

```
Issue: fetchTransactionData returns empty array
Solution: Check API credentials and user permissions
```

**3. Trust Score Too Low**

```
Issue: Trust score lower than expected
Solution: Ensure reviews contain positive keywords and sufficient volume
```

---

## 📚 File Structure

```
backend/
├── services/
│   ├── sentimentService.js      # Sentiment analysis functions
│   └── creditScoreService.js    # Credit score + transactions
├── controllers/
│   └── sentimentController.js   # Sentiment endpoints
├── routes/
│   └── sentiment.js             # Sentiment routes
└── server.js                    # Updated with sentiment routes
```

---

## 🎯 Next Steps

1. ✅ **Test Endpoints** - Use Postman to test all sentiment endpoints
2. ✅ **Integrate Frontend** - Create UI components for sentiment analysis
3. ✅ **Connect Banking APIs** - Replace mock transaction data
4. ✅ **Add Caching** - Implement Redis for sentiment result caching
5. ✅ **Create Dashboard** - Build analytics dashboard for trust scores

---

## 📊 Benefits

### For Entrepreneurs:

- ✅ Improve campaign descriptions with sentiment feedback
- ✅ Monitor business reputation through review analysis
- ✅ Get credit scores based on transaction patterns

### For Investors:

- ✅ Verify business trustworthiness before investing
- ✅ Analyze campaign sentiment for quality assessment
- ✅ Track sentiment trends over time

### For Platform:

- ✅ Automated quality control for campaigns
- ✅ Enhanced credit scoring accuracy
- ✅ Data-driven trust metrics

---

**Status**: ✅ Sentiment Analysis & Transaction Data Integration Complete!  
**Version**: 1.0.0  
**Last Updated**: March 11, 2026
