import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, AlertTriangle, CreditCard, HeadphonesIcon, ChevronRight } from 'lucide-react';
import { useCurrentSubscription } from '@/module/subscription/presentation/hooks/subscriptions/useCurrentSubscription';


function GlitchField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Shard {
      x: number; y: number;
      vx: number; vy: number;
      length: number;
      alpha: number; alphaDir: number;
      color: string;
      width: number;
    }

    const palette = ['#F87171', '#FCA5A5', '#FB923C', '#FBBF24', '#EF4444', '#DC2626', '#FF6B6B'];

    const shards: Shard[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      length: 10 + Math.random() * 60,
      alpha: Math.random() * 0.5,
      alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.004,
      color: palette[Math.floor(Math.random() * palette.length)],
      width: 0.5 + Math.random() * 1.5,
    }));

    interface Ring { x: number; y: number; r: number; alpha: number; }
    const rings: Ring[] = [];

    const addRing = () => {
      rings.push({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.38,
        r: 0,
        alpha: 0.35,
      });
    };
    addRing();
    setTimeout(addRing, 600);
    setTimeout(addRing, 1200);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += 3.5;
        rg.alpha -= 0.003;
        if (rg.alpha <= 0) { rings.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
        ctx.strokeStyle = '#EF4444';
        ctx.globalAlpha = rg.alpha;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (const s of shards) {
        s.x += s.vx; s.y += s.vy;
        s.alpha += s.alphaDir;
        if (s.alpha >= 0.55 || s.alpha <= 0) s.alphaDir *= -1;
        if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;
        const angle = Math.atan2(s.vy, s.vx);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + Math.cos(angle) * s.length, s.y + Math.sin(angle) * s.length);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.lineWidth = s.width;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}


function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    };
    const interval = Math.floor(2800 + Math.random() * 1200);
    const id = setInterval(cycle, interval);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block">
      {text}
      {glitch && (
        <>
          <span className="absolute inset-0 text-red-400 g1" aria-hidden="true">{text}</span>
          <span className="absolute inset-0 text-orange-400 g2" aria-hidden="true">{text}</span>
        </>
      )}
    </span>
  );
}


export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading } = useCurrentSubscription();
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  const sub = subscriptionData?.subscription;

  const formatDate = (d?: Date) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '—';

  const planBadgeColor: Record<string, string> = {
    free: 'from-slate-500 to-slate-600',
    basic: 'from-sky-500 to-blue-600',
    pro: 'from-violet-500 to-purple-700',
    enterprise: 'from-amber-500 to-orange-600',
  };
  const badgeGrad =
    sub ? (planBadgeColor[sub.planType] ?? 'from-red-500 to-rose-600') : 'from-red-500 to-rose-600';

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => navigate('/recruiter/subscription'), 800);
  };

  const commonReasons = [
    { icon: '💳', reason: 'Insufficient funds', fix: 'Check your account balance' },
    { icon: '🔒', reason: 'Card declined by bank', fix: 'Contact your bank or try another card' },
    { icon: '⏱️', reason: 'Session timed out', fix: 'The payment window may have expired' },
    { icon: '🌐', reason: 'Network interruption', fix: 'Unstable connection during checkout' },
  ];

  type ActionItem = {
    icon: React.ReactNode;
    title: string;
    desc: string;
    action: () => void;
    primary: boolean;
  };

  const actionItems: ActionItem[] = [
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: 'Retry Payment',
      desc: 'Use the same or a different card',
      action: handleRetry,
      primary: true,
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Try Another Card',
      desc: 'Switch to a different payment method',
      action: () => navigate('/recruiter/subscription'),
      primary: false,
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5" />,
      title: 'Contact Support',
      desc: "We'll help resolve this quickly",
      action: () => { window.location.href = 'mailto:support@example.com'; },
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#080404] relative overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .display { font-family: 'Syne', sans-serif; }
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.show { opacity: 1; transform: translateY(0); }
        .fade-right {
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-right.show { opacity: 1; transform: translateX(0); }
        .fade-left {
          opacity: 0;
          transform: translateX(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-left.show { opacity: 1; transform: translateX(0); }
        .glow-red {
          box-shadow: 0 0 40px rgba(239,68,68,0.3), 0 0 80px rgba(239,68,68,0.12);
        }
        .glow-ring-red {
          box-shadow: 0 0 0 1px rgba(239,68,68,0.2), 0 0 40px rgba(239,68,68,0.12);
        }
        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        @keyframes spin-slow-rev { to { transform: rotate(-360deg); } }
        @keyframes throb {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.2); opacity: 0.12; }
        }
        @keyframes glitch-1 {
          0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-3px, 0); }
          50% { clip-path: inset(30% 0 50% 0); transform: translate(3px, 0); }
        }
        @keyframes glitch-2 {
          0%, 100% { clip-path: inset(70% 0 10% 0); transform: translate(3px, 0); }
          50% { clip-path: inset(10% 0 80% 0); transform: translate(-3px, 0); }
        }
        .spin-rev { animation: spin-slow-rev 10s linear infinite; }
        .throb { animation: throb 2.2s ease-in-out infinite; }
        .g1 { animation: glitch-1 0.12s steps(2) forwards; }
        .g2 { animation: glitch-2 0.12s steps(2) forwards; }
        ::-webkit-scrollbar { width: 6px; background: #080404; }
        ::-webkit-scrollbar-thumb { background: #3a1a1a; border-radius: 99px; }
      `}</style>

      <GlitchField />

     
      <div className="fixed top-[-15%] left-[10%] w-[55vw] h-[55vw] rounded-full bg-red-950/30 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-orange-950/25 blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 space-y-8">

    
        <div
          className={`text-center space-y-5 fade-up ${visible ? 'show' : ''}`}
          style={{ transitionDelay: '0ms' }}
        >
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-red-500/10 throb" />
              <div
                className="absolute inset-4 rounded-full bg-red-500/10 throb"
                style={{ animationDelay: '0.5s' }}
              />
              <svg
                className="absolute inset-0 w-full h-full spin-rev"
                viewBox="0 0 128 128"
              >
                <circle
                  cx="64" cy="64" r="58"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="6 10"
                  strokeLinecap="round"
                  opacity="0.45"
                />
              </svg>
              <div className="absolute inset-6 rounded-full bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center glow-red">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <p className="display text-red-500 text-sm font-semibold tracking-[0.25em] uppercase mb-2">
              Payment Failed
            </p>
            <h1 className="display text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
              <GlitchText text="Something" />{' '}
              <span className="bg-linear-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                went wrong.
              </span>
            </h1>
            <p className="text-zinc-400 mt-3 text-lg max-w-xl mx-auto">
              {isLoading
                ? 'Loading your plan details…'
                : `Your payment for the ${sub?.planName ?? 'selected'} plan could not be processed. Don't worry — no charges were made.`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

       
          <div
            className={`lg:col-span-3 rounded-2xl border border-white/6 bg-white/3 backdrop-blur-sm noise relative overflow-hidden fade-right ${visible ? 'show' : ''} glow-ring-red`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className={`h-1 w-full bg-linear-to-r ${badgeGrad} opacity-60`} />
            <div className="p-7 space-y-6">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 mb-3">
                    <AlertTriangle className="w-3 h-3" /> Payment Incomplete
                  </span>
                  <h2 className="display text-2xl font-bold text-white">
                    {isLoading ? 'Loading…' : (sub?.planName ?? 'Selected Plan')}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Amount</p>
                  <p className="display text-3xl font-extrabold text-red-400/80 line-through decoration-red-600">
                    {isLoading
                      ? '—'
                      : sub?.planPrice
                        ? `₹${sub.planPrice.toLocaleString('en-IN')}`
                        : 'Free'}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">not charged</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Plan Type', value: sub?.planType ?? '—', icon: '📋' },
                  { label: 'Attempted On', value: formatDate(new Date()), icon: '📅' },
                  {
                    label: 'Job Post Days',
                    value: sub?.jobPostActiveDays ? `${sub.jobPostActiveDays} days` : '—',
                    icon: '📌',
                  },
                  { label: 'Current Status', value: sub?.status ?? 'Inactive', icon: '⚡' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/3 rounded-xl px-4 py-3 border border-white/5"
                  >
                    <p className="text-zinc-500 text-xs flex items-center gap-1.5 mb-1">
                      <span>{item.icon}</span>
                      {item.label}
                    </p>
                    <p className="text-white/80 font-medium text-sm capitalize">
                      {isLoading ? '…' : item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Your subscription has{' '}
                  <span className="text-red-400 font-semibold">not been activated</span>. You can
                  safely retry the payment or choose a different plan. Your account data is intact.
                </p>
              </div>
            </div>
          </div>

        
          <div
            className={`lg:col-span-2 rounded-2xl border border-white/6 bg-white/3 backdrop-blur-sm noise relative overflow-hidden fade-left ${visible ? 'show' : ''}`}
            style={{ transitionDelay: '250ms' }}
          >
            <div className="p-6 h-full flex flex-col">
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-5">
                Common Reasons
              </p>
              <div className="space-y-3 flex-1">
                {commonReasons.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/4 hover:bg-white/6 transition-colors"
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white/80 text-xs font-semibold">{item.reason}</p>
                      <p className="text-zinc-600 text-xs mt-0.5">{item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-3 fade-up ${visible ? 'show' : ''}`}
          style={{ transitionDelay: '350ms' }}
        >
          {actionItems.map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              className={`group flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 text-left ${
                item.primary
                  ? 'bg-linear-to-r from-red-600 to-rose-600 border-red-500/30 hover:from-red-500 hover:to-rose-500 glow-red'
                  : 'border-white/8 bg-white/3 hover:bg-white/[0.07] hover:border-white/[0.14]'
              }`}
            >
              <span
                className={`shrink-0 transition-colors ${
                  item.primary ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                }`}
              >
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm display ${
                    item.primary ? 'text-white' : 'text-zinc-200'
                  }`}
                >
                  {item.title}
                  {item.primary && retrying && (
                    <span className="ml-2 inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin align-middle" />
                  )}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    item.primary ? 'text-white/70' : 'text-zinc-600'
                  }`}
                >
                  {item.desc}
                </p>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform ${
                  item.primary ? 'text-white/60' : 'text-zinc-700'
                }`}
              />
            </button>
          ))}
        </div>

      
        <div
          className={`flex items-center justify-center gap-6 fade-up ${visible ? 'show' : ''}`}
          style={{ transitionDelay: '450ms' }}
        >
          <button
            onClick={() => navigate('/recruiter/subscription')}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Plans
          </button>
          <span className="text-zinc-700">·</span>
          <a
            href="mailto:support@example.com"
            className="text-zinc-500 hover:text-red-400 text-sm transition-colors"
          >
            support@example.com
          </a>
        </div>

      </div>
    </div>
  );
}