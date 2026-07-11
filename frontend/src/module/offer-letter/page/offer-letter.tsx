'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Briefcase, Building2, MapPin, Code2, Clock, Calendar, Users, Heart, Zap, Shield, Banknote } from 'lucide-react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
}

export default function EmploymentOfferPage() {
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 9, hours: 18, minutes: 24 });
  const [timeStatus, setTimeStatus] = useState<'green' | 'orange' | 'red'>('green');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes } = prev;
        
        if (minutes > 0) {
          minutes--;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
        }

        // Determine status color based on remaining time
        if (days >= 7) {
          setTimeStatus('green');
        } else if (days >= 1) {
          setTimeStatus('orange');
        } else {
          setTimeStatus('red');
        }

        return { days, hours, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getCountdownColor = () => {
    if (timeStatus === 'green') return 'text-accent';
    if (timeStatus === 'orange') return 'text-amber-500';
    return 'text-destructive';
  };

  const getCountdownBgColor = () => {
    if (timeStatus === 'green') return 'bg-accent/10';
    if (timeStatus === 'orange') return 'bg-amber-500/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">ABC Technologies</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Employment Offer</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">Sent</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 animate-in fade-in duration-1000">
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <div className="px-8 py-16 sm:px-12 sm:py-20">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-16 h-16 text-accent mb-6 animate-bounce" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Congratulations, Rashid!
                </h2>
                <p className="text-lg text-muted mb-6 max-w-2xl">
                  We are pleased to offer you the position of
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                  Senior Frontend Developer
                </h3>
                <p className="text-lg text-muted">at</p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  ABC Technologies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Card */}
        <div className={`mb-12 bg-card border border-border rounded-2xl p-8 ${getCountdownBgColor()}`}>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-6">
            Offer Expires In
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold ${getCountdownColor()} mb-2`}>
                {String(countdown.days).padStart(2, '0')}
              </div>
              <p className="text-sm text-muted">Days</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold ${getCountdownColor()} mb-2`}>
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <p className="text-sm text-muted">Hours</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold ${getCountdownColor()} mb-2`}>
                {String(countdown.minutes).padStart(2, '0')}
              </div>
              <p className="text-sm text-muted">Minutes</p>
            </div>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted font-medium">Position</span>
            </div>
            <p className="text-lg font-semibold text-foreground">Frontend Developer</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted font-medium">Company</span>
            </div>
            <p className="text-lg font-semibold text-foreground">ABC Technologies</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted font-medium">Location</span>
            </div>
            <p className="text-lg font-semibold text-foreground">Bangalore</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted font-medium">Employment</span>
            </div>
            <p className="text-lg font-semibold text-foreground">Full Time</p>
          </div>
        </div>

        {/* Compensation Section */}
        <div className="mb-12 bg-card border border-border rounded-2xl p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Banknote className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Annual Compensation</h3>
          </div>
          <div className="mb-6">
            <p className="text-5xl sm:text-6xl font-bold text-accent mb-2">
              ₹12,00,000
            </p>
            <p className="text-base text-muted">per year</p>
          </div>
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted mb-1">Approximately</p>
            <p className="text-2xl font-semibold text-foreground">₹1,00,000</p>
            <p className="text-sm text-muted">per month</p>
          </div>
        </div>

        {/* Joining Details - Apple Settings Style */}
        <div className="mb-12 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">Joining Details</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="px-8 py-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-base text-foreground font-medium">Joining Date</span>
              </div>
              <span className="text-base text-muted">20 July 2026</span>
            </div>
            <div className="px-8 py-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-base text-foreground font-medium">Department</span>
              </div>
              <span className="text-base text-muted">Engineering</span>
            </div>
            <div className="px-8 py-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-base text-foreground font-medium">Probation</span>
              </div>
              <span className="text-base text-muted">6 Months</span>
            </div>
            <div className="px-8 py-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-base text-foreground font-medium">Work Location</span>
              </div>
              <span className="text-base text-muted">Bangalore</span>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6">Benefits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Code2, label: 'Laptop' },
              { icon: Shield, label: 'Medical Insurance' },
              { icon: Clock, label: 'Paid Leave' },
              { icon: Zap, label: 'Performance Bonus' },
              { icon: Heart, label: 'Flexible Hours' },
              { icon: MapPin, label: 'Remote Option' },
              { icon: Banknote, label: 'PF & Gratuity' },
              { icon: Users, label: 'Team Events' },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary transition-colors"
              >
                <div className="w-5 h-5 text-accent flex-shrink-0">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-12 bg-secondary rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Important Notes</h3>
          <ul className="space-y-3 text-muted">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>This offer is contingent upon successful background verification and final approval from the hiring team.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Please confirm your acceptance or rejection within 7 days of receiving this offer.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Your start date may be negotiable based on your current employment situation.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>For any queries, please contact our HR team at hr@abc-tech.com</span>
            </li>
          </ul>
        </div>

        {/* Timeline Section */}
        <div className="mb-16 bg-card border border-border rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-foreground mb-8">What Happens Next</h3>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Accept or Decline', desc: 'Review the offer and let us know your decision' },
              { step: 2, title: 'Background Check', desc: 'We will initiate the standard background verification process' },
              { step: 3, title: 'Final Approval', desc: 'HR team completes the necessary formalities' },
              { step: 4, title: 'Onboarding', desc: 'You&apos;ll receive onboarding instructions and documents' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    {item.step}
                  </div>
                  {idx < 3 && <div className="w-0.5 h-12 bg-border mt-2" />}
                </div>
                <div className="pt-2 pb-6">
                  <h4 className="font-semibold text-foreground text-base mb-1">{item.title}</h4>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-end">
          <button className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors order-2 sm:order-1">
            Ask Questions
          </button>
          <button className="px-8 py-3 rounded-lg bg-destructive text-destructive hover:bg-red-700 font-medium transition-colors order-3">
            Decline
          </button>
          <button className="px-8 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-green-700 transition-colors order-1 sm:order-4">
            Accept Offer
          </button>
        </div>
      </div>
    </div>
  );
}
