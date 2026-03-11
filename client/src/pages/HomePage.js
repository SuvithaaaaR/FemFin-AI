import React from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Grid,
  Card,
  Group,
  Stack,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconChartBar,
  IconCoins,
  IconCreditCard,
  IconSparkles,
  IconShieldCheck,
  IconTrendingUp,
} from "@tabler/icons-react";

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: IconChartBar,
      title: "AI Fund Recommendations",
      description:
        "Get personalized funding recommendations based on your business profile. Access government schemes, angel investors, VC funds, and grants.",
      color: "violet",
      path: "/fund-recommendation",
    },
    {
      icon: IconCoins,
      title: "Blockchain Crowdfunding",
      description:
        "Connect directly with investors through our transparent blockchain-based platform. Smart contracts ensure secure milestone-based funding.",
      color: "blue",
      path: "/crowdfunding",
    },
    {
      icon: IconCreditCard,
      title: "AI Credit Scoring",
      description:
        "Access credit without collateral. Our AI evaluates your digital footprint, business activity, and social trust score for fair assessment.",
      color: "teal",
      path: "/credit-scoring",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl" py="xl">
        {/* Hero Section */}
        <Stack align="center" gap="md" py={rem(60)}>
          <Group gap="xs">
            <IconSparkles size={40} color="#9c27b0" />
            <Title order={1} size={rem(48)} ta="center" c="violet">
              Empowering Women Entrepreneurs
            </Title>
          </Group>

          <Text size="xl" ta="center" maw={800} c="dimmed">
            Access funding through AI-powered recommendations, blockchain
            crowdfunding, and collateral-free credit scoring - all in one
            platform
          </Text>

          <Group mt="xl">
            <Button
              size="lg"
              leftSection={<IconTrendingUp size={rem(20)} />}
              onClick={() => navigate("/fund-recommendation")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </Button>
          </Group>
        </Stack>

        {/* Features Grid */}
        <Grid gutter="lg" mt="xl">
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 4 }}>
              <Card
                shadow="md"
                padding="xl"
                radius="md"
                withBorder
                style={{ height: "100%", cursor: "pointer" }}
                onClick={() => navigate(feature.path)}
              >
                <Stack gap="md">
                  <ThemeIcon size={60} radius="md" color={feature.color}>
                    <feature.icon size={rem(30)} />
                  </ThemeIcon>

                  <Title order={3}>{feature.title}</Title>

                  <Text c="dimmed" size="sm">
                    {feature.description}
                  </Text>

                  <Button
                    variant="light"
                    color={feature.color}
                    fullWidth
                    mt="auto"
                  >
                    Learn More
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Stats Section */}
        <Card shadow="sm" padding="xl" radius="md" withBorder mt="xl">
          <Group justify="space-around">
            <Stack align="center" gap={5}>
              <Title order={2} c="violet">
                5000+
              </Title>
              <Text c="dimmed">Women Entrepreneurs</Text>
            </Stack>
            <Stack align="center" gap={5}>
              <Title order={2} c="blue">
                ₹500Cr+
              </Title>
              <Text c="dimmed">Funds Facilitated</Text>
            </Stack>
            <Stack align="center" gap={5}>
              <Title order={2} c="teal">
                95%
              </Title>
              <Text c="dimmed">Success Rate</Text>
            </Stack>
            <Stack align="center" gap={5}>
              <IconShieldCheck size={40} color="#9c27b0" />
              <Text c="dimmed">Secure & Transparent</Text>
            </Stack>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

export default HomePage;
