import React from "react";
import {
  Briefcase,
  Linkedin,
  Twitter,
  Instagram,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: ["Our Story", "Work With Us", "Blog", "Contact"],
  },
  {
    title: "Resources",
    links: ["Tech Stack", "Open Source", "Press", "Privacy Policy"],
  },
  {
    title: "Legal",
    links: ["Terms of Use", "Cookie Policy", "Security", "Accessibility"],
  },
];

const SOCIALS = [
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
];

export const Footer: React.FC = () => (
  <footer className="relative bg-slate-900 text-slate-400">

    <div className="h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
    
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-black text-base">
              RecruitIQ
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-5 max-w-xs">
            AI-powered recruitment for the modern enterprise. Helping teams
            hire faster, and candidates get discovered sooner.
          </p>

          <div className="flex gap-2.5">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:scale-105 transition-all duration-150"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-white font-bold text-sm mb-4">
              {col.title}
            </h3>

            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1 text-xs hover:text-indigo-400 transition-colors"
                  >
                    {link}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} RecruitIQ. All rights reserved.
        </p>

        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-3 h-3" />
          Bangalore, India
        </div>
      </div>
    </div>
  </footer>
);