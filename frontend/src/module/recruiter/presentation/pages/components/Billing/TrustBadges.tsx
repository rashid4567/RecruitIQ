import { Shield, Zap, Headphones, Target } from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "SOC 2 Type II certified",
  },
  { icon: Zap, title: "99.9% Uptime", desc: "Guaranteed availability" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert help anytime" },
  { icon: Target, title: "Smart Matching", desc: "AI-powered recommendations" },
];

export default function TrustBadges() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
