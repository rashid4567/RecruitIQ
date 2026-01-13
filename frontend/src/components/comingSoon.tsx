// pages/candidate/ComingSoon.tsx
export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
        <p className="text-gray-600 mb-8">This page is under development.</p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}