/**
 * Task: T063
 * Spec: Frontend UI Fixes - Profile Page with Enhanced UI and Navigation Links
 */

'use client';

import { useState, useEffect } from 'react';
import { ProfileTabLayout } from '@/components/ProfileTabLayout';
import { FadeInWhenVisible } from '@/components/ScrollAnimations';

export default function ProfilePage() {
  return (
    <>
      <FadeInWhenVisible className="bg-white dark:bg-gray-800 shadow rounded-lg p-6" distance={30}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Profile</h1>

        <ProfileTabLayout initialSection={'profile'} />
      </FadeInWhenVisible>
    </>
  );
}