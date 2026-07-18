import {
  ScanSearch,
  Bookmark,
  Network,
  Lock,
  Zap,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: ScanSearch,
    title: "AI Resume Parsing",
    description:
      "Automate resume screening with intelligent AI, extracting key information and skills with unparalleled accuracy to identify top talent faster.",
    accent: "blue",
  },
  {
    icon: Bookmark,
    title: "Candidate Ranking",
    description:
      "Leverage machine learning to rank candidates based on job requirements, experience, and potential, ensuring you always see the best fits first.",
    accent: "teal",
  },
  {
    icon: Network,
    title: "Streamlined Workflow",
    description:
      "Optimize your hiring process from application to offer with custom pipelines, automated tasks, and collaborative tools for your entire team.",
    accent: "orange",
  },
  {
    icon: Lock,
    title: "Secure Data Management",
    description:
      "Ensure candidate data privacy and compliance with robust security protocols and GDPR-ready features, protecting sensitive information.",
    accent: "blue",
  },
  {
    icon: Zap,
    title: "Personalized Insights",
    description:
      "Gain deeper understanding into your hiring funnel with custom analytics and AI-driven recommendations to continuously improve your strategy.",
    accent: "teal",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "Track key recruitment metrics, visualize pipeline health, and identify bottlenecks with intuitive dashboards and customizable reports.",
    accent: "orange",
  },
];

const accentStyles: Record<
  string,
  {
    iconBg: string;
    icon: string;
    ring: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-50 group-hover:bg-blue-600",
    icon: "text-blue-600 group-hover:text-white",
    ring: "group-hover:ring-blue-600/20",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
  },
  teal: {
    iconBg: "bg-teal-50 group-hover:bg-teal-700",
    icon: "text-teal-700 group-hover:text-white",
    ring: "group-hover:ring-teal-700/20",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
  },
  orange: {
    iconBg: "bg-orange-50 group-hover:bg-orange-400",
    icon: "text-orange-500 group-hover:text-white",
    ring: "group-hover:ring-orange-400/20",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-500",
  },
};

export default function Features() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-blue-50 px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
              Why teams choose us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Intelligent features for modern hiring
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock the power of AI to streamline your recruitment process and
            elevate your talent acquisition strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const style = accentStyles[feature.accent];
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-8 border border-gray-200 ring-1 ring-transparent hover:border-transparent hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${style.ring}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${style.iconBg}`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-300 ${style.icon}`}
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}