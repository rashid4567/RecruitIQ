import { Linkedin, Twitter, Instagram } from "lucide-react";

export const JOB_TYPE_CONFIG: Record<string, { gradient: string; text: string; border: string }> = {
  "full-time": { gradient: "from-emerald-500/10 to-teal-500/10", text: "text-emerald-600", border: "border-emerald-200" },
  "part-time": { gradient: "from-amber-500/10 to-orange-500/10", text: "text-amber-600", border: "border-amber-200" },
  contract: { gradient: "from-violet-500/10 to-purple-500/10", text: "text-violet-600", border: "border-violet-200" },
  internship: { gradient: "from-sky-500/10 to-blue-500/10", text: "text-sky-600", border: "border-sky-200" },
};

export const ACCENT_COLORS = [
  "from-indigo-500 to-violet-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-teal-500 to-cyan-500",
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-fuchsia-500",
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "InnovateTech values innovation and collaboration. Challenging projects with exceptional team support.",
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    quote: "Working here lets me build impactful products. The culture truly encourages new ideas.",
    name: "Mark Johnson",
    role: "Product Manager",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    quote: "Freedom to experiment with strong mentorship. The design culture is unlike anywhere I've worked.",
    name: "Emily Davis",
    role: "UI/UX Designer",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

export const FOOTER_LINKS = {
  Company: ["Our Story", "Work With Us", "Blog", "Contact"],
  Resources: ["Tech Stack", "Open Source", "Press", "Privacy Policy"],
  Legal: ["Terms of Use", "Cookie Policy", "Security", "Accessibility"],
};

export const SOCIAL_ICONS = [Linkedin, Twitter, Instagram];