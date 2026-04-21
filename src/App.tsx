import React, { lazy, Suspense } from 'react';
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
import { GenericPageSkeleton } from "@/components/ui/page-skeletons";

import HomePage from "./pages/HomePage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import JournalPage from "./pages/JournalPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import GratitudePage from "./pages/GratitudePage";
import RemindersPage from "./pages/RemindersPage";
import TimerPage from "./pages/TimerPage";
import CrisisResourcesPage from "./pages/CrisisResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import GuestUpgradePrompt from "./components/auth/GuestUpgradePrompt";

// Route-level code splitting for heavy / lower-traffic pages.
// Cuts ~40% off the initial bundle and defers recharts/dashboards.
const PlannerPage = lazy(() => import("./pages/PlannerPage"));
const SupportToolkitPage = lazy(() => import("./pages/SupportToolkitPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard"));
const PersonalizationPage = lazy(() => import("./pages/PersonalizationPage"));

const queryClient = new QueryClient();

const RouteFallback = () => <GenericPageSkeleton />;

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
            <Suspense fallback={<RouteFallback />}>
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
            </Suspense>
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
