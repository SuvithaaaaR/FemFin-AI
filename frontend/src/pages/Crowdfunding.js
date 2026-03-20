import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  Grid,
  Badge,
  Progress,
  Avatar,
  Tabs,
  TextInput,
  Textarea,
  NumberInput,
  Paper,
  ThemeIcon,
  rem,
  Modal,
  List,
  Checkbox,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconRocket,
  IconCoins,
  IconUsers,
  IconTarget,
  IconClock,
  IconShieldCheck,
  IconPlus,
  IconHeart,
  IconChartLine,
} from "@tabler/icons-react";
import apiClient from "../services/api";

const FALLBACK_CAMPAIGNS = [
  {
    id: 1,
    title: "Eco-Friendly Fashion Brand",
    entrepreneur: "Priya Sharma",
    location: "Mumbai",
    target: 5000000,
    raised: 3500000,
    investors: 124,
    daysLeft: 15,
    category: "Fashion",
    description:
      "Sustainable fashion brand using organic materials and ethical manufacturing.",
    milestones: [
      { title: "Product Development", amount: 1500000, status: "completed" },
      {
        title: "Manufacturing Setup",
        amount: 2000000,
        status: "in-progress",
      },
      { title: "Marketing & Launch", amount: 1500000, status: "pending" },
    ],
    verified: true,
    image: "👗",
  },
  {
    id: 2,
    title: "HealthTech Mobile App",
    entrepreneur: "Anita Desai",
    location: "Bangalore",
    target: 3000000,
    raised: 1200000,
    investors: 67,
    daysLeft: 30,
    category: "Healthcare",
    description: "AI-powered health monitoring app for women's wellness.",
    milestones: [
      { title: "App Development", amount: 1000000, status: "completed" },
      { title: "Beta Testing", amount: 800000, status: "in-progress" },
      { title: "Market Launch", amount: 1200000, status: "pending" },
    ],
    verified: true,
    image: "🏥",
  },
  {
    id: 3,
    title: "Organic Farm Products",
    entrepreneur: "Meera Patel",
    location: "Pune",
    target: 2000000,
    raised: 1800000,
    investors: 156,
    daysLeft: 7,
    category: "Agriculture",
    description: "Direct farm-to-consumer organic produce delivery platform.",
    milestones: [
      { title: "Infrastructure", amount: 800000, status: "completed" },
      { title: "Supply Chain", amount: 700000, status: "completed" },
      { title: "Expansion", amount: 500000, status: "in-progress" },
    ],
    verified: true,
    image: "🌾",
  },
];

const normalizeCampaignForUi = (campaign) => {
  const endDate = campaign.endDate || campaign.end_date;
  const daysLeft = endDate
    ? Math.max(
        0,
        Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      )
    : 0;

  return {
    id: campaign._id || campaign.id,
    title: campaign.title,
    entrepreneur: campaign.entrepreneur || "Founder",
    location: campaign.location || "India",
    target: Number(campaign.targetAmount || campaign.target_amount || 0),
    raised: Number(campaign.currentAmount || campaign.current_amount || 0),
    investors:
      Number(campaign.stats?.backers || 0) ||
      (Array.isArray(campaign.investments) ? campaign.investments.length : 0),
    daysLeft,
    category: campaign.category || "General",
    description: campaign.description || "",
    milestones: campaign.milestones || [],
    verified: true,
    image: "🚀",
  };
};

const loadRazorpayCheckout = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Crowdfunding() {
  const [activeTab, setActiveTab] = useState("browse");
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [investModalOpened, setInvestModalOpened] = useState(false);
  const [receiptModalOpened, setReceiptModalOpened] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [investmentReceipt, setInvestmentReceipt] = useState(null);
  const [campaigns, setCampaigns] = useState(FALLBACK_CAMPAIGNS);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [processingInvestment, setProcessingInvestment] = useState(false);

  const refreshCampaigns = async () => {
    try {
      const response = await apiClient.get("/crowdfunding/campaigns");
      const normalized = (response.data?.data || []).map(normalizeCampaignForUi);
      if (normalized.length) {
        setCampaigns(normalized);
      }
    } catch (error) {
      // Keep fallback campaigns silently if API is unavailable.
    }
  };

  useEffect(() => {
    void refreshCampaigns();
  }, []);

  const createForm = useForm({
    initialValues: {
      title: "",
      description: "",
      targetAmount: "",
      duration: 30,
      category: "",
      milestone1: "",
      milestone1Amount: "",
      milestone2: "",
      milestone2Amount: "",
      milestone3: "",
      milestone3Amount: "",
    },
  });

  const investForm = useForm({
    initialValues: {
      amount: "",
      investorName: "",
      email: "",
      agreementAccepted: false,
    },
  });

  const trendingCampaigns = useMemo(
    () => [...campaigns].sort((a, b) => b.raised - a.raised).slice(0, 6),
    [campaigns],
  );

  const myInvestments = useMemo(
    () =>
      campaigns.filter((campaign) =>
        Array.isArray(campaign.investments)
          ? campaign.investments.some((inv) => inv?.investor)
          : false,
      ),
    [campaigns],
  );

  const handleCreateCampaign = async (values) => {
    setCreatingCampaign(true);
    try {
      const milestones = [
        {
          title: values.milestone1,
          targetAmount: Number(values.milestone1Amount || 0),
        },
        {
          title: values.milestone2,
          targetAmount: Number(values.milestone2Amount || 0),
        },
        {
          title: values.milestone3,
          targetAmount: Number(values.milestone3Amount || 0),
        },
      ].filter((item) => item.title && item.targetAmount > 0);

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Number(values.duration || 30));

      await apiClient.post("/crowdfunding/campaigns", {
        title: values.title,
        description: values.description,
        targetAmount: Number(values.targetAmount || 0),
        category: values.category,
        status: "Active",
        endDate: endDate.toISOString(),
        milestones,
      });

      await refreshCampaigns();

      notifications.show({
        title: "Campaign Created!",
        message: "Your crowdfunding campaign is now live",
        color: "green",
      });
      setCreateModalOpened(false);
      createForm.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message || "Failed to create campaign",
        color: "red",
      });
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleInvest = async (values) => {
    if (!selectedCampaign) {
      return;
    }

    setProcessingInvestment(true);
    try {
      const sdkLoaded = await loadRazorpayCheckout();
      if (!sdkLoaded) {
        throw new Error("Unable to load Razorpay checkout SDK");
      }

      const amount = Number(values.amount || 0);
      if (amount < 1000) {
        throw new Error("Minimum investment amount is 1000");
      }

      if (!values.agreementAccepted) {
        throw new Error("Please accept the investment agreement before payment");
      }

      const orderResponse = await apiClient.post(
        `/crowdfunding/campaigns/${selectedCampaign.id}/investments/order`,
        { amount },
      );

      const orderData = orderResponse.data?.data;
      if (!orderData?.order?.id || !orderData?.keyId) {
        throw new Error("Invalid order response from backend");
      }

      const verificationData = await new Promise((resolve, reject) => {
        const rz = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: "FemFin Crowdfunding",
          description: `Investment in ${selectedCampaign.title}`,
          order_id: orderData.order.id,
          prefill: {
            name: values.investorName,
            email: values.email,
          },
          theme: {
            color: "#9c27b0",
          },
          handler: async (response) => {
            try {
              const verifyResponse = await apiClient.post(
                `/crowdfunding/campaigns/${selectedCampaign.id}/investments/verify`,
                {
                  amount,
                  investorName: values.investorName,
                  investorEmail: values.email,
                  agreementAccepted: values.agreementAccepted,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              );
              resolve(verifyResponse.data?.data || {});
            } catch (verifyError) {
              reject(verifyError);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled"));
            },
          },
        });

        rz.open();
      });

      await refreshCampaigns();

      setInvestmentReceipt({
        campaignTitle: selectedCampaign.title,
        amount,
        investorName: values.investorName,
        investorEmail: values.email,
        payment: verificationData?.payment,
        agreement: verificationData?.agreement,
        blockchain: verificationData?.blockchain,
      });

      notifications.show({
        title: "Investment Successful!",
        message:
          "Payment verified and investment recorded with blockchain receipt.",
        color: "green",
      });
      setInvestModalOpened(false);
      setReceiptModalOpened(true);
      investForm.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to process investment",
        color: "red",
      });
    } finally {
      setProcessingInvestment(false);
    }
  };

  const CampaignCard = ({ campaign }) => {
    const progress = (campaign.raised / campaign.target) * 100;

    return (
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <Avatar size={50} radius="md">
                {campaign.image}
              </Avatar>
              <div>
                <Group gap="xs">
                  <Text fw={600} size="lg">
                    {campaign.title}
                  </Text>
                  {campaign.verified && (
                    <ThemeIcon size={20} radius="xl" color="green">
                      <IconShieldCheck size={rem(14)} />
                    </ThemeIcon>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  by {campaign.entrepreneur} • {campaign.location}
                </Text>
              </div>
            </Group>
            <Badge color="violet">{campaign.category}</Badge>
          </Group>

          <Text size="sm" lineClamp={2}>
            {campaign.description}
          </Text>

          <div>
            <Group justify="space-between" mb={5}>
              <Text fw={600} size="xl" c="violet">
                ₹{(campaign.raised / 100000).toFixed(1)}L
              </Text>
              <Text c="dimmed" size="sm">
                of ₹{(campaign.target / 100000).toFixed(1)}L
              </Text>
            </Group>
            <Progress value={progress} color="violet" size="lg" radius="xl" />
            <Text size="xs" c="dimmed" mt={5}>
              {progress.toFixed(1)}% funded
            </Text>
          </div>

          <Grid>
            <Grid.Col span={4}>
              <Stack gap={0} align="center">
                <Group gap={5}>
                  <IconUsers size={16} color="#9c27b0" />
                  <Text fw={600}>{campaign.investors}</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Investors
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack gap={0} align="center">
                <Group gap={5}>
                  <IconClock size={16} color="#9c27b0" />
                  <Text fw={600}>{campaign.daysLeft}</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Days Left
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack gap={0} align="center">
                <Group gap={5}>
                  <IconTarget size={16} color="#9c27b0" />
                  <Text fw={600}>{campaign.milestones.length}</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Milestones
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>

          <Paper p="sm" withBorder>
            <Text size="sm" fw={600} mb="xs">
              Milestones
            </Text>
            <Stack gap="xs">
              {campaign.milestones.map((milestone, idx) => (
                <Group key={idx} justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon
                      size={20}
                      radius="xl"
                      color={
                        milestone.status === "completed"
                          ? "green"
                          : milestone.status === "in-progress"
                            ? "blue"
                            : "gray"
                      }
                    >
                      <IconTarget size={rem(12)} />
                    </ThemeIcon>
                    <Text size="xs">{milestone.title}</Text>
                  </Group>
                  <Badge
                    size="xs"
                    color={
                      milestone.status === "completed"
                        ? "green"
                        : milestone.status === "in-progress"
                          ? "blue"
                          : "gray"
                    }
                  >
                    ₹{(milestone.amount / 100000).toFixed(1)}L
                  </Badge>
                </Group>
              ))}
            </Stack>
          </Paper>

          <Group grow>
            <Button
              variant="light"
              leftSection={<IconHeart size={rem(16)} />}
              onClick={() => {
                setSelectedCampaign(campaign);
                setInvestModalOpened(true);
              }}
            >
              Invest Now
            </Button>
            <Button variant="outline">View Details</Button>
          </Group>
        </Stack>
      </Card>
    );
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Blockchain Crowdfunding Platform
          </Title>
          <Text c="dimmed" size="lg">
            Transparent, secure, and milestone-based funding for women
            entrepreneurs
          </Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder bg="violet.0">
          <Group justify="space-between">
            <Group>
              <ThemeIcon size={50} radius="md" color="violet">
                <IconShieldCheck size={rem(30)} />
              </ThemeIcon>
              <div>
                <Title order={3}>Smart Contract Protection</Title>
                <Text size="sm">
                  Funds released automatically when milestones are verified
                </Text>
              </div>
            </Group>
            <Button
              size="lg"
              leftSection={<IconPlus size={rem(20)} />}
              loading={creatingCampaign}
              onClick={() => setCreateModalOpened(true)}
            >
              Create Campaign
            </Button>
          </Group>
        </Card>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="browse"
              leftSection={<IconRocket size={rem(16)} />}
            >
              Browse Campaigns
            </Tabs.Tab>
            <Tabs.Tab
              value="trending"
              leftSection={<IconChartLine size={rem(16)} />}
            >
              Trending
            </Tabs.Tab>
            <Tabs.Tab
              value="invested"
              leftSection={<IconCoins size={rem(16)} />}
            >
              My Investments
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="browse" pt="xl">
            <Grid>
              {campaigns.map((campaign) => (
                <Grid.Col key={campaign.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <CampaignCard campaign={campaign} />
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="trending" pt="xl">
            <Grid>
              {trendingCampaigns.map((campaign) => (
                <Grid.Col key={campaign.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <CampaignCard campaign={campaign} />
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="invested" pt="xl">
            {myInvestments.length ? (
              <Grid>
                {myInvestments.map((campaign) => (
                  <Grid.Col key={campaign.id} span={{ base: 12, md: 6, lg: 4 }}>
                    <CampaignCard campaign={campaign} />
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                Your investments will appear here
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>

        {/* Create Campaign Modal */}
        <Modal
          opened={createModalOpened}
          onClose={() => setCreateModalOpened(false)}
          title={<Title order={3}>Create Crowdfunding Campaign</Title>}
          size="lg"
        >
          <form onSubmit={createForm.onSubmit(handleCreateCampaign)}>
            <Stack gap="md">
              <TextInput
                label="Campaign Title"
                placeholder="Enter campaign title"
                required
                {...createForm.getInputProps("title")}
              />
              <Textarea
                label="Description"
                placeholder="Describe your business and why you need funding"
                required
                minRows={4}
                {...createForm.getInputProps("description")}
              />
              <NumberInput
                label="Target Amount"
                placeholder="Enter target amount"
                required
                prefix="₹ "
                thousandSeparator=","
                {...createForm.getInputProps("targetAmount")}
              />
              <NumberInput
                label="Campaign Duration (Days)"
                placeholder="30"
                required
                min={7}
                max={90}
                {...createForm.getInputProps("duration")}
              />
              <TextInput
                label="Category"
                placeholder="e.g., Technology, Fashion, Healthcare"
                required
                {...createForm.getInputProps("category")}
              />

              <Title order={4} mt="md">
                Milestones
              </Title>
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Milestone 1"
                    placeholder="e.g., Product Development"
                    {...createForm.getInputProps("milestone1")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Amount"
                    placeholder="Amount"
                    prefix="₹ "
                    {...createForm.getInputProps("milestone1Amount")}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Milestone 2"
                    placeholder="e.g., Manufacturing"
                    {...createForm.getInputProps("milestone2")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Amount"
                    placeholder="Amount"
                    prefix="₹ "
                    {...createForm.getInputProps("milestone2Amount")}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Milestone 3"
                    placeholder="e.g., Marketing & Launch"
                    {...createForm.getInputProps("milestone3")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Amount"
                    placeholder="Amount"
                    prefix="₹ "
                    {...createForm.getInputProps("milestone3Amount")}
                  />
                </Grid.Col>
              </Grid>

              <Group justify="flex-end" mt="md">
                <Button
                  variant="default"
                  onClick={() => setCreateModalOpened(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Campaign</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Invest Modal */}
        <Modal
          opened={investModalOpened}
          onClose={() => setInvestModalOpened(false)}
          title={<Title order={3}>Invest in {selectedCampaign?.title}</Title>}
        >
          <form onSubmit={investForm.onSubmit(handleInvest)}>
            <Stack gap="md">
              <Paper p="md" withBorder bg="violet.0">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={600}>
                      Target Amount:
                    </Text>
                    <Text>
                      ₹{(selectedCampaign?.target / 100000).toFixed(1)}L
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" fw={600}>
                      Already Raised:
                    </Text>
                    <Text c="green">
                      ₹{(selectedCampaign?.raised / 100000).toFixed(1)}L
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" fw={600}>
                      Remaining:
                    </Text>
                    <Text c="violet">
                      ₹
                      {(
                        (selectedCampaign?.target - selectedCampaign?.raised) /
                        100000
                      ).toFixed(1)}
                      L
                    </Text>
                  </Group>
                </Stack>
              </Paper>

              <NumberInput
                label="Investment Amount"
                placeholder="Enter amount"
                required
                prefix="₹ "
                thousandSeparator=","
                min={1000}
                {...investForm.getInputProps("amount")}
              />
              <TextInput
                label="Your Name"
                placeholder="Enter your name"
                required
                {...investForm.getInputProps("investorName")}
              />
              <TextInput
                label="Email"
                placeholder="your.email@example.com"
                required
                {...investForm.getInputProps("email")}
              />

              <Paper p="sm" withBorder>
                <Text size="sm" fw={600} mb="xs">
                  🔒 Smart Contract Terms:
                </Text>
                <List size="xs" spacing="xs">
                  <List.Item>
                    Funds locked in blockchain smart contract
                  </List.Item>
                  <List.Item>
                    Released automatically when milestones verified
                  </List.Item>
                  <List.Item>Full transparency on fund usage</List.Item>
                  <List.Item>Refund protection if milestones not met</List.Item>
                </List>
              </Paper>

              <Checkbox
                label="I agree to the digital investment agreement and smart-contract execution terms"
                {...investForm.getInputProps("agreementAccepted", {
                  type: "checkbox",
                })}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="default"
                  onClick={() => setInvestModalOpened(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftSection={<IconCoins size={rem(16)} />}
                  loading={processingInvestment}
                  disabled={!investForm.values.agreementAccepted}
                >
                  Confirm Investment
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        <Modal
          opened={receiptModalOpened}
          onClose={() => setReceiptModalOpened(false)}
          title={<Title order={3}>Investment Receipt</Title>}
          size="md"
        >
          <Stack gap="sm">
            <Text size="sm">
              Your investment has been securely recorded with payment verification
              and blockchain proof.
            </Text>

            <Divider />

            <Group justify="space-between">
              <Text fw={600}>Campaign</Text>
              <Text>{investmentReceipt?.campaignTitle}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600}>Investor</Text>
              <Text>{investmentReceipt?.investorName}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600}>Email</Text>
              <Text>{investmentReceipt?.investorEmail}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600}>Amount</Text>
              <Text>₹ {Number(investmentReceipt?.amount || 0).toLocaleString("en-IN")}</Text>
            </Group>

            {!!investmentReceipt?.payment?.paymentId && (
              <Group justify="space-between">
                <Text fw={600}>Payment ID</Text>
                <Text size="sm">{investmentReceipt.payment.paymentId}</Text>
              </Group>
            )}

            {!!investmentReceipt?.agreement?.hash && (
              <Group justify="space-between">
                <Text fw={600}>Agreement Hash</Text>
                <Text size="sm">{investmentReceipt.agreement.hash.slice(0, 18)}...</Text>
              </Group>
            )}

            {!!investmentReceipt?.blockchain?.txHash && (
              <Group justify="space-between">
                <Text fw={600}>Blockchain Tx</Text>
                <Text size="sm">{investmentReceipt.blockchain.txHash.slice(0, 18)}...</Text>
              </Group>
            )}

            <Divider />

            <Text size="xs" c="dimmed">
              Full payment IDs, agreement hash, and blockchain transaction data
              are stored in backend investment records for auditability.
            </Text>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}

export default Crowdfunding;
