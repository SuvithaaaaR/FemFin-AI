import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
  NumberInput,
  Paper,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingBank,
  IconCheck,
  IconGift,
  IconSparkles,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import apiClient from "../services/api";

function FundRecommendation() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      businessIdea: "",
      budgetRequired: "",
      industryType: "",
      businessStage: "",
      experience: "",
      location: "",
      teamSize: "",
    },
    validate: (values) => {
      if (active === 0) {
        return {
          fullName:
            values.fullName.length < 2
              ? "Name must be at least 2 characters"
              : null,
          email: /^\S+@\S+$/.test(values.email) ? null : "Invalid email",
          phone: values.phone.length === 10 ? null : "Phone must be 10 digits",
        };
      }

      if (active === 1) {
        return {
          businessIdea:
            values.businessIdea.length < 20
              ? "Describe your business idea in detail (min 20 characters)"
              : null,
          budgetRequired:
            values.budgetRequired === "" ? "Budget is required" : null,
          industryType:
            values.industryType === null ? "Select an industry" : null,
          businessStage:
            values.businessStage === null ? "Select business stage" : null,
        };
      }

      return {};
    },
  });

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Education",
    "E-commerce",
    "Manufacturing",
    "Agriculture",
    "Fashion & Textiles",
    "Food & Beverage",
    "Beauty & Wellness",
    "Professional Services",
    "Others",
  ];

  const businessStageOptions = [
    "Idea Stage",
    "Prototype/MVP",
    "Early Stage (Pre-revenue)",
    "Revenue Generating",
    "Growth Stage",
    "Expansion Stage",
  ];

  const nextStep = () => {
    const validation = form.validate();
    if (!validation.hasErrors) {
      setActive((current) => (current < 2 ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        "/fund-recommendations/analyze",
        form.values,
      );
      setRecommendations(response.data.recommendations);
      setActive(2);
      notifications.show({
        title: "Analysis Complete!",
        message: "We found the best funding options for your business",
        color: "green",
        icon: <IconCheck size={rem(18)} />,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to analyze. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendations = () => {
    if (!recommendations) return null;

    const categories = [
      {
        title: "Government Schemes",
        icon: IconBuildingBank,
        color: "blue",
        data: recommendations.governmentSchemes || [],
      },
      {
        title: "Angel Investors",
        icon: IconUsers,
        color: "violet",
        data: recommendations.angelInvestors || [],
      },
      {
        title: "Venture Capital Funds",
        icon: IconTrendingUp,
        color: "orange",
        data: recommendations.vcFunds || [],
      },
      {
        title: "Women Entrepreneur Grants",
        icon: IconGift,
        color: "pink",
        data: recommendations.grants || [],
      },
    ];

    return (
      <Stack gap="xl">
        <Group>
          <ThemeIcon size={50} radius="md" color="green">
            <IconSparkles size={rem(30)} />
          </ThemeIcon>
          <div>
            <Title order={2}>Your Personalized Recommendations</Title>
            <Text c="dimmed">
              Based on your business profile and requirements
            </Text>
          </div>
        </Group>

        {recommendations.aiSummary && (
          <Card withBorder radius="md" padding="md" bg="violet.0">
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={700}>Grok AI Summary</Text>
                <Badge variant="light" color="grape">
                  {recommendations.provider || "grok"}
                </Badge>
              </Group>
              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {recommendations.aiSummary}
              </Text>
            </Stack>
          </Card>
        )}

        {categories.map((category, idx) => (
          <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group>
                <ThemeIcon size={40} radius="md" color={category.color}>
                  <category.icon size={rem(24)} />
                </ThemeIcon>
                <div>
                  <Title order={3}>{category.title}</Title>
                  <Badge color={category.color}>
                    {category.data.length} Options Available
                  </Badge>
                </div>
              </Group>

              <Grid>
                {category.data.map((item, index) => (
                  <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text fw={600}>{item.name}</Text>
                          <Badge color={category.color} variant="light">
                            {item.matchScore}% Match
                          </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {item.description}
                        </Text>
                        <Group gap="xs">
                          <Badge size="sm" variant="outline">
                            ₹{item.fundingRange}
                          </Badge>
                          <Badge size="sm" variant="outline" color="gray">
                            {item.timeline}
                          </Badge>
                        </Group>
                        {item.comparisonText && (
                          <Paper
                            p="xs"
                            bg="gray.0"
                            style={{
                              borderLeft: `3px solid var(--mantine-color-${category.color}-filled)`,
                            }}
                          >
                            <Text size="xs" fw={500} c="dimmed">
                              Why this is suitable for your idea:
                            </Text>
                            <Text size="sm">{item.comparisonText}</Text>
                          </Paper>
                        )}
                        <List size="sm" spacing="xs">
                          {item.eligibility?.map((criteria, itemIndex) => (
                            <List.Item key={itemIndex}>{criteria}</List.Item>
                          ))}
                        </List>
                      </Stack>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Card>
        ))}

        <Group justify="center" mt="xl">
          <Button
            variant="outline"
            onClick={() => {
              setActive(0);
              setRecommendations(null);
              form.reset();
            }}
          >
            Start New Analysis
          </Button>
        </Group>
      </Stack>
    );
  };

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            AI Recommendation
          </Title>
          <Text c="dimmed" size="lg">
            Get personalized funding recommendations based on your business
            profile
          </Text>
        </div>

        <Card shadow="lg" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <div>
              <Title order={3}>AI Recommendation</Title>
              <Text c="dimmed" size="sm">
                Fill in your business profile to get personalized fund matches
              </Text>
            </div>

            <Stepper
              active={active}
              onStepClick={setActive}
              allowNextStepsSelect={false}
            >
              <Stepper.Step label="Personal Info" description="Your details">
                <Stack gap="md" mt="xl">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                    {...form.getInputProps("fullName")}
                  />
                  <TextInput
                    label="Email"
                    placeholder="your.email@example.com"
                    required
                    {...form.getInputProps("email")}
                  />
                  <TextInput
                    label="Phone Number"
                    placeholder="10-digit mobile number"
                    required
                    maxLength={10}
                    {...form.getInputProps("phone")}
                  />
                  <TextInput
                    label="Location"
                    placeholder="City, State"
                    {...form.getInputProps("location")}
                  />
                </Stack>
              </Stepper.Step>

              <Stepper.Step label="Business Info" description="Your business">
                <Stack gap="md" mt="xl">
                  <Textarea
                    label="Business Idea"
                    placeholder="Describe your business idea in detail..."
                    required
                    minRows={4}
                    {...form.getInputProps("businessIdea")}
                  />
                  <NumberInput
                    label="Budget Required"
                    placeholder="Enter amount in INR"
                    required
                    min={0}
                    prefix="₹ "
                    thousandSeparator=","
                    {...form.getInputProps("budgetRequired")}
                  />
                  <Select
                    label="Industry Type"
                    placeholder="Select your industry"
                    required
                    data={industryOptions}
                    searchable
                    {...form.getInputProps("industryType")}
                  />
                  <Select
                    label="Business Stage"
                    placeholder="Select your current stage"
                    required
                    data={businessStageOptions}
                    {...form.getInputProps("businessStage")}
                  />
                  <NumberInput
                    label="Years of Experience"
                    placeholder="Your relevant experience"
                    min={0}
                    max={50}
                    {...form.getInputProps("experience")}
                  />
                  <NumberInput
                    label="Team Size"
                    placeholder="Number of team members"
                    min={1}
                    {...form.getInputProps("teamSize")}
                  />
                </Stack>
              </Stepper.Step>

              <Stepper.Step label="Results" description="View recommendations">
                {renderRecommendations()}
              </Stepper.Step>

              <Stepper.Completed>{renderRecommendations()}</Stepper.Completed>
            </Stepper>

            {active < 2 && (
              <Group justify="space-between" mt="xl">
                <Button
                  variant="default"
                  onClick={prevStep}
                  disabled={active === 0}
                >
                  Back
                </Button>
                {active === 1 ? (
                  <Button onClick={handleSubmit} loading={loading}>
                    Analyze & Get Recommendations
                  </Button>
                ) : (
                  <Button onClick={nextStep}>Next Step</Button>
                )}
              </Group>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

export default FundRecommendation;
