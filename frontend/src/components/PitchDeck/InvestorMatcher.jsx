import React from "react";
import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

function InvestorMatcher({
  investors,
  companyName,
  askLabel,
  onEmail,
  metadata,
}) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Recommended for {companyName || "your startup"} based on stage and
          sector.
        </Text>

        {metadata ? (
          <Group gap="xs">
            <Badge color="violet" variant="light">
              {metadata.totalInvestors} total investors
            </Badge>
            <Badge color="pink" variant="light">
              {metadata.womenFocused} women-focused
            </Badge>
            <Badge color="teal" variant="light">
              Avg ticket {metadata.avgTicketSize}
            </Badge>
          </Group>
        ) : null}

        <Stack gap="xs">
          {investors.map((investor) => (
            <Paper key={investor.id} withBorder p="sm" radius="md">
              <Stack gap={6}>
                <Group justify="space-between" wrap="wrap">
                  <Text fw={600}>{investor.name}</Text>
                  <Group gap={6}>
                    {typeof investor.matchScore === "number" ? (
                      <Badge color="grape" variant="light">
                        AI Match {investor.matchScore}/100
                      </Badge>
                    ) : null}
                    {investor.womenFocus ? (
                      <Badge color="pink" variant="light">
                        Women Focused
                      </Badge>
                    ) : null}
                    <Badge color="violet" variant="outline">
                      {investor.ticketSize}
                    </Badge>
                  </Group>
                </Group>

                <Text size="sm" c="dimmed">
                  Focus: {(investor.focus || []).join(", ") || "General"}
                </Text>
                <Text size="sm" c="dimmed">
                  Location: {investor.location || "N/A"}
                </Text>

                <Group gap="sm" wrap="wrap">
                  {investor.contact?.email ? (
                    <Text size="sm">Email: {investor.contact.email}</Text>
                  ) : null}
                  {investor.contact?.website ? (
                    <Anchor
                      href={investor.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                    >
                      Website
                    </Anchor>
                  ) : null}
                </Group>

                {investor.responseTime ? (
                  <Text size="xs" c="dimmed">
                    Response Time: {investor.responseTime}
                  </Text>
                ) : null}
                {investor.applicationProcess ? (
                  <Text size="xs" c="dimmed">
                    Process: {investor.applicationProcess}
                  </Text>
                ) : null}
                {investor.matchReason ? (
                  <Text size="xs" c="dimmed">
                    Why this match: {investor.matchReason}
                  </Text>
                ) : null}
                {investor.nextStep ? (
                  <Text size="xs" c="dimmed">
                    Suggested next step: {investor.nextStep}
                  </Text>
                ) : null}
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Button
          color="violet"
          variant="light"
          onClick={onEmail}
          disabled={!companyName || !askLabel}
        >
          Email to Matched Investors
        </Button>
      </Stack>
    </Card>
  );
}

export default InvestorMatcher;
