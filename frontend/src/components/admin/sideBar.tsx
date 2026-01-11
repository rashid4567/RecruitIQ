"use client"

import { useState } from "react"
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
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Activity, label: "Activity Logs", id: "activity" },
  { icon: Briefcase, label: "Recruiter Management", id: "recruiter" },
  { icon: Users, label: "Candidate Management", id: "candidate" },
  { icon: CreditCard, label: "Subscribers", id: "subscribers" },
  { icon: TrendingUp, label: "Plans Overview", id: "plans" },
  { icon: Mail, label: "Email Template Management", id: "templates" },
  { icon: MailIcon, label: "Email Logs", id: "logs" },
  { icon: Settings, label: "Settings", id: "settings" },
]

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(isOpen)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    onToggle?.()
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-black transition-colors"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 overflow-hidden ${
          sidebarOpen ? "w-64" : "w-20"
        } lg:relative`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shrink-0">
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

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                    isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100 active:bg-gray-200"
                  }`}
                  title={sidebarOpen ? "" : item.label}
                >
                  <Icon
                    size={20}
                    className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
                  />
                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                      {isActive && <ChevronRight size={16} className="opacity-90 transition-transform duration-200" />}
                    </>
                  )}
                </button>
              )
            })}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-black hover:bg-red-50 hover:text-red-600 active:bg-red-100 transition-all duration-200 group"
              title={sidebarOpen ? "" : "Log Out"}
            >
              <LogOut
                size={20}
                className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
              />
              {sidebarOpen && <span className="text-sm font-medium">Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleSidebar} />}
    </>
  )
}
