import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Mail, BellRing, Settings, Briefcase, Calendar, TrendingUp, Sparkles, MessageSquare, AlertCircle, Check } from "lucide-react"

export function NotificationsSection() {
  const [emailSettings, setEmailSettings] = useState({
    newApplications: true,
    interviewUpdates: true,
    jobExpiryAlerts: false,
    weeklyDigest: true,
    marketingEmails: false,
  })

  const [pushSettings, setPushSettings] = useState({
    newApplications: true,
    messages: true,
    reminders: false,
  })

  return (
    <div className="space-y-8">
      {/* Email Notifications Card */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-violet-500 to-violet-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Email Notifications</CardTitle>
              <CardDescription>Control how and when you receive email notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'newApplications', label: 'New Applications', description: 'When candidates apply to your jobs' },
              { key: 'interviewUpdates', label: 'Interview Updates', description: 'Changes to scheduled interviews' },
              { key: 'jobExpiryAlerts', label: 'Job Expiry Alerts', description: 'When your job posts are about to expire' },
              { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your weekly activity and insights' },
              { key: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates, tips, and promotional offers' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 hover:border-slate-300/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      emailSettings[item.key as keyof typeof emailSettings]
                        ? "bg-linear-to-br from-violet-500 to-violet-600"
                        : "bg-slate-100"
                    }`}>
                      {item.key === 'newApplications' && <Briefcase className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'interviewUpdates' && <Calendar className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'jobExpiryAlerts' && <AlertCircle className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'weeklyDigest' && <TrendingUp className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'marketingEmails' && <Sparkles className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={emailSettings[item.key as keyof typeof emailSettings]}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, [item.key]: checked }))
                  }
                  className="data-[state=checked]:bg-violet-500"
                />
              </div>
            ))}
          </div>

          <Separator className="bg-slate-200/50" />

          <div className="p-4 rounded-xl bg-linear-to-r from-violet-50 to-violet-100/30 border border-violet-200/50">
            <div className="flex items-start gap-3">
              <BellRing className="h-5 w-5 text-violet-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-violet-900">Notification Frequency</h4>
                <p className="text-sm text-violet-800">
                  You can choose to receive notifications instantly, daily, or weekly.
                </p>
                <div className="flex gap-3 mt-3">
                  <Button variant="outline" size="sm" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                    Instant
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200">
                    Daily Digest
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200">
                    Weekly Digest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button variant="outline" className="border-slate-200">
            Reset to Defaults
          </Button>
          <Button className="bg-linear-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg shadow-violet-500/25">
            Save Preferences
          </Button>
        </CardFooter>
      </Card>

      {/* Push Notifications Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <BellRing className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Push Notifications</CardTitle>
              <CardDescription>Control browser and mobile push notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'newApplications', label: 'New Applications', description: 'Real-time alerts for new job applications' },
              { key: 'messages', label: 'Messages', description: 'When candidates or team members message you' },
              { key: 'reminders', label: 'Reminders', description: 'Interview and task reminders' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 hover:border-slate-300/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      pushSettings[item.key as keyof typeof pushSettings]
                        ? "bg-linear-to-br from-blue-500 to-blue-600"
                        : "bg-slate-100"
                    }`}>
                      {item.key === 'newApplications' && <Briefcase className={`h-4 w-4 ${pushSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'messages' && <MessageSquare className={`h-4 w-4 ${pushSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'reminders' && <BellRing className={`h-4 w-4 ${pushSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={pushSettings[item.key as keyof typeof pushSettings]}
                  onCheckedChange={(checked) => 
                    setPushSettings(prev => ({ ...prev, [item.key]: checked }))
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-linear-to-r from-blue-50 to-blue-100/30 border border-blue-200/50">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">Browser Permissions</h4>
                <p className="text-sm text-blue-800 mb-4">
                  You need to allow browser notifications to receive push notifications. Click the button below to enable.
                </p>
                <div className="flex items-center gap-4">
                  <Button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25">
                    Enable Push Notifications
                  </Button>
                  <div className="text-xs text-slate-500">
                    <Check className="h-3 w-3 inline mr-1 text-emerald-500" />
                    Currently {pushSettings.newApplications ? "enabled" : "disabled"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-6 border-t border-slate-200">
          <div className="w-full">
            <h4 className="font-medium text-slate-900 mb-4">Notification Sound</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-3" />
                Default
              </Button>
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-3" />
                Gentle
              </Button>
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-3" />
                Alert
              </Button>
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-violet-500 mr-3" />
                None
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}