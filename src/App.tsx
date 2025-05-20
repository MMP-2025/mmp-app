
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

import HomePage from "./pages/HomePage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import JournalPage from "./pages/JournalPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import GratitudePage from "./pages/GratitudePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <SidebarLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mood" element={<MoodTrackerPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/mindfulness" element={<MindfulnessPage />} />
              <Route path="/gratitude" element={<GratitudePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarLayout>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
