const { createXai } = require("@ai-sdk/xai");
require("dotenv").config();

// Initialize xAI with your API key
const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

/**
 * Generate AI response using Grok
 * @param {string} prompt - The prompt to send to Grok
 * @param {string} model - The model to use (default: grok-beta)
 * @returns {Promise<string>} - The AI response
 */
async function generateGrokResponse(prompt, model = "grok-beta") {
  try {
    const response = await xai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Grok AI:", error.message);
    throw new Error("Failed to generate AI response");
  }
}

/**
 * Generate financial advice using Grok
 * @param {Object} userData - User's financial data
 * @returns {Promise<string>} - Financial advice
 */
async function generateFinancialAdvice(userData) {
  const prompt = `As a financial advisor for women entrepreneurs, provide personalized advice based on the following:
- Business Type: ${userData.businessType || "Not specified"}
- Monthly Revenue: ${userData.monthlyRevenue || "Not specified"}
- Credit Score: ${userData.creditScore || "Not specified"}
- Funding Need: ${userData.fundingNeed || "Not specified"}
- Business Stage: ${userData.businessStage || "Not specified"}

Provide concise, actionable financial recommendations.`;

  return await generateGrokResponse(prompt);
}

/**
 * Analyze business plan using Grok
 * @param {string} businessPlan - The business plan text
 * @returns {Promise<string>} - Analysis and feedback
 */
async function analyzeBusinessPlan(businessPlan) {
  const prompt = `Analyze this business plan and provide constructive feedback:

${businessPlan}

Focus on:
1. Strengths and opportunities
2. Potential risks and challenges
3. Financial viability
4. Market potential
5. Recommendations for improvement`;

  return await generateGrokResponse(prompt);
}

/**
 * Generate fund matching recommendations
 * @param {Object} businessProfile - Business profile data
 * @returns {Promise<string>} - Fund recommendations
 */
async function generateFundRecommendations(
  businessProfile,
  fundCatalogContext = "",
) {
  const catalogSection = fundCatalogContext
    ? `Use ONLY the following FemFin fund catalog entries when recommending matches. Reference the fund names exactly as provided and avoid inventing new programs.\n\n${fundCatalogContext}`
    : "No catalog provided. Give general guidance but note that the live catalog is unavailable.";

  const prompt = `You are FemFin AI, guiding women founders toward the best available funds. Analyze the applicant profile and recommend up to three funding options from the catalog.

Applicant Profile:
- Industry: ${businessProfile.industry || "Not specified"}
- Stage: ${businessProfile.stage || "Not specified"}
- Funding Need: ₹${businessProfile.fundingAmount || "Not specified"}
- Location: ${businessProfile.location || "Not specified"}
- Business Model: ${businessProfile.businessModel || "Not specified"}

${catalogSection}

Response instructions:
1. Recommend up to three funds from the catalog (no made-up names).
2. For each, include Match Score (/100), why it fits, indicative funding window, and immediate next steps (application portal or documentation focus).
3. Close with a short summary that reinforces the best next action.
4. Format as:
Recommendation 1: <Fund Name>
- Match Score: xx/100
- Why: ...
- Funding Window: ...
- Next Steps: ...

Recommendation 2: ...

Summary: ...`;

  return await generateGrokResponse(prompt);
}

/**
 * Generate credit score improvement tips
 * @param {number} currentScore - Current credit score
 * @param {Object} financialHistory - Financial history data
 * @returns {Promise<string>} - Improvement tips
 */
async function generateCreditScoreTips(currentScore, financialHistory) {
  const prompt = `Provide actionable tips to improve a credit score of ${currentScore}.
Financial History:
- Payment History: ${financialHistory.paymentHistory || "Not specified"}
- Outstanding Debt: $${financialHistory.outstandingDebt || "Not specified"}
- Credit Utilization: ${financialHistory.creditUtilization || "Not specified"}%
- Years of Credit History: ${financialHistory.yearsOfHistory || "Not specified"}

Give 5-7 specific, practical steps to improve the credit score.`;

  return await generateGrokResponse(prompt);
}

/**
 * Generate investment pitch feedback
 * @param {string} pitch - The investment pitch text
 * @returns {Promise<string>} - Feedback and suggestions
 */
async function analyzePitch(pitch) {
  const prompt = `Review this investment pitch and provide detailed feedback:

${pitch}

Evaluate:
1. Clarity and persuasiveness
2. Problem-solution fit
3. Market opportunity presentation
4. Financial projections credibility
5. Team credibility
6. Ask and use of funds
7. Suggestions for improvement`;

  return await generateGrokResponse(prompt);
}

/**
 * Chat with Grok (general conversation)
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages
 * @returns {Promise<string>} - AI response
 */
async function chatWithGrok(message, conversationHistory = []) {
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant for FemFin AI, a platform that helps women entrepreneurs with funding and financial advice.",
      },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await xai.chat.completions.create({
      model: "grok-beta",
      messages: messages,
      temperature: 0.8,
      max_tokens: 1500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chat:", error.message);
    throw new Error("Failed to process chat message");
  }
}

module.exports = {
  generateGrokResponse,
  generateFinancialAdvice,
  analyzeBusinessPlan,
  generateFundRecommendations,
  generateCreditScoreTips,
  analyzePitch,
  chatWithGrok,
};
