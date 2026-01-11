"use client"

import { Menu, X, User, LogOut, Briefcase, Home, Settings, Bell, Search, HelpCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { authService } from "@/services/auth/auth.service"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [notifications, setNotifications] = useState(3)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthStatus()
    // Listen for auth changes
    window.addEventListener('storage', checkAuthStatus)
    window.addEventListener('authChange', checkAuthStatus)
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus)
      window.removeEventListener('authChange', checkAuthStatus)
    }
  }, [])

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    
    setIsLoggedIn(!!token)
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserRole(user.role)
        setUserName(user.name || user.fullName || "User")
        setUserEmail(user.email || "")
      } catch {
        // Handle parse error
      }
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("refreshToken")
      
      setIsLoggedIn(false)
      setUserRole(null)
      setUserName("")
      setUserEmail("")
      
      window.dispatchEvent(new Event('authChange'))
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleProfileClick = () => {
    if (userRole === "candidate") {
      navigate("/candidate/profile")
    } else if (userRole === "recruiter") {
      navigate("/recruiter/profile")
    }
  }

  const handleDashboardClick = () => {
    if (userRole === "candidate") {
      navigate("/candidate/home")
    } else if (userRole === "recruiter") {
      navigate("/recruiter/")
    } else if (userRole === "admin") {
      navigate("/admin/dashboard")
    }
  }

  const getInitials = () => {
    if (!userName) return "U"
    return userName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLabel = () => {
    if (!userRole) return "Guest"
    return userRole.charAt(0).toUpperCase() + userRole.slice(1)
  }

  // Navigate to specific pages based on user role and login status
  const handleFindJobs = () => {
    if (isLoggedIn && userRole === "candidate") {
      navigate("/candidate/home")
    } else if (isLoggedIn && userRole === "recruiter") {
      navigate("/recruiter/")
    } else {
      navigate("/jobs")
    }
  }

  const handlePostJobs = () => {
    if (isLoggedIn && userRole === "recruiter") {
      navigate("/recruiter/")
    } else if (!isLoggedIn) {
      navigate("/signup?role=recruiter")
    } else {
      // If logged in but not recruiter, redirect to role selection
      navigate("/role-selection")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden -ml-2 p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  RecruitIQ
                </span>
                <span className="block text-xs text-gray-500 font-medium tracking-wide">
                  Talent & Careers
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2 hover:bg-gray-100 text-gray-700"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            
            {/* Find Jobs - Shows for everyone */}
            <Button
              variant="ghost"
              onClick={handleFindJobs}
              className="gap-2 hover:bg-gray-100 text-gray-700"
            >
              <Briefcase className="h-4 w-4" />
              {isLoggedIn && userRole === "recruiter" ? "Find Candidates" : "Find Jobs"}
            </Button>
            
            {/* Post Jobs - Only for recruiters or redirect to signup */}
            {(isLoggedIn && userRole === "recruiter") || !isLoggedIn ? (
              <Button
                variant="ghost"
                onClick={handlePostJobs}
                className="gap-2 hover:bg-gray-100 text-gray-700"
              >
                <Briefcase className="h-4 w-4" />
                {isLoggedIn && userRole === "recruiter" ? "Post Jobs" : "For Employers"}
              </Button>
            ) : null}
            
            <Button
              variant="ghost"
              onClick={() => navigate("/about")}
              className="gap-2 hover:bg-gray-100 text-gray-700"
            >
              <HelpCircle className="h-4 w-4" />
              About
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-4">
            
            {/* Search Bar - Desktop (for logged in users) */}
            {isLoggedIn && (
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={userRole === "recruiter" ? "Search candidates..." : "Search jobs..."}
                  className="pl-9 w-48 lg:w-64 h-9 bg-gray-50 border-gray-200 focus:w-72 transition-all"
                />
              </div>
            )}

            {/* Auth Buttons / Profile */}
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-gray-100"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {notifications} new
                      </Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 hover:bg-gray-100 cursor-pointer border-b">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New Job Application</p>
                            <p className="text-xs text-gray-500">John Doe applied for Senior Designer</p>
                            <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-100 cursor-pointer border-b">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Profile Viewed</p>
                            <p className="text-xs text-gray-500">TechCorp viewed your profile</p>
                            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer justify-center text-blue-600">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 hover:bg-gray-100 h-9 px-2"
                    >
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src="/api/placeholder/32/32" alt={userName} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-medium text-sm">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{getRoleLabel()}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-gray-500">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        onClick={handleDashboardClick}
                        className="cursor-pointer gap-2"
                      >
                        <Home className="h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleProfileClick}
                        className="cursor-pointer gap-2"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                      {userRole === "candidate" && (
                        <DropdownMenuItem 
                          onClick={() => navigate("/candidate/profile/setting")}
                          className="cursor-pointer gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                      )}
                      {userRole === "recruiter" && (
                        <DropdownMenuItem 
                          onClick={() => navigate("/recruiter/profile")}
                          className="cursor-pointer gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate("/help")}
                      className="cursor-pointer gap-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Desktop Auth Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/signin")}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    onClick={() => navigate("/role-selection")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-sm"
                  >
                    Get Started
                  </Button>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex lg:hidden items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/signin")}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate("/role-selection")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-sm"
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 pt-4 pb-6 space-y-4 animate-in slide-in-from-top">
            {/* Mobile Navigation */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/")
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => {
                  handleFindJobs()
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
              >
                <Briefcase className="h-4 w-4" />
                {isLoggedIn && userRole === "recruiter" ? "Find Candidates" : "Find Jobs"}
              </Button>
              
              {(isLoggedIn && userRole === "recruiter") || !isLoggedIn ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handlePostJobs()
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
                >
                  <Briefcase className="h-4 w-4" />
                  {isLoggedIn && userRole === "recruiter" ? "Post Jobs" : "For Employers"}
                </Button>
              ) : null}
              
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/about")
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
              >
                <HelpCircle className="h-4 w-4" />
                About Us
              </Button>
            </div>

            {/* Mobile Search for logged in users */}
            {isLoggedIn && (
              <>
                <Separator />
                <div className="px-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder={userRole === "recruiter" ? "Search candidates..." : "Search jobs..."}
                      className="pl-9 w-full h-9 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mobile User Info for logged in users */}
            {isLoggedIn && (
              <>
                <Separator />
                <div className="px-1 space-y-4">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userName}</p>
                      <p className="text-sm text-gray-500 capitalize">{getRoleLabel()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleDashboardClick()
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleProfileClick()
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Button>
                    {userRole === "candidate" && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/candidate/profile/setting")
                          setIsMenuOpen(false)
                        }}
                        className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    )}
                    {userRole === "recruiter" && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/recruiter/profile")
                          setIsMenuOpen(false)
                        }}
                        className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/help")
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}