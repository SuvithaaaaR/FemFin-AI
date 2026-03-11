import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import App from "./App";

const theme = createTheme({
  primaryColor: "violet",
  colors: {
    violet: [
      "#f3e5f5",
      "#e1bee7",
      "#ce93d8",
      "#ba68c8",
      "#ab47bc",
      "#9c27b0",
      "#8e24aa",
      "#7b1fa2",
      "#6a1b9a",
      "#4a148c",
    ],
  },
  defaultRadius: "md",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
