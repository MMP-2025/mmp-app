import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import AccessibilityToolbar from "@/components/accessibility/AccessibilityToolbar";
import VoiceControl from "@/components/accessibility/VoiceControl";
import LoginForm from "@/components/auth/LoginForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { registerSW } from './utils/serviceWorker';
import PageWrapper from "@/components/PageWrapper";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { useOnboarding } from "@/hooks/useOnboarding";

import HomePage from "./pages/HomePage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import JournalPage from "./pages/JournalPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import GratitudePage from "./pages/GratitudePage";
import PlannerPage from "./pages/PlannerPage";
import RemindersPage from "./pages/RemindersPage";
import TimerPage from "./pages/TimerPage";
import CrisisResourcesPage from "./pages/CrisisResourcesPage";
import SupportToolkitPage from "./pages/SupportToolkitPage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import ProviderDashboard from "./pages/ProviderDashboard";
import NotFound from "./pages/NotFound";
import PersonalizationPage from "./pages/PersonalizationPage";
import GuestUpgradePrompt from "./components/auth/GuestUpgradePrompt";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, isGuest } = useAuth();
  const { shouldShowOnboarding } = useOnboarding();

  React.useEffect(() => {
    registerSW();
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (shouldShowOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <UserPreferencesProvider>
      <AccessibilityProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <AccessibilityToolbar />
          <VoiceControl />
          <div className="w-full min-h-screen">
            <Routes>
              <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/crisis" element={<PageWrapper><CrisisResourcesPage /></PageWrapper>} />
              <Route path="/mood" element={<MoodTrackerPage />} />
              <Route path="/journal" element={<PageWrapper><JournalPage /></PageWrapper>} />
              <Route path="/mindfulness" element={<PageWrapper><MindfulnessPage /></PageWrapper>} />
              <Route path="/gratitude" element={<PageWrapper><GratitudePage /></PageWrapper>} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/reminders" element={<PageWrapper><RemindersPage /></PageWrapper>} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/support-toolkit" element={<PageWrapper><SupportToolkitPage /></PageWrapper>} />
              <Route path="/community" element={<PageWrapper><CommunityPage /></PageWrapper>} />
              {!isGuest ? (
                <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
              ) : (
                <Route path="/profile" element={
                  <GuestUpgradePrompt 
                    featureName="Personal Profile"
                    description="Create and manage your personalized wellness profile"
                    features={[
                      "Save your preferences and settings",
                      "Track your progress over time",
                      "Personalized recommendations",
                      "Custom reminders and goals",
                      "Data backup and synchronization"
                    ]}
                  />
                } />
              )}
              <Route path="/provider-dashboard" element={
                <ProtectedRoute requiredRole="provider">
                  <PageWrapper><ProviderDashboard /></PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/personalization" element={<PersonalizationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </AccessibilityProvider>
    </UserPreferencesProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
