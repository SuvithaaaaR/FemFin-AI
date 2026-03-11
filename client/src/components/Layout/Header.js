import React from "react";
import {
  Group,
  Button,
  Title,
  Container,
  rem,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Menu,
  Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import {
  IconChartBar,
  IconCoins,
  IconCreditCard,
  IconDashboard,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";

function Header() {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return (
    <Container size="xl" h="100%">
      <Group justify="space-between" h="100%">
        <Group onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <Title order={2} c="violet">
            FemFin AI
          </Title>
        </Group>

        {/* Desktop Navigation */}
        <Group gap="xs" visibleFrom="md">
          <Button
            variant="subtle"
            leftSection={<IconChartBar size={rem(16)} />}
            onClick={() => navigate("/fund-recommendation")}
          >
            Funds
          </Button>

          <Button
            variant="subtle"
            leftSection={<IconCoins size={rem(16)} />}
            onClick={() => navigate("/crowdfunding")}
          >
            Crowdfunding
          </Button>

          <Button
            variant="subtle"
            leftSection={<IconCreditCard size={rem(16)} />}
            onClick={() => navigate("/credit-scoring")}
          >
            Credit Score
          </Button>

          <Button
            variant="filled"
            leftSection={<IconDashboard size={rem(16)} />}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>

          <ActionIcon
            onClick={toggleColorScheme}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
          >
            {computedColorScheme === "dark" ? (
              <IconSun size={rem(18)} />
            ) : (
              <IconMoon size={rem(18)} />
            )}
          </ActionIcon>
        </Group>

        {/* Mobile Navigation */}
        <Group gap="xs" hiddenFrom="md">
          <ActionIcon
            onClick={toggleColorScheme}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
          >
            {computedColorScheme === "dark" ? (
              <IconSun size={rem(18)} />
            ) : (
              <IconMoon size={rem(18)} />
            )}
          </ActionIcon>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Burger opened={opened} onClick={toggle} />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconChartBar size={rem(16)} />}
                onClick={() => {
                  navigate("/fund-recommendation");
                  toggle();
                }}
              >
                Fund Recommendations
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCoins size={rem(16)} />}
                onClick={() => {
                  navigate("/crowdfunding");
                  toggle();
                }}
              >
                Crowdfunding
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCreditCard size={rem(16)} />}
                onClick={() => {
                  navigate("/credit-scoring");
                  toggle();
                }}
              >
                Credit Scoring
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconDashboard size={rem(16)} />}
                onClick={() => {
                  navigate("/dashboard");
                  toggle();
                }}
              >
                Dashboard
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Container>
  );
}

export default Header;
