/**
 * Task: T014
 * Spec: 012-AI-Powered UI Enhancements
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  aiThemeEnabled: boolean;
  toggleAiTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Initialize with default
  const [aiThemeEnabled, setAiTheme] = useState<boolean>(false); // Initialize with default

  useEffect(() => {
    // Initialize on client-side only
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const savedAiTheme = localStorage.getItem('aiThemeEnabled') === 'true';
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Apply theme to document element
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);

      setTheme(initialTheme);
      setAiTheme(savedAiTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme to document element
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const toggleAiTheme = () => {
    const newAiThemeState = !aiThemeEnabled;
    setAiTheme(newAiThemeState);
    localStorage.setItem('aiThemeEnabled', String(newAiThemeState));
  };

  const value = {
    theme,
    toggleTheme,
    aiThemeEnabled,
    toggleAiTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}