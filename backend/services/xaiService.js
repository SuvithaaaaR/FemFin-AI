const axios = require("axios");
const { generateText } = require("ai");
const { createXai } = require("@ai-sdk/xai");
require("dotenv").config();

const FALLBACK_XAI_API_KEY =
  "xai-tG0aM3KpSlhQxA6UcuBDfdGmQHS22P38AEMsMVVxU5soSZwIpaOPOZvUdlCVvREMs4uwUU2KQm6aB6no";
const RESOLVED_XAI_API_KEY = process.env.XAI_API_KEY || FALLBACK_XAI_API_KEY;

// Initialize xAI with your API key
const xai = createXai({
  apiKey: RESOLVED_XAI_API_KEY,
});

const AI_PROVIDER = (process.env.AI_PROVIDER || "grok").toLowerCase();
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const DEFAULT_MODEL = process.env.XAI_MODEL || "grok-2-latest";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 120000);

const useOllama = () => AI_PROVIDER === "ollama";

const resolveModel = (modelName) => {
  try {
    return xai(modelName || DEFAULT_MODEL);
  } catch (error) {
    console.warn(
      `Invalid model '${modelName}', falling back to ${DEFAULT_MODEL}`,
    );
    return xai(DEFAULT_MODEL);
  }
};

const buildModelCandidates = (requestedModel) => {
  const candidates = [
    requestedModel,
    process.env.XAI_MODEL,
    "grok-2-latest",
    "grok-2",
    "grok-beta",
  ]
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return [...new Set(candidates)];
};

const generateOllamaResponse = async (
  prompt,
  { temperature = 0.7, maxTokens = 1000 } = {},
) => {
  const response = await axios.post(
    `${OLLAMA_URL}/api/generate`,
    {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens,
      },
    },
    {
      timeout: AI_TIMEOUT_MS,
    },
  );

  const text = response?.data?.response;
  if (!text || typeof text !== "string") {
    throw new Error("Invalid response from Ollama");
  }

  return text.trim();
};

const chatWithOllama = async (
  messages,
  { temperature = 0.8, maxTokens = 1500 } = {},
) => {
  const response = await axios.post(
    `${OLLAMA_URL}/api/chat`,
    {
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens,
      },
    },
    {
      timeout: AI_TIMEOUT_MS,
    },
  );

  const text = response?.data?.message?.content;
  if (!text || typeof text !== "string") {
    throw new Error("Invalid chat response from Ollama");
  }

  return text.trim();
};

/**
 * Generate AI response using Grok
 * @param {string} prompt - The prompt to send to Grok
 * @param {string} model - The model to use (default: grok-beta)
 * @returns {Promise<string>} - The AI response
 */
async function generateGrokResponse(
  prompt,
  model = "grok-beta",
  options = {},
) {
  const resolvedMaxTokens = Number(options?.maxTokens || 1000);
  const resolvedTemperature =
    typeof options?.temperature === "number" ? options.temperature : 0.7;

  try {
    if (useOllama()) {
      return await generateOllamaResponse(prompt, {
        temperature: resolvedTemperature,
        maxTokens: resolvedMaxTokens,
      });
    }

    const modelCandidates = buildModelCandidates(model || DEFAULT_MODEL);
    const failures = [];

    for (const candidate of modelCandidates) {
      try {
        const { text } = await generateText({
          model: resolveModel(candidate),
          prompt,
          temperature: resolvedTemperature,
          maxTokens: resolvedMaxTokens,
        });

        return text;
      } catch (modelError) {
        failures.push(`${candidate}: ${modelError.message}`);
      }
    }

    throw new Error(`All Grok model attempts failed. ${failures.join(" | ")}`);
  } catch (error) {
    const providerName = useOllama() ? "Ollama" : "Grok";
    console.error(`Error calling ${providerName} AI:`, error.message);

    const message = String(error?.message || "").toLowerCase();
    if (
      message.includes("doesn't have any credits") ||
      message.includes("does not have permission") ||
      message.includes("credits or licenses")
    ) {
      throw new Error(
        "xAI account has no active credits/license. Add credits in xAI console and retry.",
      );
    }

    if (message.includes("model not found")) {
      throw new Error(
        "Configured Grok model is unavailable for this xAI account. Update to an allowed model and retry.",
      );
    }

    throw new Error(
      `Failed to generate AI response via ${providerName}. Verify provider configuration and API credentials.`,
    );
  }
}

const getAiStatus = () => {
  const grokConfigured = Boolean(RESOLVED_XAI_API_KEY);
  const modelCandidates = buildModelCandidates(DEFAULT_MODEL);
  return {
    provider: AI_PROVIDER,
    ready: useOllama() || grokConfigured,
    model: useOllama() ? OLLAMA_MODEL : modelCandidates[0],
    modelCandidates: useOllama() ? [OLLAMA_MODEL] : modelCandidates,
    grokConfigured,
    ollamaUrl: useOllama() ? OLLAMA_URL : null,
  };
};

const isAiReady = () => getAiStatus().ready;

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

    const normalizedMessages = messages
      .filter((msg) => msg && typeof msg.content === "string")
      .map((msg) => ({
        role:
          msg.role === "assistant"
            ? "assistant"
            : msg.role === "system"
              ? "system"
              : "user",
        content: msg.content,
      }));

    if (useOllama()) {
      return await chatWithOllama(normalizedMessages, {
        temperature: 0.8,
        maxTokens: 1500,
      });
    }

    const { text } = await generateText({
      model: resolveModel(DEFAULT_MODEL),
      messages: normalizedMessages,
      temperature: 0.8,
      maxTokens: 1500,
    });

    return text;
  } catch (error) {
    const providerName = useOllama() ? "Ollama" : "Grok";
    console.error(`Error in ${providerName} chat:`, error.message);
    throw new Error(`Failed to process chat message via ${providerName}`);
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
  getAiStatus,
  isAiReady,
};
