import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  Group,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async (idToken) => {
    setError("");

    try {
      const response = await authService.loginWithGoogle({ idToken });
      login(response.user, response.token);
      notifications.show({
        title: "Success",
        message: `Google sign-in successful. Welcome, ${response.user.name}!`,
        color: "green",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Google sign-in failed. Please try again.",
      );
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        ta="center"
        style={{
          fontWeight: 900,
          fontSize: "2rem",
        }}
      >
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
          {error && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Error"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <Text ta="center" c="dimmed" size="sm">
            Continue using your Google account.
          </Text>

          <Group justify="center">
            <GoogleSignInButton
              clientId={GOOGLE_CLIENT_ID}
              onSuccess={handleGoogleLogin}
              onError={(msg) => setError(msg)}
              text="signin_with"
              width={300}
            />
          </Group>
        </Stack>

        <Text c="dimmed" size="xs" ta="center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Paper>
    </Container>
  );
}

export default Login;
