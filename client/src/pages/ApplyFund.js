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
    requirements: [
      "Aadhaar/PAN and address proof",
      "MSME/Udyam registration",
      "Business plan and ownership proof",
      "Bank statement and ITR where applicable",
    ],
    applicationProcess:
      "Apply at SBI branch or SME loans portal with documents and business plan.",
    website: "https://sbi.co.in/web/business/sme/sme-loans",
    contactPhone: "1800-1234",
    schemeDetails: {
      requiredDocuments: [
        { title: "Identity", details: "Aadhaar/PAN/Voter ID" },
        { title: "Address", details: "Ration card or utility bill" },
        { title: "Business", details: "MSME/Udyam registration" },
      ],
      applicationSteps: [
        { step: "Visit SBI branch or SBI SME loans portal." },
        { step: "Fill Stree Shakti Package application." },
        { step: "Submit documents and business plan." },
        { step: "Approval typically in 15-30 days." },
      ],
      integrationPrompt:
        "Retail/Service 50K-2L, SSI/Professional up to 25L, apply via SBI branch + MSME registration.",
    },
  },
  {
    _id: "fallback-mudra",
    name: "MUDRA Loan Scheme",
    category: "Loan",
    status: "Active",
    description:
      "Collateral-light support for micro and small businesses up to 10 lakh.",
    fundingRange: { min: 50000, max: 1000000 },
    timeline: "1-2 months",
    requirements: ["KYC", "Business proof", "Bank statements"],
    applicationProcess:
      "Submit loan request through partner bank/NBFC with business details.",
    website: "https://www.mudra.org.in/",
  },
  {
    _id: "fb1",
    title: "PRIME MINISTER EMPLOYMENT GENERATION PROGRAMME (PMEGP)",
    description:
      "To generate employment opportunities in rural as well as urban areas of the country through setting up of new self-employment ventures/projects/micro enterprises.",
    category: "Government Scheme",
    targetAudience:
      "Any individual, above 18 years of age. For setting up of project costing above Rs. 10 lakh in the manufacturing sector and above Rs. 5 lakh in the Business/ Service sector, the beneficiaries should possess at least VIII standard pass educational qualification.",
    benefits:
      "The subsidy ranging from 15% to 35% of project cost provided by Government of India through Khadi and Village Industries Boards (KVIC).",
    amount: 5000000,
    interestRate: "12.15%",
    repaymentPeriod: "3 to 7 years",
    applicationLink:
      "https://www.kviconline.gov.in/pmegpeportal/jsp/portal/index.jsp",
    deadline: "N/A",
    eligibility:
      "Any individual, above 18 years of age. Assistance under the scheme is available only for new projects sanctioned specially under the PMEGP. Self Help Groups, Institutions registered under Societies Registration Act, 1860, Production Co-operative Societies, and Charitable Trusts are also eligible.",
    requiredDocuments: [
      "VIII standard pass certificate (for projects above specified costs)",
      "Project Report",
      "ID and Address Proof",
    ],
    contactInfo: "support@ruralher.org",
  },
  {
    _id: "fb4",
    title: "PRIME MINISTER EMPLOYMENT GENERATION PROGRAMME (PMEGP)",
    description:
      "To generate employment opportunities in rural as well as urban areas of the country through setting up of new self-employment ventures/projects/micro enterprises.",
    category: "Government Scheme",
    targetAudience:
      "Any individual, above 18 years of age. For setting up of project costing above Rs. 10 lakh in the manufacturing sector and above Rs. 5 lakh in the Business/ Service sector, the beneficiaries should possess at least VIII standard pass educational qualification.",
    benefits:
      "The subsidy ranging from 15% to 35% of project cost provided by Government of India through Khadi and Village Industries Boards (KVIC).",
    amount: 5000000,
    interestRate: "12.15%",
    repaymentPeriod: "3 to 7 years",
    applicationLink:
      "https://www.kviconline.gov.in/pmegpeportal/jsp/portal/index.jsp",
    deadline: "N/A",
    eligibility:
      "Any individual, above 18 years of age. Assistance under the scheme is available only for new projects sanctioned specially under the PMEGP. Self Help Groups, Institutions registered under Societies Registration Act, 1860, Production Co-operative Societies, and Charitable Trusts are also eligible.",
    requiredDocuments: [
      "VIII standard pass certificate (for projects above specified costs)",
      "Project Report",
      "ID and Address Proof",
    ],
    contactInfo: "www.kviconline.gov.in",
  },
];

function ApplyFund() {
  const [fundCatalog, setFundCatalog] = useState(FALLBACK_FUNDS);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [applyOpened, setApplyOpened] = useState(false);

  useEffect(() => {
    const fetchFunds = async () => {
      setCatalogLoading(true);
      try {
        const response = await apiClient.get("/funds");
        const serverFunds = response.data?.data || [];
        if (serverFunds.length) {
          setFundCatalog(serverFunds);
        }
      } catch (error) {
        // Keep fallback data silently when API is unavailable.
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

  const openApply = (fund) => {
    setSelectedFund(fund);
    setApplyOpened(true);
  };

  const renderApplyCatalog = () => {
    if (!fundCatalog.length) {
      return (
        <Alert color="blue" title="No application-ready funds listed yet">
          Fund application options will appear here after funds are loaded.
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
                  <Text fw={700}>{fund.name}</Text>
                  <Text size="sm" c="dimmed">
                    {fund.category}
                  </Text>
                </div>
                <Badge color="green" variant="light">
                  Apply Open
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                {fund.applicationProcess ||
                  "Open the application checklist and official channel for this fund."}
              </Text>

              <Group gap="xs">
                <Badge size="sm" variant="outline">
                  {formatCurrency(fund.fundingRange?.min)} -{" "}
                  {formatCurrency(fund.fundingRange?.max)}
                </Badge>
                <Badge size="sm" variant="outline" color="gray">
                  {fund.timeline || "Timeline N/A"}
                </Badge>
              </Group>

              <Button mt="xs" onClick={() => openApply(fund)}>
                Apply Fund
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
            Apply Fund
          </Title>
          <Text c="dimmed" size="lg">
            Choose a fund and open its application process, documents, and
            official link.
          </Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>Fund Applications</Title>
                <Text c="dimmed" size="sm">
                  Each fund opens a separate apply workflow and checklist.
                </Text>
              </div>
              <Badge color="green" variant="light">
                {fundCatalog.length} Apply Options
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
            {renderApplyCatalog()}
          </Stack>
        </Card>

        <Modal
          opened={applyOpened}
          onClose={() => setApplyOpened(false)}
          title="Fund Apply"
          size="lg"
          centered
        >
          {selectedFund && (
            <Stack gap="sm">
              <Title order={4}>Apply for {selectedFund.name}</Title>

              <Text size="sm" c="dimmed">
                Follow the checklist below to complete your application.
              </Text>

              {!!selectedFund.applicationProcess && (
                <Paper p="sm" withBorder>
                  <Text size="sm">{selectedFund.applicationProcess}</Text>
                </Paper>
              )}

              {!!selectedFund.requirements?.length && (
                <>
                  <Divider label="Documents Required" />
                  <List size="sm" spacing="xs">
                    {selectedFund.requirements.map((item, idx) => (
                      <List.Item key={idx}>{item}</List.Item>
                    ))}
                  </List>
                </>
              )}

              {!!selectedFund.schemeDetails?.requiredDocuments?.length && (
                <>
                  <Divider label="Detailed Documents" />
                  <List size="sm" spacing="xs">
                    {selectedFund.schemeDetails.requiredDocuments.map(
                      (item, idx) => (
                        <List.Item key={idx}>
                          <b>{item.title}:</b> {item.details}
                        </List.Item>
                      ),
                    )}
                  </List>
                </>
              )}

              {!!selectedFund.schemeDetails?.applicationSteps?.length && (
                <>
                  <Divider label="How to Apply" />
                  <List size="sm" spacing="xs">
                    {selectedFund.schemeDetails.applicationSteps.map(
                      (item, idx) => (
                        <List.Item key={idx}>{item.step}</List.Item>
                      ),
                    )}
                  </List>
                </>
              )}

              {!!selectedFund.schemeDetails?.integrationPrompt && (
                <Paper p="sm" withBorder>
                  <Text size="sm">
                    <b>AI Prompt Addition:</b>{" "}
                    {selectedFund.schemeDetails.integrationPrompt}
                  </Text>
                </Paper>
              )}

              {!!selectedFund.website && (
                <Anchor href={selectedFund.website} target="_blank">
                  Open Official Application Website
                </Anchor>
              )}

              {!!selectedFund.contactPhone && (
                <Text size="sm">
                  Contact Phone: {selectedFund.contactPhone}
                </Text>
              )}
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
}

export default ApplyFund;
