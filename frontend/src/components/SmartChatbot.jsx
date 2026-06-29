import React, { useMemo, useRef, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
  Tooltip,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMessageChatbot, IconSend, IconX } from "@tabler/icons-react";

const DEFAULT_WEBHOOK_URL = "http://localhost:5678/webhook/smartchat";

function normalizeResponseText(payload) {
  if (typeof payload === "string") {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  const candidateValues = [
    payload.reply,
    payload.answer,
    payload.message,
    payload.text,
    payload.content,
    payload.output,
    payload.data,
    payload.response,
  ];

  for (const value of candidateValues) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (value && typeof value === "object") {
      const nestedText = normalizeResponseText(value);
      if (nestedText) {
        return nestedText;
      }
    }
  }

  return "";
}

function buildRequestBody(message, history) {
  return {
    message,
    chatInput: message,
    prompt: message,
    text: message,
    conversationHistory: history,
    history,
    messages: history,
    source: "femfin-website",
  };
}

function SmartChatbot() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I can help with funding, credit scoring, crowdfunding, and platform questions.",
    },
  ]);
  const viewportRef = useRef(null);

  const webhookUrl = useMemo(
    () =>
      process.env.REACT_APP_SMARTCHAT_WEBHOOK_URL || DEFAULT_WEBHOOK_URL,
    [],
  );

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending) {
      return;
    }

    const nextMessages = [
      ...messages,
      { role: "user", content: trimmedMessage },
    ];

    setMessages(nextMessages);
    setMessage("");
    setSending(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildRequestBody(trimmedMessage, nextMessages)),
      });

      const contentType = response.headers.get("content-type") || "";
      let responsePayload = "";

      if (contentType.includes("application/json")) {
        responsePayload = await response.json();
      } else {
        responsePayload = await response.text();
      }

      const replyText = normalizeResponseText(responsePayload);

      if (!response.ok) {
        throw new Error(replyText || "Webhook request failed.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            replyText ||
            "I received your message, but the webhook did not return a readable reply.",
        },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            error.message ||
            "Sorry, I could not reach the chatbot service right now.",
        },
      ]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: rem(20),
        bottom: rem(20),
        zIndex: 1000,
      }}
    >
      {opened ? (
        <Card
          shadow="xl"
          radius="xl"
          withBorder
          padding="md"
          style={{
            width: "min(380px, calc(100vw - 24px))",
            height: "min(560px, calc(100vh - 120px))",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,245,255,0.98))",
            backdropFilter: "blur(12px)",
          }}
        >
          <Stack gap="sm" h="100%">
            <Group justify="space-between" align="flex-start">
              <div>
                <Group gap={6}>
                  <Text fw={700}>FemFin SmartChat</Text>
                  <Badge color="violet" variant="light" size="sm">
                    Webhook
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  Connected to {webhookUrl}
                </Text>
              </div>

              <Tooltip label="Close chat">
                <ActionIcon variant="subtle" color="gray" onClick={close}>
                  <IconX size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>

            <Paper
              ref={viewportRef}
              withBorder
              radius="lg"
              p="sm"
              style={{
                flex: 1,
                overflowY: "auto",
                background: "#fff",
              }}
            >
              <Stack gap="sm" pr="xs">
                {messages.map((entry, index) => (
                  <Group
                    key={`${entry.role}-${index}`}
                    justify={entry.role === "user" ? "flex-end" : "flex-start"}
                  >
                    <Paper
                      radius="lg"
                      px="md"
                      py="sm"
                      maw="85%"
                      shadow="xs"
                      style={{
                        background:
                          entry.role === "user"
                            ? "linear-gradient(135deg, #6d28d9, #8b5cf6)"
                            : "#f6f3ff",
                        color: entry.role === "user" ? "#fff" : "inherit",
                      }}
                    >
                      <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                        {entry.content}
                      </Text>
                    </Paper>
                  </Group>
                ))}
                {sending && (
                  <Group justify="flex-start">
                    <Paper radius="lg" px="md" py="sm" shadow="xs">
                      <Group gap="xs">
                        <Loader size="xs" />
                        <Text size="sm" c="dimmed">
                          Typing...
                        </Text>
                      </Group>
                    </Paper>
                  </Group>
                )}
              </Stack>
            </Paper>

            <Stack gap={6}>
              <Textarea
                autosize
                minRows={2}
                maxRows={4}
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about funding, loans, crowdfunding, or the platform..."
                disabled={sending}
              />
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Press Enter to send
                </Text>
                <Button
                  onClick={sendMessage}
                  leftSection={<IconSend size={16} />}
                  loading={sending}
                >
                  Send
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Card>
      ) : (
        <Tooltip label="Open chat" position="left">
          <ActionIcon
            onClick={toggle}
            size={60}
            radius="xl"
            variant="gradient"
            gradient={{ from: "violet", to: "grape", deg: 135 }}
            style={{ boxShadow: "0 14px 34px rgba(109, 40, 217, 0.32)" }}
            aria-label="Open chatbot"
          >
            <IconMessageChatbot size={30} />
          </ActionIcon>
        </Tooltip>
      )}
    </div>
  );
}

export default SmartChatbot;