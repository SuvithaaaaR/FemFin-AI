import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconClock, IconInfoCircle } from "@tabler/icons-react";
import apiClient from "../services/api";

function RecommendationHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get("/fund-recommendations/history");
        setHistory(response.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load recommendation history right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Title order={1}>Recommendation History</Title>
          <Text c="dimmed" size="lg">
            Saved AI fund recommendation inputs and results
          </Text>
        </div>

        {loading ? (
          <Group justify="center" py="xl">
            <Loader size="lg" />
          </Group>
        ) : null}

        {!loading && error ? (
          <Alert color="red" icon={<IconInfoCircle size={16} />}>
            {error}
          </Alert>
        ) : null}

        {!loading && !error && history.length === 0 ? (
          <Alert color="blue" icon={<IconInfoCircle size={16} />}>
            No saved recommendation history found yet. Submit AI Recommendation
            once to see entries here.
          </Alert>
        ) : null}

        {!loading && !error
          ? history.map((entry) => {
              const totalRecommendations = [
                ...(entry.recommendations?.governmentSchemes || []),
                ...(entry.recommendations?.angelInvestors || []),
                ...(entry.recommendations?.vcFunds || []),
                ...(entry.recommendations?.grants || []),
              ];

              return (
                <Card key={entry._id} withBorder radius="md" padding="lg">
                  <Stack gap="md">
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text fw={700}>{entry.businessIdea}</Text>
                        <Text size="sm" c="dimmed">
                          {entry.industryType} • {entry.businessStage} • Budget:
                          ₹
                          {Number(entry.budgetRequired || 0).toLocaleString(
                            "en-IN",
                          )}
                        </Text>
                      </div>
                      <Badge leftSection={<IconClock size={12} />}>
                        {new Date(entry.createdAt).toLocaleString()}
                      </Badge>
                    </Group>

                    <Paper p="sm" withBorder bg="gray.0">
                      <Text size="sm" fw={600} mb={4}>
                        Contact Details
                      </Text>
                      <Text size="sm">Name: {entry.fullName || "-"}</Text>
                      <Text size="sm">Email: {entry.email || "-"}</Text>
                      <Text size="sm">Phone: {entry.phone || "-"}</Text>
                    </Paper>

                    <Stack gap="xs">
                      <Text size="sm" fw={600}>
                        Top recommended funds ({totalRecommendations.length})
                      </Text>
                      {totalRecommendations.slice(0, 5).map((item, index) => (
                        <Paper key={`${entry._id}-${index}`} p="sm" withBorder>
                          <Group justify="space-between" align="flex-start">
                            <div>
                              <Text fw={600}>{item.name}</Text>
                              {item.comparisonText ? (
                                <Text size="sm" c="dimmed">
                                  {item.comparisonText}
                                </Text>
                              ) : null}
                            </div>
                            <Badge color="green" variant="light">
                              {item.matchScore || 0}%
                            </Badge>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              );
            })
          : null}
      </Stack>
    </Container>
  );
}

export default RecommendationHistory;
