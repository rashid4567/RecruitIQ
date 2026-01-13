"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Lock,
  Shield,
  ShieldCheck,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { recruiterService } from "@/services/recruiter/recruiter.service"

export function SecuritySection() {
  // 🔐 Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    })
  }


  const getPasswordStrength = () => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length
    if (validCount <= 2) return { strength: "Weak", color: "text-red-500", bg: "bg-red-500" }
    if (validCount <= 3) return { strength: "Fair", color: "text-amber-500", bg: "bg-amber-500" }
    if (validCount <= 4) return { strength: "Good", color: "text-blue-500", bg: "bg-blue-500" }
    return { strength: "Strong", color: "text-emerald-500", bg: "bg-emerald-500" }
  }


  const handleUpdatePassword = async () => {
   
    const errors = []

    if (!currentPassword) errors.push("Current password is required")
    if (!newPassword) errors.push("New password is required")
    if (!confirmPassword) errors.push("Confirm password is required")

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error("Password must contain at least one uppercase letter")
      return
    }

    if (!/[a-z]/.test(newPassword)) {
      toast.error("Password must contain at least one lowercase letter")
      return
    }

    if (!/[0-9]/.test(newPassword)) {
      toast.error("Password must contain at least one number")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match")
      return
    }


    if (newPassword === currentPassword) {
      toast.error("New password must be different from current password")
      return
    }

    try {
      setLoading(true)

      await recruiterService.updatePassword({
        currentPassword,
        newPassword,
      })

      toast.success("Password updated successfully!", {
        description: "Your password has been changed successfully.",
        duration: 3000,
      })


      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      })
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to update password"
      toast.error("Password Update Failed", {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const strength = getPasswordStrength()

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* PASSWORD CARD */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden transition-all hover:shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-500 via-rose-600 to-rose-700" />

        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Password & Security</CardTitle>
              <CardDescription className="text-base">
                Manage your password and enhance account protection
              </CardDescription>
            </div>
            <Badge className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 mr-2" /> Protected
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* CHANGE PASSWORD SECTION */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Key className="h-5 w-5 text-rose-600" />
                  Change Password
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Create a strong, unique password to secure your account
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Password */}
              <div className="space-y-4">
                <Label htmlFor="current-password" className="text-base font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Current Password
                </Label>
                <div className="relative group">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 text-base transition-all focus-visible:ring-2 focus-visible:ring-rose-500 border-slate-300"
                    placeholder="Enter your current password"
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-2.5 hover:bg-slate-100"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-4">
                <Label htmlFor="new-password" className="text-base font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  New Password
                </Label>
                <div className="relative group">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      validatePassword(e.target.value)
                    }}
                    className="pl-11 pr-11 h-12 text-base transition-all focus-visible:ring-2 focus-visible:ring-rose-500 border-slate-300"
                    placeholder="Create a strong password"
                  />
                  <Key className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-2.5 hover:bg-slate-100"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-500" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password Strength</span>
                      <Badge className={`${strength.color} bg-opacity-10 border-none`}>
                        {strength.strength}
                      </Badge>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.bg} transition-all duration-500`}
                        style={{ width: `${(Object.values(passwordValidation).filter(Boolean).length / 5) * 100}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { key: 'length', text: 'At least 8 characters' },
                        { key: 'uppercase', text: 'Uppercase letter' },
                        { key: 'lowercase', text: 'Lowercase letter' },
                        { key: 'number', text: 'At least one number' },
                        { key: 'special', text: 'Special character' },
                      ].map(({ key, text }) => (
                        <div key={key} className="flex items-center gap-2">
                          {passwordValidation[key as keyof typeof passwordValidation] ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-300" />
                          )}
                          <span className={passwordValidation[key as keyof typeof passwordValidation] ? 'text-emerald-600' : 'text-slate-400'}>
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-4">
                <Label htmlFor="confirm-password" className="text-base font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirm New Password
                </Label>
                <div className="relative group">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 text-base transition-all focus-visible:ring-2 focus-visible:ring-rose-500 border-slate-300"
                    placeholder="Re-enter your new password"
                  />
                  <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-2.5 hover:bg-slate-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-500" />
                    )}
                  </Button>
                </div>
                {confirmPassword && newPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {confirmPassword === newPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-600 font-medium">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="lg:col-span-2">
                <Separator className="my-6" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <AlertCircle className="h-5 w-5 text-slate-400" />
                    <span>Make sure your password is strong and unique</span>
                  </div>
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    className="gap-3 px-8 py-3 h-12 bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY TIPS SECTION */}
          <Card className="border-slate-200 bg-linear-to-br from-slate-50 to-white">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-rose-600" />
                Security Tips
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                  <span>Use a unique password that you don't use elsewhere</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                  <span>Change your password regularly (every 90 days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                  <span>Avoid using personal information in your password</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                  <span>Consider using a password manager</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}