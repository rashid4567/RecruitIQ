"use client"

import { useState, useEffect } from "react"
import { Settings, Bell, Users, Building, FileText, User, Briefcase, TrendingUp, BarChart3, DollarSign, Zap, Target, Activity, Calendar, Clock, ArrowUpRight, ArrowDownRight, RefreshCw, Download } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts"
import Sidebar from "../../components/admin/sideBar"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const revenueData = [
  { name: "Starter Plan", value: 35, fill: "#4f46e5" },
  { name: "Pro Plan", value: 45, fill: "#7c3aed" },
  { name: "Enterprise Plan", value: 20, fill: "#ec4899" },
]

const growthData = [
  { month: 'Jan', users: 4000, revenue: 2400 },
  { month: 'Feb', users: 3000, revenue: 1398 },
  { month: 'Mar', users: 2000, revenue: 9800 },
  { month: 'Apr', users: 2780, revenue: 3908 },
  { month: 'May', users: 1890, revenue: 4800 },
  { month: 'Jun', users: 2390, revenue: 3800 },
  { month: 'Jul', users: 3490, revenue: 4300 },
]

const recentActivity = [
  { time: '10 min ago', action: 'New recruiter registered', user: 'John Doe' },
  { time: '25 min ago', action: 'Premium subscription activated', user: 'TechCorp Inc' },
  { time: '1 hour ago', action: 'Job post approved', user: 'Jane Smith' },
  { time: '2 hours ago', action: 'Candidate profile verified', user: 'Alex Johnson' },
  { time: '3 hours ago', action: 'System maintenance completed', user: 'System' },
]

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  color: string;
}

const StatCard = ({ icon, label, value, change, changeType, color }: StatCardProps) => (
  <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'positive' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {change}
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const [sidebarOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Admin</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
                Dashboard Overview
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={18} />
                Refresh
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              >
                <Download size={18} />
                Export Report
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Users className="w-6 h-6 text-indigo-600" />}
              label="Total Recruiters"
              value="12,450"
              change="+8.2%"
              changeType="positive"
              color="bg-indigo-100"
            />
            <StatCard
              icon={<Briefcase className="w-6 h-6 text-blue-600" />}
              label="Total Companies"
              value="1,530"
              change="+4.1%"
              changeType="positive"
              color="bg-blue-100"
            />
            <StatCard
              icon={<FileText className="w-6 h-6 text-purple-600" />}
              label="Job Posts"
              value="11,780"
              change="+4.1%"
              changeType="positive"
              color="bg-purple-100"
            />
            <StatCard
              icon={<User className="w-6 h-6 text-green-600" />}
              label="Total Candidates"
              value="250,110"
              change="+5.3%"
              changeType="positive"
              color="bg-green-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Target className="w-6 h-6 text-amber-600" />}
              label="Total Applications"
              value="54,200"
              change="-1.4%"
              changeType="negative"
              color="bg-amber-100"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
              label="Monthly Revenue"
              value="$45,280"
              change="+12.5%"
              changeType="positive"
              color="bg-emerald-100"
            />
            <StatCard
              icon={<Zap className="w-6 h-6 text-violet-600" />}
              label="AI Usage Rate"
              value="92%"
              change="-0.5%"
              changeType="negative"
              color="bg-violet-100"
            />
            <StatCard
              icon={<Activity className="w-6 h-6 text-rose-600" />}
              label="System Uptime"
              value="99.9%"
              change="+0.1%"
              changeType="positive"
              color="bg-rose-100"
            />
          </div>

          {/* Charts and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <Card className="border border-gray-200 shadow-sm lg:col-span-2">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  Growth Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
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
                <div className="mt-4 space-y-2">
                  {revenueData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-gray-200 shadow-sm lg:col-span-2">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">by {activity.user}</p>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Active Sessions</p>
                      <p className="text-xs text-blue-600">Current users</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">1,234</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-700">API Requests</p>
                      <p className="text-xs text-green-600">Last 24h</p>
                    </div>
                    <div className="text-2xl font-bold text-green-700">45.2K</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Avg Response Time</p>
                      <p className="text-xs text-purple-600">API performance</p>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">124ms</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-amber-700">Error Rate</p>
                      <p className="text-xs text-amber-600">System errors</p>
                    </div>
                    <div className="text-2xl font-bold text-amber-700">0.2%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}