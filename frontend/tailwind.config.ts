/**
 * Task: T004
 * Spec: 012-AI-Powered UI Enhancements
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode using the 'dark' class
  theme: {
    extend: {
      animation: {
        'gradient-animation': 'gradient-animation 8s ease infinite',
        'pulse-bg': 'pulse-bg 4s ease-in-out infinite',
        'floating': 'floating 3s ease-in-out infinite',
        'bounce': 'bounce 2s ease-in-out infinite',
        'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'border-glow-pulse': 'border-glow-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-animation': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-bg': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'floating': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'glow-pulse': {
          'from': { opacity: '0.6', transform: 'scale(1)' },
          'to': { opacity: '1', transform: 'scale(1.05)' },
        },
        'border-glow-pulse': {
          'from': { opacity: '0.5' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
