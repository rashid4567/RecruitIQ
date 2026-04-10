import { Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authService } from "@/services/auth/auth.service"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils" 

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("userRole")
    const fullName = localStorage.getItem("userFullName")

    setIsLoggedIn(!!token)
    setUserRole(role)
    setUserName(fullName || null)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem("authToken")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userFullName")
      setIsLoggedIn(false)
      setUserRole(null)
      setUserName(null)
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getProfilePath = () => {
    if (userRole === "candidate") return "/candidate/profile/setting"
    if (userRole === "recruiter") return "/recruiter-dashboard"
    if (userRole === "admin") return "/admin-dashboard"
    return "/profile"
  }

  const getInitials = () => {
    if (!userName) return "U"
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleDisplay = () => {
    return userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "User"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 via-cyan-500 to-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-black text-xl">RIQ</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">
              Recruit<span className="text-cyan-600">IQ</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {["Features", "Jobs", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={item === "Jobs" ? "/jobs" : `#${item.toLowerCase()}`}
                className="relative text-sm font-medium text-gray-700 hover:text-cyan-700 transition-colors after:absolute after:bottom-[-6px] after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-600 after:to-cyan-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Auth / Profile Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Profile trigger (clickable row) */}
                <button
                  onClick={() => navigate(getProfilePath())}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-gray-50/80 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  )}
                >
                  <Avatar className="h-9 w-9 ring-1 ring-gray-200/80 group-hover:ring-cyan-400/60 transition-all">
                    <AvatarImage src="https://github.com/shadcn.png" alt={userName || ""} />
                    <AvatarFallback className="bg-linear-to-br from-blue-600 to-cyan-600 text-white text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden md:block text-left leading-tight">
                    <p className="text-sm font-medium text-gray-900">{userName || "Profile"}</p>
                    <p className="text-xs text-gray-500 capitalize">{getRoleDisplay()}</p>
                  </div>
                </button>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/60 px-3 py-1.5 rounded-lg transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-700 hover:text-cyan-700 transition-colors hidden md:block"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-5 space-y-5">
            <nav className="flex flex-col gap-4">
              {["Features", "Jobs", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={item === "Jobs" ? "/jobs" : `#${item.toLowerCase()}`}
                  className="text-base font-medium text-gray-800 hover:text-cyan-700 py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="pt-5 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      navigate(getProfilePath())
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-linear-to-br from-blue-600 to-cyan-600 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{userName || "Your Account"}</p>
                      <p className="text-sm text-gray-500 capitalize">{getRoleDisplay()}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      navigate("/login")
                      setIsMenuOpen(false)
                    }}
                    className="text-base font-medium text-gray-700 hover:text-cyan-700 py-2"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register")
                      setIsMenuOpen(false)
                    }}
                    className="py-3 px-6 bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-md text-center"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}