import { ChevronLeft, Download, Lock } from 'lucide-react';
import type { ReactNode } from "react";


export default function RecruiterInterviewDecision() {
  const skills = [
    'Product Strategy',
    'Roadmap Development',
    'User Experience (UX)',
    'Agile Methodologies',
    'Market Research',
    'Stakeholder Management',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-950">RecruitQ</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon="grid" label="Dashboard" />
          <NavItem icon="briefcase" label="Jobs" />
          <NavItem icon="filetext" label="Applications" active />
          <NavItem icon="video" label="Interviews" />
          <NavItem icon="users" label="Candidates" />
          <NavItem icon="credit" label="Billing" />
          <NavItem icon="user" label="Profile" />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 text-gray-600 hover:text-gray-950 font-semibold text-sm w-full transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 overflow-auto bg-linear-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto p-10">
          {/* Back Button */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-950 mb-8 font-semibold text-sm transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-950 mb-2">Recruiter Interview Decision</h1>
            <p className="text-2xl">
              <span className="font-bold text-blue-600">Amelia Khan</span>
              <span className="text-gray-600 font-semibold"> (Senior Product Manager)</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-10">
            <button className="px-1 py-3 text-gray-950 font-bold text-base border-b-3 border-blue-600 transition-colors">
              View Details
            </button>
            <button className="px-1 py-3 text-gray-600 hover:text-gray-950 font-semibold text-base transition-colors">
              Add Internal Note
            </button>
            <button className="px-1 py-3 text-gray-600 hover:text-gray-950 font-semibold text-base transition-colors">
              View Transcript
            </button>
          </div>

          {/* Candidate Summary Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-950 mb-8">Candidate Summary</h2>

            <div className="grid grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <div className="mb-10">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Candidate Name</p>
                  <p className="text-xl font-bold text-gray-950">Amelia Khan</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">AI Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-gray-950">92%</span>
                    <span className="text-base font-semibold text-gray-600 mb-1">Match</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Applied for</p>
                <p className="text-xl font-bold text-gray-950 mb-8">Senior Product Manager</p>

                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Resume</p>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-bold text-base flex items-center gap-2 transition-colors">
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="mt-10 pt-10 border-t border-gray-200">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-5">Matched Skills</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2.5 bg-gray-200 text-gray-950 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr className="my-12 border-gray-200" />

          {/* Interview Information Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-950">Interview Information</h2>
              <select className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-950 font-semibold text-base hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white">
                <option>Scheduled</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <div className="mb-10">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Interview Type</p>
                  <p className="text-xl font-bold text-gray-950">Video Interview (Zoom)</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Duration</p>
                  <p className="text-xl font-bold text-gray-950">60 minutes</p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-10">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Scheduled Date & Time</p>
                  <p className="text-xl font-bold text-gray-950">October 26, 2024, 10:00 AM PST</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Current Status</p>
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-sm">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Lock Message */}
          <div className="flex items-center gap-4 bg-blue-50 border-2 border-blue-200 rounded-xl px-5 py-4 mb-10 shadow-sm">
            <Lock className="w-6 h-6 text-blue-600 shrink-0" />
            <p className="text-base text-gray-800 font-semibold">
              Decision locked — interview session not completed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg text-base">
              Select Candidate
            </button>
            <button className="flex-1 px-6 py-3.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 active:bg-red-700 transition-all shadow-md hover:shadow-lg text-base">
              Reject Candidate
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}



type NavIcon =
  | "grid"
  | "briefcase"
  | "filetext"
  | "video"
  | "users"
  | "credit"
  | "user";

interface NavItemProps {
  icon: NavIcon;
  label: string;
  active?: boolean;
}

function NavItem({
  icon,
  label,
  active = false,
}: NavItemProps) {
  const iconMap: Record<NavIcon, ReactNode> = {
    grid: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),

    briefcase: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),

    filetext: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="13" x2="12" y2="17" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),

    video: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),

    users: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),

    credit: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),

    user: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-gray-700 hover:text-gray-950 hover:bg-gray-100"
      }`}
    >
      {iconMap[icon]}
      <span>{label}</span>
    </button>
  );
}