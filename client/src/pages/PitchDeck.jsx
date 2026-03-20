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

  const buildSlidePoints = (title) => {
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
    const taglineText = normalizeText(
      formValues.tagline,
      "Building high-impact outcomes with a women-led execution engine",
    );

    const map = {
      Cover: [
        companyName,
        taglineText,
        `Industry (as entered): ${normalizeText(formValues.industry, "Not provided")}`,
        `Funding ask (as entered): ${askLabel}`,
        `One-line pitch: ${solutionNarrative}`,
        `Contact (as entered): ${contactText}`,
      ],
      Problem: [
        `Problem statement (as entered): ${problemText}`,
        `${industryInsight.tnLoss} lost annually in this segment in Tamil Nadu alone`,
        "Current alternatives are fragmented, manual, and too slow for high-frequency decisions",
        "Women-led MSMEs face an additional trust and access gap in early-stage capital",
      ],
      Solution: [
        `Solution statement (as entered): ${solutionNarrative}`,
        "Product stack: data capture, intelligence layer, and decision dashboard in one workflow",
        "Designed for fast onboarding with low training overhead and clear ROI tracking",
        "Defensibility comes from localized data, implementation playbooks, and network effects",
      ],
      Market: [
        `TAM: ${industryInsight.market}`,
        `SAM: 22% of TAM reachable through regional category focus and partner channels`,
        `SOM (3-year target): 2.5% of SAM with phased execution across top districts`,
        `Market context: ${formValues.marketInsight || `${industryInsight.market} opportunity with measurable demand-side urgency`}`,
      ],
      "Business Model": [
        "Revenue model: subscription + onboarding + premium analytics",
        "Indicative pricing: core SaaS around Rs 5,000/month/customer with annual plans",
        "Expansion revenue from enterprise integrations and workflow automation modules",
        "Unit economics focus: strong gross margin with scalable implementation operations",
      ],
      Traction: [
        `Live traction (as entered): ${tractionText}`,
        "Pipeline includes channel-led deals with institutional and ecosystem partners",
        "Early customer feedback indicates measurable productivity and cost improvement",
        "Execution cadence: pilot-to-paid conversion framework with quarterly expansion targets",
      ],
      Competition: [
        "Competitive set includes legacy manual operators and horizontal software tools",
        "Our positioning: high local relevance, faster deployment, and outcomes-first onboarding",
        "2x2 advantage: affordability + measurable ROI + founder-driven customer success",
        "Switching moat grows with proprietary workflow data and partner integrations",
      ],
      "Go-to-Market": [
        "Primary channels: women entrepreneur networks, district business communities, and ecosystem partnerships",
        "Geographic strategy: start with Tamil Nadu clusters, then replicate via playbook-led expansion",
        "Demand engine: demos, partner-led onboarding, and high-trust founder storytelling",
        `Investor access via curated introductions to ${investors}`,
      ],
      Team: [
        `Founder thesis (as entered): ${teamText}`,
        "Core team capability spans product, operations, and market development",
        "Advisory support planned across finance, sector strategy, and institutional growth",
        "Execution style: data-driven weekly review cadence and milestone-led governance",
      ],
      Financials: [
        `Year 1 projected revenue: ${formatInr(year1Revenue)}`,
        `Year 2 projected revenue: ${formatInr(year2Revenue)}`,
        `Year 3 projected revenue: ${formatInr(year3Revenue)}`,
        `Planned monthly burn: ${formatInr(monthlyBurn)} | Runway: ~${runwayMonths} months on current ask`,
      ],
      Ask: [
        `Fundraise ask (as entered): ${askLabel}`,
        "Use of funds: product and platform 45%, go-to-market 35%, operations and talent 20%",
        "Target outcome in 18 months: scale pilots, improve conversion, and institutionalize repeatable growth",
        "Investor proposition: efficient capital deployment with milestone-based de-risking",
      ],
      "Contact / Thank You": [
        `Target investors: ${investors}`,
        `Founder story signal: ${story}`,
        "We are building a category-defining, women-led company with scalable execution discipline",
        `Reach us (as entered): ${contactText}`,
      ],
    };

    return map[title] || ["Data not available"];
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
        points: buildSlidePoints(slide.title),
      }));

      let slides = baseSlides;

      if (useGrokEnhancement) {
        const prompt = `You are a startup fundraising expert. Improve this 12-slide pitch deck for investor quality while staying accurate to the provided founder inputs.

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
3. For each slide, provide 4 to 6 concise bullet points.
4. Do not invent contradictory facts; if unknown, state assumption clearly.
5. Keep bullets professional and investor-friendly.

Output schema:
{
  "slides": [
    {
      "id": 1,
      "title": "Cover",
      "points": ["...", "..."]
    }
  ]
}`;

        try {
          const response = await apiClient.post("/ai/query", {
            prompt,
            model: "grok-beta",
          });

          const parsed = parseJsonFromResponse(response.data?.data);
          const aiSlides = Array.isArray(parsed?.slides) ? parsed.slides : [];

          if (aiSlides.length === baseSlides.length) {
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
                    .slice(0, 6)
                : [];

              return {
                ...slide,
                points: aiPoints.length ? aiPoints : slide.points,
              };
            });

            notifications.show({
              title: "Grok Enhanced",
              message:
                "Slides were enriched with AI-generated investor content.",
              color: "grape",
            });
          } else {
            notifications.show({
              title: "Using base content",
              message:
                "Grok response format was not valid. Generated with local professional template.",
              color: "yellow",
            });
          }
        } catch (error) {
          notifications.show({
            title: "Grok unavailable",
            message:
              error.response?.data?.message ||
              "Generated deck with local content because AI enhancement failed.",
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

          const investorResponse = await apiClient.post("/ai/query", {
            prompt: investorPrompt,
            model: "grok-beta",
          });

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
