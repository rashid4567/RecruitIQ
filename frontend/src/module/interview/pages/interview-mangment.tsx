'use client';

import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  Plus,
  MoreVertical,
  ChevronRight,
  BarChart3,
  Search,
  Bell,
  Clock,
} from 'lucide-react';
import ScheduleInterviewModal from "./components/schedule-interview-modal"
import Sidebar from '@/module/recruiter/pages/components/layout/Sidebar';

interface Interview {
  id: number;
  date: string;
  time: string;
  candidate: string;
  candidateInitial: string;
  candidateColor: string;
  jobTitle: string;
  type: string;
  interviewers: Array<{ initials: string; color: string }>;
  status: 'cancelled' | 'pending' | 'scheduled' | 'pending_feedback';
  meetingLink?: string;
}

export default function InterviewDashboard() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const interviews: Interview[] = [
    {
      id: 1,
      date: 'Jul 23, 2024',
      time: '04:00 PM',
      candidate: 'Olivia Brown',
      candidateInitial: 'OB',
      candidateColor: 'from-orange-500 to-orange-600',
      jobTitle: 'Marketing Specialist',
      type: 'Culture Fit',
      interviewers: [{ initials: 'JD', color: 'bg-linear-to-br from-orange-400 to-orange-600' }],
      status: 'cancelled',
      meetingLink: 'N/A',
    },
    {
      id: 2,
      date: 'Jul 24, 2024',
      time: '02:30 PM',
      candidate: 'Michael Chen',
      candidateInitial: 'MC',
      candidateColor: 'from-purple-500 to-purple-600',
      jobTitle: 'Product Manager',
      type: 'Behavioral Interview',
      interviewers: [{ initials: 'SJ', color: 'bg-linear-to-br from-purple-400 to-purple-600' }],
      status: 'pending',
      meetingLink: 'Schedule Interview',
    },
    {
      id: 3,
      date: 'Jul 25, 2024',
      time: '10:00 AM',
      candidate: 'Alice Johnson',
      candidateInitial: 'AJ',
      candidateColor: 'from-blue-500 to-blue-600',
      jobTitle: 'Senior Frontend Developer',
      type: 'Technical Interview',
      interviewers: [
        { initials: 'MK', color: 'bg-linear-to-br from-blue-400 to-blue-600' },
        { initials: 'EM', color: 'bg-linear-to-br from-pink-400 to-pink-600' },
      ],
      status: 'scheduled',
      meetingLink: 'Meeting',
    },
    {
      id: 4,
      date: 'Jul 26, 2024',
      time: '11:00 AM',
      candidate: 'David Lee',
      candidateInitial: 'DL',
      candidateColor: 'from-green-500 to-green-600',
      jobTitle: 'Data Scientist',
      type: 'Technical Interview',
      interviewers: [
        { initials: 'LM', color: 'bg-linear-to-br from-green-400 to-green-600' },
        { initials: 'TW', color: 'bg-linear-to-br from-indigo-400 to-indigo-600' },
      ],
      status: 'pending_feedback',
      meetingLink: 'Meeting',
    },
    {
      id: 5,
      date: 'Aug 1, 2024',
      time: '09:00 AM',
      candidate: 'Sophia Garcia',
      candidateInitial: 'SG',
      candidateColor: 'from-cyan-500 to-cyan-600',
      jobTitle: 'UX Designer',
      type: 'Portfolio Review',
      interviewers: [
        { initials: 'AK', color: 'bg-linear-to-br from-cyan-400 to-cyan-600' },
        { initials: 'MY', color: 'bg-linear-to-br from-yellow-400 to-yellow-600' },
      ],
      status: 'scheduled',
      meetingLink: 'Meeting',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'pending':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'pending_feedback':
        return 'bg-slate-50 text-slate-700 border border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'cancelled':
        return 'cancelled';
      case 'pending':
        return 'pending';
      case 'scheduled':
        return 'scheduled';
      case 'pending_feedback':
        return 'pending feedback';
      default:
        return status;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">


      <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-8 py-5">
            {/* Title and Controls */}
            <div className="flex items-center justify-between gap-6 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Interviews</h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-200">
                  <Search size={18} />
                </button>
                <button className="p-2.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-200 relative">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                <TabButton
                  icon={BarChart3}
                  label="Timeline"
                  active={selectedTab === 'timeline'}
                  onClick={() => setSelectedTab('timeline')}
                />
                <TabButton
                  label="All"
                  active={selectedTab === 'all'}
                  onClick={() => setSelectedTab('all')}
                />
                <TabButton
                  label="Upcoming"
                  active={selectedTab === 'upcoming'}
                  onClick={() => setSelectedTab('upcoming')}
                />
                <TabButton
                  label="Today"
                  active={selectedTab === 'today'}
                  onClick={() => setSelectedTab('today')}
                />
              </div>

              {/* Date Picker */}
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors duration-200">
                <Calendar size={16} />
                <span>Thu Dec 04 2025</span>
              </button>

              {/* Schedule Button */}
              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <Plus size={16} />
                Schedule Interview
              </button>
            </div>

            {/* Stats Cards - Compact Row */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <CompactStatCard
                label="Today's interviews"
                value="0"
                subtext="Next interview in: now"
              />
              <CompactStatCard 
                label="This Week" 
                value="20" 
                chart 
              />
              <CompactStatCard
                label="Completed This Month"
                value="0"
                subtext="Success rate: 75%"
              />
              <CompactStatCard 
                label="Pending Feedback" 
                value="1"
              />
            </div>
          </div>
        </header>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Interviewers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Meeting Link
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {interviews.map((interview) => (
                      <tr
                        key={interview.id}
                        className="hover:bg-blue-50/30 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4 text-sm">
                          <div className="text-slate-900 font-semibold">
                            {interview.date}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                            <Clock size={12} />
                            {interview.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-linear-to-br ${interview.candidateColor} rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                              {interview.candidateInitial}
                            </div>
                            <span className="text-slate-900 font-semibold">
                              {interview.candidate}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-900 font-medium">
                            {interview.jobTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                          {interview.type}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center -space-x-2">
                            {interview.interviewers.map((interviewer, idx) => (
                              <div
                                key={idx}
                                className={`w-9 h-9 ${interviewer.color} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200`}
                                title={`Interviewer ${idx + 1}`}
                              >
                                {interviewer.initials.charAt(0)}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getStatusStyle(
                              interview.status
                            )}`}
                          >
                            {getStatusLabel(interview.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {interview.meetingLink === 'N/A' ? (
                            <span className="text-slate-400 text-sm font-medium">N/A</span>
                          ) : interview.meetingLink === 'Schedule Interview' ? (
                            <button className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200">
                              {interview.meetingLink}
                            </button>
                          ) : (
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-bold inline-flex items-center gap-1 transition-colors duration-200 group/link">
                              {interview.meetingLink}
                              <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform duration-200" />
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-linear-to-r from-slate-50 to-slate-50">
                <button className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 text-sm transition-colors duration-200">
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg border border-blue-300 flex items-center justify-center font-semibold text-blue-600 bg-blue-50 text-sm">
                    1
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 text-sm">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 text-sm">
                    3
                  </button>
                </div>
                <button className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 text-sm transition-colors duration-200">
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </div>
  );
}


interface TabButtonProps {
  icon?: React.ComponentType<{ size: number }>;
  label?: string;
  active?: boolean;
  onClick?: () => void;
}

function TabButton({ icon: Icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium text-xs transition-colors ${
        active
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

interface CompactStatCardProps {
  label: string;
  value: string;
  subtext?: string;
  chart?: boolean;
}

function CompactStatCard({ label, value, subtext, chart }: CompactStatCardProps) {
  return (
    <div className="bg-white rounded-lg p-3 border border-slate-200 hover:shadow-md transition-all duration-200">
      <h3 className="text-xs font-semibold text-slate-600 mb-2 truncate">{label}</h3>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      {chart && (
        <div className="flex items-end gap-0.5 h-8">
          <div className="flex-1 h-2 bg-blue-500 rounded-sm" />
          <div className="flex-1 h-1.5 bg-blue-500 rounded-sm" />
          <div className="flex-1 h-3 bg-blue-500 rounded-sm" />
          <div className="flex-1 h-1.5 bg-blue-500 rounded-sm" />
          <div className="flex-1 h-2.5 bg-blue-500 rounded-sm" />
        </div>
      )}
      {subtext && <p className="text-xs text-slate-500 mt-1.5 truncate">{subtext}</p>}
    </div>
  );
}
