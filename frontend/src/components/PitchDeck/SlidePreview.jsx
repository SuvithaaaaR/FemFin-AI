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

                {!!slide.points?.[0] && (
                  <Text size="sm" fw={600}>
                    Executive takeaway: {slide.points[0]}
                  </Text>
                )}

                {(slide.points || []).slice(1, 9).map((point, index) => (
                  <Text key={index} size="sm" c="dimmed">
                    - {point}
                  </Text>
                ))}

                {(slide.points || []).length > 9 && (
                  <Text size="xs" c="gray.6">
                    + {(slide.points || []).length - 9} additional points not shown
                  </Text>
                )}

                {slide.chartData?.series?.length > 0 && (
                  <Group gap={6}>
                    <Badge size="xs" color="violet" variant="light">
                      Chart: {slide.chartData.title || "Key Metrics"}
                    </Badge>
                    {slide.chartData.series.slice(0, 3).map((item) => (
                      <Badge key={`${slide.id}-${item.label}`} size="xs" variant="outline">
                        {item.label}: {item.value}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default SlidePreview;
