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
    // Register service worker for PWA functionality
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
              <Route path="/" element={
                <PageWrapper backgroundColor="bg-mental-peach">
                  <HomePage />
                </PageWrapper>
              } />
              <Route path="/crisis" element={
                <PageWrapper backgroundColor="bg-red-50">
                  <CrisisResourcesPage />
                </PageWrapper>
              } />
              <Route path="/mood" element={<MoodTrackerPage />} />
              <Route path="/journal" element={
                <PageWrapper backgroundColor="bg-mental-green">
                  <JournalPage />
                </PageWrapper>
              } />
              <Route path="/mindfulness" element={
                <PageWrapper backgroundColor="bg-mental-beige">
                  <MindfulnessPage />
                </PageWrapper>
              } />
              <Route path="/gratitude" element={
                <PageWrapper backgroundColor="bg-mental-gray">
                  <GratitudePage />
                </PageWrapper>
              } />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/reminders" element={
                <PageWrapper backgroundColor="bg-mental-peach">
                  <RemindersPage />
                </PageWrapper>
              } />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/support-toolkit" element={
                <PageWrapper backgroundColor="bg-mental-beige">
                  <SupportToolkitPage />
                </PageWrapper>
              } />
              {!isGuest ? (
                <>
                  <Route path="/profile" element={
                    <PageWrapper backgroundColor="bg-mental-gray">
                      <ProfilePage />
                    </PageWrapper>
                  } />
                  <Route path="/community" element={
                    <PageWrapper backgroundColor="bg-mental-blue">
                      <CommunityPage />
                    </PageWrapper>
                  } />
                </>
              ) : (
                <>
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
                  <Route path="/community" element={
                    <GuestUpgradePrompt 
                      featureName="Community Features"
                      description="Connect with others on their wellness journey"
                      features={[
                        "Join supportive community groups",
                        "Share experiences safely and anonymously",
                        "Participate in wellness challenges",
                        "Access peer support networks",
                        "Connect with mental health professionals"
                      ]}
                    />
                  } />
                </>
              )}
              <Route path="/provider-dashboard" element={
                <ProtectedRoute requiredRole="provider">
                  <PageWrapper backgroundColor="bg-mental-gray">
                    <ProviderDashboard />
                  </PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/personalization" element={
                <PersonalizationPage />
              } />
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