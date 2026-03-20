import React from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Grid,
  Badge,
  ThemeIcon,
  rem,
  Paper,
  Progress,
  Button,
  Timeline,
  RingProgress,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconChartBar,
  IconCoins,
  IconCreditCard,
  IconTrendingUp,
  IconUsers,
  IconWallet,
  IconChecklist,
  IconClock,
  IconStar,
  IconArrowRight,
} from "@tabler/icons-react";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Applications",
      value: "12",
      icon: IconChecklist,
      color: "blue",
      description: "Fund applications submitted",
    },
    {
      title: "Active Campaigns",
      value: "3",
      icon: IconCoins,
      color: "violet",
      description: "Crowdfunding campaigns",
    },
    {
      title: "Credit Score",
      value: "785",
      icon: IconCreditCard,
      color: "teal",
      description: "Out of 900",
    },
    {
      title: "Funds Raised",
      value: "₹8.5L",
      icon: IconWallet,
      color: "green",
      description: "Total amount secured",
    },
  ];

  const recentActivity = [
    {
      title: "Credit Score Generated",
      description: "Your AI credit score is 785/900",
      time: "2 hours ago",
      color: "teal",
      icon: IconCreditCard,
    },
    {
      title: "New Investment Received",
      description: "Received ₹50,000 for Fashion Brand campaign",
      time: "5 hours ago",
      color: "green",
      icon: IconCoins,
    },
    {
      title: "Fund Recommendation",
      description: "Matched with 5 new funding opportunities",
      time: "1 day ago",
      color: "violet",
      icon: IconChartBar,
    },
    {
      title: "Application Approved",
      description: "Your application for Startup India Grant approved",
      time: "2 days ago",
      color: "blue",
      icon: IconChecklist,
    },
  ];

  const activeCampaigns = [
    {
      title: "Eco Fashion Brand",
      raised: 3500000,
      target: 5000000,
      investors: 124,
      daysLeft: 15,
    },
    {
      title: "Organic Cosmetics",
      raised: 1200000,
      target: 2000000,
      investors: 67,
      daysLeft: 22,
    },
  ];

  const recommendations = [
    {
      title: "Startup India Seed Fund",
      type: "Government Scheme",
      match: 95,
      color: "blue",
    },
    {
      title: "Women Entrepreneur Grant",
      type: "Grant",
      match: 92,
      color: "pink",
    },
    {
      title: "Angel Investors Network",
      type: "Angel Investor",
      match: 88,
      color: "violet",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Dashboard</Title>
          <Text c="dimmed" size="lg">
            Overview of your funding journey
          </Text>
        </div>

        {/* Stats Grid */}
        <Grid>
          {stats.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Group justify="space-between">
                    <ThemeIcon size={50} radius="md" color={stat.color}>
                      <stat.icon size={rem(28)} />
                    </ThemeIcon>
                    <IconTrendingUp color="#00b341" size={20} />
                  </Group>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      {stat.title}
                    </Text>
                    <Title order={2} mt={5}>
                      {stat.value}
                    </Title>
                    <Text size="xs" c="dimmed" mt={5}>
                      {stat.description}
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <Grid>
          {/* Active Campaigns */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ height: "100%" }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Title order={3}>Active Campaigns</Title>
                    <Text size="sm" c="dimmed">
                      Your crowdfunding campaigns
                    </Text>
                  </div>
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => navigate("/crowdfunding")}
                  >
                    View All
                  </Button>
                </Group>

                <Stack gap="md">
                  {activeCampaigns.map((campaign, idx) => (
                    <Paper key={idx} p="md" withBorder>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text fw={600}>{campaign.title}</Text>
                          <Badge color="violet">
                            {campaign.daysLeft} days left
                          </Badge>
                        </Group>
                        <Group justify="space-between" mb={5}>
                          <Text size="sm" c="dimmed">
                            ₹{(campaign.raised / 100000).toFixed(1)}L raised
                          </Text>
                          <Text size="sm" c="dimmed">
                            of ₹{(campaign.target / 100000).toFixed(1)}L
                          </Text>
                        </Group>
                        <Progress
                          value={(campaign.raised / campaign.target) * 100}
                          color="violet"
                          size="sm"
                          radius="xl"
                        />
                        <Group gap="xs">
                          <IconUsers size={14} />
                          <Text size="xs" c="dimmed">
                            {campaign.investors} investors
                          </Text>
                        </Group>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Credit Score Overview */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ height: "100%" }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Title order={3}>Credit Score</Title>
                    <Text size="sm" c="dimmed">
                      AI-powered assessment
                    </Text>
                  </div>
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => navigate("/credit-scoring")}
                  >
                    View Details
                  </Button>
                </Group>

                <Group justify="center" py="md">
                  <RingProgress
                    size={180}
                    thickness={16}
                    sections={[{ value: 87, color: "teal" }]}
                    label={
                      <div style={{ textAlign: "center" }}>
                        <Text size="xl" fw={700}>
                          785
                        </Text>
                        <Text size="xs" c="dimmed">
                          out of 900
                        </Text>
                        <Badge color="teal" mt="xs">
                          Excellent
                        </Badge>
                      </div>
                    }
                  />
                </Group>

                <Paper p="md" withBorder bg="teal.0">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>
                        Eligible for
                      </Text>
                      <Badge color="green">No Collateral</Badge>
                    </Group>
                    <Text size="xl" fw={700} c="teal">
                      ₹20L Loan
                    </Text>
                    <Text size="xs" c="dimmed">
                      At 8.5% interest • 60 months tenure
                    </Text>
                  </Stack>
                </Paper>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          {/* Top Recommendations */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Title order={3}>Top Recommendations</Title>
                    <Text size="sm" c="dimmed">
                      Best matches for your profile
                    </Text>
                  </div>
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => navigate("/fund-recommendation")}
                  >
                    View All
                  </Button>
                </Group>

                <Stack gap="sm">
                  {recommendations.map((rec, idx) => (
                    <Paper key={idx} p="md" withBorder>
                      <Group justify="space-between">
                        <div style={{ flex: 1 }}>
                          <Group gap="xs" mb={5}>
                            <Text fw={600}>{rec.title}</Text>
                            <Badge size="sm" color={rec.color} variant="light">
                              {rec.type}
                            </Badge>
                          </Group>
                          <Progress
                            value={rec.match}
                            color={rec.color}
                            size="sm"
                          />
                        </div>
                        <div style={{ textAlign: "center", minWidth: 60 }}>
                          <Text fw={700} size="lg" c={rec.color}>
                            {rec.match}%
                          </Text>
                          <Text size="xs" c="dimmed">
                            match
                          </Text>
                        </div>
                        <Button
                          variant="light"
                          color={rec.color}
                          size="xs"
                          rightSection={<IconArrowRight size={rem(14)} />}
                        >
                          Apply
                        </Button>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Recent Activity */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ height: "100%" }}
            >
              <Stack gap="md">
                <div>
                  <Title order={3}>Recent Activity</Title>
                  <Text size="sm" c="dimmed">
                    Your latest updates
                  </Text>
                </div>

                <Timeline
                  active={-1}
                  bulletSize={24}
                  lineWidth={2}
                  color="violet"
                >
                  {recentActivity.map((activity, idx) => (
                    <Timeline.Item
                      key={idx}
                      bullet={<activity.icon size={14} />}
                      title={
                        <Text size="sm" fw={600}>
                          {activity.title}
                        </Text>
                      }
                    >
                      <Text size="xs" c="dimmed" mt={4}>
                        {activity.description}
                      </Text>
                      <Group gap={4} mt={4}>
                        <IconClock size={12} color="#868e96" />
                        <Text size="xs" c="dimmed">
                          {activity.time}
                        </Text>
                      </Group>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Quick Actions */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Quick Actions</Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="light"
                  color="violet"
                  leftSection={<IconChartBar size={rem(18)} />}
                  onClick={() => navigate("/fund-recommendation")}
                >
                  Get Fund Recommendations
                </Button>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="light"
                  color="blue"
                  leftSection={<IconCoins size={rem(18)} />}
                  onClick={() => navigate("/crowdfunding")}
                >
                  Create Campaign
                </Button>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="light"
                  color="teal"
                  leftSection={<IconCreditCard size={rem(18)} />}
                  onClick={() => navigate("/credit-scoring")}
                >
                  Check Credit Score
                </Button>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="light"
                  color="green"
                  leftSection={<IconWallet size={rem(18)} />}
                >
                  Apply for Loan
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

export default Dashboard;
