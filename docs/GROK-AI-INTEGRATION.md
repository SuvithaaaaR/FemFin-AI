# 🤖 Grok AI (xAI) Integration Guide

Complete guide for integrating xAI's Grok AI into FemFin AI platform.

---

## 📦 Installation

The required packages have been installed:

```bash
npm install @ai-sdk/xai axios dotenv
```

**Installed Packages:**

- `@ai-sdk/xai` - Official xAI SDK for Grok integration
- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management

---

## 🔑 API Key Setup

### 1. Get Your xAI API Key

1. Visit [xAI Console](https://console.x.ai/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### 2. Add API Key to Environment

Open `backend/.env` and add your xAI API key:

```env
# xAI API Key (for Grok AI)
XAI_API_KEY=your_actual_xai_api_key_here
```

⚠️ **Important**: Replace `your_actual_xai_api_key_here` with your real API key!

---

## 🎯 Available AI Features

### 1. **Financial Advice**

Get personalized financial recommendations for entrepreneurs.

**Endpoint**: `POST /api/ai/financial-advice`

**Request Body**:

```json
{
  "businessType": "E-commerce",
  "monthlyRevenue": "50000",
  "creditScore": "720",
  "fundingNeed": "100000",
  "businessStage": "Growth"
}
```

**Response**:

```json
{
  "success": true,
  "data": "Based on your business profile... [AI advice]"
}
```

---

### 2. **Business Plan Analysis**

Analyze and get feedback on business plans.

**Endpoint**: `POST /api/ai/analyze-business-plan`

**Request Body**:

```json
{
  "businessPlan": "Your complete business plan text here..."
}
```

**Response**:

```json
{
  "success": true,
  "data": "Analysis of your business plan... [AI analysis]"
}
```

---

### 3. **Fund Recommendations**

Get personalized funding source recommendations.

**Endpoint**: `POST /api/ai/fund-recommendations`

**Request Body**:

```json
{
  "industry": "Technology",
  "stage": "Seed",
  "fundingAmount": "250000",
  "location": "San Francisco, CA",
  "businessModel": "SaaS"
}
```

**Response**:

```json
{
  "success": true,
  "data": "Recommended funding sources... [AI recommendations]"
}
```

---

### 4. **Credit Score Improvement Tips**

Get actionable tips to improve credit scores.

**Endpoint**: `POST /api/ai/credit-score-tips`

**Request Body**:

```json
{
  "currentScore": 650,
  "paymentHistory": "Good",
  "outstandingDebt": "15000",
  "creditUtilization": "45",
  "yearsOfHistory": "5"
}
```

**Response**:

```json
{
  "success": true,
  "data": "Tips to improve your credit score... [AI tips]"
}
```

---

### 5. **Investment Pitch Analysis**

Get detailed feedback on investment pitches.

**Endpoint**: `POST /api/ai/analyze-pitch`

**Request Body**:

```json
{
  "pitch": "Your complete investment pitch text here..."
}
```

**Response**:

```json
{
  "success": true,
  "data": "Feedback on your pitch... [AI feedback]"
}
```

---

### 6. **AI Chat**

Have a conversation with Grok AI assistant.

**Endpoint**: `POST /api/ai/chat`

**Request Body**:

```json
{
  "message": "What are the best funding options for women-led startups?",
  "conversationHistory": [
    { "role": "user", "content": "Previous message..." },
    { "role": "assistant", "content": "Previous response..." }
  ]
}
```

**Response**:

```json
{
  "success": true,
  "data": "AI assistant response... [AI chat response]"
}
```

---

### 7. **General AI Query**

Send any custom prompt to Grok.

**Endpoint**: `POST /api/ai/query`

**Request Body**:

```json
{
  "prompt": "Explain venture capital funding for beginners",
  "model": "grok-beta"
}
```

**Response**:

```json
{
  "success": true,
  "data": "AI response to your query... [AI response]"
}
```

---

## 🔐 Authentication

All AI endpoints require authentication. Include JWT token in request headers:

```
Authorization: Bearer <your_jwt_token>
```

---

## 💻 Using xAI Service in Your Code

### Import the Service

```javascript
const xaiService = require("./services/xaiService");
```

### Example: Get Financial Advice

```javascript
const advice = await xaiService.generateFinancialAdvice({
  businessType: "E-commerce",
  monthlyRevenue: "50000",
  creditScore: "720",
  fundingNeed: "100000",
  businessStage: "Growth",
});

console.log(advice);
```

### Example: Analyze Business Plan

```javascript
const analysis = await xaiService.analyzeBusinessPlan(
  "My business plan is to create...",
);

console.log(analysis);
```

### Example: Custom Grok Query

```javascript
const response = await xaiService.generateGrokResponse(
  "What are the top 5 grants for women entrepreneurs in 2026?",
  "grok-beta",
);

console.log(response);
```

---

## 📁 File Structure

```
backend/
├── services/
│   └── xaiService.js          # xAI service with helper functions
├── controllers/
│   └── aiController.js        # AI endpoints controller
├── routes/
│   └── ai.js                  # AI routes
├── .env                       # Environment variables (add XAI_API_KEY)
└── server.js                  # Main server (AI routes registered)
```

---

## 🧪 Testing the Integration

### Test with cURL

```bash
# 1. Login first to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# 2. Use the token to test AI endpoint
curl -X POST http://localhost:5000/api/ai/financial-advice \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "businessType": "E-commerce",
    "monthlyRevenue": "50000",
    "creditScore": "720",
    "fundingNeed": "100000",
    "businessStage": "Growth"
  }'
```

### Test with Postman

1. **Login** → `POST /api/auth/login` → Copy token
2. **Set Headers** → `Authorization: Bearer <token>`
3. **Test AI Endpoint** → `POST /api/ai/financial-advice`
4. **Send Request** → View AI response

---

## ⚙️ Configuration Options

### xAI Service Configuration

**File**: `backend/services/xaiService.js`

```javascript
// Change default model
async function generateGrokResponse(prompt, model = "grok-beta") {
  // Use "grok-2-latest" or other available models
}

// Adjust temperature (0.0 - 1.0)
temperature: 0.7,  // Lower = more focused, Higher = more creative

// Adjust max tokens
max_tokens: 1000,  // Increase for longer responses
```

---

## 🎨 Frontend Integration Example

### Create AI Service (Client)

**File**: `frontend/src/services/aiService.js`

```javascript
import apiClient from "./api";

const aiService = {
  getFinancialAdvice: async (userData) => {
    const response = await apiClient.post("/ai/financial-advice", userData);
    return response.data;
  },

  analyzeBusinessPlan: async (businessPlan) => {
    const response = await apiClient.post("/ai/analyze-business-plan", {
      businessPlan,
    });
    return response.data;
  },

  chat: async (message, conversationHistory) => {
    const response = await apiClient.post("/ai/chat", {
      message,
      conversationHistory,
    });
    return response.data;
  },
};

export default aiService;
```

### Use in React Component

```javascript
import React, { useState } from "react";
import { Button, Textarea, Paper, Text } from "@mantine/core";
import aiService from "../services/aiService";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await aiService.chat(message);
      setResponse(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md">
      <Textarea
        label="Ask Grok AI"
        placeholder="What would you like to know?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSubmit} loading={loading} mt="md">
        Get AI Response
      </Button>
      {response && (
        <Paper p="md" mt="md" withBorder>
          <Text>{response}</Text>
        </Paper>
      )}
    </Paper>
  );
}

export default AIAssistant;
```

---

## 🚨 Error Handling

### Common Errors

**1. Missing API Key**

```
Error: XAI_API_KEY is not set in environment variables
```

**Solution**: Add `XAI_API_KEY` to your `.env` file

**2. Invalid API Key**

```
Error: Authentication failed - Invalid API key
```

**Solution**: Verify your API key is correct in `.env`

**3. Rate Limit Exceeded**

```
Error: Rate limit exceeded
```

**Solution**: Wait before making more requests or upgrade your xAI plan

**4. Unauthorized Access**

```
Error: Not authorized to access this route. Please login.
```

**Solution**: Include JWT token in Authorization header

---

## 💡 Best Practices

1. ✅ **Always validate user input** before sending to AI
2. ✅ **Use environment variables** for API keys
3. ✅ **Implement rate limiting** to prevent API abuse
4. ✅ **Cache responses** for frequently asked questions
5. ✅ **Handle errors gracefully** with user-friendly messages
6. ✅ **Monitor API usage** to stay within limits
7. ✅ **Sanitize AI responses** before displaying to users

---

## 📊 Available Grok Models

- `grok-beta` - Latest beta model (recommended)
- `grok-2-latest` - Grok 2 (stable release)

Check [xAI Documentation](https://docs.x.ai/) for the latest models.

---

## 🔗 Useful Links

- [xAI Console](https://console.x.ai/) - Manage API keys
- [xAI Documentation](https://docs.x.ai/) - Official docs
- [xAI Pricing](https://x.ai/pricing) - Pricing information
- [Grok GitHub](https://github.com/xai-org) - Open source projects

---

## 🆘 Troubleshooting

### Check if xAI is working

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Check if AI routes are registered
curl http://localhost:5000/api
```

### Enable Debug Logging

Add to `backend/services/xaiService.js`:

```javascript
console.log("Sending prompt to Grok:", prompt);
console.log("Using model:", model);
console.log("Response:", response);
```

---

## 📝 Example Use Cases in FemFin AI

1. **Dashboard Widget**: Show AI-generated daily financial tips
2. **Business Plan Wizard**: Real-time AI feedback as users write
3. **Fund Matcher**: AI-powered fund recommendations
4. **Credit Score Page**: Personalized improvement suggestions
5. **Chat Support**: 24/7 AI assistant for user questions
6. **Pitch Review**: Automated pitch deck analysis

---

## 🎉 Next Steps

1. ✅ **Get xAI API key** from console.x.ai
2. ✅ **Add key to .env** file
3. ✅ **Restart server** to load new environment variables
4. ✅ **Test endpoints** with Postman or cURL
5. ✅ **Build frontend components** to use AI features
6. ✅ **Deploy to production** with production API key

---

**Status**: ✅ xAI Integration Complete!  
**Version**: 1.0.0  
**Last Updated**: March 11, 2026
