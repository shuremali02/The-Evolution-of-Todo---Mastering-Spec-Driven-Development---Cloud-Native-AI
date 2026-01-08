/**
 * Task: T061
 * Spec: 002-authentication/spec.md - User Profile Page
 */

import { UserProfile } from '@/src/components/auth/UserProfile';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account</h2>
                <nav className="space-y-1">
                  <a
                    href="/profile"
                    className="bg-blue-50 text-blue-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  >
                    Profile
                  </a>
                  <a
                    href="/profile/change-password"
                    className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  >
                    Change Password
                  </a>
                  <a
                    href="/profile/update-email"
                    className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  >
                    Update Email
                  </a>
                </nav>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                <UserProfile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}