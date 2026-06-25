import React from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "InnovateTech values innovation and collaboration. Challenging projects with exceptional team support.",
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    quote:
      "Working here lets me build impactful products. The culture truly encourages new ideas.",
    name: "Mark Johnson",
    role: "Product Manager",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    quote:
      "Freedom to experiment with strong mentorship. The design culture is unlike anywhere I've worked.",
    name: "Emily Davis",
    role: "UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

export const Testimonials: React.FC = () => (
  <section className="bg-linear-to-b from-slate-50 to-white py-16 border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Life at InnovateTech
        </h2>
        <p className="text-slate-500 text-sm">
          Hear from the people who build here
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);