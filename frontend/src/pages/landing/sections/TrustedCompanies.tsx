export default function TrustedCompanies() {
  const companies = [
    { name: "TechCore", accent: "blue" },
    { name: "Global Solutions", accent: "teal" },
    { name: "Nimbus", accent: "orange" },
    { name: "Recruit Co", accent: "blue" },
    { name: "DataConnect", accent: "teal" },
    { name: "Bluepeak", accent: "orange" },
    { name: "Foundry Labs", accent: "blue" },
    { name: "Vertex Talent", accent: "teal" },
    { name: "Orbit HR", accent: "orange" },
    { name: "Northline", accent: "blue" },
  ];

  const marqueeCompanies = [...companies, ...companies];

  const accentStyles: Record<
    string,
    { dot: string; border: string; text: string; bg: string }
  > = {
    blue: {
      dot: "bg-blue-600",
      border: "group-hover:border-blue-600/40",
      text: "group-hover:text-blue-700",
      bg: "group-hover:bg-blue-50",
    },
    teal: {
      dot: "bg-teal-700",
      border: "group-hover:border-teal-700/40",
      text: "group-hover:text-teal-800",
      bg: "group-hover:bg-teal-50",
    },
    orange: {
      dot: "bg-orange-400",
      border: "group-hover:border-orange-400/50",
      text: "group-hover:text-orange-600",
      bg: "group-hover:bg-orange-50",
    },
  };

  return (
    <section className="py-16 md:py-20 bg-linear-to-b from-white to-blue-50/30 overflow-hidden">
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 48s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-wrapper::before,
        .marquee-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 10;
          pointer-events: none;
        }
        .marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #ffffff, rgba(255,255,255,0));
        }
        .marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #ffffff, rgba(255,255,255,0));
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-blue-50 px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
              Trusted worldwide
            </span>
          </div>
          <p className="text-gray-900 font-bold text-2xl md:text-3xl tracking-tight">
            Trusted by leading companies worldwide
          </p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Join 2,000+ hiring teams who've made recruiting faster and smarter.
          </p>
        </div>

        <div className="marquee-wrapper relative">
          <div className="marquee-track flex w-max gap-4">
            {marqueeCompanies.map((company, index) => {
              const style = accentStyles[company.accent];
              return (
                <div
                  key={index}
                  className={`group shrink-0 w-48 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 px-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${style.border} ${style.bg}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}
                  />
                  <span
                    className={`font-semibold text-sm text-gray-700 transition-colors duration-300 whitespace-nowrap ${style.text}`}
                  >
                    {company.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
