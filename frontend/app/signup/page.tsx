/**
 * Task: T025
 * Spec: Professional Signup Page - Split screen layout with feature highlights
 */

'use client';

import { SignupForm } from '@/src/components/auth/SignupForm';
import { AppLogo } from '@/components/AppLogo';

export default function SignupPage() {
  return (
      <div className="min-h-screen flex">
        {/* Left side - Feature highlights */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"></path>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)"></rect>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
            <div className="flex items-center mb-6">
              <AppLogo size="xl" permanentWhite={true} />
            </div>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Create your account and start organizing your tasks to boost your productivity.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-slate-300">Quick and easy task management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-slate-300">Secure and private data storage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-slate-300">Access from any device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <AppLogo size="lg" permanentWhite={true} />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
  );
}
