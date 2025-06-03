
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FormsPage from "./pages/FormsPage";
import PatentFormPage from "./pages/PatentFormPage";
import Form1Page from "./pages/Form1Page";
import DraftingPage from "./pages/DraftingPage";
import FilingGuidePage from "./pages/FilingGuidePage";
import SettingsPage from "./pages/SettingsPage";
import AgentDetailsPage from "./pages/AgentDetailsPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/form1" element={<Form1Page />} />
              <Route path="/patent-form" element={<PatentFormPage />} />
              <Route path="/drafting" element={<DraftingPage />} />
              <Route path="/filing-guide" element={<FilingGuidePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/agent-details" element={<AgentDetailsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
