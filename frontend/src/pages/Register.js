import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  Anchor,
  Select,
  Alert,
  Stack,
  Checkbox,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";
import FaceCapture from "../components/Auth/FaceCapture";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const isGoogleConfigured =
  Boolean(GOOGLE_CLIENT_ID) &&
  !GOOGLE_CLIENT_ID.includes("your_google_oauth_client_id");

function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [enableFaceLogin, setEnableFaceLogin] = useState(false);
  const [faceImage, setFaceImage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    initialValues: {
      role: "entrepreneur",
    },
  });

  const handleGoogleRegister = async (idToken) => {
    setError("");

    try {
      const response = await authService.loginWithGoogle({
        idToken,
        role: form.values.role || "entrepreneur",
      });

      login(response.user, response.token);

      if (enableFaceLogin && faceImage) {
        await authService.enrollFace({ faceImage });
      }

      notifications.show({
        title: "Success",
        message: enableFaceLogin
          ? "Google account connected and face verification enabled."
          : "Google account connected successfully!",
        color: "green",
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Google sign-up failed. Please try again.",
      );
    }
  };

  return (
    <Container size={460} my={40}>
      <Title
        ta="center"
        style={{
          fontWeight: 900,
          fontSize: "2rem",
        }}
      >
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Sign in
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

          <Select
            label="I am an..."
            placeholder="Select your role"
            required
            data={[
              { value: "entrepreneur", label: "Entrepreneur" },
              { value: "investor", label: "Investor" },
            ]}
            {...form.getInputProps("role")}
          />

          <Checkbox
            label="Enable Face Verification"
            checked={enableFaceLogin}
            onChange={(event) => {
              setEnableFaceLogin(event.currentTarget.checked);
              setError("");
            }}
          />

          {enableFaceLogin && (
            <FaceCapture
              title="Capture Face For Enrollment"
              onCapture={(image) => {
                setFaceImage(image);
                setError("");
              }}
            />
          )}

          {!isGoogleConfigured ? (
            <Alert color="yellow" variant="light" title="Google Not Configured">
              Google OAuth client ID is not configured. Add a real
              REACT_APP_GOOGLE_CLIENT_ID to enable Google sign-up.
            </Alert>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GoogleSignInButton
                clientId={GOOGLE_CLIENT_ID}
                onSuccess={handleGoogleRegister}
                onError={(msg) => setError(msg)}
                text="signup_with"
                width={300}
              />
            </div>
          )}

          {enableFaceLogin && !faceImage && (
            <Button variant="light" color="gray" disabled>
              Capture face to enable verification
            </Button>
          )}
        </Stack>

        <Text c="dimmed" size="xs" ta="center" mt="md">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Paper>
    </Container>
  );
}

export default Register;
