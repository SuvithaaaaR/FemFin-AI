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
  Checkbox,
  Anchor,
  Stack,
  Alert,
  Divider,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconFaceId, IconLogin } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import FaceCapture from "../components/Auth/FaceCapture";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useFaceLogin, setUseFaceLogin] = useState(false);
  const [faceImage, setFaceImage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        useFaceLogin ? null : !value ? "Password is required" : null,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = useFaceLogin
        ? await authService.loginWithFace({
            email: values.email,
            faceImage,
          })
        : await authService.login({
            email: values.email,
            password: values.password,
          });

      // Update auth context
      login(response.user, response.token);

      // Show success notification
      notifications.show({
        title: "Success",
        message: useFaceLogin
          ? `Face verified. Welcome back, ${response.user.name}!`
          : `Welcome back, ${response.user.name}!`,
        color: "green",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
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
        <Group grow mb="md">
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
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps("email")}
            />

            {!useFaceLogin && (
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                {...form.getInputProps("password")}
              />
            )}

            {useFaceLogin && (
              <FaceCapture
                title="Scan Your Face"
                onCapture={(image) => {
                  setFaceImage(image);
                  setError("");
                }}
                disabled={loading}
              />
            )}

            {!useFaceLogin && (
              <Group justify="space-between" mt="xs">
                <Checkbox
                  label="Remember me"
                  {...form.getInputProps("rememberMe", { type: "checkbox" })}
                />
                <Anchor component="button" size="sm">
                  Forgot password?
                </Anchor>
              </Group>
            )}
          </Stack>

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={loading}
            leftSection={
              useFaceLogin ? <IconFaceId size="1rem" /> : <IconLogin size="1rem" />
            }
            disabled={useFaceLogin && !faceImage}
          >
            {useFaceLogin ? "Verify Face & Sign in" : "Sign in"}
          </Button>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Text c="dimmed" size="xs" ta="center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Paper>
    </Container>
  );
}

export default Login;
