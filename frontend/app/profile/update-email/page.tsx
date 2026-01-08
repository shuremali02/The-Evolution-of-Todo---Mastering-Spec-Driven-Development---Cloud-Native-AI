/**
 * Task: T060
 * Spec: 002-authentication/spec.md - Email Update Page
 */

import { EmailUpdateForm } from '@/src/components/auth/EmailUpdateForm';

export default function UpdateEmailPage() {
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
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 tracking-tight">Todo App</h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Keep your account up-to-date with your current email address.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-slate-300">Receive important notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-slate-300">Account recovery access</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-slate-300">Stay connected to your account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Email update form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Todo App</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Your Email</h2>
            <p className="text-gray-600 mb-6">Enter your new email address</p>
            <EmailUpdateForm />
          </div>
        </div>
      </div>
    </div>
  );
}