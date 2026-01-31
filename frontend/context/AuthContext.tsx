/**
 * Task: T039
 * Spec: 010-ai-chatbot/spec.md - Auth Context Provider
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { User, UserProfile } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;  // Using UserProfile which is returned by getProfile()
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuthStatus = async () => {
      try {
        const storedToken = sessionStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);

          // Fetch user profile to populate user data
          try {
            const userProfile = await apiClient.getProfile();
            setUser(userProfile);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            // Token exists but profile fetch failed - might be invalid/expired
            apiClient.clearToken();
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This will call the API and store the token via apiClient
      const response = await apiClient.login(email, password);

      // The response from login is AuthResponse which has user property (User type)
      // But we need to convert it to UserProfile format for consistency
      // Since User and UserProfile share id, email, created_at, we can cast
      const userProfile: UserProfile = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.email.split('@')[0], // derive username from email if not available
        created_at: response.user.created_at
      };

      setUser(userProfile);
      setToken(response.access_token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.clearToken();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;