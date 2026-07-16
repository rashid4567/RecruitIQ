import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Bell,
  Briefcase,
  FileText,
  Video,
  Users,
  User,
  ChevronRight,
  ChevronDown,
  Clock,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CalendarClock,
  RefreshCw,
  Inbox,
  Star,
  Zap,
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  UserCheck,
  Activity,
  ChevronUp,
} from "lucide-react";
import Sidebar from "@/module/recruiter/pages/components/layout/Sidebar";
import { useRecruiterDashboard } from "../hooks/useRecruiterDashboard";
import type {
  DashboardApplication,
  DashboardInterview,
} from "../types/recruiter-dashboard.types";
import { useNavigate } from "react-router-dom";
import { RECRUITER_ROUTES } from "@/routes/constants/Recruiter.routes";
import Header from "@/module/auth/pages/home/header";

const STATUS = {
  info: {
    text: "text-blue-600",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    solid: "#3B82F6",
    ring: "ring-blue-100",
  },
  success: {
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    solid: "#10B981",
    ring: "ring-emerald-100",
  },
  pending: {
    text: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    solid: "#F59E0B",
    ring: "ring-amber-100",
  },
  rejected: {
    text: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    solid: "#EF4444",
    ring: "ring-red-100",
  },
  interview: {
    text: "text-purple-600",
    bg: "bg-purple-50",
    dot: "bg-purple-500",
    solid: "#8B5CF6",
    ring: "ring-purple-100",
  },
} as const;

type Tone = keyof typeof STATUS;
const KPI_ACCENTS = [
  {
    grad: "from-blue-500 to-blue-600",
    chip: "bg-blue-50 text-blue-600",
    ring: "hover:ring-blue-100",
  },
  {
    grad: "from-indigo-500 to-violet-600",
    chip: "bg-indigo-50 text-indigo-600",
    ring: "hover:ring-indigo-100",
  },
  {
    grad: "from-amber-500 to-orange-500",
    chip: "bg-amber-50 text-amber-600",
    ring: "hover:ring-amber-100",
  },
  {
    grad: "from-emerald-500 to-teal-600",
    chip: "bg-emerald-50 text-emerald-600",
    ring: "hover:ring-emerald-100",
  },
  {
    grad: "from-purple-500 to-fuchsia-600",
    chip: "bg-purple-50 text-purple-600",
    ring: "hover:ring-purple-100",
  },
  {
    grad: "from-cyan-500 to-sky-600",
    chip: "bg-cyan-50 text-cyan-600",
    ring: "hover:ring-cyan-100",
  },
  {
    grad: "from-green-500 to-emerald-600",
    chip: "bg-green-50 text-green-600",
    ring: "hover:ring-green-100",
  },
  {
    grad: "from-rose-500 to-red-600",
    chip: "bg-rose-50 text-rose-600",
    ring: "hover:ring-rose-100",
  },
] as const;

const PIPELINE_ICONS = [
  Users,
  Sparkles,
  CheckCircle2,
  Video,
  FileText,
  Check,
] as const;
function applicationTone(status: string): Tone {
  const s = status?.toLowerCase() ?? "";
  if (["rejected", "declined"].includes(s)) return "rejected";
  if (["shortlisted", "hired", "offer_accepted"].includes(s)) return "success";
  if (["interview", "interviewing", "interview_scheduled"].includes(s))
    return "interview";
  if (["pending", "applied", "in_review"].includes(s)) return "pending";
  return "info";
}

function jobTone(status: string): Tone {
  const s = status?.toLowerCase() ?? "";
  if (["published", "active", "open"].includes(s)) return "success";
  if (["closed", "expired", "archived"].includes(s)) return "rejected";
  return "pending";
}

function interviewTone(status: string): Tone {
  const s = status?.toLowerCase() ?? "";
  if (["completed", "passed"].includes(s)) return "success";
  if (["cancelled", "no_show"].includes(s)) return "rejected";
  if (["scheduled", "upcoming"].includes(s)) return "interview";
  return "pending";
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}


function computeWeeklyTrend(dates: string[]): number | null {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  let thisWeek = 0;
  let lastWeek = 0;
  for (const iso of dates) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    if (d >= weekAgo && d <= now) thisWeek += 1;
    else if (d >= twoWeeksAgo && d < weekAgo) lastWeek += 1;
  }
  if (lastWeek === 0) return thisWeek > 0 ? 100 : null;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
}

const trendRanges = ["7 Days", "30 Days", "90 Days"] as const;
type TrendRange = (typeof trendRanges)[number];

const trendMetrics = [
  "Applications",
  "AI Score",
  "Interviews",
  "Hires",
] as const;
type TrendMetric = (typeof trendMetrics)[number];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildTrendData(
  applications: DashboardApplication[],
  interviews: DashboardInterview[],
  range: TrendRange,
) {
  const bucketCount = range === "7 Days" ? 7 : range === "30 Days" ? 30 : 90;
  const groupByWeek = range !== "7 Days";
  const now = new Date();
  const buckets: {
    label: string;
    start: Date;
    end: Date;
    applications: number;
    shortlisted: number;
    interview: number;
    hired: number;
    aiScoreSum: number;
    aiScoreCount: number;
  }[] = [];

  if (!groupByWeek) {
    for (let i = bucketCount - 1; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      buckets.push({
        label: day.toLocaleDateString(undefined, { weekday: "short" }),
        start: day,
        end: next,
        applications: 0,
        shortlisted: 0,
        interview: 0,
        hired: 0,
        aiScoreSum: 0,
        aiScoreCount: 0,
      });
    }
  } else {
    const weeks = Math.ceil(bucketCount / 7);
    for (let i = weeks - 1; i >= 0; i--) {
      const end = new Date(now);
      end.setDate(end.getDate() - i * 7);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      buckets.push({
        label: `Wk ${weeks - i}`,
        start,
        end,
        applications: 0,
        shortlisted: 0,
        interview: 0,
        hired: 0,
        aiScoreSum: 0,
        aiScoreCount: 0,
      });
    }
  }

  for (const app of applications) {
    const applied = new Date(app.appliedAt);
    const bucket = buckets.find((b) => applied >= b.start && applied < b.end);
    if (!bucket) continue;
    bucket.applications += 1;
    const tone = applicationTone(app.status);
    if (tone === "success" && app.status?.toLowerCase() !== "hired")
      bucket.shortlisted += 1;
    if (app.status?.toLowerCase() === "hired") bucket.hired += 1;
    if (typeof app.aiScore === "number") {
      bucket.aiScoreSum += app.aiScore;
      bucket.aiScoreCount += 1;
    }
  }
  for (const iv of interviews) {
    const scheduled = new Date(iv.scheduledAt);
    const bucket = buckets.find(
      (b) => scheduled >= b.start && scheduled < b.end,
    );
    if (bucket) bucket.interview += 1;
  }

  const earliestStart = buckets[0]?.start ?? now;
  const inRangeApplications = applications.filter(
    (a) => new Date(a.appliedAt) >= earliestStart,
  );
  const inRangeScored = inRangeApplications.filter(
    (a) => typeof a.aiScore === "number",
  );
  const avgAiScore = inRangeScored.length
    ? Math.round(
        inRangeScored.reduce((sum, a) => sum + (a.aiScore ?? 0), 0) /
          inRangeScored.length,
      )
    : null;
  const hiredInRange = inRangeApplications.filter(
    (a) => a.status?.toLowerCase() === "hired",
  ).length;
  const hireRate = inRangeApplications.length
    ? Math.round((hiredInRange / inRangeApplications.length) * 100)
    : 0;

  return {
    points: buckets.map((b) => ({
      label: b.label,
      applications: b.applications,
      shortlisted: b.shortlisted,
      interview: b.interview,
      hired: b.hired,
      aiScore: b.aiScoreCount ? Math.round(b.aiScoreSum / b.aiScoreCount) : 0,
    })),
    totalApplications: inRangeApplications.length,
    avgAiScore,
    hireRate,
  };
}

function buildWeekdayHeatmap(applications: DashboardApplication[]) {
  const counts = new Array(7).fill(0);
  for (const app of applications) {
    const d = new Date(app.appliedAt);
    if (Number.isNaN(d.getTime())) continue;
    counts[d.getDay()] += 1;
  }
  const max = Math.max(1, ...counts);
  return WEEKDAY_LABELS.map((label, i) => ({
    label,
    count: counts[i],
    pct: Math.round((counts[i] / max) * 100),
  }));
}

function ToneDot({ tone }: { tone: Tone }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS[tone].dot}`}
    />
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  const s = STATUS[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <ToneDot tone={tone} />
      {children}
    </span>
  );
}

function AnimatedNumber({
  value,
  duration = 900,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = display;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

function TrendBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const positive = pct >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${positive ? "text-emerald-600" : "text-red-500"}`}
    >
      <Icon size={11} strokeWidth={2.5} />
      {positive ? "+" : ""}
      {pct}%
    </span>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = "",
  tint,
  delay = 0,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tint?: "white" | "blue" | "purple" | "green" | "gray";
  delay?: number;
}) {
  const tintClass =
    tint === "blue"
      ? "bg-linear-to-br from-blue-50/70 to-white"
      : tint === "purple"
        ? "bg-linear-to-br from-purple-50/70 to-white"
        : tint === "green"
          ? "bg-linear-to-br from-emerald-50/70 to-white"
          : tint === "gray"
            ? "bg-linear-to-br from-gray-50 to-white"
            : "bg-white";
  return (
    <div
      className={`fade-up ${tintClass} rounded-2xl p-6 border border-gray-200 shadow-sm transition-shadow hover:shadow-md ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {title && (
        <div className="flex items-start justify-between mb-5 gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function EmptyState({
  title,
  subtitle,
  ctaLabel,
  onCta,
}: {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <div className="relative w-16 h-16 mb-3">
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-50 to-indigo-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Inbox size={22} className="text-blue-300" />
        </div>
        <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white border-2 border-blue-100" />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1 max-w-xs">{subtitle}</p>
      {ctaLabel && (
        <button
          onClick={onCta}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3"
        >
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <SectionCard>
      <Skeleton className="h-5 w-40 mb-5" />
      <Skeleton className="h-64 w-full" />
    </SectionCard>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <SectionCard>
      <Skeleton className="h-5 w-40 mb-5" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-500" />
      </div>
      <p className="text-base font-semibold text-gray-900">
        Couldn&apos;t load dashboard
      </p>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
}

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { dashboard, loading, error, refresh, isEmpty } =
    useRecruiterDashboard();

  const [range, setRange] = useState<TrendRange>("7 Days");
  const [metric, setMetric] = useState<TrendMetric>("Applications");
  const [fabOpen, setFabOpen] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date());
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);

  useEffect(() => {
    if (!loading) setLastSyncedAt(new Date());
  }, [loading]);

  const jobs = dashboard?.jobs ?? [];
  const applications = dashboard?.applications ?? [];
  const interviews = dashboard?.interviews ?? [];
  const subscription = dashboard?.subscription ?? null;

  const todaysInterviews = useMemo(() => {
    const today = new Date();

    return interviews.filter((iv) =>
      isSameDay(new Date(iv.scheduledAt), today),
    );
  }, [interviews]);

  const todaysApplications = useMemo(() => {
    const today = new Date();

    return applications.filter((a) => isSameDay(new Date(a.appliedAt), today));
  }, [applications]);
  const pendingReview = useMemo(
    () =>
      applications.filter((a) => applicationTone(a.status) === "pending")
        .length,
    [applications],
  );

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12 ? "Morning" : currentHour < 18 ? "Afternoon" : "Evening";
  const applicationsTrend = useMemo(
    () => computeWeeklyTrend(applications.map((a) => a.appliedAt)),
    [applications],
  );
  const interviewsTrend = useMemo(
    () => computeWeeklyTrend(interviews.map((iv) => iv.scheduledAt)),
    [interviews],
  );
  const hiredTrend = useMemo(
    () =>
      computeWeeklyTrend(
        applications
          .filter((a) => a.status?.toLowerCase() === "hired")
          .map((a) => a.appliedAt),
      ),
    [applications],
  );
  const rejectedTrend = useMemo(
    () =>
      computeWeeklyTrend(
        applications
          .filter((a) => applicationTone(a.status) === "rejected")
          .map((a) => a.appliedAt),
      ),
    [applications],
  );

  const kpiCards = useMemo(() => {
    const count = (pred: (a: DashboardApplication) => boolean) =>
      applications.filter(pred).length;
    return [
      {
        label: "Active Jobs",
        value: jobs.filter((j) => jobTone(j.status) === "success").length,
        icon: Briefcase,
        href: RECRUITER_ROUTES.JOBS,
        trend: null as number | null,
      },
      {
        label: "Applications",
        value: applications.length,
        icon: Users,
        href: null,
        trend: applicationsTrend,
      },
      {
        label: "Pending Review",
        value: pendingReview,
        icon: AlertCircle,
        href: null,
        trend: null,
      },
      {
        label: "Shortlisted",
        value: count((a) => a.status?.toLowerCase() === "shortlisted"),
        icon: CheckCircle2,
        href: null,
        trend: null,
      },
      {
        label: "Interviews Scheduled",
        value: interviews.filter(
          (iv) => interviewTone(iv.status) === "interview",
        ).length,
        icon: Video,
        href: RECRUITER_ROUTES.INTERVIEWS,
        trend: interviewsTrend,
      },
      {
        label: "Offers Sent",
        value: count((a) =>
          ["offer", "offer_sent", "offered"].includes(a.status?.toLowerCase()),
        ),
        icon: FileText,
        href: null,
        trend: null,
      },
      {
        label: "Hired",
        value: count((a) => a.status?.toLowerCase() === "hired"),
        icon: Check,
        href: null,
        trend: hiredTrend,
      },
      {
        label: "Rejected",
        value: count((a) => applicationTone(a.status) === "rejected"),
        icon: XCircle,
        href: null,
        trend: rejectedTrend,
      },
    ];
  }, [
    jobs,
    applications,
    interviews,
    pendingReview,
    applicationsTrend,
    interviewsTrend,
    hiredTrend,
    rejectedTrend,
  ]);

  const pipelineStages = useMemo(() => {
    const total = applications.length;
    const screened = applications.filter(
      (a) => a.analysisStatus?.toLowerCase() === "completed",
    ).length;
    const shortlisted = applications.filter(
      (a) => a.status?.toLowerCase() === "shortlisted",
    ).length;
    const interviewCount = interviews.length;
    const offer = applications.filter((a) =>
      ["offer", "offer_sent", "offered"].includes(a.status?.toLowerCase()),
    ).length;
    const hired = applications.filter(
      (a) => a.status?.toLowerCase() === "hired",
    ).length;
    return [
      { label: "Applied", value: total, tone: "info" as Tone },
      { label: "AI Screened", value: screened, tone: "info" as Tone },
      { label: "Shortlisted", value: shortlisted, tone: "success" as Tone },
      { label: "Interview", value: interviewCount, tone: "interview" as Tone },
      { label: "Offer", value: offer, tone: "pending" as Tone },
      { label: "Hired", value: hired, tone: "success" as Tone },
    ];
  }, [applications, interviews]);

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => b.applicationsCount - a.applicationsCount),
    [jobs],
  );
  const topJobs = showAllJobs ? sortedJobs : sortedJobs.slice(0, 5);
  const maxJobApplications = Math.max(
    1,
    ...sortedJobs.map((j) => j.applicationsCount),
  );
  const maxJobViews = Math.max(1, ...sortedJobs.map((j) => j.views));

  const sortedApplications = useMemo(
    () =>
      [...applications].sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      ),
    [applications],
  );
  const recentApplications = showAllApps
    ? sortedApplications
    : sortedApplications.slice(0, 5);

  const aiTopCandidates = useMemo(() => {
    return [...applications]
      .filter((a) => typeof a.aiScore === "number")
      .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
      .slice(0, 3);
  }, [applications]);

  const trend = useMemo(
    () => buildTrendData(applications, interviews, range),
    [applications, interviews, range],
  );

  const weekdayHeatmap = useMemo(
    () => buildWeekdayHeatmap(applications),
    [applications],
  );

  const metricConfig: Record<
    TrendMetric,
    {
      key: "applications" | "aiScore" | "interview" | "hired";
      name: string;
      color: string;
    }
  > = {
    Applications: {
      key: "applications",
      name: "Applications",
      color: STATUS.info.solid,
    },
    "AI Score": { key: "aiScore", name: "Avg. AI Score", color: "#8B5CF6" },
    Interviews: {
      key: "interview",
      name: "Interviews",
      color: STATUS.interview.solid,
    },
    Hires: { key: "hired", name: "Hired", color: "#059669" },
  };

  const usagePct = (used: number, limit: number) =>
    limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const usageColor = (pct: number) =>
    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-blue-600";
  const healthScore = useMemo(() => {
    const appActivity =
      jobs.length > 0
        ? Math.min(
            100,
            Math.round((applications.length / (jobs.length * 5)) * 100),
          )
        : 0;
    const hiringHealth = Math.min(100, trend.hireRate * 3);
    const aiHealth = trend.avgAiScore ?? 50;
    let subHealth = 70;
    if (subscription) {
      const usages = [
        usagePct(subscription.jobPostsUsed, subscription.jobPostsLimit),
        usagePct(subscription.screeningUsed, subscription.screeningLimit),
        usagePct(subscription.aiScoreUsed, subscription.aiScoreLimit),
        usagePct(
          subscription.resumeDownloadedCount,
          subscription.resumeDownloadLimit,
        ),
      ];
      const avgUsage = usages.reduce((s, v) => s + v, 0) / usages.length;
      subHealth = Math.max(0, 100 - avgUsage);
    }
    const overall = Math.round(
      (appActivity + hiringHealth + aiHealth + subHealth) / 4,
    );
    const label =
      overall >= 85
        ? "Excellent"
        : overall >= 70
          ? "Good"
          : overall >= 50
            ? "Fair"
            : "Needs Attention";
    const labelTone: Tone =
      overall >= 85
        ? "success"
        : overall >= 70
          ? "success"
          : overall >= 50
            ? "pending"
            : "rejected";
    return {
      overall,
      label,
      labelTone,
      breakdown: [
        { label: "Applications", value: appActivity },
        { label: "Hiring", value: Math.round(hiringHealth) },
        { label: "AI Screening", value: Math.round(aiHealth) },
        { label: "Subscription", value: Math.round(subHealth) },
      ],
    };
  }, [jobs, applications, trend, subscription]);

  const aiRecommendations = useMemo(() => {
    const items: { icon: typeof CheckCircle2; text: string; tone: Tone }[] = [];

    if (aiTopCandidates[0]) {
      items.push({
        icon: CheckCircle2,
        text: `${aiTopCandidates[0].candidateName} is your strongest match at ${aiTopCandidates[0].aiScore}% for ${aiTopCandidates[0].jobTitle}`,
        tone: "success",
      });
    }
    const lowApplicantJob = jobs.find(
      (j) => jobTone(j.status) === "success" && j.applicationsCount < 3,
    );
    if (lowApplicantJob) {
      items.push({
        icon: AlertTriangle,
        text: `"${lowApplicantJob.title}" has very few applicants — consider boosting visibility`,
        tone: "pending",
      });
    }
    if (applicationsTrend !== null) {
      items.push({
        icon: applicationsTrend >= 0 ? TrendingUp : TrendingDown,
        text: `Applications ${applicationsTrend >= 0 ? "increased" : "decreased"} ${Math.abs(applicationsTrend)}% vs last week`,
        tone: applicationsTrend >= 0 ? "success" : "rejected",
      });
    }
    if (trend.avgAiScore !== null) {
      items.push({
        icon: Star,
        text: `Average AI match quality is ${trend.avgAiScore}% across recent applications`,
        tone: trend.avgAiScore >= 70 ? "success" : "pending",
      });
    }
    return items.slice(0, 4);
  }, [aiTopCandidates, jobs, applicationsTrend, trend.avgAiScore]);

  const activityFeed = useMemo(() => {
    const items: {
      text: string;
      time: string;
      at: number;
      kind: "application" | "interview";
    }[] = [];
    for (const a of applications.slice(0, 10)) {
      items.push({
        text: `${a.candidateName} applied to ${a.jobTitle}`,
        time: formatRelativeTime(a.appliedAt),
        at: new Date(a.appliedAt).getTime(),
        kind: "application",
      });
    }
    for (const iv of interviews.slice(0, 10)) {
      items.push({
        text: `Interview with ${iv.candidateName} — ${iv.status}`,
        time: formatRelativeTime(iv.scheduledAt),
        at: new Date(iv.scheduledAt).getTime(),
        kind: "interview",
      });
    }
    return items.sort((a, b) => b.at - a.at).slice(0, 6);
  }, [applications, interviews]);

  const quickActions = [
    {
      label: "Post Job",
      icon: Plus,
      href: RECRUITER_ROUTES.JOB_EDITOR,
      tone: "info" as Tone,
    },
    {
      label: "Manage Jobs",
      icon: Briefcase,
      href: RECRUITER_ROUTES.JOBS,
      tone: "info" as Tone,
    },
    {
      label: "Interviews",
      icon: Video,
      href: RECRUITER_ROUTES.INTERVIEWS,
      tone: "interview" as Tone,
    },
    {
      label: "Notifications",
      icon: Bell,
      href: RECRUITER_ROUTES.NOTIFICATIONS,
      tone: "pending" as Tone,
    },
    {
      label: "Subscription Plans",
      icon: Sparkles,
      href: RECRUITER_ROUTES.PLANS,
      tone: "success" as Tone,
    },
    {
      label: "Edit Profile",
      icon: User,
      href: RECRUITER_ROUTES.PROFILE,
      tone: "info" as Tone,
    },
  ] as const;

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-auto">
          <DashboardError message={error} onRetry={refresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
        @keyframes softPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .soft-pulse { animation: softPulse 2s ease-in-out infinite; }
      `}</style>
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto relative">
        <Header />

        <div className="p-8 space-y-6">
          <div className="fade-up relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -right-4 top-20 w-40 h-40 bg-white/5 rounded-full" />
            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 soft-pulse" />
                  Live · Synced {formatRelativeTime(lastSyncedAt.toISOString())}
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  Good {greeting}
                  {dashboard ? `, ${dashboard.recruiter.recruiterName}` : ""} 👋
                </h1>
                <p className="text-blue-100 text-sm mt-2 max-w-lg">
                  Here&apos;s what&apos;s happening across your pipeline today.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <button
                    onClick={() => navigate(RECRUITER_ROUTES.JOB_EDITOR)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={15} /> Post Job
                  </button>
                  <button
                    onClick={() => navigate(RECRUITER_ROUTES.JOBS)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors"
                  >
                    View Jobs
                  </button>
                  <button
                    onClick={refresh}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-white/70 rounded-lg text-xs font-medium hover:text-white transition-colors"
                    title="Refresh dashboard"
                  >
                    <RefreshCw size={13} /> Refresh
                  </button>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-3xl font-black">
                    <AnimatedNumber
                      value={loading ? 0 : todaysApplications.length}
                    />
                  </p>
                  <p className="text-xs text-blue-200 mt-1 font-medium">
                    New Applications
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black">
                    <AnimatedNumber
                      value={loading ? 0 : todaysInterviews.length}
                    />
                  </p>
                  <p className="text-xs text-blue-200 mt-1 font-medium">
                    Interviews Today
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black">
                    <AnimatedNumber value={loading ? 0 : pendingReview} />
                  </p>
                  <p className="text-xs text-blue-200 mt-1 font-medium">
                    Pending Reviews
                  </p>
                </div>
              </div>
            </div>

            {!loading && (
              <div className="relative mt-7 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-3 sm:w-56 shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <Activity size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-200 font-medium">
                      Recruitment Health
                    </p>
                    <p className="text-xl font-black leading-tight">
                      <AnimatedNumber value={healthScore.overall} />% ·{" "}
                      <span className="text-sm font-bold">
                        {healthScore.label}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {healthScore.breakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-[11px] text-blue-200 mb-1">
                        <span>{b.label}</span>
                        <span className="font-semibold text-white">
                          {b.value}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/80"
                          style={{
                            width: `${Math.min(100, Math.max(4, b.value))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {loading ? (
            <KpiSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpiCards.map((kpi, i) => {
                const Icon = kpi.icon;
                const accent = KPI_ACCENTS[i % KPI_ACCENTS.length];
                const Wrapper = kpi.href ? "a" : "div";
                return (
                  <Wrapper
                    key={kpi.label}
                    {...(kpi.href ? { href: kpi.href } : {})}
                    className={`fade-up group bg-white border border-gray-200 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ring-1 ring-transparent ${accent.ring} ${
                      kpi.href ? "cursor-pointer" : ""
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br ${accent.grad} shadow-sm`}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                      {kpi.href && (
                        <ChevronRight
                          size={16}
                          className="text-gray-300 group-hover:text-gray-500 transition-colors"
                        />
                      )}
                    </div>
                    <div className="flex items-end justify-between mt-3">
                      <p className="text-3xl font-black text-gray-900 tracking-tight">
                        <AnimatedNumber value={kpi.value} />
                      </p>
                      <TrendBadge pct={kpi.trend} />
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      {kpi.label}
                    </p>
                  </Wrapper>
                );
              })}
            </div>
          )}

          {isEmpty && !loading ? (
            <SectionCard>
              <EmptyState
                title="No activity yet"
                subtitle="Post your first job to start receiving applications — your dashboard will fill in as candidates apply."
                ctaLabel="Post a Job"
                onCta={() => navigate(RECRUITER_ROUTES.JOB_EDITOR)}
              />
            </SectionCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {loading ? (
                  <ChartSkeleton />
                ) : (
                  <SectionCard
                    title="Application Trends"
                    action={
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                          {trendRanges.map((r) => (
                            <button
                              key={r}
                              onClick={() => setRange(r)}
                              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                                range === r
                                  ? "bg-white text-gray-900 shadow-sm"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                          {trendMetrics.map((m) => (
                            <button
                              key={m}
                              onClick={() => setMetric(m)}
                              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                                metric === m
                                  ? "bg-white text-gray-900 shadow-sm"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-[11px] font-medium text-blue-600/80">
                          Applications
                        </p>
                        <p className="text-xl font-black text-blue-700 mt-0.5">
                          <AnimatedNumber value={trend.totalApplications} />
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3">
                        <p className="text-[11px] font-medium text-purple-600/80">
                          Avg. AI Score
                        </p>
                        <p className="text-xl font-black text-purple-700 mt-0.5">
                          {trend.avgAiScore !== null ? (
                            <>
                              <AnimatedNumber value={trend.avgAiScore} />%
                            </>
                          ) : (
                            "—"
                          )}
                        </p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-3">
                        <p className="text-[11px] font-medium text-emerald-600/80">
                          Hiring Rate
                        </p>
                        <p className="text-xl font-black text-emerald-700 mt-0.5">
                          <AnimatedNumber value={trend.hireRate} />%
                        </p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart
                        data={trend.points}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f0f0f0"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          stroke="#d1d5db"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#d1d5db" style={{ fontSize: "12px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line
                          type="monotone"
                          dataKey={metricConfig[metric].key}
                          name={metricConfig[metric].name}
                          stroke={metricConfig[metric].color}
                          strokeWidth={2.5}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </SectionCard>
                )}

                {!loading && (
                  <SectionCard
                    title="Hiring Pipeline"
                    subtitle="Where candidates drop off, stage by stage"
                  >
                    <div className="flex flex-col items-center gap-1">
                      {pipelineStages.map((stage, idx) => {
                        const tone = STATUS[stage.tone];
                        const maxValue = Math.max(1, pipelineStages[0].value);
                        const widthPct = Math.max(
                          22,
                          Math.round((stage.value / maxValue) * 100),
                        );
                        const Icon = PIPELINE_ICONS[idx];
                        const conversion =
                          idx > 0 && pipelineStages[idx - 1].value > 0
                            ? Math.round(
                                (stage.value / pipelineStages[idx - 1].value) *
                                  100,
                              )
                            : null;
                        return (
                          <React.Fragment key={stage.label}>
                            <div
                              className="fade-up w-full flex justify-center group"
                              style={{ animationDelay: `${idx * 70}ms` }}
                            >
                              <div
                                className={`relative flex items-center justify-between px-5 py-3.5 rounded-xl ${tone.bg} border ${tone.ring} transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-md cursor-default`}
                                style={{ width: `${widthPct}%`, minWidth: 180 }}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center ${tone.text}`}
                                  >
                                    <Icon size={14} />
                                  </span>
                                  <span
                                    className={`text-xs font-semibold ${tone.text}`}
                                  >
                                    {stage.label}
                                  </span>
                                </div>
                                <span
                                  className={`text-lg font-black ${tone.text}`}
                                >
                                  <AnimatedNumber value={stage.value} />
                                </span>
                              </div>
                            </div>
                            {idx < pipelineStages.length - 1 && (
                              <div className="flex flex-col items-center text-gray-300 py-0.5">
                                <ChevronDown size={14} />
                                {conversion !== null && (
                                  <span
                                    className={`text-[10px] font-semibold -mt-0.5 ${conversion >= 50 ? "text-emerald-500" : "text-gray-400"}`}
                                  >
                                    {conversion}% carry through
                                  </span>
                                )}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </SectionCard>
                )}
                {!loading && applications.length > 0 && (
                  <SectionCard
                    title="Weekly Application Volume"
                    subtitle="Applications received by day of week"
                  >
                    <div className="flex items-end justify-between gap-2 h-32">
                      {weekdayHeatmap.map((d) => (
                        <div
                          key={d.label}
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                        >
                          <span className="text-[11px] font-semibold text-gray-500">
                            {d.count}
                          </span>
                          <div
                            className="w-full rounded-t-md bg-linear-to-t from-blue-500 to-indigo-400 transition-all"
                            style={{ height: `${Math.max(6, d.pct)}%` }}
                          />
                          <span className="text-[11px] text-gray-400">
                            {d.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {loading ? (
                  <ListSkeleton rows={4} />
                ) : (
                  <SectionCard
                    title="Job Performance"
                    action={
                      <button
                        onClick={() => navigate(RECRUITER_ROUTES.JOBS)}
                        className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-700 font-medium"
                      >
                        View All Jobs <ChevronRight size={16} />
                      </button>
                    }
                  >
                    {topJobs.length > 0 ? (
                      <>
                        <div className="space-y-5">
                          {topJobs.map((job, idx) => (
                            <div
                              key={job.id ?? idx}
                              onClick={() =>
                                job.id &&
                                navigate(
                                  RECRUITER_ROUTES.JOB_APPLICATIONS(job.id),
                                )
                              }
                              className="fade-up p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-900 text-sm truncate pr-3">
                                  {job.title}
                                </p>
                                <StatusPill tone={jobTone(job.status)}>
                                  {job.status}
                                </StatusPill>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-gray-400 w-20 shrink-0">
                                    Applications
                                  </span>
                                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-500"
                                      style={{
                                        width: `${Math.max(4, (job.applicationsCount / maxJobApplications) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                                    {job.applicationsCount}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-gray-400 w-20 shrink-0">
                                    Views
                                  </span>
                                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-linear-to-r from-cyan-400 to-sky-500"
                                      style={{
                                        width: `${Math.max(4, (job.views / maxJobViews) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                                    {job.views}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {sortedJobs.length > 5 && (
                          <button
                            onClick={() => setShowAllJobs((v) => !v)}
                            className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 py-2 border-t border-gray-100"
                          >
                            {showAllJobs ? (
                              <>
                                Show Less <ChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                Show All {sortedJobs.length} Jobs{" "}
                                <ChevronDown size={14} />
                              </>
                            )}
                          </button>
                        )}
                      </>
                    ) : (
                      <EmptyState
                        title="No Jobs Yet"
                        subtitle="Post your first job to start receiving applications."
                        ctaLabel="Create Job"
                        onCta={() => navigate(RECRUITER_ROUTES.JOB_EDITOR)}
                      />
                    )}
                  </SectionCard>
                )}

                {loading ? (
                  <ListSkeleton rows={4} />
                ) : (
                  <SectionCard
                    title="Latest Candidates"
                    action={
                      <button
                        onClick={() =>
                          topJobs[0]?.id &&
                          navigate(
                            RECRUITER_ROUTES.JOB_APPLICATIONS(topJobs[0].id),
                          )
                        }
                        className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-700 font-medium"
                      >
                        View All <ChevronRight size={16} />
                      </button>
                    }
                  >
                    {recentApplications.length > 0 ? (
                      <>
                        <div className="space-y-1">
                          {recentApplications.map((app, idx) => {
                            const stars =
                              typeof app.aiScore === "number"
                                ? Math.round(app.aiScore / 20)
                                : 0;
                            return (
                              <div
                                key={app.applicationId}
                                className="fade-up flex items-center justify-between gap-3 py-3.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                                style={{ animationDelay: `${idx * 40}ms` }}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                 <div className="h-12 w-12 shrink-0 rounded-full bg-linear-to-br from-blue-500 via-indigo-500 to-violet-600 text-white font-bold text-base flex items-center justify-center shadow-sm overflow-hidden">
                                    {app.candidateProfileImage ? (
                                      <img
                                        src={app.candidateProfileImage}
                                        alt={app.candidateName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      app.candidateName.charAt(0).toUpperCase()
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {app.candidateName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {app.jobTitle} ·{" "}
                                      {formatRelativeTime(app.appliedAt)}
                                    </p>
                                    {stars > 0 && (
                                      <div className="flex items-center gap-0.5 mt-1">
                                        {Array.from({ length: 5 }).map(
                                          (_, i) => (
                                            <Star
                                              key={i}
                                              size={11}
                                              className={
                                                i < stars
                                                  ? "fill-amber-400 text-amber-400"
                                                  : "text-gray-200"
                                              }
                                            />
                                          ),
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  {typeof app.aiScore === "number" && (
                                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-full hidden sm:inline">
                                      AI {app.aiScore}%
                                    </span>
                                  )}
                                  <StatusPill
                                    tone={applicationTone(app.status)}
                                  >
                                    {app.status}
                                  </StatusPill>
                                  <div className="hidden md:flex items-center gap-1.5">
                                    <button
                                      onClick={() =>
                                        navigate(
                                          RECRUITER_ROUTES.APPLICATION_DETAILS(
                                            app.applicationId,
                                          ),
                                        )
                                      }
                                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                                      title="View resume"
                                    >
                                      <ExternalLink size={14} />
                                    </button>
                                    <button
                                      className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600"
                                      title="Shortlist"
                                    >
                                    
                                    </button>
                                    <button
                                      className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                                      title="Reject"
                                    >
                                    
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {sortedApplications.length > 5 && (
                          <button
                            onClick={() => setShowAllApps((v) => !v)}
                            className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 py-2 border-t border-gray-100"
                          >
                            {showAllApps ? (
                              <>
                                Show Less <ChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                Show All {sortedApplications.length} Candidates{" "}
                                <ChevronDown size={14} />
                              </>
                            )}
                          </button>
                        )}
                      </>
                    ) : (
                      <EmptyState
                        title="No Applications Yet"
                        subtitle="Candidates who apply will appear here."
                      />
                    )}
                  </SectionCard>
                )}
              </div>

              <div className="space-y-6">
                {!loading && (
                  <SectionCard tint="purple">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
                        <Sparkles size={15} className="text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900">
                        AI Intelligence
                      </h3>
                    </div>

                    {aiTopCandidates.length > 0 && (
                      <div className="space-y-2.5 mb-4">
                        {aiTopCandidates.map((cand, idx) => (
                          <div
                            key={cand.applicationId}
                            onClick={() =>
                              navigate(
                                RECRUITER_ROUTES.APPLICATION_DETAILS(
                                  cand.applicationId,
                                ),
                              )
                            }
                            className="fade-up bg-white/70 rounded-xl p-3.5 cursor-pointer hover:bg-white transition-colors border border-purple-100"
                            style={{ animationDelay: `${idx * 60}ms` }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[11px] font-bold text-purple-400 w-4">
                                  #{idx + 1}
                                </span>
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {cand.candidateName}
                                </p>
                              </div>
                              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                                {cand.aiScore}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 pl-6">
                              {cand.jobTitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiRecommendations.length > 0 ? (
                      <div className="space-y-2 pt-3 border-t border-purple-100/70">
                        {aiRecommendations.map((rec, idx) => {
                          const Icon = rec.icon;
                          const tone = STATUS[rec.tone];
                          return (
                            <div key={idx} className="flex items-start gap-2">
                              <span
                                className={`mt-0.5 w-5 h-5 rounded-md ${tone.bg} flex items-center justify-center shrink-0`}
                              >
                                <Icon size={11} className={tone.text} />
                              </span>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {rec.text}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      aiTopCandidates.length === 0 && (
                        <EmptyState
                          title="No AI Scores Yet"
                          subtitle="Once candidates are screened, insights show up here."
                        />
                      )
                    )}
                  </SectionCard>
                )}
                {!loading && (
                  <SectionCard
                    title="Today's Interviews"
                    action={
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CalendarClock size={13} /> {todaysInterviews.length}{" "}
                        scheduled
                      </span>
                    }
                  >
                    {todaysInterviews.length > 0 ? (
                      <div className="space-y-3">
                        {todaysInterviews.map((iv) => (
                          <div
                            key={iv.interviewId}
                            className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                          >
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {iv.candidateName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {iv.jobTitle}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <Clock size={11} />{" "}
                                {new Date(iv.scheduledAt).toLocaleTimeString(
                                  undefined,
                                  { hour: "numeric", minute: "2-digit" },
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {iv.roomId && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      RECRUITER_ROUTES.INTERVIEW_ROOM(
                                        iv.interviewId,
                                      ),
                                    )
                                  }
                                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-3 py-1.5"
                                >
                                  Join
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  navigate(
                                    RECRUITER_ROUTES.INTERVIEW_LOBBY(
                                      iv.interviewId,
                                    ),
                                  )
                                }
                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 border border-gray-200 rounded-lg"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No Interviews Today"
                        subtitle="Scheduled interviews for today will show up here."
                      />
                    )}
                  </SectionCard>
                )}

                {!loading && subscription && (
                  <SectionCard
                    tint="blue"
                    title={subscription.planName}
                    action={
                      <span className="text-xs text-gray-400">
                        Expires{" "}
                        {new Date(subscription.endDate).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    }
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-linear-to-r from-amber-400 to-orange-500 px-2.5 py-1 rounded-full">
                        <Zap size={11} /> {subscription.planName.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                        {Math.max(
                          0,
                          subscription.jobPostsLimit -
                            subscription.jobPostsUsed,
                        )}{" "}
                        jobs left
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                        {Math.max(
                          0,
                          subscription.aiScoreLimit - subscription.aiScoreUsed,
                        )}{" "}
                        AI credits
                      </span>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Jobs Used",
                          used: subscription.jobPostsUsed,
                          limit: subscription.jobPostsLimit,
                        },
                        {
                          label: "Screening Credits",
                          used: subscription.screeningUsed,
                          limit: subscription.screeningLimit,
                        },
                        {
                          label: "AI Score Credits",
                          used: subscription.aiScoreUsed,
                          limit: subscription.aiScoreLimit,
                        },
                        {
                          label: "Resume Downloads",
                          used: subscription.resumeDownloadedCount,
                          limit: subscription.resumeDownloadLimit,
                        },
                      ].map((row) => {
                        const pct = usagePct(row.used, row.limit);
                        return (
                          <div key={row.label}>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-600 font-medium">
                                {row.label}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {row.used} / {row.limit} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${usageColor(pct)}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <button
                        onClick={() => navigate(RECRUITER_ROUTES.PLANS)}
                        className="w-full mt-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg py-2"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  </SectionCard>
                )}

                {!loading && (
                  <SectionCard title="Recruiter Activity" tint="gray">
                    {activityFeed.length > 0 ? (
                      <div className="space-y-3.5">
                        {activityFeed.map((item, idx) => (
                          <div
                            key={idx}
                            className="fade-up flex gap-3"
                            style={{ animationDelay: `${idx * 40}ms` }}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                item.kind === "application"
                                  ? "bg-blue-50"
                                  : "bg-purple-50"
                              }`}
                            >
                              {item.kind === "application" ? (
                                <UserCheck
                                  size={12}
                                  className="text-blue-500"
                                />
                              ) : (
                                <CalendarCheck
                                  size={12}
                                  className="text-purple-500"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-700">
                                {item.text}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {item.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No Activity Yet"
                        subtitle="Recent applications and interviews will show up here."
                      />
                    )}
                  </SectionCard>
                )}
              </div>
            </div>
          )}

          <SectionCard title="Quick Actions">
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const tone = STATUS[action.tone];
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.href)}
                    className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 transition-all font-medium text-sm`}
                  >
                    <Icon size={16} className={tone.text} /> {action.label}
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Floating quick action button */}
        <div className="fixed bottom-8 right-8 z-30">
          {fabOpen && (
            <div className="fade-up absolute bottom-16 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 w-56 space-y-1">
              {quickActions.slice(0, 4).map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => {
                      setFabOpen(false);
                      navigate(action.href);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 text-left transition-colors"
                  >
                    <Icon size={15} className="text-blue-600" /> {action.label}
                  </button>
                );
              })}
            </div>
          )}
          <button
            onClick={() => setFabOpen((v) => !v)}
            className="w-14 h-14 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <span
              className="inline-block transition-transform duration-200"
              style={{ transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              <Plus size={22} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
