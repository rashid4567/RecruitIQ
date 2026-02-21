import { Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authService } from "@/services/auth/auth.service"
import { useNavigate } from "react-router-dom"


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userFullName")

    setIsLoggedIn(!!token)
    setUserRole(role)
    setUserName(name || null)
  }, [])

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
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  const getProfilePath = () => {
    if (userRole === "admin") return "/admin-dashboard"
    if (userRole === "recruiter") return "/recruiter/profile"
    if (userRole === "candidate") return "/candidate/profile"
    return "/profile"
  }

  const getDisplayName = () => {
    if (!userName) return "Account"
    const parts = userName.trim().split(" ")
    return parts.length >= 2 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : userName
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <span className="text-white font-black text-xl tracking-tight">RIQ</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">
              Recruit<span className="text-blue-600">IQ</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {["Features", "Jobs", "Companies", "About"].map((item) => (
              <a
                key={item}
                href={item === "Jobs" ? "/jobs" : `#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-[-6px] after:left-0 after:h-0.5 after:bg-blue-600 after:w-0 after:transition-all hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Auth / Profile area */}
          <div className="flex items-center gap-4 sm:gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 sm:gap-5">
                <button
                  onClick={() => navigate(getProfilePath())}
                  className="group flex items-center gap-2.5 hover:bg-gray-50/80 px-3 py-1.5 rounded-full transition-all duration-200"
                >
                  <Avatar className="h-9 w-9 ring-1 ring-gray-200 group-hover:ring-blue-400/60 transition-all">
                    <AvatarImage src="https://i.pravatar.cc/96" alt={userName || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{userRole || "User"}</p>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50/60"
                  title="Sign out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => navigate("/signin")}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/role-selection")}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.03] active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 -mr-2 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-5 space-y-5">
            {/* Mobile nav links */}
            <div className="flex flex-col gap-4">
              {["Features", "Jobs", "Companies", "About"].map((item) => (
                <a
                  key={item}
                  href={item === "Jobs" ? "/jobs" : `#${item.toLowerCase()}`}
                  className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile auth */}
            <div className="pt-4 border-t border-gray-200">
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
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{userName || "Your Account"}</p>
                      <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium w-full text-left py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      navigate("/signin")
                      setIsMenuOpen(false)
                    }}
                    className="text-base font-medium text-gray-700 hover:text-blue-600 py-2"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/role-selection")
                      setIsMenuOpen(false)
                    }}
                    className="py-3 px-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl text-center shadow-md"
                  >
                    Get Started
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