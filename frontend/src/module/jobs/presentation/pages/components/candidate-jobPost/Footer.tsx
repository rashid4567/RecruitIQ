import React from "react";
import { Briefcase, Linkedin, Twitter, Instagram, MapPin } from "lucide-react";

export const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-slate-400">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-black text-base">RecruitIQ</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            AI-powered recruitment for the modern enterprise.
          </p>
          <div className="flex gap-3">
            {[Linkedin, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
        {[
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
            links: [
              "Terms of Use",
              "Cookie Policy",
              "Security",
              "Accessibility",
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="text-white font-bold text-sm mb-4">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs hover:text-indigo-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-600">
          © 2025 RecruitIQ. All rights reserved.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-3 h-3" /> Bangalore, India
        </div>
      </div>
    </div>
  </footer>
);