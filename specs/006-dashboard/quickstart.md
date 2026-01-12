# Quickstart Guide: Dashboard

## Overview
This guide explains how to set up and run the dashboard feature locally.

## Prerequisites
- Node.js 18+ installed
- Access to backend API server
- Valid authentication token

## Setup
1. Ensure the backend API server is running
2. Install frontend dependencies: `npm install`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - URL of your backend API

## Running Locally
1. Start the development server: `npm run dev`
2. Navigate to `/dashboard` in your browser
3. Ensure you're logged in to view the dashboard

## Key Components
- `/app/dashboard/page.tsx` - Main dashboard page
- `/components/Dashboard/` - Dashboard-specific components
- `/hooks/useDashboardData.ts` - Data fetching hook

## Testing
- Verify all dashboard widgets load correctly
- Test responsive behavior on different screen sizes
- Confirm API calls return expected data
- Validate error handling when API is unavailable