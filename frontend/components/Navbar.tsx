/**
 * Task: T039
 * Spec: Professional Navbar for Authenticated Pages - Clean styling
 */

'use client';

interface NavbarProps {
  userEmail?: string;
  onLogout: () => void;
}

export function Navbar({ userEmail, onLogout }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Text only, no emoji */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Todo App
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* User Email */}
            {userEmail && (
              <span className="hidden sm:block text-sm text-gray-600">
                {userEmail}
              </span>
            )}

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              aria-label="Logout"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
