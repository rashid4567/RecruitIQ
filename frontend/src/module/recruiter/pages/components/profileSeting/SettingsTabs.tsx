"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  User, Shield, Bell, CreditCard } from "lucide-react"

interface SettingsTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [

    { value: "profile", label: "Profile", icon: User },
    { value: "security", label: "Security", icon: Shield },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "billing", label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="overflow-x-auto">
      <TabsList className="inline-flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/50 min-w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center whitespace-nowrap ${
              activeTab === tab.value
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            onClick={() => onTabChange(tab.value)}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}