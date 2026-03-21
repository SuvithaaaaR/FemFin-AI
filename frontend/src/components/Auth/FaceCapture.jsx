import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Group, Image, Paper, Stack, Text } from "@mantine/core";
import {
  IconAlertCircle,
  IconCamera,
  IconCameraOff,
  IconCheck,
  IconPhoto,
} from "@tabler/icons-react";

function FaceCapture({ onCapture, disabled = false, title = "Face Capture" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [preview, setPreview] = useState("");
  const [cameraError, setCameraError] = useState("");

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (error) {
      setCameraError("Unable to access camera. Please allow camera permissions.");
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      setCameraError("Camera is not ready yet. Please try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPreview(dataUrl);
    onCapture(dataUrl);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <Paper withBorder p="sm" radius="md">
      <Stack gap="sm">
        <Text size="sm" fw={600}>
          {title}
        </Text>

        {cameraError && (
          <Alert
            color="red"
            variant="light"
            icon={<IconAlertCircle size="1rem" />}
            title="Camera Error"
          >
            {cameraError}
          </Alert>
        )}

        <video
          ref={videoRef}
          style={{
            width: "100%",
            borderRadius: 8,
            display: cameraActive ? "block" : "none",
            background: "#f1f3f5",
          }}
          playsInline
          muted
        />

        {!cameraActive && (
          <Text size="xs" c="dimmed">
            Start camera, center your face in the frame, then capture.
          </Text>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {preview && (
          <Image
            src={preview}
            alt="Captured face"
            radius="md"
            style={{ border: "1px solid #dee2e6" }}
          />
        )}

        <Group>
          {!cameraActive ? (
            <Button
              variant="light"
              leftSection={<IconCamera size="1rem" />}
              onClick={startCamera}
              disabled={disabled}
            >
              Start Camera
            </Button>
          ) : (
            <Button
              variant="light"
              color="gray"
              leftSection={<IconCameraOff size="1rem" />}
              onClick={stopCamera}
              disabled={disabled}
            >
              Stop Camera
            </Button>
          )}

          <Button
            onClick={captureImage}
            leftSection={<IconPhoto size="1rem" />}
            disabled={!cameraActive || disabled}
          >
            Capture Face
          </Button>

          {preview && (
            <Text size="xs" c="green" fw={600}>
              <IconCheck size={14} style={{ verticalAlign: "middle" }} /> Face captured
            </Text>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}

export default FaceCapture;
