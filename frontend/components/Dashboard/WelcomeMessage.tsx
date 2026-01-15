/**
 * Task: T006
 * Spec: 006 Dashboard - Welcome Message Personalization
 */

'use client';

import { useState, useEffect } from 'react';

export function WelcomeMessage() {
  const [isReturningUser, setIsReturningUser] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has visited the dashboard before
    const hasVisited = localStorage.getItem('hasVisitedDashboard');

    if (hasVisited) {
      // User has visited before
      setIsReturningUser(true);
    } else {
      // First time visiting, mark as visited
      localStorage.setItem('hasVisitedDashboard', 'true');
      setIsReturningUser(false);
    }
  }, []);

  if (isReturningUser === null) {
    // During initial render/hydration, show default message
    return <>Welcome! Here's your overview</>;
  }

  return (
    <>
      {isReturningUser
        ? 'Welcome back! Here\'s your overview'
        : 'Welcome! Here\'s your overview'}
    </>
  );
}