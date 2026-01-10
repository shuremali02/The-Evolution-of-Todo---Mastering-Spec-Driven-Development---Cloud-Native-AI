/**
 * Task: T005, T006, T007, T008, T009, T010, T012
 * Spec: Profile Navigation Enhancement - Tabbed interface for profile sections
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProfileTabLayout } from '@/components/ProfileTabLayout';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');

  // Determine initial section based on URL parameter
  let initialSection: 'profile' | 'password' | 'email' = 'profile';
  if (sectionParam === 'password') {
    initialSection = 'password';
  } else if (sectionParam === 'email') {
    initialSection = 'email';
  }

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Profile', href: '/profile' }
      ]} />

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Profile</h1>

        <ProfileTabLayout initialSection={initialSection} />
      </div>
    </>
  );
}