import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { useCurrentSubscription } from "@/module/subscription/presentation/hooks/subscriptions/useCurrentSubscription";

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Trail {
      x: number;
      y: number;
      alpha: number;
    }
    interface Rocket {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetY: number;
      color: string;
      trail: Trail[];
      exploded: boolean;
    }
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      gravity: number;
      tail: Array<{ x: number; y: number }>;
    }
    interface Glitter {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      color: string;
      spin: number;
    }

    const palettes = [
      ["#FF6B6B", "#FF8E53", "#FFD93D"],
      ["#6BCB77", "#4D96FF", "#FFD93D"],
      ["#C77DFF", "#E0AAFF", "#FFD6FF"],
      ["#00F5D4", "#00BBF9", "#9B5DE5"],
      ["#F15BB5", "#FEE440", "#00BBF9"],
    ];

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    const glitters: Glitter[] = [];

    const launchRocket = () => {
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      rockets.push({
        x: canvas.width * (0.15 + Math.random() * 0.7),
        y: canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(12 + Math.random() * 6),
        targetY: canvas.height * (0.1 + Math.random() * 0.45),
        color: palette[0],
        trail: [],
        exploded: false,
      });
    };

    const explode = (x: number, y: number, palette: string[]) => {
      const count = 90 + Math.floor(Math.random() * 60);
      const style = Math.floor(Math.random() * 4);

      for (let i = 0; i < count; i++) {
        let vx: number, vy: number;
        if (style === 0) {
          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
          const spd = 3 + Math.random() * 5;
          vx = Math.cos(angle) * spd;
          vy = Math.sin(angle) * spd;
        } else if (style === 1) {
          const points = 5;
          const section = Math.floor((i / count) * points);
          const baseAngle = (section / points) * Math.PI * 2 - Math.PI / 2;
          const spread =
            ((i / count) * points - section) * ((Math.PI * 2) / points);
          const spd =
            spread < 0.3 ? 6 + Math.random() * 2 : 2 + Math.random() * 2;
          vx = Math.cos(baseAngle + spread) * spd;
          vy = Math.sin(baseAngle + spread) * spd;
        } else if (style === 2) {
          const angle = (i / count) * Math.PI * 2;
          const spd = 5 + Math.random() * 0.5;
          vx = Math.cos(angle) * spd;
          vy = Math.sin(angle) * spd;
        } else {
          const angle = (i / count) * Math.PI * 2;
          const spd = 2 + Math.random() * 6;
          vx = Math.cos(angle) * spd * 0.5;
          vy = -Math.abs(Math.sin(angle) * spd) - 2;
        }

        const color = palette[Math.floor(Math.random() * palette.length)];
        const maxLife = 0.6 + Math.random() * 0.6;
        sparks.push({
          x,
          y,
          vx,
          vy,
          life: maxLife,
          maxLife,
          size: 2 + Math.random() * 2.5,
          color,
          gravity: style === 3 ? 0.12 : 0.06,
          tail: [],
        });
      }

      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 3;
        glitters.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 1,
          life: 0.8 + Math.random() * 0.6,
          size: 3 + Math.random() * 4,
          color: ["#FFD700", "#FFF176", "#FFFFFF"][
            Math.floor(Math.random() * 3)
          ],
          spin: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    let launchCount = 0;
    const maxLaunches = 14;
    const launchSchedule = [
      0, 150, 300, 500, 700, 950, 1200, 1500, 1850, 2200, 2600, 3000, 3400,
      3800,
    ];
    launchSchedule.forEach((delay) => {
      setTimeout(() => {
        if (launchCount < maxLaunches) {
          launchRocket();
          launchCount++;
        }
      }, delay);
    });

    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        if (r.exploded) {
          rockets.splice(i, 1);
          continue;
        }

        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 18) r.trail.shift();

        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          const alpha = (t / r.trail.length) * 0.7;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2 * (t / r.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 1;
        ctx.fill();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.22;

        if (r.y <= r.targetY || r.vy >= 0) {
          const palette = palettes[Math.floor(Math.random() * palettes.length)];
          explode(r.x, r.y, palette);
          r.exploded = true;
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.tail.push({ x: s.x, y: s.y });
        if (s.tail.length > 8) s.tail.shift();

        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= 0.98;
        s.life -= 0.016;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = s.life / s.maxLife;

        for (let t = 0; t < s.tail.length; t++) {
          ctx.beginPath();
          ctx.arc(
            s.tail[t].x,
            s.tail[t].y,
            s.size * 0.4 * (t / s.tail.length),
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = s.color;
          ctx.globalAlpha = alpha * (t / s.tail.length) * 0.5;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * alpha * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = alpha * 0.8;
        ctx.fill();
      }

      for (let i = glitters.length - 1; i >= 0; i--) {
        const g = glitters[i];
        g.x += g.vx;
        g.y += g.vy;
        g.vy += 0.04;
        g.vx *= 0.99;
        g.life -= 0.014;
        g.spin += 0.1;

        if (g.life <= 0) {
          glitters.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.spin);
        ctx.globalAlpha = g.life;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.moveTo(0, -g.size);
        ctx.lineTo(g.size * 0.4, 0);
        ctx.lineTo(0, g.size);
        ctx.lineTo(-g.size * 0.4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}

function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(to / 50));
    const id = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(id);
      } else setVal(start);
    }, 18);
    return () => clearInterval(id);
  }, [to]);
  return (
    <>
      {prefix}
      {val.toLocaleString("en-IN")}
      {suffix}
    </>
  );
}

function ConfettiStrip() {
  return (
    <div className="fixed inset-x-0 top-0 h-2 z-40 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-2 h-2 rounded-sm opacity-80"
          style={{
            left: `${(i / 40) * 100}%`,
            background: [
              "#10B981",
              "#F59E0B",
              "#3B82F6",
              "#EC4899",
              "#8B5CF6",
              "#EF4444",
            ][i % 6],
            animation: `confetti-drop ${1.2 + (i % 5) * 0.3}s ${i * 0.06}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading } = useCurrentSubscription();
  const [visible, setVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 200);
    const t2 = setTimeout(() => setShowFireworks(false), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const sub = subscriptionData?.subscription;

  const formatDate = (d?: Date) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const planBadgeColor: Record<string, string> = {
    free: "from-slate-400 to-slate-500",
    basic: "from-sky-400 to-blue-500",
    pro: "from-violet-500 to-purple-600",
    enterprise: "from-amber-400 to-orange-500",
  };
  const badgeGrad = sub
    ? (planBadgeColor[sub.planType] ?? "from-emerald-400 to-teal-500")
    : "from-emerald-400 to-teal-500";

  const usageStats = [
    {
      label: "Job Posts",
      icon: <Briefcase className="w-3.5 h-3.5" />,
      used: sub?.jobPostsUsed ?? 0,
      limit: sub?.jobPostsLimit ?? 0,
      unlimited: sub?.jobPostsLimit === -1,
      pct:
        sub?.jobPostsLimit === -1
          ? 100
          : sub
            ? Math.round((sub.jobPostsUsed / sub.jobPostsLimit) * 100)
            : 0,
      color: "from-emerald-400 to-teal-400",
    },
    {
      label: "Screenings",
      icon: <Zap className="w-3.5 h-3.5" />,
      used: sub?.screeningUsed ?? 0,
      limit: sub?.screeningLimit ?? 0,
      unlimited: sub?.screeningLimit === -1,
      pct:
        sub?.screeningLimit === -1
          ? 100
          : sub
            ? Math.round((sub.screeningUsed / sub.screeningLimit) * 100)
            : 0,
      color: "from-blue-400 to-indigo-400",
    },

    {
      label: "AI Score Credits",
      icon: <Star className="w-3.5 h-3.5" />,
      used: sub?.aiScoreUsed ?? 0,
      limit: sub?.aiScoreLimit ?? 0,
      unlimited: sub?.aiScoreLimit === -1,
      pct:
        sub?.aiScoreLimit === -1
          ? 100
          : sub
            ? Math.round(
                ((sub.aiScoreUsed ?? 0) / (sub.aiScoreLimit ?? 1)) * 100,
              )
            : 0,
      color: "from-amber-400 to-orange-400",
    },
  ];

  const billingPct = sub
    ? (() => {
        const now = Date.now();
        const start = new Date(sub.currentPeriodStart).getTime();
        const end = new Date(sub.currentPeriodEnd).getTime();
        return Math.min(
          100,
          Math.max(0, Math.round(((now - start) / (end - start)) * 100)),
        );
      })()
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Satoshi:wght@300;400;500;700&display=swap');
        * { font-family: 'Satoshi', system-ui, sans-serif; }
        .display { font-family: 'Cabinet Grotesk', system-ui, sans-serif; }

        .fade-up {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-up.show { opacity: 1; transform: translateY(0); }
        .fade-right {
          opacity: 0; transform: translateX(-28px);
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-right.show { opacity: 1; transform: translateX(0); }
        .fade-left {
          opacity: 0; transform: translateX(28px);
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-left.show { opacity: 1; transform: translateX(0); }

        .bar-fill { transition: width 1.6s cubic-bezier(0.16,1,0.3,1); }

        /* card hover lift */
        .card-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(16,185,129,0.12);
        }

        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes check-draw {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ring-pop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float-badge {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes confetti-drop {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
        }
        @keyframes sparkle {
          0%,100% { transform: scale(0) rotate(0deg); opacity:0; }
          50% { transform: scale(1) rotate(180deg); opacity:1; }
        }

        .spin-slow { animation: spin-slow 14s linear infinite; }
        .ring-pop { animation: ring-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .float-badge { animation: float-badge 3s ease-in-out infinite; }
        .shimmer-text {
          background: linear-linear(90deg, #059669 0%, #10b981 40%, #34d399 50%, #10b981 60%, #059669 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .check-path {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: check-draw 0.5s 0.6s cubic-bezier(0.65,0,0.35,1) forwards;
        }
        .sparkle-1 { animation: sparkle 1.8s 0.3s ease-in-out infinite; }
        .sparkle-2 { animation: sparkle 2.1s 0.7s ease-in-out infinite; }
        .sparkle-3 { animation: sparkle 1.6s 1.1s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 6px; background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 99px; }
      `}</style>

      {showFireworks && <Fireworks />}
      <ConfettiStrip />

      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-emerald-100/60 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-teal-100/50 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-amber-50/60 blur-[90px] pointer-events-none -z-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-14 space-y-8">
        <div
          className={`text-center space-y-6 fade-up ${visible ? "show" : ""}`}
          style={{ transitionDelay: "0ms" }}
        >
          <div className="flex justify-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-8 -translate-y-2 sparkle-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="absolute top-2 left-1/2 translate-x-4 -translate-y-4 sparkle-2">
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="absolute bottom-0 left-1/2 translate-x-8 translate-y-2 sparkle-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>

            <div
              className={`relative w-32 h-32 ${visible ? "ring-pop" : "opacity-0"}`}
            >
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />

              <svg
                className="absolute inset-0 w-full h-full spin-slow"
                viewBox="0 0 128 128"
              >
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="14 6"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
              <div className="absolute inset-3 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-200/60 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-14 h-14" fill="none">
                  <path
                    className="check-path"
                    d="M9 18l6 6L27 12"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 float-badge">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Payment Confirmed
            </div>
            <h1 className="display text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tight">
              You&apos;re all <span className="shimmer-text">set!</span>
            </h1>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto leading-relaxed">
              {isLoading ? (
                "Loading your plan details…"
              ) : (
                <>
                  Your{" "}
                  <span className="font-semibold text-slate-800">
                    {sub?.planName ?? "subscription"}
                  </span>{" "}
                  plan is now active and ready to use.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div
            className={`lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 overflow-hidden card-lift fade-right ${visible ? "show" : ""}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className={`h-1.5 w-full bg-linear-to-r ${badgeGrad}`} />

            <div className="p-7 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-linear-to-r ${badgeGrad} text-white mb-3 shadow-sm`}
                  >
                    <Star className="w-3 h-3" />
                    {isLoading ? "…" : (sub?.planType ?? "plan")}
                  </span>
                  <h2 className="display text-2xl font-bold text-slate-900">
                    {isLoading ? "Loading…" : (sub?.planName ?? "—")}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
                    Amount Paid
                  </p>
                  <p className="display text-3xl font-black text-slate-900">
                    {isLoading ? (
                      "—"
                    ) : sub?.planPrice ? (
                      <Counter to={sub.planPrice} prefix="₹" />
                    ) : (
                      "Free"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: <Calendar className="w-4 h-4" />,
                    label: "Start Date",
                    value: formatDate(sub?.startDate),
                    color: "text-emerald-500",
                  },
                  {
                    icon: <Calendar className="w-4 h-4" />,
                    label: "End Date",
                    value: formatDate(sub?.endDate),
                    color: "text-blue-500",
                  },
                  {
                    icon: <Briefcase className="w-4 h-4" />,
                    label: "Active Days Per Post",
                    value: sub?.jobPostActiveDays
                      ? `${sub.jobPostActiveDays} days`
                      : "—",
                    color: "text-violet-500",
                  },
                  {
                    icon: <Shield className="w-4 h-4" />,
                    label: "Status",
                    value: sub?.status ?? "—",
                    color: "text-amber-500",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-100 transition-colors"
                  >
                    <p
                      className={`text-xs flex items-center gap-1.5 mb-1 ${item.color}`}
                    >
                      {item.icon}
                      <span className="text-slate-500">{item.label}</span>
                    </p>
                    <p className="text-slate-800 font-semibold text-sm capitalize">
                      {isLoading ? "…" : item.value}
                    </p>
                  </div>
                ))}
              </div>

              {sub && (
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium">Billing period</span>
                    <span>
                      {formatDate(sub.currentPeriodStart)}
                      {" → "}
                      {formatDate(sub.currentPeriodEnd)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-400 to-teal-400 rounded-full bar-fill"
                      style={{ width: visible ? `${billingPct}%` : "0%" }}
                    />
                  </div>
                  <p className="text-right text-xs text-slate-400 mt-1">
                    {billingPct}% elapsed
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            className={`lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-6 card-lift fade-left ${visible ? "show" : ""}`}
            style={{ transitionDelay: "250ms" }}
          >
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-5">
              Usage Limits
            </p>
            <div className="space-y-5">
              {usageStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-600 text-sm flex items-center gap-1.5 font-medium">
                      <span className="text-slate-400">{stat.icon}</span>
                      {stat.label}
                    </p>
                    <span className="text-slate-700 text-xs font-semibold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                      {isLoading
                        ? "…"
                        : stat.unlimited
                          ? "∞ Unlimited"
                          : `${stat.used} / ${stat.limit}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${stat.color} rounded-full bar-fill`}
                      style={{
                        width: visible
                          ? `${stat.unlimited ? 100 : stat.pct}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 fade-up ${visible ? "show" : ""}`}
          style={{ transitionDelay: "350ms" }}
        >
          {[
            {
              icon: "📧",
              title: "Confirmation Email",
              desc: "Sent to your inbox",
            },
            {
              icon: "📋",
              title: "Post Your First Job",
              desc: "Start hiring today",
            },
            {
              icon: "🤖",
              title: "AI Screening",
              desc: isLoading
                ? "…"
                : sub?.screeningLimit === -1
                  ? "Unlimited credits"
                  : `${sub?.screeningLimit ?? 0} credits`,
            },
            {
              icon: "🛡️",
              title: "Priority Support",
              desc: "We're here to help",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-100 px-4 py-4 flex items-start gap-3 shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-slate-800 text-xs font-semibold">
                  {item.title}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-3 fade-up ${visible ? "show" : ""}`}
          style={{ transitionDelay: "450ms" }}
        >
          <button
            onClick={() => navigate("/recruiter/jobs/create")}
            className="flex-1 group flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-200/60 hover:shadow-xl hover:shadow-emerald-300/50 hover:-translate-y-0.5 display text-sm"
          >
            Post Your First Job
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 text-sm"
          >
            Go to Dashboard
          </button>
        </div>

        <p
          className={`text-center text-slate-400 text-xs fade-up ${visible ? "show" : ""}`}
          style={{ transitionDelay: "550ms" }}
        >
          Have questions?{" "}
          <a
            href="mailto:support@example.com"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
