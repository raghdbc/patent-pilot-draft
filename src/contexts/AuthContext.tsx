/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Handles user sign-in, sign-up, and sign-out functionality using Supabase.
 * Manages authentication state and session persistence.
 */

// React and Routing
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Supabase Integration
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// UI Components
import { toast } from "@/hooks/use-toast";

/**
 * Authentication Context Type Definition
 * Defines the shape of the authentication context and its methods
 */
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
};

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Provides authentication state and methods to the application.
 * Manages user sessions and authentication state changes.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set up authentication state listener
  useEffect(() => {
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Handle navigation based on auth events
        if (event === 'SIGNED_IN' && currentSession) {
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with email, password, and name
   */
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created",
        description: "Please check your email for a confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  /**
   * Sign out the current user
   */
=======
  const signInWithPhone = async (phone: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Phone verification failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Verification successful",
        description: "You have been signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

>>>>>>> 29be57e4784e9b5b4a903d36404ce24fdee89555
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Provide authentication context to children
  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signUp, 
      signOut,
      signInWithPhone,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the authentication context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
