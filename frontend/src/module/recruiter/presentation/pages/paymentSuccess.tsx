'use client';

import { useEffect, useState } from 'react';

interface SubscriptionSuccessProps {
  planName?: string;
  email?: string;
  onDashboardClick?: () => void;
  onExploreClick?: () => void;
}

export default function SubscriptionSuccess({
  planName = 'Stellar Pro',
  email = 'user@example.com',
  onDashboardClick = () => {},
  onExploreClick = () => {},
}: SubscriptionSuccessProps) {
  const [mounted, setMounted] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setCheckDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  const perks = [
    'Unlimited Projects',
    'AI Analytics Engine',
    'Priority Rendering',
    'Custom API Endpoints',
    'Dedicated Workspace',
    'Global CDN Access',
  ];

  const stats = [
    { value: '∞', label: 'Bandwidth' },
    { value: '24/7', label: 'Support' },
    { value: '99.9%', label: 'Uptime SLA' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #fffdf7 0%, #fdf8ec 40%, #fefcf4 100%)',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-5%', right: '-8%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,160,40,0.10) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(184,134,11,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(184,134,11,0.05) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>

          {/* Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-14px)', transition: 'all 0.6s ease' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 18px', borderRadius: 100, border: '1px solid rgba(184,134,11,0.32)', background: 'rgba(184,134,11,0.1)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 700, color: '#8B6914', fontFamily: 'Arial, sans-serif' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A227', boxShadow: '0 0 6px rgba(184,134,11,0.6)', display: 'inline-block' }} />
              Subscription Active
            </span>
          </div>

          {/* Card */}
          <div style={{ background: '#ffffff', border: '1px solid rgba(184,134,11,0.18)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 6px rgba(184,134,11,0.04), 0 20px 60px rgba(184,134,11,0.08)', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

            {/* Header */}
            <div style={{ padding: '2.5rem 2.5rem 2rem', background: 'linear-gradient(160deg, #fffbf0 0%, #fdf6dc 60%, #fff9ec 100%)', borderBottom: '1px solid rgba(184,134,11,0.12)', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 100, height: 3, borderRadius: '0 0 4px 4px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />

              {/* Icon */}
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', position: 'relative' }}>
                <div style={{ position: 'absolute', width: 88, height: 88, borderRadius: '50%', border: '1.5px solid rgba(184,134,11,0.2)' }} />
                <div style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', border: '1px solid rgba(184,134,11,0.09)' }} />
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A227, #E8C547, #D4AF37)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(184,134,11,0.35), 0 2px 8px rgba(0,0,0,0.06)', opacity: mounted ? 1 : 0, transform: mounted ? 'scale(1)' : 'scale(0)', transition: 'all 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.1s' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14L11 19.5L22 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="28" strokeDashoffset={checkDone ? 0 : 28} style={{ transition: 'stroke-dashoffset 0.5s ease 0.9s' }} />
                  </svg>
                </div>
              </div>

              <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.2, color: '#7A5C0A', marginBottom: '0.5rem' }}>
                Welcome to {planName}
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#8a7340', fontFamily: 'Arial, sans-serif', lineHeight: 1.5 }}>
                Your account has been elevated. The full suite is now at your disposal.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid rgba(184,134,11,0.1)' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ padding: '1.1rem 1rem', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(184,134,11,0.1)' : 'none' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 400, color: '#B8860B', letterSpacing: '-0.02em', marginBottom: 3 }}>{s.value}</div>
                  <div style={{ fontFamily: 'Arial,sans-serif', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#a08040' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Body */}
            <div style={{ padding: '1.75rem 2.5rem 2.25rem' }}>
              <p style={{ margin: '0 0 0.7rem', fontFamily: 'Arial,sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 700, color: '#B8860B' }}>What's included</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 6, marginBottom: '1.5rem' }}>
                {perks.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.85rem', borderRadius: 9, border: '1px solid rgba(184,134,11,0.13)', background: 'rgba(184,134,11,0.04)', cursor: 'default', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(184,134,11,0.09)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(184,134,11,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(184,134,11,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(184,134,11,0.13)'; }}>
                    <span style={{ color: '#C9A227', fontSize: 8 }}>◆</span>
                    <span style={{ fontFamily: 'Arial,sans-serif', fontSize: 12, color: '#5a4a20' }}>{p}</span>
                  </div>
                ))}
              </div>

              {/* Email notice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.9rem 1.1rem', borderRadius: 12, background: 'rgba(184,134,11,0.07)', border: '1px solid rgba(184,134,11,0.22)', marginBottom: '1.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(184,134,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'Arial,sans-serif', fontSize: 12, color: '#7A5C0A', fontWeight: 600, marginBottom: 2 }}>Confirmation dispatched to {email}</div>
                  <div style={{ fontFamily: 'Arial,sans-serif', fontSize: 11, color: '#9a8040' }}>Billing details and onboarding resources await in your inbox</div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                <button onClick={onDashboardClick}
                  style={{ flex: 1, minWidth: 180, padding: '0.875rem 1.5rem', borderRadius: 11, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #B8860B, #D4AF37, #C9A227)', color: '#fff', fontFamily: 'Arial,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(184,134,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(184,134,11,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(184,134,11,0.3)'; }}>
                  Enter Dashboard
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <button onClick={onExploreClick}
                  style={{ flex: 1, minWidth: 160, padding: '0.875rem 1.5rem', borderRadius: 11, border: '1.5px solid rgba(184,134,11,0.35)', cursor: 'pointer', background: 'transparent', color: '#8B6914', fontFamily: 'Arial,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,134,11,0.07)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(184,134,11,0.6)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(184,134,11,0.35)'; }}>
                  Explore Features
                </button>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Arial,sans-serif', fontSize: 11, color: '#aaa' }}>
            Questions? Reach us at{' '}
            <a href="mailto:concierge@stellar.com" style={{ color: '#B8860B', textDecoration: 'none' }}>concierge@stellar.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}