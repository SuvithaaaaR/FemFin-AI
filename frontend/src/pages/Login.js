import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
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
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";
import FaceCapture from "../components/Auth/FaceCapture";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const isGoogleConfigured =
  Boolean(GOOGLE_CLIENT_ID) &&
  !GOOGLE_CLIENT_ID.includes("your_google_oauth_client_id");

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [useFaceLogin, setUseFaceLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [faceImage, setFaceImage] = useState("");

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
              Google Login
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
              <Text ta="center" c="dimmed" size="sm">
                Continue using your Google account.
              </Text>
              {!isGoogleConfigured ? (
                <Alert color="yellow" variant="light" title="Google Not Configured">
                  Google OAuth client ID is not configured. Add a real
                  REACT_APP_GOOGLE_CLIENT_ID to enable Google login.
                </Alert>
              ) : (
                <Group justify="center">
                  <GoogleSignInButton
                    clientId={GOOGLE_CLIENT_ID}
                    onSuccess={handleGoogleLogin}
                    onError={(msg) => setError(msg)}
                    text="signin_with"
                    width={300}
                  />
                </Group>
              )}
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
