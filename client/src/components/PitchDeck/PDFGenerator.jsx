import React from "react";
import { Button, Group } from "@mantine/core";

function PDFGenerator({
  disabled,
  onDownload,
  onPreview,
  onSave,
  onLinkedInShare,
}) {
  return (
    <Group wrap="wrap">
      <Button color="violet" onClick={onDownload} disabled={disabled}>
        Download PDF
      </Button>
      <Button
        variant="light"
        color="pink"
        onClick={onPreview}
        disabled={disabled}
      >
        Preview PDF
      </Button>
      <Button
        variant="outline"
        color="violet"
        onClick={onSave}
        disabled={disabled}
      >
        Save to Dashboard
      </Button>
      <Button
        variant="outline"
        color="pink"
        onClick={onLinkedInShare}
        disabled={disabled}
      >
        Share on LinkedIn
      </Button>
    </Group>
  );
}

export default PDFGenerator;
