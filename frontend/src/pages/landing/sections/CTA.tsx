"use client"

import { SquareDot, Bookmark, Network, Lock, Zap, TrendingUp } from "lucide-react"

const features = [
  {
    icon: SquareDot,
    title: "AI Resume Parsing",
    description:
      "Automate resume screening with intelligent AI, extracting key information and skills with unparalleled accuracy to identify top talent faster.",
  },
  {
    icon: Bookmark,
    title: "Candidate Ranking",
    description:
      "Leverage machine learning to rank candidates based on job requirements, experience, and potential, ensuring you always see the best fits first.",
  },
  {
    icon: Network,
    title: "Streamlined Workflow",
    description:
      "Optimize your hiring process from application to offer with custom pipelines, automated tasks, and collaborative tools for your entire team.",
  },
  {
    icon: Lock,
    title: "Secure Data Management",
    description:
      "Ensure candidate data privacy and compliance with robust security protocols and GDPR-ready features, protecting sensitive information.",
  },
  {
    icon: Zap,
    title: "Personalized Insights",
    description:
      "Gain deeper understanding into your hiring funnel with custom analytics and AI-driven recommendations to continuously improve your strategy.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "Track key recruitment metrics, visualize pipeline health, and identify bottlenecks with intuitive dashboards and customizable reports.",
  },
]

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Intelligent Features for Modern Hiring</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock the power of AI to streamline your recruitment process and elevate your talent acquisition strategy.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="bg-gray-100 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
