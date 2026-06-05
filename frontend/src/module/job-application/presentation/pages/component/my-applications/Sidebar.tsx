'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  User,
  Briefcase,
  Calendar,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FileText, label: 'My Applications', active: true },
  { icon: Briefcase, label: 'Saved Jobs' },
  { icon: User, label: 'My Profile' },
  { icon: Calendar, label: 'Interviews' },
  { icon: FileText, label: 'Resume' },
];

export const Sidebar: React.FC = () => (
  <aside className="w-[220px] shrink-0 bg-white border-r border-slate-100 flex flex-col h-full">

    {/* Brand */}
    <div className="px-5 pt-6 pb-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-black text-[11px] tracking-widest">RI</span>
        </div>
        <div>
          <p className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none">
            RecruitIQ
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Candidate Portal</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-5 space-y-0.5">
      {NAV_ITEMS.map((item, i) => (
        <button
          key={i}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
            item.active
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-300'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <item.icon
            size={16}
            className={item.active ? 'text-white' : 'text-slate-400'}
          />
          {item.label}
        </button>
      ))}
    </nav>

    {/* User profile */}
    <div className="px-4 py-4 border-t border-slate-100">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-[11px] font-extrabold shrink-0 shadow-sm">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-slate-800 truncate leading-tight">John Doe</p>
          <p className="text-[10px] text-slate-400 truncate">john@example.com</p>
        </div>
      </div>
      <button className="w-full flex items-center gap-2 text-[11px] text-red-400 hover:text-red-600 font-semibold transition px-1">
        <LogOut size={12} />
        Sign out
      </button>
    </div>
  </aside>
);