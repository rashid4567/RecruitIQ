import { useNavigate } from "react-router-dom"

export default function Header() {

  const Navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">◇</span>
            </div>
            <span className="font-bold text-lg text-gray-900">RecruitIQ</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              About Us
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact
            </a>
          </nav>

        
          <div className="flex items-center gap-3">
            <button className="hidden md:block px-5 py-2 text-gray-700 font-medium hover:text-gray-900">Sign In</button>
            <button onClick={()=> Navigate("/role-selection")} className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
