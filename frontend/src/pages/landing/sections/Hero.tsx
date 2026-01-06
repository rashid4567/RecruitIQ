"use client"

//import { useState } from "react"

export default function Hero() {
  //const [email, setEmail] = useState("")

  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
              Revolutionize Your <span className="text-blue-600">Recruitment</span>
              with AI
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              RecruitFlow brings intelligent automation to your hiring process, from resume screening to candidate
              ranking, ensuring you find the perfect match every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-center">
                Get Started
              </button>
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition text-center">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gray-300 rounded-3xl p-8 aspect-square flex items-center justify-center overflow-hidden shadow-lg">
              {/* Diagonal stripes background */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Left side - teal diagonal pattern */}
                <div className="absolute left-0 top-0 w-1/2 h-full bg-teal-700">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px)",
                    }}
                  ></div>
                </div>
                {/* Right side - orange diagonal pattern */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-orange-300">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 40px)",
                    }}
                  ></div>
                </div>
              </div>

              {/* Dashboard mockup card */}
              <div className="absolute bottom-8 right-8 bg-white rounded-xl p-5 shadow-2xl w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm">Analytics</h3>
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                  <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/5"></div>
                </div>
              </div>

              {/* Blue circle accent */}
              <div className="absolute top-12 right-12 w-14 h-14 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10">
                <div className="w-7 h-7 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
