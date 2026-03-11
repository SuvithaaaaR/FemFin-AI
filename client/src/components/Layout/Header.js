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
  IconLogin,
  IconUserPlus,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

          {user ? (
            <Menu shadow="md" width={220}>
              <Menu.Target>
                <Button
                  variant="default"
                  leftSection={<IconUser size={rem(16)} />}
                >
                  {user.name}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={<IconDashboard size={rem(16)} />}
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconUser size={rem(16)} />}
                  onClick={() => navigate("/dashboard")}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  leftSection={
                    computedColorScheme === "dark" ? (
                      <IconSun size={rem(16)} />
                    ) : (
                      <IconMoon size={rem(16)} />
                    )
                  }
                  onClick={toggleColorScheme}
                >
                  {computedColorScheme === "dark" ? "Light Mode" : "Dark Mode"}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={rem(16)} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              <Button
                variant="default"
                leftSection={<IconLogin size={rem(16)} />}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="filled"
                leftSection={<IconUserPlus size={rem(16)} />}
                onClick={() => navigate("/register")}
              >
                Register
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
            </>
          )}
        </Group>

        {/* Mobile Navigation */}
        <Group gap="xs" hiddenFrom="md">
          <Menu shadow="md" width={220}>
            <Menu.Target>
              <Burger opened={opened} onClick={toggle} />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Navigation</Menu.Label>
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
              {user ? (
                <>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    leftSection={<IconDashboard size={rem(16)} />}
                    onClick={() => {
                      navigate("/dashboard");
                      toggle();
                    }}
                  >
                    Dashboard
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconUser size={rem(16)} />}
                    onClick={() => {
                      navigate("/dashboard");
                      toggle();
                    }}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    leftSection={
                      computedColorScheme === "dark" ? (
                        <IconSun size={rem(16)} />
                      ) : (
                        <IconMoon size={rem(16)} />
                      )
                    }
                    onClick={() => {
                      toggleColorScheme();
                      toggle();
                    }}
                  >
                    {computedColorScheme === "dark"
                      ? "Light Mode"
                      : "Dark Mode"}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconLogout size={rem(16)} />}
                    color="red"
                    onClick={() => {
                      handleLogout();
                      toggle();
                    }}
                  >
                    Logout
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    leftSection={<IconLogin size={rem(16)} />}
                    onClick={() => {
                      navigate("/login");
                      toggle();
                    }}
                  >
                    Login
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconUserPlus size={rem(16)} />}
                    onClick={() => {
                      navigate("/register");
                      toggle();
                    }}
                  >
                    Register
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    leftSection={
                      computedColorScheme === "dark" ? (
                        <IconSun size={rem(16)} />
                      ) : (
                        <IconMoon size={rem(16)} />
                      )
                    }
                    onClick={() => {
                      toggleColorScheme();
                      toggle();
                    }}
                  >
                    {computedColorScheme === "dark"
                      ? "Light Mode"
                      : "Dark Mode"}
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Container>
  );
}

export default Header;
