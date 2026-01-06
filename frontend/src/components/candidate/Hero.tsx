"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const [email, setEmail] = useState("")

  return (
    <section className="pt-40 md:pt-56 pb-20 md:pb-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-8">
              <div className="inline-block">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-3 rounded-full border border-blue-200">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full animate-pulse"></div>
                  <p className="text-blue-700 font-semibold text-sm">AI-Powered Recruitment Revolution</p>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight text-gray-900">
                Revolutionize Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  Recruitment
                </span>
                <br />
                with AI
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg font-light">
              RecruitFlow brings intelligent automation to your hiring process, from resume screening to candidate
              ranking, ensuring you find the perfect match every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image - Enhanced */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 rounded-3xl blur-2xl"></div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 aspect-square flex items-center justify-center overflow-hidden shadow-2xl relative">
              {/* Diagonal stripes background */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Left side - teal diagonal pattern */}
                <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-teal-600 to-teal-700">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px)",
                    }}
                  ></div>
                </div>
                {/* Right side - orange diagonal pattern */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-orange-300 to-orange-400">
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
              <div className="absolute bottom-8 right-8 bg-white rounded-xl p-6 shadow-2xl w-2/3 backdrop-blur-sm bg-opacity-95 hover:shadow-3xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm">Analytics</h3>
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full w-full"></div>
                  <div className="h-2 bg-gray-300 rounded-full w-4/5"></div>
                  <div className="h-2 bg-gray-300 rounded-full w-3/5"></div>
                </div>
              </div>

              {/* Blue circle accent */}
              <div className="absolute top-12 right-12 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center z-10 animate-pulse">
                <div className="w-8 h-8 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
