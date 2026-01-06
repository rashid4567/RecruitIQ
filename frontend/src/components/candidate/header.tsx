"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-linear-to-b from-white/80 via-white/70 to-white/0 backdrop-blur-xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-110">
              <span className="text-white font-bold text-xl">◇</span>
            </div>
            <span className="font-bold text-xl text-gray-900">RecruitIQ</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
            >
              Jobs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block px-5 py-2 text-gray-700 font-medium hover:text-blue-600 transition duration-300">
              Sign In
            </button>
            <button className="px-5 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-in fade-in slide-in-from-top-2">
            <a href="#features" className="block text-gray-700 hover:text-blue-600 font-medium">
              Features
            </a>
            <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">
              Jobs
            </a>
            <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">
              About Us
            </a>
            <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </a>
          </div>
        )}
      </div>
    </header>
  )
}
