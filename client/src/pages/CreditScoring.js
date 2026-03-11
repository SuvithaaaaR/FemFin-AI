import React, { useState } from "react";
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
  ThemeIcon,
  rem,
  Paper,
  RingProgress,
  Stepper,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  List,
  Alert,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconCreditCard,
  IconShieldCheck,
  IconChartLine,
  IconUsers,
  IconStar,
  IconTrendingUp,
  IconAlertCircle,
  IconCheck,
  IconReceipt,
  IconBrandGoogle,
  IconShoppingCart,
} from "@tabler/icons-react";
import apiClient from "../services/api";

function CreditScoring() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creditScore, setCreditScore] = useState(null);

  const form = useForm({
    initialValues: {
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      businessType: "",
      yearsInBusiness: "",
      monthlyRevenue: "",
      annualRevenue: "",

      // Digital Transactions
      upiTransactions: "",
      onlineSales: "",
      digitalPayments: "",

      // Business Activity
      activeCustomers: "",
      repeatCustomers: "",
      averageOrderValue: "",

      // Social Trust Score
      socialMediaPresence: "",
      googleRating: "",
      totalReviews: "",

      // Additional Info
      bankAccount: "",
      gstRegistered: "",
    },
  });

  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        "/credit-scoring/analyze",
        form.values,
      );
      setCreditScore(response.data.creditScore);
      setActive(3);
      notifications.show({
        title: "Credit Score Generated!",
        message: "Your AI-powered credit assessment is complete",
        color: "green",
        icon: <IconCheck size={rem(18)} />,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to generate credit score",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const ScoreCard = ({ title, score, icon: Icon, color, description }) => (
    <Paper p="md" withBorder>
      <Stack gap="xs" align="center">
        <ThemeIcon size={50} radius="md" color={color}>
          <Icon size={rem(28)} />
        </ThemeIcon>
        <Text fw={600} size="sm" ta="center">
          {title}
        </Text>
        <RingProgress
          size={100}
          thickness={8}
          sections={[{ value: score, color: color }]}
          label={
            <Text ta="center" fw={700} size="lg">
              {score}
            </Text>
          }
        />
        <Text size="xs" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </Paper>
  );

  const renderCreditScoreResults = () => {
    if (!creditScore) return null;

    const getScoreColor = (score) => {
      if (score >= 750) return "green";
      if (score >= 650) return "teal";
      if (score >= 550) return "yellow";
      return "orange";
    };

    const getLoanEligibility = (score) => {
      if (score >= 750) return { amount: 2000000, interest: 8.5, tenure: 60 };
      if (score >= 650) return { amount: 1000000, interest: 10.5, tenure: 48 };
      if (score >= 550) return { amount: 500000, interest: 12.5, tenure: 36 };
      return { amount: 250000, interest: 15, tenure: 24 };
    };

    const eligibility = getLoanEligibility(creditScore.totalScore);

    return (
      <Stack gap="xl">
        <Card shadow="lg" padding="xl" radius="md" withBorder>
          <Stack gap="xl" align="center">
            <Group>
              <ThemeIcon
                size={60}
                radius="md"
                color={getScoreColor(creditScore.totalScore)}
              >
                <IconCreditCard size={rem(35)} />
              </ThemeIcon>
              <div>
                <Text size="lg" c="dimmed">
                  Your AI Credit Score
                </Text>
                <Title order={1} c={getScoreColor(creditScore.totalScore)}>
                  {creditScore.totalScore}/900
                </Title>
              </div>
            </Group>

            <RingProgress
              size={200}
              thickness={20}
              sections={[
                {
                  value: (creditScore.totalScore / 900) * 100,
                  color: getScoreColor(creditScore.totalScore),
                },
              ]}
              label={
                <div style={{ textAlign: "center" }}>
                  <Text size="xl" fw={700}>
                    {creditScore.totalScore}
                  </Text>
                  <Text size="xs" c="dimmed">
                    out of 900
                  </Text>
                </div>
              }
            />

            <Badge
              size="xl"
              color={getScoreColor(creditScore.totalScore)}
              variant="light"
            >
              {creditScore.totalScore >= 750
                ? "Excellent"
                : creditScore.totalScore >= 650
                  ? "Good"
                  : creditScore.totalScore >= 550
                    ? "Fair"
                    : "Needs Improvement"}
            </Badge>
          </Stack>
        </Card>

        <Title order={3}>Score Breakdown</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <ScoreCard
              title="Digital Transactions"
              score={creditScore.digitalTransactions}
              icon={IconReceipt}
              color="blue"
              description="UPI & online payments"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <ScoreCard
              title="Business Activity"
              score={creditScore.businessActivity}
              icon={IconTrendingUp}
              color="violet"
              description="Sales & customer base"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <ScoreCard
              title="Social Trust"
              score={creditScore.socialTrust}
              icon={IconUsers}
              color="teal"
              description="Reviews & ratings"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <ScoreCard
              title="Financial Health"
              score={creditScore.financialHealth}
              icon={IconChartLine}
              color="green"
              description="Revenue & transactions"
            />
          </Grid.Col>
        </Grid>

        <Card shadow="sm" padding="lg" radius="md" withBorder bg="green.0">
          <Stack gap="md">
            <Group>
              <ThemeIcon size={50} radius="md" color="green">
                <IconCheck size={rem(30)} />
              </ThemeIcon>
              <div>
                <Title order={3}>Loan Eligibility</Title>
                <Text c="dimmed">Based on your credit score</Text>
              </div>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper p="md" withBorder bg="white">
                  <Text size="sm" c="dimmed">
                    Maximum Loan Amount
                  </Text>
                  <Title order={2} c="green">
                    ₹{(eligibility.amount / 100000).toFixed(1)}L
                  </Title>
                  <Text size="xs" c="dimmed">
                    Without collateral
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper p="md" withBorder bg="white">
                  <Text size="sm" c="dimmed">
                    Interest Rate
                  </Text>
                  <Title order={2} c="blue">
                    {eligibility.interest}%
                  </Title>
                  <Text size="xs" c="dimmed">
                    Per annum
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper p="md" withBorder bg="white">
                  <Text size="sm" c="dimmed">
                    Loan Tenure
                  </Text>
                  <Title order={2} c="violet">
                    {eligibility.tenure} months
                  </Title>
                  <Text size="xs" c="dimmed">
                    Maximum period
                  </Text>
                </Paper>
              </Grid.Col>
            </Grid>

            <Alert icon={<IconShieldCheck size={rem(16)} />} color="green">
              <Text size="sm">
                ✨ No collateral required! Your digital footprint and business
                activity serve as your creditworthiness.
              </Text>
            </Alert>

            <Button
              size="lg"
              fullWidth
              leftSection={<IconCreditCard size={rem(20)} />}
            >
              Apply for Loan
            </Button>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Score Improvement Tips</Title>
            <List spacing="xs" size="sm">
              {creditScore.totalScore < 750 && (
                <>
                  <List.Item
                    icon={<IconTrendingUp size={16} color="#9c27b0" />}
                  >
                    Increase your digital payment transactions for better
                    tracking
                  </List.Item>
                  <List.Item icon={<IconUsers size={16} color="#9c27b0" />}>
                    Encourage customers to leave reviews on Google and social
                    media
                  </List.Item>
                  <List.Item icon={<IconChartLine size={16} color="#9c27b0" />}>
                    Maintain consistent monthly revenue and reduce fluctuations
                  </List.Item>
                  <List.Item
                    icon={<IconShoppingCart size={16} color="#9c27b0" />}
                  >
                    Focus on building repeat customer relationships
                  </List.Item>
                </>
              )}
              {creditScore.totalScore >= 750 && (
                <List.Item icon={<IconCheck size={16} color="green" />}>
                  Excellent score! Keep maintaining your current business
                  practices.
                </List.Item>
              )}
            </List>
          </Stack>
        </Card>

        <Group justify="center" mt="xl">
          <Button
            variant="outline"
            onClick={() => {
              setActive(0);
              setCreditScore(null);
              form.reset();
            }}
          >
            Start New Assessment
          </Button>
          <Button onClick={() => window.print()}>Download Report</Button>
        </Group>
      </Stack>
    );
  };

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Group>
            <ThemeIcon size={50} radius="md" color="teal">
              <IconShieldCheck size={rem(30)} />
            </ThemeIcon>
            <div>
              <Title order={1}>AI Credit Scoring</Title>
              <Text c="dimmed" size="lg">
                Get credit without collateral - assessed through your digital
                footprint
              </Text>
            </div>
          </Group>
        </div>

        <Alert
          icon={<IconAlertCircle size={rem(16)} />}
          color="blue"
          variant="light"
        >
          <Text size="sm">
            <strong>No property collateral needed!</strong> We evaluate your
            creditworthiness based on: digital transactions, business activity,
            social trust score, customer reviews, and sales data.
          </Text>
        </Alert>

        <Card shadow="lg" padding="xl" radius="md" withBorder>
          <Stepper
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
          >
            <Stepper.Step label="Business Info" description="Your details">
              <Stack gap="md" mt="xl">
                <TextInput
                  label="Business Name"
                  placeholder="Enter your business name"
                  required
                  {...form.getInputProps("businessName")}
                />
                <TextInput
                  label="Owner Name"
                  placeholder="Your full name"
                  required
                  {...form.getInputProps("ownerName")}
                />
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Email"
                      placeholder="your.email@example.com"
                      required
                      {...form.getInputProps("email")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Phone"
                      placeholder="10-digit number"
                      required
                      {...form.getInputProps("phone")}
                    />
                  </Grid.Col>
                </Grid>
                <Select
                  label="Business Type"
                  placeholder="Select business type"
                  required
                  data={[
                    "Retail",
                    "E-commerce",
                    "Services",
                    "Manufacturing",
                    "Food & Beverage",
                    "Others",
                  ]}
                  {...form.getInputProps("businessType")}
                />
                <NumberInput
                  label="Years in Business"
                  placeholder="Number of years"
                  required
                  min={0}
                  {...form.getInputProps("yearsInBusiness")}
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Step label="Financials" description="Revenue data">
              <Stack gap="md" mt="xl">
                <NumberInput
                  label="Monthly Revenue (Average)"
                  placeholder="Enter amount"
                  required
                  prefix="₹ "
                  thousandSeparator=","
                  {...form.getInputProps("monthlyRevenue")}
                />
                <NumberInput
                  label="Annual Revenue"
                  placeholder="Enter amount"
                  required
                  prefix="₹ "
                  thousandSeparator=","
                  {...form.getInputProps("annualRevenue")}
                />
                <NumberInput
                  label="Monthly UPI/Digital Transactions"
                  placeholder="Number of transactions"
                  required
                  {...form.getInputProps("upiTransactions")}
                />
                <NumberInput
                  label="Online Sales (Monthly)"
                  placeholder="Amount"
                  prefix="₹ "
                  thousandSeparator=","
                  {...form.getInputProps("onlineSales")}
                />
                <NumberInput
                  label="Digital Payment Percentage"
                  placeholder="% of total sales"
                  suffix="%"
                  min={0}
                  max={100}
                  {...form.getInputProps("digitalPayments")}
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Step label="Business Activity" description="Customer data">
              <Stack gap="md" mt="xl">
                <NumberInput
                  label="Active Customers (Monthly)"
                  placeholder="Number of customers"
                  required
                  {...form.getInputProps("activeCustomers")}
                />
                <NumberInput
                  label="Repeat Customers"
                  placeholder="Number of repeat customers"
                  required
                  {...form.getInputProps("repeatCustomers")}
                />
                <NumberInput
                  label="Average Order Value"
                  placeholder="Average amount"
                  prefix="₹ "
                  thousandSeparator=","
                  {...form.getInputProps("averageOrderValue")}
                />
                <Select
                  label="Social Media Presence"
                  placeholder="Select presence level"
                  data={["None", "Basic", "Moderate", "Strong", "Excellent"]}
                  {...form.getInputProps("socialMediaPresence")}
                />
                <NumberInput
                  label="Google Rating"
                  placeholder="e.g., 4.5"
                  step={0.1}
                  min={0}
                  max={5}
                  precision={1}
                  {...form.getInputProps("googleRating")}
                />
                <NumberInput
                  label="Total Reviews"
                  placeholder="Number of reviews"
                  {...form.getInputProps("totalReviews")}
                />
                <Select
                  label="GST Registered"
                  placeholder="Select"
                  data={["Yes", "No"]}
                  {...form.getInputProps("gstRegistered")}
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Step label="Results" description="Your score">
              {renderCreditScoreResults()}
            </Stepper.Step>
          </Stepper>

          {active < 3 && (
            <Group justify="space-between" mt="xl">
              <Button
                variant="default"
                onClick={prevStep}
                disabled={active === 0}
              >
                Back
              </Button>
              {active === 2 ? (
                <Button onClick={handleSubmit} loading={loading}>
                  Generate Credit Score
                </Button>
              ) : (
                <Button onClick={nextStep}>Next Step</Button>
              )}
            </Group>
          )}
        </Card>
      </Stack>
    </Container>
  );
}

export default CreditScoring;
