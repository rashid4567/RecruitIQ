"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Lock } from "lucide-react"

export function PrivacySection() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    contactInfo: "recruiters-only",
    resumeDownload: true,
    dataSharing: "limited",
    activityStatus: true,
    searchVisibility: true,
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
        <p className="text-sm text-gray-500">Control your profile visibility and data sharing preferences</p>
      </div>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Privacy & Data</h3>
            <p className="text-sm text-gray-500">Manage your privacy settings and data preferences</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {[
            { 
              id: "profileVisibility",
              title: "Profile Visibility", 
              desc: "Control who can see your profile",
              type: "select",
              options: [
                { value: "public", label: "Public (Everyone)" },
                { value: "recruiters-only", label: "Recruiters Only" },
                { value: "private", label: "Private (Only Me)" },
              ]
            },
            { 
              id: "contactInfo",
              title: "Contact Information", 
              desc: "Who can see your contact details",
              type: "select",
              options: [
                { value: "recruiters-only", label: "Recruiters Only" },
                { value: "verified-companies", label: "Verified Companies" },
                { value: "nobody", label: "Nobody" },
              ]
            },
            { 
              id: "resumeDownload",
              title: "Resume Download", 
              desc: "Allow recruiters to download your resume",
              type: "switch"
            },
            { 
              id: "dataSharing",
              title: "Data Sharing", 
              desc: "Share profile data with partner companies",
              type: "select",
              options: [
                { value: "none", label: "Don't Share" },
                { value: "limited", label: "Limited (Anonymized)" },
                { value: "full", label: "Full (With Consent)" },
              ]
            },
            { 
              id: "activityStatus",
              title: "Activity Status", 
              desc: "Show when you're active on the platform",
              type: "switch"
            },
            { 
              id: "searchVisibility",
              title: "Search Visibility", 
              desc: "Allow your profile to appear in search results",
              type: "switch"
            },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50">
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.type === "select" ? (
                  <Select
                    value={privacySettings[item.id as keyof typeof privacySettings] as string}
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, [item.id]: value }))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {item.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Switch
                    checked={privacySettings[item.id as keyof typeof privacySettings] as boolean}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, [item.id]: checked }))}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200/50">
          <h4 className="font-medium text-gray-900 mb-4">Data Management</h4>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start border-gray-200 hover:border-gray-300">
              Download Your Data
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 hover:border-gray-300">
              View Data Usage
            </Button>
            <Button variant="outline" className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}