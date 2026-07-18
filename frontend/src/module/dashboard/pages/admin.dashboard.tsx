import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  User,
  Target,
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Wallet,
  UserPlus,
  FileCheck2,
  CalendarClock,
  Inbox,
  Search,
  FilePlus2,
  Mail,
  FileBarChart2,
  ScrollText,
  Layers,
  Users2,
  ArrowRight,
  Server,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import type {
  AdminOverview,
  RevenueBreakdown,
  RecentActivity,
} from "../types/admin-dashboard.types";

import { ADMIN_ROUTES } from "@/routes/constants/admin.routes";
const KPI_COLORS = {
  recruiters: {
    icon: "text-blue-600",
    bg: "bg-blue-100",
    ring: "hover:border-blue-300",
    accent: "#2563eb",
  },
  candidates: {
    icon: "text-emerald-600",
    bg: "bg-emerald-100",
    ring: "hover:border-emerald-300",
    accent: "#059669",
  },
  jobs: {
    icon: "text-purple-600",
    bg: "bg-purple-100",
    ring: "hover:border-purple-300",
    accent: "#7c3aed",
  },
  applications: {
    icon: "text-orange-600",
    bg: "bg-orange-100",
    ring: "hover:border-orange-300",
    accent: "#ea580c",
  },
  revenue: {
    icon: "text-green-600",
    bg: "bg-green-100",
    ring: "hover:border-green-300",
    accent: "#16a34a",
  },
  subscriptions: {
    icon: "text-pink-600",
    bg: "bg-pink-100",
    ring: "hover:border-pink-300",
    accent: "#db2777",
  },
} as const;

const PLAN_COLORS: Record<string, string> = {
  Starter: "#4f46e5",
  Professional: "#7c3aed",
  Enterprise: "#ec4899",
};
const FALLBACK_COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#0ea5e9", "#f59e0b"];


type OverviewExt = AdminOverview & { totalSubscriptions?: number };

function formatINR(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function activityVisual(action: string): {
  icon: ReactNode;
  bg: string;
  verb: string;
} {
  const lower = action.toLowerCase();
  if (lower.includes("verif"))
    return {
      icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      bg: "bg-green-100",
      verb: "verified",
    };
  if (
    lower.includes("subscription") ||
    lower.includes("payment") ||
    lower.includes("purchase")
  )
    return {
      icon: <Wallet className="w-4 h-4 text-purple-600" />,
      bg: "bg-purple-100",
      verb: "purchased",
    };
  if (lower.includes("candidate") || lower.includes("registered"))
    return {
      icon: <UserPlus className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-100",
      verb: "registered",
    };
  if (lower.includes("job") || lower.includes("post"))
    return {
      icon: <FileCheck2 className="w-4 h-4 text-orange-600" />,
      bg: "bg-orange-100",
      verb: "published",
    };
  if (lower.includes("interview") || lower.includes("schedul"))
    return {
      icon: <CalendarClock className="w-4 h-4 text-indigo-600" />,
      bg: "bg-indigo-100",
      verb: "scheduled",
    };
  return {
    icon: <Activity className="w-4 h-4 text-gray-600" />,
    bg: "bg-gray-100",
    verb: "updated",
  };
}

function humanizeAction(action: string) {
  const cleaned = action.replace(/[._]/g, " ").toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}



function pctChange(series: number[]): number | null {
  if (series.length < 2) return null;
  const prev = series[series.length - 2];
  const curr = series[series.length - 1];
  if (!prev) return null;
  return Math.round(((curr - prev) / prev) * 1000) / 10;
}

function useCountUp(value: number, duration = 700) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    let raf: number;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(
        Math.round(fromRef.current + (value - fromRef.current) * eased),
      );
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

function Sparkline({
  data,
  stroke = "#4f46e5",
}: {
  data: number[];
  stroke?: string;
}) {
  if (data.length < 2) return null;
  const w = 72;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  rawValue: number;
  format?: (n: number) => string;
  insight?: string;
  changePct?: number | null;
  sparkline?: number[];
  colorClasses: (typeof KPI_COLORS)[keyof typeof KPI_COLORS];
  onClick?: () => void;
  delay?: number;
}

const StatCard = ({
  icon,
  label,
  rawValue,
  format,
  insight,
  changePct,
  sparkline,
  colorClasses,
  onClick,
  delay = 0,
}: StatCardProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const animated = useCountUp(mounted ? rawValue : 0);
  const displayValue = format
    ? format(animated)
    : animated.toLocaleString("en-IN");
  const positive = (changePct ?? 0) >= 0;

  return (
    <Card
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity 300ms ease, transform 250ms ease, box-shadow 250ms ease",
      }}
      className={`group border border-gray-200 shadow-sm ${colorClasses.ring} ${
        onClick
          ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          : ""
      } hover:shadow-lg hover:-translate-y-1`}
    >
      <CardContent className="p-5 h-full flex flex-col justify-between min-h-38">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${colorClasses.bg}`}>
            <div className={colorClasses.icon}>{icon}</div>
          </div>
          {sparkline && sparkline.length > 1 ? (
            <Sparkline data={sparkline} stroke={colorClasses.accent} />
          ) : changePct != null ? (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {Math.abs(changePct)}%
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              {displayValue}
            </p>
            {changePct != null && sparkline && (
              <span
                className={`text-xs font-semibold ${positive ? "text-green-600" : "text-red-600"}`}
              >
                {positive ? "↑" : "↓"} {Math.abs(changePct)}%
              </span>
            )}
          </div>
          {insight && <p className="text-xs text-gray-400 mt-1">{insight}</p>}
        </div>
        {onClick && (
          <div className="flex items-center gap-1 text-xs font-medium text-transparent group-hover:text-indigo-600 transition-colors mt-2 -mb-1">
            View details <ArrowRight size={12} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatCardSkeleton = () => (
  <Card className="border border-gray-200 shadow-sm">
    <CardContent className="p-5 min-h-38">
      <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse mb-4" />
      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-6 w-14 bg-gray-200 rounded animate-pulse" />
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
  </div>
);

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-center gap-2">
      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="text-xs text-gray-500 max-w-55">{description}</p>
    </div>
  );
}



function QuickActions({ navigate }: { navigate: (path: string) => void }) {
  const actions = [
    {
      label: "New plan",
      icon: <FilePlus2 size={18} />,
      path: ADMIN_ROUTES.CREATE_PLAN,
    },
    {
      label: "Email template",
      icon: <Mail size={18} />,
      path: ADMIN_ROUTES.CREATE_EMAIL_TEMPLATE,
    },
    {
      label: "Subscribers",
      icon: <Users2 size={18} />,
      path: ADMIN_ROUTES.SUBSCRIBERS,
    },
    {
      label: "Job posts",
      icon: <Layers size={18} />,
      path: ADMIN_ROUTES.JOB_POSTS,
    },
    {
      label: "Email logs",
      icon: <ScrollText size={18} />,
      path: ADMIN_ROUTES.EMAIL_LOGS,
    },
    {
      label: "Activity logs",
      icon: <FileBarChart2 size={18} />,
      path: ADMIN_ROUTES.ACTIVITY_LOGS,
    },
  ];
  return (
    <Card className="border border-gray-200 shadow-sm h-full">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-base">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 grid grid-cols-3 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className="flex flex-col items-center justify-center gap-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl aspect-square hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {a.icon}
            <span className="text-center leading-tight px-1">{a.label}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

interface CommandItem {
  label: string;
  group: string;
  icon: ReactNode;
  path: string;
}

function CommandPalette({
  open,
  onClose,
  navigate,
}: {
  open: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(
    () => [
      {
        label: "Recruiters",
        group: "Manage",
        icon: <Users size={16} />,
        path: ADMIN_ROUTES.RECRUITERS,
      },
      {
        label: "Candidates",
        group: "Manage",
        icon: <User size={16} />,
        path: ADMIN_ROUTES.CANDIDATES,
      },
      {
        label: "Job posts",
        group: "Manage",
        icon: <Briefcase size={16} />,
        path: ADMIN_ROUTES.JOB_POSTS,
      },
      {
        label: "Plans",
        group: "Billing",
        icon: <CreditCard size={16} />,
        path: ADMIN_ROUTES.PLANS,
      },
      {
        label: "Create plan",
        group: "Billing",
        icon: <FilePlus2 size={16} />,
        path: ADMIN_ROUTES.CREATE_PLAN,
      },
      {
        label: "Subscribers",
        group: "Billing",
        icon: <Users2 size={16} />,
        path: ADMIN_ROUTES.SUBSCRIBERS,
      },
      {
        label: "Email templates",
        group: "Communication",
        icon: <Mail size={16} />,
        path: ADMIN_ROUTES.EMAIL_TEMPLATES,
      },
      {
        label: "Create email template",
        group: "Communication",
        icon: <FilePlus2 size={16} />,
        path: ADMIN_ROUTES.CREATE_EMAIL_TEMPLATE,
      },
      {
        label: "Email logs",
        group: "Communication",
        icon: <ScrollText size={16} />,
        path: ADMIN_ROUTES.EMAIL_LOGS,
      },
      {
        label: "Activity logs",
        group: "System",
        icon: <FileBarChart2 size={16} />,
        path: ADMIN_ROUTES.ACTIVITY_LOGS,
      },
      {
        label: "Dashboard",
        group: "System",
        icon: <BarChart3 size={16} />,
        path: ADMIN_ROUTES.DASHBOARD,
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        navigate(filtered[activeIndex].path);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, activeIndex, navigate, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to recruiters, candidates, plans…"
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          <kbd className="text-[10px] font-medium text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            Esc
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">
              No matches for "{query}"
            </p>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left ${
                  index === activeIndex
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700"
                }`}
              >
                <span className="text-gray-400">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-[11px] text-gray-400">{item.group}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}



export default function AdminDashboard() {
  const navigate = useNavigate();
  const { dashboard, loading, error, refresh, lastUpdated } =
    useAdminDashboard();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => refresh(), 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const overview = dashboard?.overview as OverviewExt | undefined;
  const revenueBreakdown = dashboard?.revenueBreakdown ?? [];
  const growthData = dashboard?.subscriptionGrowth ?? [];
  const activities = dashboard?.recentActivities ?? [];

  const revenueChartData = useMemo(
    () =>
      revenueBreakdown.map((item, index) => ({
        name: item.planName,
        value: item.subscribers,
        revenue: item.revenue,
        fill:
          PLAN_COLORS[item.planName] ??
          FALLBACK_COLORS[index % FALLBACK_COLORS.length],
      })),
    [revenueBreakdown],
  );
  const totalSubscribers = revenueBreakdown.reduce(
    (sum, i) => sum + i.subscribers,
    0,
  );
  const maxRevenue = Math.max(1, ...revenueBreakdown.map((i) => i.revenue));
  const subscriptionsSeries = growthData.map((g) => g.subscriptions);
  const revenueSeries = growthData.map((g) => g.revenue);
  const subscriptionsChange = pctChange(subscriptionsSeries);
  const revenueChange = pctChange(revenueSeries);
  const lastUpdatedLabel = lastUpdated ? timeAgo(lastUpdated) : "just now";


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          navigate={navigate}
        />


        <div className="flex-1 overflow-auto px-8 py-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {loading && !dashboard ? (
              Array.from({ length: 6 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            ) : (
              <>
                <StatCard
                  icon={<Users size={20} />}
                  label="Recruiters"
                  rawValue={overview?.totalRecruiters ?? 0}
                  insight="Tap to manage recruiter accounts"
                  colorClasses={KPI_COLORS.recruiters}
                  onClick={() => navigate(ADMIN_ROUTES.RECRUITERS)}
                  delay={0}
                />
                <StatCard
                  icon={<User size={20} />}
                  label="Candidates"
                  rawValue={overview?.totalCandidates ?? 0}
                  insight="Tap to manage candidates"
                  colorClasses={KPI_COLORS.candidates}
                  onClick={() => navigate(ADMIN_ROUTES.CANDIDATES)}
                  delay={40}
                />
                <StatCard
                  icon={<Briefcase size={20} />}
                  label="Jobs"
                  rawValue={overview?.totalJobPosts ?? 0}
                  insight="Tap to manage job posts"
                  colorClasses={KPI_COLORS.jobs}
                  onClick={() => navigate(ADMIN_ROUTES.JOB_POSTS)}
                  delay={80}
                />
                <StatCard
                  icon={<Target size={20} />}
                  label="Applications"
                  rawValue={overview?.totalApplications ?? 0}
                  insight="Across all active job posts"
                  colorClasses={KPI_COLORS.applications}
                  delay={120}
                />
                <StatCard
                  icon={<DollarSign size={20} />}
                  label="Revenue"
                  rawValue={overview?.monthlyRevenue ?? 0}
                  format={formatINR}
                  insight="Tap to view subscribers"
                  changePct={revenueChange}
                  sparkline={
                    revenueSeries.length > 1 ? revenueSeries : undefined
                  }
                  colorClasses={KPI_COLORS.revenue}
                  onClick={() => navigate(ADMIN_ROUTES.SUBSCRIBERS)}
                  delay={160}
                />
                <StatCard
                  icon={<CreditCard size={20} />}
                  label="Subscriptions"
                  rawValue={overview?.totalSubscriptions ?? totalSubscribers}
                  insight="Tap to view all subscribers"
                  changePct={subscriptionsChange}
                  sparkline={
                    subscriptionsSeries.length > 1
                      ? subscriptionsSeries
                      : undefined
                  }
                  colorClasses={KPI_COLORS.subscriptions}
                  onClick={() => navigate(ADMIN_ROUTES.SUBSCRIBERS)}
                  delay={200}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="border border-gray-200 shadow-sm lg:col-span-2">
              <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  Platform growth
                </CardTitle>
                {revenueChange != null && (
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      revenueChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {revenueChange >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    {Math.abs(revenueChange)}% since last month
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                {loading && !dashboard ? (
                  <ChartSkeleton />
                ) : growthData.length === 0 ? (
                  <EmptyState
                    icon={<TrendingUp className="w-7 h-7 text-gray-300" />}
                    title="No growth data yet"
                    description="Growth trends will appear once activity picks up."
                  />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthData}>
                        <defs>
                          <linearGradient
                            id="subsGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#4f46e5"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="95%"
                              stopColor="#4f46e5"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="revGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#7c3aed"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="95%"
                              stopColor="#7c3aed"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="2 4"
                          stroke="#f1f5f9"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="subscriptions"
                          name="Subscriptions"
                          stroke="#4f46e5"
                          strokeWidth={2}
                          fill="url(#subsGradient)"
                          activeDot={{ r: 4 }}
                          dot={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#7c3aed"
                          strokeWidth={2}
                          fill="url(#revGradient)"
                          activeDot={{ r: 4 }}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  Revenue breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {loading && !dashboard ? (
                  <ChartSkeleton />
                ) : revenueChartData.length === 0 ? (
                  <EmptyState
                    icon={<DollarSign className="w-7 h-7 text-gray-300" />}
                    title="No revenue yet"
                    description="Your first subscription purchase will appear here."
                  />
                ) : (
                  <>
                    <div className="relative h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={88}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {revenueChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, _name, item) => [
                              `${value ?? 0} subscribers`,
                              item?.payload?.name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-gray-900">
                          {totalSubscribers}
                        </span>
                        <span className="text-xs text-gray-500">
                          Active plans
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-3">
                      {revenueBreakdown.map((item: RevenueBreakdown) => {
                        const color =
                          PLAN_COLORS[item.planName] ??
                          FALLBACK_COLORS[
                            revenueBreakdown.indexOf(item) %
                              FALLBACK_COLORS.length
                          ];
                        const widthPct = Math.max(
                          6,
                          Math.round((item.revenue / maxRevenue) * 100),
                        );
                        return (
                          <div key={item.planName}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-700 font-medium">
                                {item.planName}
                              </span>
                              <span className="text-gray-500">
                                {item.subscribers} users ·{" "}
                                {formatINR(item.revenue)}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                  width: `${widthPct}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => navigate(ADMIN_ROUTES.PLANS)}
                      className="w-full text-center text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 mt-4"
                    >
                      Manage plans
                    </button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <QuickActions navigate={navigate} />
            </div>

            <Card className="border border-gray-200 shadow-sm lg:col-span-2">
              <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  Recent activity
                </CardTitle>
                <button
                  onClick={() => navigate(ADMIN_ROUTES.ACTIVITY_LOGS)}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  View all
                </button>
              </CardHeader>
              <CardContent className="pt-6">
                {loading && !dashboard ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length === 0 ? (
                  <EmptyState
                    icon={<Inbox className="w-7 h-7 text-gray-300" />}
                    title="No recent activity"
                    description="Everything is up to date."
                  />
                ) : (
                  <ul className="relative pl-2">
                    <div className="absolute left-4.75 top-2 bottom-2 w-px bg-gray-200" />
                    {activities.map((activity: RecentActivity) => {
                      const { icon, bg, verb } = activityVisual(
                        activity.action,
                      );
                      return (
                        <li
                          key={activity.id}
                          className="relative flex items-start gap-4 pb-6 last:pb-0 group"
                        >
                          <div
                            className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center ${bg} ring-4 ring-white`}
                          >
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0 pt-1 rounded-lg -mx-2 px-2 group-hover:bg-gray-50 transition-colors py-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-semibold">
                                {humanizeAction(activity.action)}
                              </span>{" "}
                              <span className="text-gray-500">— {verb}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {timeAgo(activity.createdAt)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white px-8 py-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">RecruitIQ Admin</span>
            <span>Version 1.0.0</span>
            <span>Last sync {lastUpdatedLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server size={12} className="text-green-500" />
            <span className="text-green-600 font-medium">Server healthy</span>
            <span className="text-gray-400">· 99.98% uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
