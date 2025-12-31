/**
 * Task: T010
 * Spec: 002-authentication
 */

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hackathon Todo</h1>
        <p className="text-lg text-gray-600 mb-8">Multi-user task management application</p>
        <div className="space-x-4">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 inline-block"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  )
}
