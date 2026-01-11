"use client"

import { useState } from "react"
import { Settings, Bell } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Sidebar } from "../../components/admin/sideBar"

const revenueData = [
  { name: "Starter Plan", value: 35, fill: "#6366f1" },
  { name: "Pro Plan", value: 45, fill: "#a855f7" },
  { name: "Enterprise Plan", value: 20, fill: "#ec4899" },
]

const StatCard = ({ icon, label, value, change, color }: any) => (
  <div
    className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-semibold opacity-80">{change}</span>
    </div>
    <h3 className="text-sm text-white/80 mb-1">{label}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-gray-900 font-semibold text-lg">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} className="text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-all">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard
              icon="👥"
              label="Total Recruiters"
              value="12,450"
              change="+8.2% vs last month"
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon="💼"
              label="Total Companies"
              value="1,530"
              change="+4.1% vs last month"
              color="from-cyan-500 to-blue-500"
            />
            <StatCard
              icon="📄"
              label="Job Posts"
              value="11,780"
              change="+4.1% vs last month"
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon="👤"
              label="Total Candidates"
              value="250,110"
              change="+5.3% vs last month"
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              icon="📊"
              label="Total Applications"
              value="54,200"
              change="-1.4% vs last month"
              color="from-orange-500 to-red-500"
            />
            <StatCard
              icon="📈"
              label="AI Usage"
              value="92%"
              change="-0.5% vs last month"
              color="from-indigo-500 to-purple-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Breakdown</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white text-center py-6 text-sm text-gray-600">
          © 2025 RecruitFlow. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
