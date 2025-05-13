/**
 * ProtectedRoute Component
 * 
 * A wrapper component that protects routes from unauthorized access.
 * It checks if a user is authenticated and redirects to the login page if not.
 * Shows a loading state while checking authentication status.
 */

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Get authentication state from context
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  
  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Render protected content if user is authenticated
  return <>{children}</>;
}
