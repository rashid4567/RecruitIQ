"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Activity,
  Briefcase,
  Users,
  CreditCard,
  TrendingUp,
  Mail,
  MailIcon,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Activity, label: "Activity Logs", path: "/admin/coming-soon" },
  { icon: Briefcase, label: "Recruiter Management", path: "/admin/recruiters" },
  { icon: Users, label: "Candidate Management", path: "/admin/candidates" },
  { icon: CreditCard, label: "Subscribers", path: "/admin/coming-soon" },
  { icon: TrendingUp, label: "Plans Overview", path: "/admin/coming-soon" },
  { icon: Mail, label: "Email Template Management", path: "/admin/coming-soon" },
  { icon: MailIcon, label: "Email Logs", path: "/admin/coming-soon" },
  { icon: Settings, label: "Settings", path: "/admin/coming-soon" },
]

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(isOpen)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    onToggle?.()
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white border border-gray-200"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        } lg:relative`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-black text-lg">RecruitIQ</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname.startsWith(item.path)

              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {isActive && <ChevronRight size={16} />}
                    </>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => navigate("/admin/login")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}
