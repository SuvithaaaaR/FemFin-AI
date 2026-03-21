import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Select,
  Stack,
  Anchor,
  Alert,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconUserPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import FaceCapture from "../components/Auth/FaceCapture";
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      role: "entrepreneur",
    },

    validate: {
      name: (value) => (!value ? "Name is required" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
      phoneNumber: (value) =>
        value && !/^[0-9]{10}$/.test(value)
          ? "Phone number must be 10 digits"
          : null,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...registerData } = values;
      const response = await authService.register(registerData);

      if (enableFaceLogin) {
        if (!faceImage) {
          throw new Error("Please capture your face image for biometric enrollment.");
        }

        await authService.enrollFace({ faceImage });
      }

      // Update auth context
      login(response.user, response.token);

      // Show success notification
      notifications.show({
        title: "Success",
        message: enableFaceLogin
          ? "Account created and face login enrolled successfully!"
          : "Account created successfully!",
        color: "green",
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (idToken) => {
    setLoading(true);
    setError("");

    try {
      const response = await authService.loginWithGoogle({
        idToken,
        role: form.values.role || "entrepreneur",
      });

      login(response.user, response.token);

      notifications.show({
        title: "Success",
        message: "Google account connected successfully!",
        color: "green",
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Google sign-up failed. Please try again.",
      );
    } finally {
      setLoading(false);
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
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

            <TextInput
              label="Full Name"
              placeholder="Your name"
              required
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps("email")}
            />

            <TextInput
              label="Phone Number"
              placeholder="1234567890"
              description="Optional - 10 digit number"
              {...form.getInputProps("phoneNumber")}
            />

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

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps("confirmPassword")}
            />

            <Checkbox
              label="Enable Face Login (Biometric)"
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
                disabled={loading}
              />
            )}
          </Stack>

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={loading}
            leftSection={<IconUserPlus size="1rem" />}
            disabled={enableFaceLogin && !faceImage}
          >
            Create Account
          </Button>
        </form>

        <Text c="dimmed" size="xs" ta="center" mt="md">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>

        <Text c="dimmed" size="xs" ta="center" mt="md" mb="xs">
          Or continue with Google
        </Text>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleSignInButton
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={handleGoogleRegister}
            onError={(msg) => setError(msg)}
            text="signup_with"
            width={300}
          />
        </div>
      </Paper>
    </Container>
  );
}

export default Register;
