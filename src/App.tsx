import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PersonalizationProvider } from "@/contexts/PersonalizationContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import AccessibilityToolbar from "@/components/accessibility/AccessibilityToolbar";
import VoiceControl from "@/components/accessibility/VoiceControl";
import LoginForm from "@/components/auth/LoginForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdvancedAnalytics from './components/analytics/AdvancedAnalytics';
import { registerSW } from './utils/serviceWorker';

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

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    // Register service worker for PWA functionality
    registerSW();
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <PersonalizationProvider>
      <AccessibilityProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <AccessibilityToolbar />
          <VoiceControl />
          <div className="w-full min-h-screen">
            <Routes>
              <Route path="/" element={
                <div className="bg-mental-peach min-h-screen">
                  <SidebarLayout>
                    <HomePage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/crisis" element={
                <div className="bg-red-50 min-h-screen">
                  <SidebarLayout>
                    <CrisisResourcesPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/mood" element={<MoodTrackerPage />} />
              <Route path="/journal" element={
                <div className="bg-mental-green min-h-screen">
                  <SidebarLayout>
                    <JournalPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/mindfulness" element={
                <div className="bg-mental-beige min-h-screen">
                  <SidebarLayout>
                    <MindfulnessPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/gratitude" element={
                <div className="bg-mental-gray min-h-screen">
                  <SidebarLayout>
                    <GratitudePage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/planner" element={
                <div className="bg-mental-blue min-h-screen">
                  <SidebarLayout>
                    <PlannerPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/reminders" element={
                <div className="bg-mental-peach min-h-screen">
                  <SidebarLayout>
                    <RemindersPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/timer" element={
                <div className="bg-mental-green min-h-screen">
                  <SidebarLayout>
                    <TimerPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/support-toolkit" element={
                <div className="bg-mental-beige min-h-screen">
                  <SidebarLayout>
                    <SupportToolkitPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/profile" element={
                <div className="bg-mental-gray min-h-screen">
                  <SidebarLayout>
                    <ProfilePage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/community" element={
                <div className="bg-mental-blue min-h-screen">
                  <SidebarLayout>
                    <CommunityPage />
                  </SidebarLayout>
                </div>
              } />
              <Route path="/provider-dashboard" element={
                <ProtectedRoute requiredRole="provider">
                  <div className="bg-mental-gray min-h-screen">
                    <SidebarLayout>
                      <ProviderDashboard />
                    </SidebarLayout>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </AccessibilityProvider>
    </PersonalizationProvider>
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
