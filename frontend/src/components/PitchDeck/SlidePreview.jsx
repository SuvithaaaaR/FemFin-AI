import React from "react";
import { Badge, Card, Group, Paper, Stack, Text, Title } from "@mantine/core";

function SlidePreview({ slides }) {
  if (!slides.length) {
    return (
      <Card withBorder radius="md" padding="lg">
        <Stack>
          <Title order={3}>Deck Preview</Title>
          <Text c="dimmed" size="sm">
            Your generated 12-slide pitch deck will appear here.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>12-Slide Preview</Title>
          <Badge color="violet" variant="light">
            {slides.length} Slides
          </Badge>
        </Group>

        <Stack gap="sm">
          {slides.map((slide) => (
            <Paper key={slide.id} p="sm" withBorder>
              <Stack gap={6}>
                <Text fw={700} c="pink.7">
                  {slide.id}. {slide.title}
                </Text>
                {slide.points.slice(0, 2).map((point, index) => (
                  <Text key={index} size="sm" c="dimmed">
                    - {point}
                  </Text>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default SlidePreview;
