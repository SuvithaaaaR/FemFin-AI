import React, { useEffect, useState } from "react";
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
  Loader,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import apiClient from "../services/api";

const FALLBACK_FUNDS = [
  {
    _id: "fallback-stree-shakti",
    name: "SBI Stree Shakti Package",
    category: "Loan",
    status: "Active",
    description:
      "Women-focused SBI package for retail, services, manufacturing, and SSI businesses.",
    fundingRange: { min: 50000, max: 2500000 },
    timeline: "15-30 days",
    eligibility: [
      "Minimum 51% women ownership",
      "Applicable for proprietary, partnership, or company entities",
      "Retail, services, professionals, and SSI units are eligible",
    ],
    features: [
      "Lower margin requirements",
      "Processing fee concessions",
      "Collateral-free options for eligible cases",
    ],
    schemeDetails: {
      fullName: "SBI Stree Shakti Package",
      launchedBy: "State Bank of India (SBI)",
      launchedOn: "October 2000",
      purpose:
        "Financial package for women entrepreneurs to start or expand businesses in retail, services, manufacturing, and SSI units.",
      loanAmountBySegment: [
        { segment: "Retail Traders", min: 50000, max: 200000 },
        { segment: "Business Enterprises", min: 50000, max: 200000 },
        {
          segment: "Professionals (Doctors, CAs, Architects)",
          min: 50000,
          max: 2500000,
        },
        { segment: "SSI Units", min: 50000, max: 2500000 },
      ],
      terms: {
        floatingRateNote:
          "Floating rate linked to SBI benchmark rate; typical range around 9.5%-11.5% based on profile.",
        concessionalMargin:
          "Concessional margin and reduced equity burden for eligible women-led entities.",
        noCollateralUpto: 1000000,
        collateralCondition:
          "Collateral may apply for high-risk or large-value profiles as per bank policy.",
        tenure:
          "Up to 7 years including moratorium, based on cash-flow assessment.",
        exampleEmi:
          "Example: INR 5 lakh at 10% for 5 years is about INR 8,500 per month.",
      },
      examples: [
        {
          text: "100% women-owned AI AgriTech proprietorship is eligible.",
          eligible: true,
        },
        {
          text: "Women partners with 60% ownership are eligible.",
          eligible: true,
        },
        {
          text: "Woman ownership below 51% is not eligible.",
          eligible: false,
        },
      ],
      currentStatus: {
        isActive: true,
        updatedAsOf: "March 2026",
        disbursalNote: "Ongoing scheme with significant cumulative disbursals.",
        relatedSchemes: ["SBI Asmita"],
      },
    },
  },
  {
    _id: "fallback-mudra",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    category: "Loan",
    status: "Active",
    description:
      "Collateral-light working capital and term loans up to Rs. 10 lakh for non-corporate, non-farm micro enterprises.",
    facilityType: "Working Capital and Term Loan",
    purpose:
      "Business purpose funding for expansion, capacity enhancement, modernization, and allied agricultural services",
    targetAudience:
      "Manufacturing, trading, and services micro units including allied agri activities",
    fundingRange: { min: 50000, max: 1000000 },
    loanCategories: [
      {
        name: "Shishu",
        amountRange: "Up to Rs. 50,000",
        description: "Infancy-stage working capital requirements",
      },
      {
        name: "Kishore",
        amountRange: "Rs. 50,001 to Rs. 5,00,000",
        description: "Stabilization and growth capital",
      },
      {
        name: "Tarun",
        amountRange: "Rs. 5,00,001 to Rs. 10,00,000",
        description: "Expansion-stage funding",
      },
    ],
    timeline: "Approval and disbursal typically within 4-8 weeks",
    eligibility: [
      "Non-corporate, non-farm micro enterprises with viable plans",
      "Apply via Commercial Banks, RRBs, SFBs, Cooperative Banks, MFIs, or NBFCs",
      "Online submissions accepted through JanSamarth portal",
    ],
    beneficiaries: [
      "Manufacturing, trading, and service micro units",
      "Allied agricultural activities (non-crop cultivation)",
    ],
    industryFocus: ["Manufacturing", "Agriculture", "Services", "Trading"],
    businessStageApplicable: [
      "Early Stage (Pre-revenue)",
      "Revenue Generating",
      "Growth Stage",
    ],
    margin: {
      shishu: "Nil for loans up to Rs. 50,000",
      kishoreTarun: "20% for Rs. 50,001 to Rs. 10 lakh",
    },
    pricing: "Competitive pricing linked to EBLR with lender-specific spreads",
    repaymentGuidelines: [
      "TL/Dropline OD below Rs. 5 lakh: up to 5 years with max 6-month moratorium",
      "TL/Dropline OD Rs. 5-10 lakh: up to 7 years with max 12-month moratorium",
    ],
    processingFee:
      "Nil for Shishu/Kishore (MSE units); Tarun: 0.50% (+tax) of loan amount",
    portal: {
      name: "JanSamarth Portal",
      url: "https://www.jansamarth.in",
    },
    applicationLink: "https://jansamarth.in/apply/sbi",
    features: [
      "Accessible via banks, RRBs, SFBs, cooperative banks, MFIs, and NBFCs",
      "MUDRA provides refinance support",
      "Product bands (Shishu/Kishore/Tarun) guide graduation",
    ],
    contactInfo: "https://jansamarth.in/apply/sbi",
  },
  {
    _id: "fallback-pmegp",
    name: "PRIME MINISTER EMPLOYMENT GENERATION PROGRAMME (PMEGP)",
    category: "Government Scheme",
    status: "Active",
    description:
      "Flagship programme that finances new micro enterprises to unlock rural and urban employment opportunities.",
    objectives: [
      "Generate employment in rural and urban areas through new self-employment ventures",
      "Bring traditional artisans and unemployed youth together with local income opportunities",
      "Increase wage-earning capacity and accelerate job growth",
    ],
    implementingMinistry: "Khadi and Village Industries Commission (KVIC)",
    portal: {
      name: "PMEGP e-Portal",
      url: "https://www.kviconline.gov.in/pmegpeportal/jsp/portal/index.jsp",
    },
    beneficiaries: [
      "Individuals above 18 years of age",
      "Projects above Rs. 10 lakh (manufacturing) or Rs. 5 lakh (services) need minimum VIII standard pass",
      "Only new projects sanctioned specifically under PMEGP",
      "Self Help Groups (including BPL) that have not received other scheme subsidies",
      "Institutions under Societies Registration Act, production co-ops, and charitable trusts",
      "Existing units that already availed Government subsidy are not eligible",
    ],
    targetAudience:
      "Individuals (18+), SHGs, registered societies, production co-ops, and charitable trusts launching new PMEGP projects",
    purpose: "Creation of sustainable employment via micro enterprises",
    fundingRange: { min: 0, max: 5000000 },
    amount: 5000000,
    loanQuantum: {
      manufacturingMax: 5000000,
      businessServiceMax: 2000000,
      manufacturingUpgradationMax: 10000000,
    },
    margin: {
      generalCategory: "10%",
      specialCategory:
        "5% (SC/ST/OBC, women, minorities, NER, aspirational districts)",
    },
    repaymentPeriod: "3 to 7 years",
    interestRate: "EBLR + 3.25% (presently ~12.15% p.a. effective 15 Feb 2025)",
    interestSubvention:
      "Government subsidy of 15% - 35% of project cost routed through KVIC/KVIB/DIC",
    creditGuarantee:
      "CGFMU coverage up to Rs. 10 lakh; CGTMSE coverage above Rs. 10 lakh",
    timeline: "Sanction to disbursal typically 4-12 weeks",
    eligibility: [
      "Age 18+ with minimum education criteria for high-value projects",
      "Only brand-new PMEGP projects are eligible",
      "SHGs, registered societies, production co-ops, charitable trusts",
    ],
    features: [
      "Subsidy directly linked with bank-financed term loans",
      "Monitoring through District Task Force Committees",
      "Collateral-free cover through CGFMU/CGTMSE based on loan size",
    ],
    requiredDocuments: [
      "Detailed project report (including working capital estimates)",
      "KYC and address proofs",
      "Category certificates (SC/ST/OBC/Minority/PH/NER) for special margin",
      "Educational qualification proof (VIII pass where applicable)",
    ],
    applicationLink:
      "https://www.kviconline.gov.in/pmegpeportal/jsp/portal/index.jsp",
    contactInfo: "support@ruralher.org",
  },
  {
    _id: "fallback-cgs1",
    name: "Credit Guarantee Scheme-I (CGTMSE)",
    category: "Credit Guarantee",
    status: "Active",
    description:
      "Guarantee cover that enables MLIs to extend collateral-free working capital and term loans up to Rs. 10 crore to eligible MSE borrowers.",
    implementingMinistry:
      "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    purpose:
      "Support collateral-free approvals by providing guarantee cover on eligible exposures from June 1, 2000 onwards.",
    beneficiaries: [
      "Micro and Small Enterprises engaged in eligible manufacturing, services, and trading activities",
      "Borrowers with compulsory Udyam registration availing up to Rs. 10 crore",
    ],
    eligibility: [
      "MSEs as per MSME Ministry definition",
      "Loans up to Rs. 10 crore sanctioned by CGTMSE Member Lending Institutions",
      "Mandatory Udyam Registration Number",
    ],
    ineligibleFacilities: [
      "Facilities already covered by DICGC/RBI risk cover",
      "Facilities additionally covered by government/general insurer/other guarantee bodies",
      "Facilities covered under NCGTC",
      "Facilities inconsistent with any law or RBI directive",
      "Borrowers with invoked guarantees under CGTMSE/other listed schemes and unsettled dues",
      "Facilities fully secured by collateral/third-party guarantee beyond hybrid allowance",
    ],
    hybridSecurity:
      "Hybrid Security model (introduced 2018) permits MLIs to take collateral for part of the facility and cover the unsecured portion under CGTMSE up to Rs. 10 crore.",
    fundingRange: { min: 0, max: 100000000 },
    loanQuantum: {
      workingCapitalMax: 100000000,
      termLoanMax: 100000000,
    },
    guaranteeFeeStructure: {
      effectiveFrom: "1 April 2025",
      slabs: [
        { range: "0 - 10 lakh", rate: "0.37%" },
        { range: "Above 10 - 50 lakh", rate: "0.55%" },
        { range: "Above 50 lakh - 1 crore", rate: "0.60%" },
        { range: "Above 1 - 2 crore", rate: "0.85%" },
        { range: "Above 2 - 5 crore", rate: "1.00%" },
        { range: "Above 5 - 8 crore", rate: "1.10%" },
        { range: "Above 8 - 10 crore", rate: "1.20%" },
      ],
      notes: [
        "Annual guarantee fee payable upfront for year one and every renewal year",
        "Fee concessions available for select borrower categories, zones, and ZED-certified units",
      ],
    },
    annualGuaranteeFeeNote:
      "Annual Guarantee Fee is due upfront at guarantee commencement and annually for continuation; see CGTMSE scheme document for concession grids.",
    features: [
      "Guarantee cover for collateral-free working capital and term loans",
      "Covers exposures sanctioned on/after 1 June 2000 by CGTMSE MLIs",
      "Allows partial security via hybrid security model",
    ],
    requiredDocuments: [
      "Loan sanction note and appraisal",
      "Udyam Registration Number",
      "Borrower KYC/compliance documents",
    ],
    applicationLink: "https://www.cgtmse.in",
    contactInfo: "https://www.cgtmse.in",
  },
  {
    _id: "fallback-standup",
    name: "Stand-Up India",
    category: "Government Scheme",
    status: "Active",
    description:
      "Stand-Up India facilitates composite bank loans between Rs. 10 lakh and Rs. 1 crore for SC/ST and women entrepreneurs launching new greenfield enterprises.",
    implementingMinistry:
      "Department of Financial Services, Ministry of Finance",
    portal: {
      name: "Stand-Up Mitra Portal",
      url: "https://www.standupmitra.in/",
    },
    targetAudience:
      "Each bank branch must support at least one SC/ST borrower and one woman borrower",
    beneficiaries: [
      "Scheduled Caste entrepreneurs",
      "Scheduled Tribe entrepreneurs",
      "Women entrepreneurs",
    ],
    objectives: [
      "Promote entrepreneurship amongst SC/ST and women segments",
      "Ensure bank branch-level inclusion for greenfield ventures",
    ],
    purpose:
      "Setting up new enterprises in manufacturing, trading, services, or allied agriculture",
    fundingRange: { min: 1000000, max: 10000000 },
    loanQuantum: {
      compositeLoanMin: 1000000,
      compositeLoanMax: 10000000,
    },
    margin:
      "Margin money up to 15% of project cost (minimum 10% even when subsidies apply)",
    repaymentPeriod:
      "Repayable within 7 years with a moratorium up to 18 months",
    interestRate: "EBLR + 3.25% (currently ~12.15% effective 15 Feb 2025)",
    interestSubvention: "Nil",
    creditGuarantee:
      "CGSSI guarantee via NCGTC; fee computed per account and recovered from borrower (coverage up to 80%)",
    features: [
      "Composite loan covers term loan plus working capital",
      "Handholding and mentorship via Stand-Up Mitra network",
      "Focus on greenfield projects only",
    ],
    requiredDocuments: [
      "Standard SME documentation",
      "Scheme-specific documentation for allied agriculture activities",
    ],
    applicationLink: "https://www.standupmitra.in/",
    contactInfo: "https://www.standupmitra.in/",
  },
];

function FundDetails() {
  const [fundCatalog, setFundCatalog] = useState(FALLBACK_FUNDS);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const mergeFundsWithFallback = (primaryFunds = []) => {
    const keyFor = (fund) => fund?._id || fund?.name || fund?.title;
    const merged = [];
    const seen = new Set();

    primaryFunds.forEach((fund) => {
      const key = keyFor(fund);
      if (!key) {
        return;
      }
      merged.push(fund);
      seen.add(key);
    });

    FALLBACK_FUNDS.forEach((fund) => {
      const key = keyFor(fund);
      if (!key || seen.has(key)) {
        return;
      }
      merged.push(fund);
      seen.add(key);
    });

    return merged;
  };

  useEffect(() => {
    const fetchFunds = async () => {
      setCatalogLoading(true);
      try {
        const response = await apiClient.get("/funds");
        const serverFunds = response.data?.data || [];
        setFundCatalog(
          serverFunds.length
            ? mergeFundsWithFallback(serverFunds)
            : FALLBACK_FUNDS,
        );
      } catch (error) {
        // Keep fallback data silently when API is unavailable.
        setFundCatalog(FALLBACK_FUNDS);
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchFunds();
  }, []);

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLoanQuantumDetails = (loanQuantum) => {
    if (!loanQuantum) return null;
    const segments = [];

    if (typeof loanQuantum.manufacturingMax === "number") {
      segments.push(
        `Manufacturing up to ${formatCurrency(loanQuantum.manufacturingMax)}`,
      );
    }

    if (typeof loanQuantum.businessServiceMax === "number") {
      segments.push(
        `Business/Service up to ${formatCurrency(
          loanQuantum.businessServiceMax,
        )}`,
      );
    }

    if (typeof loanQuantum.manufacturingUpgradationMax === "number") {
      segments.push(
        `Manufacturing upgradation up to ${formatCurrency(
          loanQuantum.manufacturingUpgradationMax,
        )}`,
      );
    }

    if (typeof loanQuantum.workingCapitalMax === "number") {
      segments.push(
        `Working capital up to ${formatCurrency(loanQuantum.workingCapitalMax)}`,
      );
    }

    if (typeof loanQuantum.termLoanMax === "number") {
      segments.push(
        `Term loan up to ${formatCurrency(loanQuantum.termLoanMax)}`,
      );
    }

    return segments.join(" | ");
  };

  const toArray = (value) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    if (value) {
      return [value];
    }

    return [];
  };

  const openDetails = (fund) => {
    setSelectedFund(fund);
    setDetailsOpened(true);
  };

  const renderFundCatalog = () => {
    if (!fundCatalog.length) {
      return (
        <Alert color="blue" title="No funds listed yet">
          Fund catalog will appear here after funds are seeded in the backend.
        </Alert>
      );
    }

    return (
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {fundCatalog.map((fund) => (
          <Paper key={fund._id} p="md" withBorder radius="md">
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={700}>{fund.name || fund.title}</Text>
                  <Badge variant="light">{fund.category}</Badge>
                </div>
                <Badge color="teal" variant="outline">
                  {fund.status || "Active"}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={3}>
                {fund.description}
              </Text>

              <Group gap="xs">
                <Badge size="sm" variant="outline">
                  {formatCurrency(fund.fundingRange?.min || fund.amount)} -{" "}
                  {formatCurrency(fund.fundingRange?.max || fund.amount)}
                </Badge>
                <Badge size="sm" variant="outline" color="gray">
                  {fund.timeline || "Timeline N/A"}
                </Badge>
              </Group>

              <Button variant="outline" onClick={() => openDetails(fund)}>
                View Fund Details
              </Button>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Fund Details
          </Title>
          <Text c="dimmed" size="lg">
            Browse detailed information for available funding schemes.
          </Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>Available Funds</Title>
                <Text c="dimmed" size="sm">
                  Open each fund to see eligibility, terms, and scheme details.
                </Text>
              </div>
              <Badge color="blue" variant="light">
                {fundCatalog.length} Funds
              </Badge>
            </Group>
            {catalogLoading && (
              <Group gap="xs">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">
                  Refreshing latest funds...
                </Text>
              </Group>
            )}
            {renderFundCatalog()}
          </Stack>
        </Card>

        <Modal
          opened={detailsOpened}
          onClose={() => setDetailsOpened(false)}
          title="Fund Details"
          size="lg"
          centered
        >
          {selectedFund &&
            (() => {
              const objectives = toArray(selectedFund.objectives);
              const beneficiaries = toArray(selectedFund.beneficiaries);
              const eligibilityItems = toArray(selectedFund.eligibility);
              const ineligibleFacilities = toArray(
                selectedFund.ineligibleFacilities,
              );
              const featureItems = toArray(selectedFund.features);
              const requiredDocs = toArray(selectedFund.requiredDocuments);
              const loanAmountSegments =
                selectedFund.schemeDetails?.loanAmountBySegment || [];
              const loanCategories = selectedFund.loanCategories || [];
              const loanQuantumText = formatLoanQuantumDetails(
                selectedFund.loanQuantum,
              );
              const repaymentNotes = toArray(
                selectedFund.repaymentGuidelines ||
                  selectedFund.repaymentPeriod,
              );
              const pricingNotes = toArray(selectedFund.pricing);
              const processingNotes = toArray(selectedFund.processingFee);
              const guaranteeFeeSlabs =
                selectedFund.guaranteeFeeStructure?.slabs || [];
              const guaranteeFeeNotes = toArray(
                selectedFund.guaranteeFeeStructure?.notes,
              );
              const hybridSecurityNote = selectedFund.hybridSecurity;
              const annualGuaranteeFeeNote =
                selectedFund.annualGuaranteeFeeNote;
              const hasFinancialTerms = Boolean(
                loanQuantumText ||
                selectedFund.margin ||
                repaymentNotes.length ||
                selectedFund.interestRate ||
                selectedFund.interestSubvention ||
                selectedFund.creditGuarantee ||
                pricingNotes.length ||
                processingNotes.length,
              );

              const renderMargin = () => {
                if (!selectedFund.margin) return null;
                if (typeof selectedFund.margin === "string") {
                  return selectedFund.margin;
                }

                const bands = [
                  selectedFund.margin.generalCategory
                    ? `General: ${selectedFund.margin.generalCategory}`
                    : null,
                  selectedFund.margin.specialCategory
                    ? `Special: ${selectedFund.margin.specialCategory}`
                    : null,
                ].filter(Boolean);

                return bands.join(" | ") || null;
              };

              return (
                <Stack gap="sm">
                  <Title order={4}>
                    {selectedFund.name || selectedFund.title}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {selectedFund.description}
                  </Text>

                  {selectedFund.facilityType && (
                    <Text size="sm">
                      <b>Nature of Facility:</b> {selectedFund.facilityType}
                    </Text>
                  )}

                  {selectedFund.implementingMinistry && (
                    <Text size="sm">
                      <b>Implementing Ministry:</b>{" "}
                      {selectedFund.implementingMinistry}
                    </Text>
                  )}

                  {selectedFund.portal?.url && (
                    <Text size="sm">
                      <b>Portal:</b>{" "}
                      <Anchor
                        href={selectedFund.portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedFund.portal.name || selectedFund.portal.url}
                      </Anchor>
                    </Text>
                  )}

                  {selectedFund.purpose && (
                    <Text size="sm">
                      <b>Purpose:</b> {selectedFund.purpose}
                    </Text>
                  )}

                  {selectedFund.targetAudience && (
                    <Text size="sm">
                      <b>Target Audience:</b> {selectedFund.targetAudience}
                    </Text>
                  )}

                  <Group gap="xs">
                    <Badge>{selectedFund.category}</Badge>
                    <Badge variant="outline">
                      {formatCurrency(
                        selectedFund.fundingRange?.min || selectedFund.amount,
                      )}{" "}
                      -{" "}
                      {formatCurrency(
                        selectedFund.fundingRange?.max || selectedFund.amount,
                      )}
                    </Badge>
                    {selectedFund.timeline && (
                      <Badge variant="outline" color="gray">
                        {selectedFund.timeline}
                      </Badge>
                    )}
                  </Group>

                  {objectives.length > 0 && (
                    <>
                      <Divider label="Objectives" />
                      <List size="sm" spacing="xs">
                        {objectives.map((item, idx) => (
                          <List.Item key={`objective-${idx}`}>{item}</List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {beneficiaries.length > 0 && (
                    <>
                      <Divider label="Beneficiaries / Target Group" />
                      <List size="sm" spacing="xs">
                        {beneficiaries.map((item, idx) => (
                          <List.Item key={`beneficiary-${idx}`}>
                            {item}
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {eligibilityItems.length > 0 && (
                    <>
                      <Divider label="Eligibility" />
                      <List size="sm" spacing="xs">
                        {eligibilityItems.map((item, idx) => (
                          <List.Item key={`eligibility-${idx}`}>
                            {item}
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {featureItems.length > 0 && (
                    <>
                      <Divider label="Key Benefits" />
                      <List size="sm" spacing="xs">
                        {featureItems.map((item, idx) => (
                          <List.Item key={`feature-${idx}`}>{item}</List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {ineligibleFacilities.length > 0 && (
                    <>
                      <Divider label="Not Eligible" />
                      <List size="sm" spacing="xs">
                        {ineligibleFacilities.map((item, idx) => (
                          <List.Item key={`ineligible-${idx}`}>
                            {item}
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {hasFinancialTerms && (
                    <>
                      <Divider label="Financial Terms" />
                      <Stack gap="xs">
                        {loanQuantumText && (
                          <Text size="sm">
                            <b>Loan Quantum:</b> {loanQuantumText}
                          </Text>
                        )}
                        {renderMargin() && (
                          <Text size="sm">
                            <b>Margin:</b> {renderMargin()}
                          </Text>
                        )}
                        {repaymentNotes.length > 0 && (
                          <Stack gap="xs">
                            <Text size="sm">
                              <b>Repayment Guidance:</b>
                            </Text>
                            <List size="sm" spacing="xs">
                              {repaymentNotes.map((item, idx) => (
                                <List.Item key={`repay-${idx}`}>
                                  {item}
                                </List.Item>
                              ))}
                            </List>
                          </Stack>
                        )}
                        {selectedFund.interestRate && (
                          <Text size="sm">
                            <b>Interest Rate:</b> {selectedFund.interestRate}
                          </Text>
                        )}
                        {selectedFund.interestSubvention && (
                          <Text size="sm">
                            <b>Subsidy:</b> {selectedFund.interestSubvention}
                          </Text>
                        )}
                        {selectedFund.creditGuarantee && (
                          <Text size="sm">
                            <b>Credit Guarantee:</b>{" "}
                            {selectedFund.creditGuarantee}
                          </Text>
                        )}
                        {pricingNotes.length > 0 && (
                          <Text size="sm">
                            <b>Pricing:</b> {pricingNotes.join(" | ")}
                          </Text>
                        )}
                        {processingNotes.length > 0 && (
                          <Text size="sm">
                            <b>Processing Fee:</b> {processingNotes.join(" | ")}
                          </Text>
                        )}
                      </Stack>
                    </>
                  )}

                  {hybridSecurityNote && (
                    <>
                      <Divider label="Hybrid Security" />
                      <Text size="sm">{hybridSecurityNote}</Text>
                    </>
                  )}

                  {!!selectedFund.schemeDetails?.fullName && (
                    <>
                      <Divider label="Scheme Overview" />
                      <Text size="sm">
                        <b>Full Name:</b> {selectedFund.schemeDetails.fullName}
                      </Text>
                      {!!selectedFund.schemeDetails.launchedBy && (
                        <Text size="sm">
                          <b>Launched By:</b>{" "}
                          {selectedFund.schemeDetails.launchedBy}
                        </Text>
                      )}
                      {!!selectedFund.schemeDetails.launchedOn && (
                        <Text size="sm">
                          <b>Launched:</b>{" "}
                          {selectedFund.schemeDetails.launchedOn}
                        </Text>
                      )}
                      {!!selectedFund.schemeDetails.purpose && (
                        <Text size="sm">
                          <b>Purpose:</b> {selectedFund.schemeDetails.purpose}
                        </Text>
                      )}
                    </>
                  )}

                  {!!loanAmountSegments.length && (
                    <>
                      <Divider label="Loan Amounts" />
                      <List size="sm" spacing="xs">
                        {loanAmountSegments.map((item, idx) => (
                          <List.Item key={`loan-segment-${idx}`}>
                            {item.segment}: {formatCurrency(item.min)} -{" "}
                            {formatCurrency(item.max)}
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {!!loanCategories.length && (
                    <>
                      <Divider label="Loan Bands" />
                      <List size="sm" spacing="xs">
                        {loanCategories.map((item, idx) => (
                          <List.Item key={`loan-band-${idx}`}>
                            <b>{item.name}:</b> {item.amountRange}
                            {item.description ? ` - ${item.description}` : ""}
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {(guaranteeFeeSlabs.length > 0 ||
                    guaranteeFeeNotes.length > 0 ||
                    selectedFund.guaranteeFeeStructure?.effectiveFrom ||
                    annualGuaranteeFeeNote) && (
                    <>
                      <Divider label="Guarantee Fee" />
                      {selectedFund.guaranteeFeeStructure?.effectiveFrom && (
                        <Text size="sm">
                          <b>Effective:</b>{" "}
                          {selectedFund.guaranteeFeeStructure.effectiveFrom}
                        </Text>
                      )}
                      {guaranteeFeeSlabs.length > 0 && (
                        <List size="sm" spacing="xs">
                          {guaranteeFeeSlabs.map((slab, idx) => (
                            <List.Item key={`fee-slab-${idx}`}>
                              {slab.range}: {slab.rate}
                            </List.Item>
                          ))}
                        </List>
                      )}
                      {guaranteeFeeNotes.length > 0 && (
                        <List size="sm" spacing="xs">
                          {guaranteeFeeNotes.map((note, idx) => (
                            <List.Item key={`fee-note-${idx}`}>
                              {note}
                            </List.Item>
                          ))}
                        </List>
                      )}
                      {annualGuaranteeFeeNote && (
                        <Text size="sm">{annualGuaranteeFeeNote}</Text>
                      )}
                    </>
                  )}

                  {requiredDocs.length > 0 && (
                    <>
                      <Divider label="Required Documents" />
                      <List size="sm" spacing="xs">
                        {requiredDocs.map((doc, idx) => (
                          <List.Item key={`doc-${idx}`}>{doc}</List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  {selectedFund.contactInfo && (
                    <Text size="sm">
                      <b>Contact:</b> {selectedFund.contactInfo}
                    </Text>
                  )}

                  {selectedFund.applicationLink && (
                    <Button
                      component="a"
                      href={selectedFund.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="filled"
                    >
                      Apply / Learn More
                    </Button>
                  )}
                </Stack>
              );
            })()}
        </Modal>
      </Stack>
    </Container>
  );
}

export default FundDetails;
