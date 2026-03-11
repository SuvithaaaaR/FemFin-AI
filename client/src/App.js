import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell, Container } from "@mantine/core";
import Header from "./components/Layout/Header";
import HomePage from "./pages/HomePage";
import FundRecommendation from "./pages/FundRecommendation";
import Crowdfunding from "./pages/Crowdfunding";
import CreditScoring from "./pages/CreditScoring";
import Dashboard from "./pages/Dashboard";

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
              <Route
                path="/fund-recommendation"
                element={<FundRecommendation />}
              />
              <Route path="/crowdfunding" element={<Crowdfunding />} />
              <Route path="/credit-scoring" element={<CreditScoring />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Container>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

export default App;
