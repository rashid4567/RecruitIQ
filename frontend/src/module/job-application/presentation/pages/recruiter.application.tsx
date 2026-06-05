'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  User,
  Briefcase,
  Calendar,
  Download,
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  Download as DownloadIcon,
  Layout,
} from 'lucide-react';

interface Application {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  logo: string;
  appliedDate: string;
  daysAgo: string;
  status: 'Interview Scheduled' | 'In Progress' | 'Rejected' | 'Other Extended';
  matchScore: number;
  interviewDate?: string;
  interviewTime?: string;
  interviewType?: string;
  resume: string;
}

const applications: Application[] = [
  {
    id: '1',
    company: 'Google',
    jobTitle: 'Senior Software Engineer',
    location: 'Mountain View, CA',
    logo: '🔵',
    appliedDate: 'Apr 15, 2024',
    daysAgo: '1 month ago',
    status: 'Interview Scheduled',
    matchScore: 85,
    interviewDate: 'May 2, 2024',
    interviewTime: '10:00 AM PST',
    interviewType: 'Video Call',
    resume: 'resume_google.pdf',
  },
  {
    id: '2',
    company: 'Microsoft',
    jobTitle: 'Product Manager',
    location: 'Seattle, WA',
    logo: '🟣',
    appliedDate: 'Apr 10, 2024',
    daysAgo: '3 weeks ago',
    status: 'In Progress',
    matchScore: 72,
    resume: 'resume_ms.pdf',
  },
  {
    id: '3',
    company: 'Apple',
    jobTitle: 'UX/UX Designer',
    location: 'Cupertino, CA',
    logo: '⚫',
    appliedDate: 'Mar 28, 2024',
    daysAgo: '1 month ago',
    status: 'Rejected',
    matchScore: 45,
    resume: 'resume_apple.pdf',
  },
  {
    id: '4',
    company: 'Meta',
    jobTitle: 'Data Scientist',
    location: 'Menlo Park, CA',
    logo: '🔶',
    appliedDate: 'Mar 20, 2024',
    daysAgo: '1 month ago',
    status: 'Interview Scheduled',
    matchScore: 91,
    interviewDate: 'May 5, 2024',
    interviewTime: '2:30 PM PST',
    interviewType: 'On-site interview',
    resume: 'resume_meta.pdf',
  },
  {
    id: '5',
    company: 'Amazon Web Services',
    jobTitle: 'Cloud Solutions Architect',
    location: 'Seattle, WA',
    logo: '🟠',
    appliedDate: 'Mar 15, 2024',
    daysAgo: '2 months ago',
    status: 'In Progress',
    matchScore: 78,
    resume: 'resume_aws.pdf',
  },
  {
    id: '6',
    company: 'Netflix',
    jobTitle: 'Software Development Eng',
    location: 'Los Gatos, CA',
    logo: '🔴',
    appliedDate: 'Feb 28, 2024',
    daysAgo: '3 months ago',
    status: 'Rejected',
    matchScore: 60,
    resume: 'resume_netflix.pdf',
  },
  {
    id: '7',
    company: 'Salesforce',
    jobTitle: 'Customer Success Manager',
    location: 'San Francisco, CA',
    logo: '🟦',
    appliedDate: 'Feb 15, 2024',
    daysAgo: '3 months ago',
    status: 'Other Extended',
    matchScore: 95,
    resume: 'resume_salesforce.pdf',
  },
];

export default function RecruitmentDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterTime, setFilterTime] = useState('Last 6 Months');
  const itemsPerPage = 6;

  const filteredApplications = applications.filter((app) =>
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): {
    bg: string;
    text: string;
  } => {
    switch (status) {
      case 'Interview Scheduled':
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'In Progress':
        return { bg: 'bg-yellow-50', text: 'text-yellow-600' };
      case 'Rejected':
        return { bg: 'bg-red-50', text: 'text-red-600' };
      case 'Other Extended':
        return { bg: 'bg-green-50', text: 'text-green-600' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600' };
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-blue-400';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">RH</span>
          </div>
          <span className="font-bold text-gray-900">RecruitHQ</span>
        </div>

        <nav className="space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard' },
            { icon: FileText, label: 'My Applications' },
            { icon: User, label: 'My Profile' },
            { icon: Briefcase, label: 'Jobs' },
            { icon: Calendar, label: 'My Interviews' },
            { icon: Download, label: 'Resume' },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                item.label === 'My Applications'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              {['Jobs', 'Companies', 'Recruiters'].map((item) => (
                <button
                  key={item}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
            Back to Dashboard
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Total Applications',
                  value: '24',
                  subtext: '+3 this week',
                  icon: '📋',
                  color: 'text-blue-600',
                },
                {
                  label: 'In Progress',
                  value: '8',
                  subtext: '2 new',
                  icon: '⏳',
                  color: 'text-yellow-600',
                },
                {
                  label: 'Interviews Scheduled',
                  value: '3',
                  subtext: 'Upcoming',
                  icon: '📅',
                  color: 'text-purple-600',
                },
                {
                  label: 'Rejected',
                  value: '13',
                  subtext: 'Last week',
                  icon: '❌',
                  color: 'text-red-600',
                },
              ].map((card, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl">{card.icon}</div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{card.label}</p>
                  <p className={`text-3xl font-bold mb-1 ${card.color}`}>{card.value}</p>
                  <p className="text-gray-400 text-xs">{card.subtext}</p>
                </div>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company or job title..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-sm text-gray-700 bg-transparent border border-gray-200 rounded px-3 py-2 outline-none hover:border-gray-300"
                >
                  <option>All Status</option>
                  <option>Interview Scheduled</option>
                  <option>In Progress</option>
                  <option>Rejected</option>
                </select>

                <select
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="text-sm text-gray-700 bg-transparent border border-gray-200 rounded px-3 py-2 outline-none hover:border-gray-300"
                >
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                  <option>Last Month</option>
                </select>

                <select className="text-sm text-gray-700 bg-transparent border border-gray-200 rounded px-3 py-2 outline-none hover:border-gray-300">
                  <option>Most Recent</option>
                </select>

                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium border border-gray-200 rounded px-3 py-2">
                  <DownloadIcon size={16} />
                  Export Applications
                </button>

                <button className="p-2 hover:bg-gray-50 rounded">
                  <Layout size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                      Company & Job
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                      AI Match Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                      Interview Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                      Files/Documents
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApplications.map((app) => {
                    const statusColor = getStatusColor(app.status);
                    return (
                      <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                              {app.logo}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {app.jobTitle}
                              </p>
                              <p className="text-xs text-gray-500">
                                {app.company} • {app.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{app.appliedDate}</p>
                            <p className="text-xs text-gray-500">{app.daysAgo}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-bold text-gray-900">
                                {app.matchScore}%
                              </span>
                            </div>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getScoreColor(app.matchScore)}`}
                                style={{ width: `${app.matchScore}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Match Score</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {app.interviewDate ? (
                            <div>
                              <p className="text-sm text-gray-900">{app.interviewDate}</p>
                              <p className="text-xs text-gray-500">{app.interviewTime}</p>
                              <button className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded">
                                Join Meeting
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No interview scheduled</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                            <Download size={16} />
                            {app.resume}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 3 && <span className="text-gray-400">...</span>}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
