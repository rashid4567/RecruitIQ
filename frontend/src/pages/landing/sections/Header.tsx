import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/auth/auth.service";
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "recruiter" | "candidate" | null;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>("");

  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") as UserRole;
    const name = localStorage.getItem("userFullName") || "";

    setIsLoggedIn(!!token);
    setUserRole(role);
    setUserName(name);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userFullName");

      setIsLoggedIn(false);
      setUserRole(null);
      setUserName("");

      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getProfilePath = (): string => {
    switch (userRole) {
      case "admin":
        return "/admin-dashboard";
      case "recruiter":
        return "/recruiter/profile";
      case "candidate":
        return "/candidate/profile";
      default:
        return "/profile";
    }
  };

  const getDisplayName = (): string => {
    if (!userName) return "Account";
    const parts = userName.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0]} ${parts[parts.length - 1][0]}.`
      : parts[0];
  };

  const getInitials = (): string => {
    if (!userName) return "U";
    return userName
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <span className="text-white font-black text-xl tracking-tighter">RIQ</span>
            </div>
            <span className="font-extrabold text-xl tracking-tighter text-gray-900 hidden sm:block">
              Recruit<span className="text-blue-600">IQ</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {["Features", "Jobs", "Companies", "About"].map((item) => (
              <a
                key={item}
                href={item === "Jobs" ? "/jobs" : `#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:h-0.5 after:bg-blue-600 after:w-0 hover:after:w-full after:transition-all"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Side - Auth / Profile */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Profile Button */}
                <button
                  onClick={() => navigate(getProfilePath())}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <Avatar className="h-9 w-9 ring-1 ring-gray-200 group-hover:ring-blue-500/50 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-semibold text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize tracking-wide">
                      {userRole}
                    </p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
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
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-4">
              {["Features", "Jobs", "Companies", "About"].map((item) => (
                <a
                  key={item}
                  href={item === "Jobs" ? "/jobs" : `#${item.toLowerCase()}`}
                  className="text-base font-medium text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Mobile Auth Section */}
            <div className="pt-6 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-5">
                  <button
                    onClick={() => {
                      navigate(getProfilePath());
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-4 w-full text-left"
                  >
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-lg font-semibold">
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
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium w-full py-3"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setIsMenuOpen(false);
                    }}
                    className="text-base font-medium text-gray-700 hover:text-blue-600 py-3 text-left"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/role-selection");
                      setIsMenuOpen(false);
                    }}
                    className="py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl text-center shadow-md"
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
  );
}