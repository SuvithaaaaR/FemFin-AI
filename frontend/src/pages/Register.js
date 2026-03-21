import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Anchor,
  Select,
  Alert,
  Stack,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");

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
      name: (value) => (value.trim() ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
      phoneNumber: (value) =>
        !value || /^[0-9]{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits",
    },
  });

  const handleRegister = async () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    setError("");

    try {
      const response = await authService.register({
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
        phoneNumber: form.values.phoneNumber || undefined,
        role: form.values.role || "entrepreneur",
      });

      login(response.user, response.token);

      notifications.show({
        title: "Success",
        message: "Account created successfully!",
        color: "green",
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.",
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

          <TextInput
            label="Full name"
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
            label="Phone number (optional)"
            placeholder="9876543210"
            {...form.getInputProps("phoneNumber")}
          />

          <PasswordInput
            label="Password"
            placeholder="At least 6 characters"
            required
            {...form.getInputProps("password")}
          />

          <PasswordInput
            label="Confirm password"
            placeholder="Re-enter password"
            required
            {...form.getInputProps("confirmPassword")}
          />

          <Button onClick={handleRegister}>Create account</Button>
        </Stack>

        <Text c="dimmed" size="xs" ta="center" mt="md">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Paper>
    </Container>
  );
}

export default Register;
