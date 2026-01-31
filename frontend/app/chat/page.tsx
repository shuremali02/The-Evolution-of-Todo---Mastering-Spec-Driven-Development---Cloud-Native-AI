/**
 * Task: T040, T041
 * Spec: Enhanced Chatbot UI with Floating Icon - Simplified chat page
 *
 * Simplified chat page that redirects users to homepage with note about global chat availability.
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Task Assistant | Hackathon Todo',
  description: 'Chat with AI to manage your tasks',
};

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">AI Task Assistant</h1>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300">
            💬 The chatbot is now available globally! Look for the chat icon floating in the bottom-right corner of any page.
          </p>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You can access the AI Task Assistant anywhere on the site using the floating chat icon.
          No need to navigate to this page specifically anymore!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-center"
          >
            Go to Homepage
          </Link>
          <Link
            href="/tasks"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors text-center"
          >
            Manage Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}