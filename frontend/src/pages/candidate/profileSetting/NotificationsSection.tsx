"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell } from "lucide-react"

export function NotificationsSection() {
  const [notifications, setNotifications] = useState({
    jobAlerts: { email: true, push: true },
    applicationUpdates: { email: true, push: false },
    interviewInvites: { email: true, push: true },
    profileViews: { email: false, push: true },
    messages: { email: true, push: true },
    newsletter: { email: true, push: false },
  })

  const handleNotificationChange = (type: keyof typeof notifications, channel: 'email' | 'push', value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: value
      }
    }))
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500">Control how and when you receive notifications</p>
      </div>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            <p className="text-sm text-gray-500">Customize your notification preferences</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {Object.entries(notifications).map(([key, value]) => {
            const labelMap: Record<string, { title: string; desc: string }> = {
              jobAlerts: { title: "Job Alerts", desc: "New job recommendations matching your profile" },
              applicationUpdates: { title: "Application Updates", desc: "Status changes on your applications" },
              interviewInvites: { title: "Interview Invites", desc: "New interview requests and schedule changes" },
              profileViews: { title: "Profile Views", desc: "When recruiters view your profile" },
              messages: { title: "Messages", desc: "New messages from recruiters" },
              newsletter: { title: "Newsletter", desc: "Weekly updates and tips" },
            }

            return (
              <div key={key} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50">
                <div>
                  <h4 className="font-medium text-gray-900">{labelMap[key].title}</h4>
                  <p className="text-sm text-gray-500">{labelMap[key].desc}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Email</span>
                    <Switch
                      checked={value.email}
                      onCheckedChange={(checked) => handleNotificationChange(key as any, 'email', checked)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Push</span>
                    <Switch
                      checked={value.push}
                      onCheckedChange={(checked) => handleNotificationChange(key as any, 'push', checked)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200/50">
          <h4 className="font-medium text-gray-900 mb-4">Notification Frequency</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Real-time
            </Button>
            <Button variant="outline" className="border-gray-200">
              Daily Digest
            </Button>
            <Button variant="outline" className="border-gray-200">
              Weekly Summary
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}