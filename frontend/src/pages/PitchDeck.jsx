import React, { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSparkles } from "@tabler/icons-react";
import PitchDeckForm from "../components/PitchDeck/PitchDeckForm";
import SlidePreview from "../components/PitchDeck/SlidePreview";
import PDFGenerator from "../components/PitchDeck/PDFGenerator";
import indiaStats from "../data/indiaStats.json";
import indiaInvestors from "../data/indiaInvestors.json";
import template from "../utils/pitchDeckTemplate.json";
import { generatePitchDeckPdf } from "../utils/pdfGenerator";
import apiClient from "../services/api";

const formatInr = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const slugify = (value) =>
  (value || "pitch-deck")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapIndustryToKey = (industry) => {
  if (!industry || typeof industry !== "string") {
    return "agritech";
  }
  const normalized = industry.trim().toLowerCase();
  if (normalized.includes("food") || normalized.includes("beverage")) {
    return "food";
  }
  if (normalized.includes("social")) {
    return "social";
  }
  if (normalized.includes("retail")) {
    return "retail";
  }
  if (normalized.includes("agri")) {
    return "agritech";
  }

  const directKey = normalized.replace(/[^a-z0-9]/g, "");
  const availableKey = Object.keys(indiaStats).find(
    (key) => key.replace(/[^a-z0-9]/g, "") === directKey,
  );

  return availableKey || "agritech";
};

const normalizeText = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed || fallback;
};

const normalizeNumericSeries = (series = []) =>
  series
    .map((item) => {
      const label =
        typeof item?.label === "string" ? item.label.trim() : String(item?.label || "").trim();
      const value = Number(item?.value);

      if (!label || Number.isNaN(value)) {
        return null;
      }

      return { label, value };
    })
    .filter(Boolean)
    .slice(0, 6);

const normalizeChartData = (chartData) => {
  if (!chartData || typeof chartData !== "object") {
    return null;
  }

  const title =
    typeof chartData.title === "string" && chartData.title.trim()
      ? chartData.title.trim()
      : "Key Metrics";
  const type = chartData.type === "line" ? "line" : "bar";
  const series = normalizeNumericSeries(chartData.series || []);

  if (!series.length) {
    return null;
  }

  return { title, type, series };
};

const parseJsonFromResponse = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    return null;
  }

  try {
    return JSON.parse(rawText);
  } catch (error) {
    // Try extracting JSON from markdown or mixed text response.
  }

  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    try {
      return JSON.parse(fencedMatch[1]);
    } catch (error) {
      // Continue to fallback parsing.
    }
  }

  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const possibleJson = rawText.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(possibleJson);
    } catch (error) {
      return null;
    }
  }

  return null;
};

const getInitialInvestorData = () => {
  if (typeof window === "undefined") {
    return indiaInvestors;
  }

  try {
    const stored = localStorage.getItem("pitchDeckInvestorData");
    if (!stored) {
      return indiaInvestors;
    }

    const parsed = JSON.parse(stored);
    return parsed && Array.isArray(parsed.networks) ? parsed : indiaInvestors;
  } catch (error) {
    return indiaInvestors;
  }
};

const parseTicketValue = (token) => {
  if (!token) {
    return null;
  }

  const cleaned = token.replace(/[₹,\s]/g, "");
  const match = cleaned.match(/([0-9]*\.?[0-9]+)([A-Za-z]*)/);
  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  const unit = (match[2] || "").toLowerCase();

  if (Number.isNaN(value)) {
    return null;
  }

  if (unit === "cr") {
    return value * 10000000;
  }
  if (unit === "l") {
    return value * 100000;
  }
  if (unit === "k") {
    return value * 1000;
  }

  return value;
};

const parseTicketRange = (rangeText) => {
  if (!rangeText || typeof rangeText !== "string") {
    return { min: null, max: null };
  }

  const [minToken, maxToken] = rangeText.split("-");
  return {
    min: parseTicketValue(minToken),
    max: parseTicketValue(maxToken),
  };
};

const hasIndustryMatch = (industry, focus = []) => {
  const normalizedIndustry = (industry || "").toLowerCase();
  const normalizedFocus = focus.map((item) => item.toLowerCase());

  if (!normalizedIndustry) {
    return false;
  }

  return normalizedFocus.some((item) => {
    return (
      item.includes(normalizedIndustry) ||
      normalizedIndustry.includes(item) ||
      (normalizedIndustry.includes("food") &&
        (item.includes("consumer") || item.includes("retail"))) ||
      (normalizedIndustry.includes("agri") && item.includes("saa"))
    );
  });
};

function PitchDeckPage() {
  const [loading, setLoading] = useState(false);
  const [deckSlides, setDeckSlides] = useState([]);
  const [deckFinancialTable, setDeckFinancialTable] = useState([]);
  const [useGrokEnhancement, setUseGrokEnhancement] = useState(true);
  const [aiMatchedInvestors, setAiMatchedInvestors] = useState([]);
  const [investorData] = useState(() => getInitialInvestorData());
  const [formValues, setFormValues] = useState({
    companyName: "",
    problem: "",
    solution: "",
    fundingAskAmount: 2500000,
    equityOffered: "10%",
    industry: "AgriTech",
    contact: "",
    tagline: "Helping women founders scale investor-ready ventures",
    traction: "",
    marketInsight: "",
    team: "Founder-led execution with domain and field experience",
  });

  const industryKey = mapIndustryToKey(formValues.industry);
  const industryInsight = indiaStats[industryKey] || indiaStats.agritech;

  const askLabel = `${formatInr(formValues.fundingAskAmount)} for ${formValues.equityOffered}`;

  const ruleMatchedInvestors = useMemo(() => {
    const askAmount = Number(formValues.fundingAskAmount || 0);

    const scored = (investorData.networks || []).map((network) => {
      const { min, max } = parseTicketRange(network.ticketSize);
      const ticketMatch =
        askAmount > 0 && min !== null && max !== null
          ? askAmount >= min && askAmount <= max
          : false;
      const industryMatch = hasIndustryMatch(
        formValues.industry,
        network.focus,
      );
      const score =
        (network.womenFocus ? 3 : 0) +
        (industryMatch ? 3 : 0) +
        (ticketMatch ? 2 : 0) +
        (network.responseTime ? 1 : 0);

      return {
        ...network,
        score,
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [formValues.fundingAskAmount, formValues.industry, investorData]);

  const matchedInvestors = useMemo(() => {
    if (aiMatchedInvestors.length > 0) {
      return aiMatchedInvestors;
    }
    return ruleMatchedInvestors;
  }, [aiMatchedInvestors, ruleMatchedInvestors]);

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutoFill = () => {
    setFormValues((prev) => ({
      ...prev,
      marketInsight: `${industryInsight.market} addressable market | ${industryInsight.tnLoss} pain point | ${industryInsight.farmers}`,
      traction: industryInsight.sampleTraction,
      team: "Women-led founding team with local field partnerships and product build capability",
      tagline: `${prev.companyName || "Your startup"} is reducing business risk with practical, scalable technology`,
    }));

    notifications.show({
      title: "AI Auto-Fill Complete",
      message: "India market stats, traction and story points were added.",
      color: "pink",
    });
  };

  const generatedSlides = useMemo(() => {
    if (!deckSlides.length) {
      return [];
    }
    return deckSlides;
  }, [deckSlides]);

  const buildFinancialProjection = () => {
    const askAmount = Number(formValues.fundingAskAmount || 0);
    const year1Revenue = Math.max(Math.round(askAmount * 1.5), 20000000);
    const year2Revenue = Math.round(year1Revenue * 2.7);
    const year3Revenue = Math.round(year2Revenue * 2.4);
    const monthlyBurn = Math.max(Math.round(askAmount * 0.06), 900000);
    const runwayMonths = Math.max(Math.round(askAmount / monthlyBurn), 12);

    return {
      year1Revenue,
      year2Revenue,
      year3Revenue,
      monthlyBurn,
      runwayMonths,
      financialTable: [
        ["Year 1", formatInr(year1Revenue)],
        ["Year 2", formatInr(year2Revenue)],
        ["Year 3", formatInr(year3Revenue)],
      ],
    };
  };

  const buildSlidePayload = (title) => {
    const industryStoryIndexMap = {
      agritech: 0,
      social: 1,
      retail: 2,
    };
    const storyIndex = Math.min(
      industryStoryIndexMap[industryKey] ?? 0,
      indiaStats.successStories.length - 1,
    );
    const story =
      indiaStats.successStories[storyIndex] || indiaStats.successStories[0];
    const investors =
      matchedInvestors.length > 0
        ? matchedInvestors
            .slice(0, 3)
            .map((item) => item.name)
            .join(", ")
        : indiaStats.investors.join(", ");
    const {
      year1Revenue,
      year2Revenue,
      year3Revenue,
      monthlyBurn,
      runwayMonths,
    } = buildFinancialProjection();

    const companyName = normalizeText(
      formValues.companyName,
      "Your Startup Name",
    );
    const problemText = normalizeText(
      formValues.problem,
      "Problem statement not provided",
    );
    const solutionNarrative = normalizeText(
      formValues.solution,
      "Solution statement not provided",
    );
    const contactText = normalizeText(formValues.contact, "founder@email.com");
    const teamText = normalizeText(
      formValues.team,
      "Founder-led execution with domain and field experience",
    );
    const tractionText = normalizeText(
      formValues.traction,
      "Pilot traction details not provided",
    );

    const marketSeries = [
      { label: "TAM", value: 100 },
      { label: "SAM", value: 22 },
      { label: "SOM Yr3", value: 2.5 },
    ];

    const revenueSeries = [
      { label: "Year 1", value: year1Revenue },
      { label: "Year 2", value: year2Revenue },
      { label: "Year 3", value: year3Revenue },
    ];

    const useOfFundsSeries = [
      { label: "Product", value: 45 },
      { label: "GTM", value: 35 },
      { label: "Ops+Talent", value: 20 },
    ];

    const map = {
      Cover: {
        points: [
          `${companyName} is positioned as a high-conviction ${normalizeText(formValues.industry, "technology-enabled")} venture designed to solve a large, recurring, and measurable business pain point in India.`,
          `Core proposition: ${solutionNarrative}. This directly addresses the founder-identified problem: ${problemText}.`,
          `Fundraise target: ${askLabel}. Capital is intended to accelerate product readiness, commercial execution, and repeatable growth systems with disciplined governance.`,
          `Investment thesis: a women-led execution team, clear regional wedge, and scalable operating playbooks that reduce go-to-market uncertainty in early expansion cycles.`,
          `Contact: ${contactText}.`,
        ],
      },
      Problem: {
        points: [
          `Primary pain point: ${problemText}.`,
          `Market inefficiency signal: ${industryInsight.tnLoss} in economic value is impacted annually in the target context, indicating urgency and budget availability for better solutions.`,
          "Legacy options are fragmented and operationally slow, which increases decision lag, avoidable loss, and inconsistent quality outcomes for customers and channel partners.",
          "Women founders also face trust and access friction in early commercialization, making structured, data-backed execution an important competitive advantage.",
          "Without intervention, customers continue to incur hidden costs in rework, delayed action, and missed revenue opportunities; this creates a strong willingness-to-pay dynamic.",
        ],
      },
      Solution: {
        points: [
          `Solution architecture: ${solutionNarrative}.`,
          "Product stack combines structured data capture, insight generation, and operator-friendly dashboards to enable faster and higher-quality decisions at the point of execution.",
          "Deployment model prioritizes low onboarding friction, regionally adapted workflows, and measurable KPI tracking from day one to improve adoption and retention outcomes.",
          "Differentiation is built through domain-specific data loops, implementation templates, and continuously improving recommendations that compound over time.",
          "The roadmap supports modular expansion so enterprise clients can start with a focused use-case and scale adoption across adjacent operational functions.",
        ],
      },
      Market: {
        points: [
          `Top-down opportunity sizing: ${industryInsight.market} TAM with staged penetration through a focused SAM and pragmatic SOM trajectory.`,
          "Execution model assumes concentrated district-level entry, partner-led trust building, and category-specific messaging to shorten sales cycles in early geographies.",
          "SAM planning uses operationally reachable customer clusters and prioritized vertical segments where pain intensity and budget alignment are both high.",
          "Three-year SOM target is conservative by design, with growth driven by repeatable acquisition channels and improving conversion/retention economics.",
          `Market context note: ${formValues.marketInsight || `${industryInsight.market} with sustained structural demand signals`}.`,
        ],
        chartData: {
          title: "Market Funnel (Indexed)",
          type: "bar",
          series: marketSeries,
        },
      },
      "Business Model": {
        points: [
          "Revenue architecture blends recurring subscription, onboarding services, and higher-value premium analytics modules for enterprise and growth-stage customers.",
          "Pricing strategy is designed to be affordable for first adoption while preserving expansion headroom through volume, feature, and workflow depth upgrades.",
          "Unit economics improve as implementation playbooks mature, reducing support intensity and increasing gross margin contribution across each additional customer cohort.",
          "Sales model combines direct founder-led enterprise closes in early stages with channel-assisted acquisition to scale coverage efficiently.",
          "Retention strategy is outcome-led: customers continue because the platform improves measurable business KPIs, not because of short-term discounts.",
        ],
      },
      Traction: {
        points: [
          `Current traction signal: ${tractionText}.`,
          `Category validation: ${story}`,
          "Pipeline quality has improved through warm ecosystem introductions and problem-first positioning, enabling higher-probability conversations with decision-makers.",
          "Early usage feedback indicates quantifiable productivity and cost improvements, supporting stronger case studies for enterprise and partner distribution.",
          "Execution cadence emphasizes milestone tracking, weekly metric reviews, and tight founder involvement to accelerate pilot-to-paid conversion learning cycles.",
        ],
      },
      Competition: {
        points: [
          "Competitive landscape includes legacy manual workflows, generic software tools, and emerging vertical operators with limited local execution depth.",
          "Positioning advantage: tailored domain relevance, faster implementation timelines, and measurable ROI communication that resonates with budget owners.",
          "Strategic moat compounds through proprietary workflow data, contextual recommendations, and implementation know-how embedded into operating playbooks.",
          "Our comparative edge is strongest where customers need reliability and measurable outcomes rather than feature-heavy but operationally shallow alternatives.",
          "Defensive strategy includes customer success rigor, partner ecosystems, and staged product depth that increases switching friction over time.",
        ],
      },
      "Go-to-Market": {
        points: [
          "Primary channels: women founder networks, district entrepreneurship ecosystems, and targeted institutional partnerships with high-trust community anchors.",
          "Geographic sequencing starts with high-intensity Tamil Nadu clusters, followed by replication to similar demand pockets using proven onboarding and conversion playbooks.",
          "Demand generation combines demos, founder storytelling, and problem economics content to establish urgency and shorten time-to-value in sales cycles.",
          `Investor and ecosystem bridge opportunities include: ${investors}.`,
          "Distribution strategy is phased: founder-led precision first, partner-assisted scale second, and operational automation third for sustainable expansion economics.",
        ],
      },
      Team: {
        points: [
          `Team narrative: ${teamText}.`,
          "Leadership combines domain expertise with execution discipline, creating strong alignment between product priorities, field realities, and commercial outcomes.",
          "Advisory depth is intentionally structured around finance, sector strategy, and institutional partnerships to improve strategic decision quality during scale-up.",
          "Operating model uses data-led governance with clear weekly, monthly, and quarterly accountability metrics across product, growth, and customer success.",
          "The team is designed for speed and learning velocity, enabling rapid iteration without compromising quality, compliance, or customer trust.",
        ],
      },
      Financials: {
        points: [
          `Projected revenue trajectory: Year 1 ${formatInr(year1Revenue)}, Year 2 ${formatInr(year2Revenue)}, Year 3 ${formatInr(year3Revenue)}.`,
          `Cost discipline baseline: monthly burn around ${formatInr(monthlyBurn)} with approximately ${runwayMonths} months runway at the current ask level.`,
          "Growth assumptions are milestone-based and tied to conversion, retention, and channel productivity improvements rather than aggressive top-line optimism.",
          "Capital efficiency strategy prioritizes revenue-critical product milestones, repeatable acquisition loops, and early signals of contribution margin resilience.",
          "The model is built to demonstrate de-risking over time through stronger customer cohorts, lower acquisition friction, and better unit economics visibility.",
        ],
        chartData: {
          title: "Projected Revenue Growth",
          type: "bar",
          series: revenueSeries,
        },
      },
      Ask: {
        points: [
          `Raise objective: ${askLabel}.`,
          "Proposed allocation is milestone-led with clear accountability: product and platform scale-up, go-to-market acceleration, and operating foundation build-out.",
          "Use-of-funds is sequenced to maximize investor capital efficiency: first de-risk product adoption, then scale distribution, then strengthen operating resilience.",
          "Target 18-month outcomes include expanded pilot conversion, improved retention economics, and stronger institutional credibility for follow-on capital.",
          "Investor value proposition combines measurable progress checkpoints, transparent reporting cadence, and disciplined founder-led execution.",
        ],
        chartData: {
          title: "Use of Funds (%)",
          type: "bar",
          series: useOfFundsSeries,
        },
      },
      "Contact / Thank You": {
        points: [
          `Priority investor profiles include networks aligned to this stage and thesis, such as: ${investors}.`,
          "Next-step ask: strategic investor conversations focused on milestone-fit, sector network leverage, and operating support beyond capital.",
          "We are building a category-defining, women-led company with disciplined execution, measurable impact, and scalable growth architecture.",
          `Founder contact: ${contactText}.`,
          "Thank you for reviewing this deck. We welcome diligence discussions, customer evidence walkthroughs, and milestone-specific funding alignment conversations.",
        ],
      },
    };

    return map[title] || { points: ["Data not available"] };
  };

  const validateEnhancedSlides = (aiSlides, baseSlides) => {
    if (!Array.isArray(aiSlides) || aiSlides.length !== baseSlides.length) {
      return false;
    }

    const byTitle = new Map(aiSlides.map((slide) => [slide?.title, slide]));
    const requiredTitles = baseSlides.map((slide) => slide.title);

    for (const title of requiredTitles) {
      const candidate = byTitle.get(title);
      if (!candidate) {
        return false;
      }

      const points = Array.isArray(candidate.points)
        ? candidate.points
            .map((point) => (typeof point === "string" ? point.trim() : ""))
            .filter(Boolean)
        : [];

      if (points.length < 6) {
        return false;
      }

      const longPoints = points.filter((point) => point.length >= 45);
      if (longPoints.length < 4) {
        return false;
      }
    }

    const cover = byTitle.get("Cover");
    const coverText = (cover?.points || []).join(" ").toLowerCase();
    if (!coverText.includes((formValues.companyName || "").toLowerCase())) {
      return false;
    }

    return true;
  };

  const handleGenerate = async () => {
    if (
      !formValues.companyName?.trim() ||
      !formValues.problem?.trim() ||
      !formValues.solution?.trim() ||
      !formValues.industry?.trim() ||
      !formValues.contact?.trim()
    ) {
      notifications.show({
        title: "Missing details",
        message:
          "Enter company, problem, solution, industry and contact to generate an accurate PDF.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const { financialTable } = buildFinancialProjection();
      const baseSlides = template.slides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        ...buildSlidePayload(slide.title),
      }));

      let slides = baseSlides;

      if (useGrokEnhancement) {
        let aiReady = true;
        try {
          const statusResponse = await apiClient.get("/ai/status");
          aiReady = Boolean(statusResponse.data?.data?.ready);
        } catch (error) {
          // If status endpoint is unavailable on an older backend, still try AI query.
          aiReady = true;
        }

        const prompt = `You are a top-tier venture fundraising strategist and market analyst. Rewrite this 12-slide pitch deck so it reads like a real institutional-grade investor deck.

Founder Inputs (must preserve):
- Company Name: ${formValues.companyName}
- Industry: ${formValues.industry}
- Problem: ${formValues.problem}
- Solution: ${formValues.solution}
- Funding Ask: ${askLabel}
- Contact: ${formValues.contact}
- Traction: ${normalizeText(formValues.traction, "Not provided")}
- Team: ${normalizeText(formValues.team, "Not provided")}

Current Slides:
${JSON.stringify(baseSlides, null, 2)}

Rules:
1. Return JSON only.
2. Keep exactly 12 slides with same id and title.
3. For each slide, provide 7 to 10 high-quality, investor-facing bullet points (not short one-liners).
4. Every slide must include deep analysis, quantified framing, and strategic rationale.
5. Use latest publicly available India startup ecosystem patterns and benchmarks where relevant; if a number is uncertain, mark it clearly as "assumption".
6. Add source cues in bullet text such as "industry benchmark" or "public startup reports" when using external-style analysis.
7. Keep all content aligned with founder inputs; no contradictions.
8. Include chartData for these titles only when useful: Market, Financials, Ask.
9. chartData schema must be: {"title":"...","type":"bar","series":[{"label":"...","value":123}]}
10. Keep charts to max 6 data points.

Output schema:
{
  "slides": [
    {
      "id": 1,
      "title": "Cover",
      "points": ["...", "..."],
      "chartData": {
        "title": "optional",
        "type": "bar",
        "series": [{ "label": "...", "value": 1 }]
      }
    }
  ]
}`;

        if (aiReady) {
          try {
            const response = await apiClient.post(
              "/ai/query",
              {
                prompt,
                model: "grok-2-latest",
                maxTokens: 2800,
                temperature: 0.55,
              },
              {
                timeout: 120000,
              },
            );

            const parsed = parseJsonFromResponse(response.data?.data);
            const aiSlides = Array.isArray(parsed?.slides) ? parsed.slides : [];

            if (validateEnhancedSlides(aiSlides, baseSlides)) {
              const aiByTitle = new Map(
                aiSlides.map((slide) => [slide.title, slide]),
              );
              slides = baseSlides.map((slide) => {
                const aiSlide = aiByTitle.get(slide.title);
                const aiPoints = Array.isArray(aiSlide?.points)
                  ? aiSlide.points
                      .map((point) =>
                        typeof point === "string" ? point.trim() : "",
                      )
                      .filter(Boolean)
                      .slice(0, 10)
                  : [];
                const aiChartData = normalizeChartData(aiSlide?.chartData);

                return {
                  ...slide,
                  points: aiPoints.length ? aiPoints : slide.points,
                  chartData: aiChartData || slide.chartData || null,
                };
              });

              notifications.show({
                title: "Grok Enhanced",
                message:
                  "Slides were deeply enriched with Grok investor-grade analysis.",
                color: "grape",
              });
            } else {
              notifications.show({
                title: "Using base content",
                message:
                  "Grok response quality checks failed. Generated with local professional template.",
                color: "yellow",
              });
            }
          } catch (error) {
            const backendMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "Grok is temporarily unavailable.";
            notifications.show({
              title: "AI fallback enabled",
              message: `${backendMessage} Generated with advanced local investor template.`,
              color: "yellow",
            });
          }
        } else {
          notifications.show({
            title: "AI not configured",
            message:
              "Generated with advanced local investor template because AI is not configured on backend.",
            color: "yellow",
          });
        }

        try {
          const investorPromptCatalog = (investorData.networks || []).map(
            (item) => ({
              id: item.id,
              name: item.name,
              focus: item.focus,
              ticketSize: item.ticketSize,
              location: item.location,
              womenFocus: item.womenFocus,
              responseTime: item.responseTime,
              applicationProcess: item.applicationProcess,
              contact: item.contact,
            }),
          );

          const investorPrompt = `You are an investor matching analyst for women founders in India.

Founder profile:
- Company: ${formValues.companyName}
- Industry: ${formValues.industry}
- Problem: ${formValues.problem}
- Solution: ${formValues.solution}
- Funding Ask: ${askLabel}
- Location context: India

Investor catalog:
${JSON.stringify(investorPromptCatalog, null, 2)}

Return JSON only with top 5 investor matches from provided catalog. Do not invent new investors.
Output schema:
{
  "recommendations": [
    {
      "id": "investor-id",
      "matchScore": 0,
      "matchReason": "short reason",
      "nextStep": "specific action"
    }
  ]
}`;

          const investorResponse = await apiClient.post(
            "/ai/query",
            {
              prompt: investorPrompt,
              model: "grok-2-latest",
            },
            {
              timeout: 90000,
            },
          );

          const parsedInvestor = parseJsonFromResponse(
            investorResponse.data?.data,
          );
          const recommendations = Array.isArray(parsedInvestor?.recommendations)
            ? parsedInvestor.recommendations
            : [];

          if (recommendations.length > 0) {
            const byId = new Map(
              (investorData.networks || []).map((network) => [
                network.id,
                network,
              ]),
            );

            const aiRanked = recommendations
              .map((rec) => {
                const baseInvestor = byId.get(rec.id);
                if (!baseInvestor) {
                  return null;
                }

                return {
                  ...baseInvestor,
                  matchScore:
                    typeof rec.matchScore === "number"
                      ? rec.matchScore
                      : undefined,
                  matchReason:
                    typeof rec.matchReason === "string"
                      ? rec.matchReason.trim()
                      : undefined,
                  nextStep:
                    typeof rec.nextStep === "string"
                      ? rec.nextStep.trim()
                      : undefined,
                };
              })
              .filter(Boolean)
              .slice(0, 5);

            if (aiRanked.length > 0) {
              setAiMatchedInvestors(aiRanked);
              notifications.show({
                title: "AI Investor Matching Ready",
                message:
                  "Grok ranked investor networks with reasons and next steps.",
                color: "grape",
              });
            } else {
              setAiMatchedInvestors([]);
            }
          } else {
            setAiMatchedInvestors([]);
          }
        } catch (error) {
          setAiMatchedInvestors([]);
        }
      } else {
        setAiMatchedInvestors([]);
      }

      setDeckSlides(slides);
      setDeckFinancialTable(financialTable);
      notifications.show({
        title: "Deck Generated",
        message: "Your 12-slide investor deck is ready.",
        color: "violet",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPdfPayload = () => ({
    companyName: formValues.companyName || "FemFin-Founder",
    slides: generatedSlides,
    financialTable: deckFinancialTable,
    fileName: `${slugify(formValues.companyName || "Founder")}-${slugify(
      formValues.industry || "pitch",
    )}-Pitch.pdf`,
  });

  const handleDownloadPdf = () => {
    generatePitchDeckPdf({ ...getPdfPayload(), preview: false });
  };

  const handlePreviewPdf = () => {
    generatePitchDeckPdf({ ...getPdfPayload(), preview: true });
  };

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem("pitchDecks") || "[]");
    const payload = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      companyName: formValues.companyName,
      industry: formValues.industry,
      fundingAsk: askLabel,
      slides: generatedSlides,
    };
    localStorage.setItem("pitchDecks", JSON.stringify([payload, ...existing]));
    notifications.show({
      title: "Saved",
      message: "Pitch deck saved to your dashboard storage.",
      color: "green",
    });
  };

  const handleEmailInvestors = () => {
    const matchedInvestorNames =
      matchedInvestors.length > 0
        ? matchedInvestors.map((investor) => investor.name).join(", ")
        : indiaStats.investors.join(", ");

    const recipientEmails = matchedInvestors
      .map((investor) => investor.contact?.email)
      .filter(Boolean)
      .join(",");

    const subject = encodeURIComponent(
      `${formValues.companyName || "Founder Startup"} | Investor Pitch Deck`,
    );
    const body = encodeURIComponent(
      `Hello Investors,\n\nPlease find our pitch summary:\nCompany: ${formValues.companyName}\nIndustry: ${formValues.industry}\nAsk: ${askLabel}\nProblem: ${formValues.problem}\nSolution: ${formValues.solution}\n\nTarget networks: ${matchedInvestorNames}\n\nRegards,\n${formValues.companyName}`,
    );
    const toParam = encodeURIComponent(recipientEmails);

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${toParam}&su=${subject}&body=${body}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleLinkedInShare = () => {
    const shareText = encodeURIComponent(
      `${formValues.companyName} is raising ${askLabel}. Building in ${formValues.industry} with women-founder momentum.`,
    );
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Paper
          p="xl"
          radius="md"
          style={{
            background:
              "linear-gradient(130deg, rgba(252,231,243,0.95), rgba(243,232,255,0.95))",
            border: "1px solid rgba(236,72,153,0.25)",
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Stack gap={4}>
              <Title order={1}>Pitch Deck Generator</Title>
              <Text c="dimmed" size="lg">
                Create investor-ready decks in under 2 minutes for India angel
                networks.
              </Text>
            </Stack>
            <Badge
              size="lg"
              color="pink"
              leftSection={<IconSparkles size={14} />}
            >
              Women Founder Edition
            </Badge>
          </Group>
        </Paper>

        <Alert color="violet" variant="light">
          AI auto-fill adds India market stats, women founder narratives and
          regional investor matches.
        </Alert>

        <Grid>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Stack>
              <PitchDeckForm
                values={formValues}
                onChange={handleChange}
                onAutoFill={handleAutoFill}
                onGenerate={handleGenerate}
                loading={loading}
                useGrokEnhancement={useGrokEnhancement}
                onToggleGrok={() =>
                  setUseGrokEnhancement((current) => !current)
                }
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Stack>
              <PDFGenerator
                disabled={!generatedSlides.length}
                onDownload={handleDownloadPdf}
                onPreview={handlePreviewPdf}
                onSave={handleSave}
                onLinkedInShare={handleLinkedInShare}
              />
              <SlidePreview slides={generatedSlides} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default PitchDeckPage;
