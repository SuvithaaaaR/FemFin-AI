import React, { useMemo, useState } from "react";
import {
  Anchor,
  Badge,
  Card,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import indiaInvestors from "../data/indiaInvestors.json";

const isValidInvestorData = (data) => {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.networks) &&
    data.metadata &&
    typeof data.metadata === "object"
  );
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
    return isValidInvestorData(parsed) ? parsed : indiaInvestors;
  } catch (error) {
    return indiaInvestors;
  }
};

function InvestorDetailsPage() {
  const [investorData] = useState(() => getInitialInvestorData());

  const networkCount = useMemo(
    () =>
      Array.isArray(investorData.networks) ? investorData.networks.length : 0,
    [investorData],
  );

  const individualCount = useMemo(
    () =>
      Array.isArray(investorData.individuals)
        ? investorData.individuals.length
        : 0,
    [investorData],
  );

  const networkNameById = useMemo(() => {
    const map = {};
    (investorData.networks || []).forEach((network) => {
      map[network.id] = network.name;
    });
    return map;
  }, [investorData]);

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Investor Details</Title>
          <Text c="dimmed" size="lg">
            Separate page to view and update all investor data used in Pitch
            Deck Generator.
          </Text>
        </div>

        <Group gap="xs">
          <Badge color="violet" variant="light">
            {investorData.metadata?.totalInvestors || 0} total investors
          </Badge>
          <Badge color="pink" variant="light">
            {investorData.metadata?.womenFocused || 0} women-focused
          </Badge>
          <Badge color="teal" variant="light">
            Avg ticket {investorData.metadata?.avgTicketSize || "N/A"}
          </Badge>
          <Badge color="gray" variant="light">
            Updated {investorData.metadata?.lastUpdated || "N/A"}
          </Badge>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Card withBorder radius="md" padding="lg">
              <Stack gap="sm">
                <Title order={3}>Angel Networks ({networkCount})</Title>
                {(investorData.networks || []).map((network) => (
                  <Paper key={network.id} withBorder p="sm" radius="md">
                    <Stack gap={6}>
                      <Group justify="space-between" wrap="wrap">
                        <Text fw={700}>{network.name}</Text>
                        <Group gap={6}>
                          {network.womenFocus ? (
                            <Badge color="pink" variant="light">
                              Women Focused
                            </Badge>
                          ) : null}
                          <Badge color="violet" variant="outline">
                            {network.ticketSize || "N/A"}
                          </Badge>
                          {network.tnFocus ? (
                            <Badge color="teal" variant="light">
                              TN Focus
                            </Badge>
                          ) : null}
                        </Group>
                      </Group>
                      {network.id ? (
                        <Text size="xs" c="dimmed">
                          ID: {network.id}
                        </Text>
                      ) : null}
                      <Text size="sm" c="dimmed">
                        Focus: {(network.focus || []).join(", ") || "General"}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Location: {network.location || "N/A"}
                      </Text>
                      <Group gap="sm" wrap="wrap">
                        {network.contact?.email ? (
                          <Text size="sm">Email: {network.contact.email}</Text>
                        ) : null}
                        {network.contact?.phone ? (
                          <Text size="sm">Phone: {network.contact.phone}</Text>
                        ) : null}
                        {network.contact?.website ? (
                          <Anchor
                            href={network.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                          >
                            Website
                          </Anchor>
                        ) : null}
                      </Group>
                      {Array.isArray(network.keyMembers) &&
                      network.keyMembers.length > 0 ? (
                        <Text size="xs" c="dimmed">
                          Key Members:{" "}
                          {network.keyMembers
                            .map((member) => member.name || "Unnamed")
                            .join(", ")}
                        </Text>
                      ) : null}
                      {Array.isArray(network.notableInvestments) &&
                      network.notableInvestments.length > 0 ? (
                        <Text size="xs" c="dimmed">
                          Notable Investments:{" "}
                          {network.notableInvestments.join(", ")}
                        </Text>
                      ) : null}
                      {network.responseTime ? (
                        <Text size="xs" c="dimmed">
                          Response Time: {network.responseTime}
                        </Text>
                      ) : null}
                      {network.applicationProcess ? (
                        <Text size="xs" c="dimmed">
                          Process: {network.applicationProcess}
                        </Text>
                      ) : null}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Stack>
              <Card withBorder radius="md" padding="lg">
                <Stack gap="sm">
                  <Title order={3}>Individual Angels ({individualCount})</Title>
                  {(investorData.individuals || []).map((person) => (
                    <Paper key={person.id} withBorder p="sm" radius="md">
                      <Stack gap={4}>
                        <Text fw={700}>{person.name}</Text>
                        <Text size="sm" c="dimmed">
                          {person.title || "Angel Investor"}
                        </Text>
                        {person.id ? (
                          <Text size="xs" c="dimmed">
                            ID: {person.id}
                          </Text>
                        ) : null}
                        <Text size="sm" c="dimmed">
                          Focus: {(person.focus || []).join(", ") || "General"}
                        </Text>
                        <Text size="sm" c="dimmed">
                          Ticket: {person.ticketSize || "N/A"} |{" "}
                          {person.location || "N/A"}
                        </Text>
                        {person.investments ? (
                          <Text size="xs" c="dimmed">
                            Investments: {person.investments}
                          </Text>
                        ) : null}
                        {person.recentDeal ? (
                          <Text size="xs" c="dimmed">
                            Recent Deal: {person.recentDeal}
                          </Text>
                        ) : null}
                        {person.response ? (
                          <Text size="xs" c="dimmed">
                            Preferred Response Channel: {person.response}
                          </Text>
                        ) : null}

                        <Group gap="xs" wrap="wrap">
                          {person.contact?.linkedin ? (
                            <Anchor
                              href={person.contact.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="xs"
                            >
                              LinkedIn
                            </Anchor>
                          ) : null}
                          {person.contact?.twitter ? (
                            <Anchor
                              href={person.contact.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="xs"
                            >
                              Twitter
                            </Anchor>
                          ) : null}
                          {person.contact?.sharks ? (
                            <Text size="xs" c="dimmed">
                              {person.contact.sharks}
                            </Text>
                          ) : null}
                        </Group>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Card>

              <Card withBorder radius="md" padding="lg">
                <Stack gap="sm">
                  <Title order={4}>Regional Mapping</Title>
                  {Object.entries(investorData.regional || {}).map(
                    ([region, ids]) => (
                      <Text key={region} size="sm" c="dimmed">
                        {region}:{" "}
                        {(ids || [])
                          .map((id) => networkNameById[id] || id)
                          .join(", ")}
                      </Text>
                    ),
                  )}

                  <Title order={5} mt="xs">
                    Women Networks
                  </Title>
                  <Text size="sm" c="dimmed">
                    {(investorData.womenNetworks || []).join(", ") || "N/A"}
                  </Text>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default InvestorDetailsPage;
