import { Network, Bookmark, Zap, Lock, Sparkles, TrendingUp, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Network,
    title: "AI Resume Parsing",
    description:
      "Automate resume screening with intelligent AI, extracting key information and skills with unparalleled accuracy.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bookmark,
    title: "Candidate Ranking",
    description:
      "Leverage machine learning to rank candidates based on job requirements, experience, and potential automatically.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Streamlined Workflow",
    description:
      "Optimize your hiring process from application to offer with custom pipelines and collaborative tools.",
    gradient: "from-blue-600 to-indigo-500",
  },
  {
    icon: Lock,
    title: "Secure Data Management",
    description: "Ensure candidate data privacy and compliance with robust security protocols and GDPR-ready features.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "Personalized Insights",
    description:
      "Gain deeper understanding into your hiring funnel with custom analytics and AI-driven recommendations.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "Track key recruitment metrics, visualize pipeline health, and identify bottlenecks with intuitive dashboards.",
    gradient: "from-pink-500 to-red-500",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-40 bg-linear-to-b from-white via-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-24 space-y-8 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-black text-gray-900">
            Intelligent Features for
            <br />
            <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Modern Hiring
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            Unlock the power of AI to streamline your recruitment process and elevate your talent acquisition strategy
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-10 border border-gray-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 bg-linear-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-8 group-hover:shadow-2xl group-hover:scale-125 transition-all duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors mb-6">
                  {feature.description}
                </p>
                <button className="text-blue-600 font-semibold hover:text-cyan-600 flex items-center gap-2 group/btn transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
