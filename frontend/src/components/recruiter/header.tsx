"use client"

import { Menu, X, User, LogOut, Briefcase, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authService } from "@/services/auth/auth.service"
import { useNavigate } from "react-router-dom"

export default function RecruiterHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("userRole")
    const fullName = localStorage.getItem("userFullName")
    const image = localStorage.getItem("userProfileImage")
    
    setIsLoggedIn(!!token)
    setUserRole(role)
    if (fullName) {
      setUserName(fullName)
    }
    if (image) {
      setProfileImage(image)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setIsLoggedIn(false)
      setUserRole(null)
      setUserName(null)
      setProfileImage(null)
      navigate("/") 
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleProfileClick = () => {
    if (userRole === "recruiter") {
      navigate("/recruiter/profile")
    } else if (userRole === "candidate") {
      navigate("/candidate/profile")
    } else if (userRole === "admin") {
      navigate("/admin-dashboard")
    }
  }

  const handleDashboardClick = () => {
    if (userRole === "recruiter") {
      navigate("/recruiter/dashboard")
    } else if (userRole === "admin") {
      navigate("/admin-dashboard")
    }
  }

  const getInitials = () => {
    if (!userName) return "R"
    return userName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/0 backdrop-blur-xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-110">
              <span className="text-white font-bold text-xl">◇</span>
            </div>
            <span className="font-bold text-xl text-gray-900">RecruitIQ</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isLoggedIn && userRole === "recruiter" && (
              <>
                <a
                  href="/recruiter/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="/recruiter/jobs"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
                >
                  My Jobs
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="/recruiter/candidates"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
                >
                  Candidates
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              </>
            )}
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Auth Buttons / Profile */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 transition duration-300">
                    <Avatar className="h-10 w-10 border-2 border-blue-500/20 hover:border-blue-500/50 transition duration-300">
                      <AvatarImage src={profileImage || "/placeholder-avatar.png"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block text-gray-700 font-medium">
                      {userName || "Profile"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)}` : "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {userRole === "recruiter" && (
                    <>
                      <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/recruiter/jobs")} className="cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>My Jobs</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {userRole === "candidate" && (
                    <DropdownMenuItem onClick={() => navigate("/candidate/profile")} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                  )}
                  
                  {userRole === "admin" && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/admin-dashboard")} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <button 
                  onClick={() => navigate("/login")}
                  className="hidden md:block px-5 py-2 text-gray-700 font-medium hover:text-blue-600 transition duration-300"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden ml-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-in fade-in slide-in-from-top-2">
            {isLoggedIn && userRole === "recruiter" && (
              <>
                <a 
                  href="/recruiter/dashboard" 
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
                <a 
                  href="/recruiter/jobs" 
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Jobs
                </a>
                <a 
                  href="/recruiter/candidates" 
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Candidates
                </a>
              </>
            )}
            
            <a 
              href="#features" 
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#" 
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            <a 
              href="#" 
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            
            {/* Mobile Auth Menu */}
            <div className="pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-10 w-10 border-2 border-blue-500/20">
                      <AvatarImage src={profileImage || "/placeholder-avatar.png"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{userName || "User"}</p>
                      <p className="text-xs text-gray-500">
                        {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)}` : "User"}
                      </p>
                    </div>
                  </div>
                  
                  {userRole === "recruiter" && (
                    <>
                      <button
                        onClick={() => {
                          handleDashboardClick()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          handleProfileClick()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate("/recruiter/jobs")
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition"
                      >
                        <Briefcase className="h-4 w-4" />
                        My Jobs
                      </button>
                    </>
                  )}
                  
                  {userRole === "candidate" && (
                    <button
                      onClick={() => {
                        navigate("/candidate/profile")
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-2 w-full text-left px-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      navigate("/login")
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      navigate("/register")
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}