import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Stack,
  Alert,
  Group,
} from "@mantine/core";
import { IconAlertCircle, IconFaceId } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import FaceCapture from "../components/Auth/FaceCapture";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [useFaceLogin, setUseFaceLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faceImage, setFaceImage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");

    try {
      const response = await authService.login({ email, password });
      login(response.user, response.token);
      notifications.show({
        title: "Success",
        message: `Login successful. Welcome back, ${response.user.name}!`,
        color: "green",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again.",
      );
    }
  };

  const handleFaceLogin = async () => {
    if (!email || !faceImage) {
      setError("Email and face image are required.");
      return;
    }

    setError("");
    try {
      const response = await authService.loginWithFace({ email, faceImage });
      login(response.user, response.token);
      notifications.show({
        title: "Success",
        message: `Face verified. Welcome, ${response.user.name}!`,
        color: "green",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Face login failed. Please try again.",
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
          <Group grow>
            <Button
              variant={!useFaceLogin ? "filled" : "light"}
              onClick={() => {
                setUseFaceLogin(false);
                setError("");
              }}
            >
              Password Login
            </Button>
            <Button
              variant={useFaceLogin ? "filled" : "light"}
              leftSection={<IconFaceId size="1rem" />}
              onClick={() => {
                setUseFaceLogin(true);
                setError("");
              }}
            >
              Face Login
            </Button>
          </Group>

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

          {!useFaceLogin && (
            <>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
              />
              <Button onClick={handleLogin} disabled={!email || !password}>
                Sign in
              </Button>
            </>
          )}

          {useFaceLogin && (
            <>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
              />
              <FaceCapture
                title="Scan Your Face"
                onCapture={(image) => {
                  setFaceImage(image);
                  setError("");
                }}
              />
              <Button onClick={handleFaceLogin} disabled={!email || !faceImage}>
                Verify Face & Sign in
              </Button>
            </>
          )}
        </Stack>

        <Text c="dimmed" size="xs" ta="center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Paper>
    </Container>
  );
}

export default Login;
