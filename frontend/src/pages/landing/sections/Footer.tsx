import { Linkedin, Twitter, Instagram, Network } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Resume analysis", "Candidate scoring", "Interview scheduling", "Analytics", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press"],
  },
  {
    title: "Resources",
    links: ["Help center", "API docs", "Guides", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy policy", "Terms of service", "Security", "Cookie settings"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Network className="w-4.5 h-4.5 text-white" strokeWidth={2} />
              </div>
              <span className="font-display text-lg font-semibold text-gray-900">
                RecruitFlow
              </span>
            </div>
            <p className="font-body text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
              AI-powered hiring that reads resumes, ranks candidates, and
              books interviews — automatically.
            </p>
            <div className="flex items-center gap-3">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600/30 hover:bg-blue-50 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="col-span-1">
              <p className="font-body text-xs font-semibold tracking-wide text-gray-900 uppercase mb-4">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-gray-500 order-2 sm:order-1">
            © {new Date().getFullYear()} RecruitFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-700" />
            <span className="font-body text-xs text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}