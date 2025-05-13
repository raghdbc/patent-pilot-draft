/**
 * Main Application Component
 * 
 * This is the root component of the application that sets up:
 * - React Query for data fetching
 * - Toast notifications
 * - Tooltips
 * - Authentication context
 * - Routing configuration
 */

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Third-party Libraries
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";

// Authentication Components
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Page Components
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import FormsPage from "./pages/FormsPage";
import DraftingPage from "./pages/DraftingPage";
import NotFound from "./pages/NotFound";

// Initialize React Query client
const queryClient = new QueryClient();

/**
 * App Component
 * 
 * Sets up the application's core providers and routing structure.
 * Protected routes are wrapped with the ProtectedRoute component
 * to ensure authentication before access.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notifications for user feedback */}
      <Toaster />
      <Sonner />
      
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/forms" element={
              <ProtectedRoute>
                <FormsPage />
              </ProtectedRoute>
            } />
            <Route path="/drafting" element={
              <ProtectedRoute>
                <DraftingPage />
              </ProtectedRoute>
            } />
            
            {/* Fallback Route - 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
