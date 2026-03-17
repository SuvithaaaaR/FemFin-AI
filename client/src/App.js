import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell, Container } from "@mantine/core";
import Header from "./components/Layout/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import FundDetails from "./pages/FundDetails";
import ApplyFund from "./pages/ApplyFund";
import FundRecommendation from "./pages/FundRecommendation";
import Crowdfunding from "./pages/Crowdfunding";
import CreditScoring from "./pages/CreditScoring";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <AppShell header={{ height: 70 }} padding="md">
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        <AppShell.Main>
          <Container size="xl" py="xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/fund-details"
                element={
                  <ProtectedRoute>
                    <FundDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply-fund"
                element={
                  <ProtectedRoute>
                    <ApplyFund />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fund-recommendation"
                element={
                  <ProtectedRoute>
                    <FundRecommendation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crowdfunding"
                element={
                  <ProtectedRoute>
                    <Crowdfunding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/credit-scoring"
                element={
                  <ProtectedRoute>
                    <CreditScoring />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

export default App;
