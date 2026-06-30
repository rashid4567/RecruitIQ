'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  User,
  Zap,
  Calendar,
  ListTodo,
  Clock,
  Bell,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface InterviewItem {
  id: string;
  date: string;
  position: string;
  company: string;
  time: string;
}

interface ExpandedState {
  [key: string]: boolean;
}

export default function MyInterviews() {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'list'>('timeline');
  const [expandedDates, setExpandedDates] = useState<ExpandedState>({});

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const pastInterviews: Record<string, InterviewItem[]> = {
    'March 27, 2024': [
      { id: '1', date: 'March 27, 2024', position: 'Senior Developer', company: 'Tech Corp', time: '2:00 PM' },
    ],
    'March 26, 2024': [
      { id: '2', date: 'March 26, 2024', position: 'Product Manager', company: 'Innovation Inc', time: '10:30 AM' },
    ],
    'March 25, 2024': [
      { id: '3', date: 'March 25, 2024', position: 'UX Designer', company: 'Design Studio', time: '3:45 PM' },
    ],
    'March 20, 2024': [
      { id: '4', date: 'March 20, 2024', position: 'Frontend Engineer', company: 'Web Solutions', time: '1:15 PM' },
    ],
    'March 18, 2024': [
      { id: '5', date: 'March 18, 2024', position: 'DevOps Engineer', company: 'Cloud Systems', time: '11:00 AM' },
    ],
    'December 15, 2023': [
      { id: '6', date: 'December 15, 2023', position: 'Backend Developer', company: 'Data Analytics Co', time: '4:00 PM' },
    ],
    'December 10, 2023': [
      { id: '7', date: 'December 10, 2023', position: 'Full Stack Developer', company: 'StartUp XYZ', time: '9:30 AM' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RecruitIQ</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard' },
            { icon: Briefcase, label: 'My Applications' },
            { icon: User, label: 'My Profile' },
            { icon: Zap, label: 'Jobs' },
            { icon: Calendar, label: 'MY Interviews', active: true },
            { icon: ListTodo, label: 'Resume' },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Interviews</h1>
              <p className="text-slate-600 mt-1">View and manage your scheduled interviews</p>
              <p className="text-sm text-slate-500 mt-2">Dashboard {'>'} My Interviews</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-700 font-semibold">Upcoming Interviews</h3>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">0</p>
              <p className="text-sm text-slate-500">No upcoming interviews</p>
            </div>

            {/* Completed Interviews */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-700 font-semibold">Completed Interviews</h3>
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">2</p>
              <p className="text-sm text-slate-500">This month</p>
            </div>

            {/* Pending Confirmation */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-700 font-semibold">Pending Confirmation</h3>
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">0</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">0 interviews awaiting response</p>
                <span className="bg-cyan-400 text-white px-3 py-1 rounded-full text-xs font-semibold">Action Required</span>
              </div>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-8">
            <div className="flex gap-4">
              {[
                { mode: 'timeline' as const, icon: Clock, label: 'Timeline' },
                { mode: 'calendar' as const, icon: Calendar, label: 'Calendar' },
                { mode: 'list' as const, icon: ListTodo, label: 'List' },
              ].map((item) => (
                <button
                  key={item.mode}
                  onClick={() => setViewMode(item.mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    viewMode === item.mode
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Past & Completed Interviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Past & Completed Interviews</h2>
            <div className="space-y-3">
              {Object.entries(pastInterviews).map(([date, interviews]) => (
                <div key={date} className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all">
                  <button
                    onClick={() => toggleDate(date)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="font-semibold text-slate-900">{date}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedDates[date] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedDates[date] && (
                    <div className="border-t border-slate-200 bg-slate-50">
                      <div className="p-6 space-y-4">
                        {interviews.map((interview, idx) => (
                          <div
                            key={interview.id}
                            className={`flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-all`}
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{interview.position}</p>
                              <p className="text-sm text-slate-500">{interview.company}</p>
                              <p className="text-xs text-slate-400 mt-1">{interview.time}</p>
                            </div>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto bg-white border-t border-slate-200 px-8 py-6 text-center text-sm text-slate-500">
          <p>© 2025 My Interviews. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
