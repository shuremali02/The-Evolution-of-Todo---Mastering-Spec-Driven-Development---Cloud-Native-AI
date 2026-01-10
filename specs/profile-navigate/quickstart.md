# Profile Navigation Quickstart Guide

## Overview
This guide explains how to implement the tabbed profile navigation interface that consolidates profile, change password, and update email sections into a single page.

## Implementation Steps

### 1. Set Up the Main Profile Page
Create or update the main profile page to manage the tabbed interface:

```typescript
// frontend/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { UserProfile } from '@/src/components/auth/UserProfile';
import { PasswordChangeForm } from '@/src/components/auth/PasswordChangeForm';
import { EmailUpdateForm } from '@/src/components/auth/EmailUpdateForm';
import { apiClient } from '@/lib/api';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'email'>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProfile();
      setUserData(data);
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeSection === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveSection('profile')}
              >
                Profile
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeSection === 'password'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveSection('password')}
              >
                Change Password
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeSection === 'email'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveSection('email')}
              >
                Update Email
              </button>
            </div>

            {/* Content Area */}
            <div className="mt-6">
              {activeSection === 'profile' && userData && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
                  <UserProfile userData={userData} />
                </div>
              )}

              {activeSection === 'password' && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h2>
                  <PasswordChangeForm onSuccess={fetchUserProfile} />
                </div>
              )}

              {activeSection === 'email' && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Update Email</h2>
                  <EmailUpdateForm onSuccess={fetchUserProfile} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
```

### 2. Update the Form Components
Ensure the PasswordChangeForm and EmailUpdateForm components accept success callbacks to update the shared user data:

```typescript
// In PasswordChangeForm and EmailUpdateForm, add onSuccess prop:
interface FormProps {
  onSuccess?: () => void; // Called after successful submission
}
```

### 3. Remove Old Route Files
After implementing the tabbed interface, remove the separate route files:
- `frontend/app/profile/change-password/page.tsx`
- `frontend/app/profile/update-email/page.tsx`

### 4. Update Navigation Links
Update any links pointing to the old routes to use the new tabbed interface instead.

## Testing Checklist

- [ ] Profile tab displays user information correctly
- [ ] Change Password tab shows password form
- [ ] Update Email tab shows email form
- [ ] Switching between tabs maintains user data
- [ ] Form submissions work correctly
- [ ] After successful form submission, user data refreshes
- [ ] Loading states work properly
- [ ] Error handling works correctly
- [ ] Responsive design works on mobile and desktop
- [ ] Active tab is highlighted correctly
- [ ] No page reloads when switching tabs

## Common Issues & Solutions

### Issue: User data not refreshing after form submission
**Solution**: Pass the `fetchUserProfile` function as an `onSuccess` callback to the form components.

### Issue: Tab state not persisting across page refreshes
**Solution**: If needed, use localStorage to save the active tab state:
```typescript
// Save tab state
useEffect(() => {
  localStorage.setItem('activeProfileTab', activeSection);
}, [activeSection]);

// Restore tab state
useEffect(() => {
  const savedTab = localStorage.getItem('activeProfileTab');
  if (savedTab && ['profile', 'password', 'email'].includes(savedTab)) {
    setActiveSection(savedTab as any);
  }
}, []);
```

### Issue: Form validation errors not displaying properly
**Solution**: Ensure the form components properly manage their own error states and display validation messages.

## Deployment Notes
- The change is purely frontend, no backend changes required
- All existing API endpoints remain the same
- The change improves user experience by eliminating page reloads
- Ensure all profile-related links are updated to point to the new tabbed interface