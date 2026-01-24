"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/auth/auth.service";
import { getError } from "@/utils/getError"
import { toast } from "sonner"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try{
        await authService.adminLogin(email, password);
        console.log("Role : ", localStorage.getItem("userRole"));
        console.log("Token : ", localStorage.getItem("authToken"))
        toast.success("login succesfully")
        navigate("/admin/dashboard");
    }catch(err: unknown){
        toast.error(getError(err || "Admin login failed"))
    }finally{
        setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/5 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-between h-screen lg:h-auto lg:min-h-96 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
            {/* linear overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">⚡</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">RecruitIQ</h2>
                  <p className="text-white/70 text-sm">Admin Portal</p>
                </div>
              </div>

              <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-3">RecruitAI Admin</h1>
                <p className="text-white/80 text-lg">AI-Powered Recruitment Platform</p>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="relative z-10 mb-12">
              <div className="bg-linear-to-br from-pink-400 to-orange-500 rounded-xl h-40 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="text-6xl mb-2">📊</div>
                  <p className="text-white/90 font-semibold">Analytics Dashboard</p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-white/60 text-sm">© 2025 RecruitIQ. All rights reserved.</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 backdrop-blur-xl">
              {/* Logo for mobile */}
              <div className="flex lg:hidden items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">⚡</span>
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RecruitIQ
                </span>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Super Admin Login</h1>
                <p className="text-gray-600">Manage your recruitment platform</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 text-gray-900 placeholder-gray-500 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                {/* Security Info */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                  <span className="text-blue-600">🔒</span>
                  <p className="text-xs text-blue-700">Secured with 256-bit encryption</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
