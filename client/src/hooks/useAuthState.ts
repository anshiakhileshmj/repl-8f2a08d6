import { useState, useEffect } from 'react';

// Simple mock authentication state management
// In a real app, this would integrate with your backend authentication system
export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already logged in (e.g., from localStorage or sessionStorage)
    return localStorage.getItem('auth_token') !== null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store auth token (mock)
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: any) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store auth token (mock)
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Sign up failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
};