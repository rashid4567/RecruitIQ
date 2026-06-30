'use client';

import { CheckCircle, Home, FileText, Settings } from 'lucide-react';

export default function ScreeningComplete() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-950">RecruitQ</span>
          </div>
          <nav className="flex items-center gap-10">
            <a href="#" className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors">Applications</a>
            <a href="#" className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
          {/* Checkmark Icon with Animation */}
          <div className="mb-10 animate-in fade-in zoom-in-50 duration-500">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-100">
              <CheckCircle className="w-20 h-20 text-blue-600" strokeWidth={1.5} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black text-gray-950 mb-4 text-center tracking-tight">
            Screening Complete
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg mb-16 text-center max-w-lg leading-relaxed">
            Thanks for applying — the screening is complete
          </p>

          {/* Application Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12 shadow-sm w-full max-w-sm">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Application ID</p>
                <p className="text-lg font-bold text-gray-950 mt-1">#APP123456789</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Applied on</p>
                <p className="text-lg font-bold text-gray-950 mt-1">October 26, 2023</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-10 w-full max-w-sm">
            <button className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg">
              Back to Dashboard
            </button>
            <button className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
              Decision
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-3">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
              View my applications
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Contact support
            </a>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l border-gray-200 bg-white p-10 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-gray-950 mb-8">Application Status</h3>

            {/* Status Badge with Background */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 p-5 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-950 font-bold text-base">Screened</p>
                  <p className="text-gray-700 text-sm font-medium mt-1">Awaiting Recruiter Review</p>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Rating</p>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-7 h-7 text-amber-400 fill-current drop-shadow-sm" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 10.26 24 10.35 17.55 16.54 19.64 24.75 12 18.56 4.36 24.75 6.45 16.54 0 10.35 8.91 10.26 12 2" />
                  </svg>
                ))}
                <svg className="w-7 h-7 text-gray-300 fill-current" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 10.26 24 10.35 17.55 16.54 19.64 24.75 12 18.56 4.36 24.75 6.45 16.54 0 10.35 8.91 10.26 12 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
