import React from "react";
import {
  Button,
  Card,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";

function PitchDeckForm({
  values,
  onChange,
  onAutoFill,
  onGenerate,
  loading,
  useGrokEnhancement,
  onToggleGrok,
}) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="sm">
        <Title order={3}>Pitch Inputs</Title>
        <Text size="sm" c="dimmed">
          Fill 5 key details and generate an investor-ready 12-slide deck.
        </Text>

        <TextInput
          label="Company Name"
          placeholder="AI AgriTech"
          value={values.companyName}
          onChange={(event) =>
            onChange("companyName", event.currentTarget.value)
          }
          required
        />

        <Textarea
          label="Problem"
          placeholder="40% crop loss due to delayed disease detection"
          minRows={2}
          value={values.problem}
          onChange={(event) => onChange("problem", event.currentTarget.value)}
          required
        />

        <Textarea
          label="Solution"
          placeholder="Satellite and AI monitoring with early warning"
          minRows={2}
          value={values.solution}
          onChange={(event) => onChange("solution", event.currentTarget.value)}
          required
        />

        <NumberInput
          label="Funding Ask (INR)"
          placeholder="2500000"
          value={values.fundingAskAmount}
          onChange={(value) => onChange("fundingAskAmount", value || 0)}
          min={100000}
          step={50000}
          allowNegative={false}
          thousandSeparator=","
          required
        />

        <TextInput
          label="Equity Offered"
          placeholder="10%"
          value={values.equityOffered}
          onChange={(event) =>
            onChange("equityOffered", event.currentTarget.value)
          }
          required
        />

        <Select
          label="Industry"
          data={["AgriTech", "Social", "Retail"]}
          placeholder="Select industry"
          value={values.industry}
          onChange={(value) => onChange("industry", value || "")}
          required
        />

        <TextInput
          label="Founder Contact"
          placeholder="founder@email.com | +91-98XXXXXXXX"
          value={values.contact}
          onChange={(event) => onChange("contact", event.currentTarget.value)}
          required
        />

        <Switch
          checked={useGrokEnhancement}
          onChange={onToggleGrok}
          color="violet"
          label="Use Grok AI to enrich each slide with deeper content"
        />

        <Stack gap={8} mt="xs">
          <Button variant="light" color="pink" onClick={onAutoFill}>
            AI Auto-Fill India Insights
          </Button>
          <Button
            color="violet"
            onClick={onGenerate}
            loading={loading}
            disabled={
              !values.companyName || !values.problem || !values.solution
            }
          >
            Generate 12-Slide Deck
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default PitchDeckForm;
