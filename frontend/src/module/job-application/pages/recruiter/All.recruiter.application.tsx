import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  Inbox,
  AlertCircle,
  Clock,
  Star,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Ban,
  Sparkles,
  ArrowRight,
  Mail,
  RefreshCw,
  Plus,
  Users,
  TrendingUp,
  ArrowLeft,
  LayoutDashboard,
  SlidersHorizontal,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import { useAllRecruiterApplications } from "../../hooks/recruiter/useAllRecruiterApplication";
import { useDebounce } from "../../hooks/recruiter/useDebounce";
import type { GetRecruiterApplicationsQuery } from "../../types/getRecruiterApplications.dto";
import type { RecruiterApplication } from "../../types/application.types";
import Sidebar from "@/module/recruiter/pages/components/layout/Sidebar";
import {
  ApplicationStatus,
  ApplicationRecommendation,
} from "../../types/jobApplication.types";
import Header from "@/module/auth/pages/home/header";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string;
    icon: typeof Clock;
    bg: string;
    text: string;
    ring: string;
    dot: string;
  }
> = {
  APPLIED: {
    label: "Applied",
    icon: Clock,
    bg: "bg-slate-100",
    text: "text-slate-600",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    icon: Star,
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-100",
    dot: "bg-blue-500",
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview",
    icon: CalendarClock,
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-100",
    dot: "bg-amber-500",
  },
  SELECTED: {
    label: "Selected",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-100",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-100",
    dot: "bg-red-500",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    icon: Ban,
    bg: "bg-slate-100",
    text: "text-slate-500",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
  },
};

const RECOMMENDATION_CONFIG: Record<
  ApplicationRecommendation,
  { label: string; bg: string; text: string; border: string; stars: number }
> = {
  STRONG_MATCH: {
    label: "Strong match",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    stars: 5,
  },
  GOOD_MATCH: {
    label: "Good match",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    stars: 4,
  },
  PARTIAL_MATCH: {
    label: "Partial match",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    stars: 3,
  },
  POOR_MATCH: {
    label: "Poor match",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    stars: 2,
  },
};

function getStars(score: number) {
  if (score >= 95) return 5;
  if (score >= 85) return 4;
  if (score >= 70) return 3;
  if (score >= 55) return 2;
  return 1;
}

const SORT_OPTIONS: {
  value: string;
  label: string;
  sortBy: NonNullable<GetRecruiterApplicationsQuery["sortBy"]>;
  sortOrder: "asc" | "desc";
}[] = [
  {
    value: "appliedAt-desc",
    label: "Newest first",
    sortBy: "appliedAt",
    sortOrder: "desc",
  },
  {
    value: "appliedAt-asc",
    label: "Oldest first",
    sortBy: "appliedAt",
    sortOrder: "asc",
  },
  {
    value: "aiScore-desc",
    label: "Highest AI score",
    sortBy: "aiScore",
    sortOrder: "desc",
  },
  {
    value: "aiScore-asc",
    label: "Lowest AI score",
    sortBy: "aiScore",
    sortOrder: "asc",
  },
  {
    value: "candidateName-asc",
    label: "Name (A–Z)",
    sortBy: "candidateName",
    sortOrder: "asc",
  },
  {
    value: "candidateName-desc",
    label: "Name (Z–A)",
    sortBy: "candidateName",
    sortOrder: "desc",
  },
];

const PAGE_SIZE = 10;

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function relativeDate(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function scoreColor(score: number) {
  if (score >= 80)
    return { stroke: "#10b981", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 60)
    return { stroke: "#4F46E5", text: "text-indigo-700", bg: "bg-indigo-50" };
  if (score >= 40)
    return { stroke: "#f59e0b", text: "text-amber-700", bg: "bg-amber-50" };
  return { stroke: "#ef4444", text: "text-red-700", bg: "bg-red-50" };
}

// Fixed at a slightly smaller size so it fits comfortably on 320px cards.
// (Kept as a prop so callers can still override for larger contexts.)
function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const c = scoreColor(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`relative shrink-0 rounded-full ${c.bg} flex items-center justify-center`}
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="3"
          className="stroke-white"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={c.stroke}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      <span className={`text-xs font-bold ${c.text}`}>{score}%</span>
    </div>
  );
}

function StatusPill({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function RecommendationPill({
  recommendation,
}: {
  recommendation?: ApplicationRecommendation;
}) {
  if (!recommendation) {
    return <span className="text-xs text-slate-300">AI pending</span>;
  }
  const cfg = RECOMMENDATION_CONFIG[recommendation];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Sparkles className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function Breadcrumb() {
  const navigate = useNavigate();
  return (
    <div className="mb-3 sm:mb-4">
      <button
        onClick={() => navigate("/recruiter/dashboard")}
        className="sm:hidden inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Dashboard
      </button>
      <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white/70">
        <button
          onClick={() => navigate("/recruiter/dashboard")}
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white">Applications</span>
      </div>
    </div>
  );
}

function ApplicationsHeader({
  onRefresh,
  refreshing,
  total,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  onExport: () => void;
  total?: number;
}) {
  const navigate = useNavigate();

  const handleCreateJob = () => {
    navigate("/recruiter/job-editor");
  };

  return (
    <div
      className="mt-3 sm:mt-5 lg:mt-8 rounded-2xl sm:rounded-3xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 shadow-sm sm:shadow-lg shadow-indigo-200/60 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #4F46E5, #2563EB, #0EA5E9)",
      }}
    >
      <Breadcrumb />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl min-[375px]:text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight">
            Applications
          </h1>
          <p className="mt-1.5 max-w-lg text-xs leading-5 text-indigo-100 sm:text-sm">
            Track, shortlist and hire candidates from one workspace.
          </p>
          {typeof total === "number" && (
            <p className="text-xs text-indigo-200/80 mt-2">
              {total} total application{total === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            aria-label="Refresh"
            className="inline-flex min-h-10 items-center gap-2 px-3 sm:px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
          >
            <RefreshCw
              className={cn("w-4 h-4", refreshing && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleCreateJob}
            aria-label="Create job"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-3 sm:px-4 text-xs sm:text-sm font-semibold text-indigo-700 hover:bg-indigo-50 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  meta,
  tint,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  meta: string;
  tint: "indigo" | "amber" | "emerald" | "violet";
}) {
  const tints = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  } as const;

  return (
    <div className="min-w-0 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white p-3 sm:p-4 shadow-sm">
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <div
          className={`flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${tints[tint]}`}
        >
          <Icon className="size-4 sm:size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl font-bold text-slate-900">
              {value}
            </span>
            <span className="hidden min-[400px]:inline text-[11px] text-slate-400 truncate">
              {meta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="min-w-0 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white p-3 sm:p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <div className="size-9 sm:size-11 rounded-lg sm:rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-16 rounded bg-slate-100" />
          <div className="h-5 w-10 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({
  app,
  index,
}: {
  app: RecruiterApplication;
  index: number;
}) {
  const navigate = useNavigate();
  const rec = app.aiRecommendation
    ? RECOMMENDATION_CONFIG[app.aiRecommendation]
    : null;
  const goToDetail = () =>
    navigate(`/recruiter/application-detail/${app.applicationId}`);

  const stopAnd =
    (fn: (app: RecruiterApplication) => void) => (e: React.MouseEvent) => {
      e.stopPropagation();
      fn(app);
    };

  const quickActions = [
    {
      label: "Interview",
      icon: CalendarClock,
      onClick: stopAnd(() => navigate("/recruiter/interviews")),
    },
    {
      label: "Shortlist",
      icon: ThumbsUp,
      onClick: stopAnd((a) =>
        toast.info(
          `Shortlist "${a.candidateName}" — connect this to your update-status mutation.`,
        ),
      ),
    },
    {
      label: "Reject",
      icon: ThumbsDown,
      onClick: stopAnd((a) =>
        toast.info(
          `Reject "${a.candidateName}" — connect this to your update-status mutation.`,
        ),
      ),
    },
  ];
  const stars = getStars(app.aiScore ?? 0);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToDetail()}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="group relative min-w-0 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white p-3.5 min-[375px]:p-4 sm:p-5 cursor-pointer transition-all duration-200 ease-out hover:border-indigo-200 hover:shadow-md lg:hover:-translate-y-0.5 lg:hover:shadow-lg lg:hover:shadow-indigo-100/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="size-10 sm:size-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
            {initials(app.candidateName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {app.candidateName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {app.jobTitle}
            </p>
            <p className="mt-1.5 flex min-w-0 items-center gap-1 text-xs text-slate-400">
              <Mail className="size-3 shrink-0" />
              <span className="truncate">{app.candidateEmail}</span>
            </p>
          </div>
        </div>

        {typeof app.aiScore === "number" && (
          <div className="flex flex-col items-center gap-1 shrink-0">
            <ScoreRing score={app.aiScore} />
            {rec && (
              <span className={cn("text-[9px] font-semibold", rec.text)}>
                {rec.label}
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className="
          mt-4
          flex flex-col gap-2
          border-t border-slate-100
          pt-3
          min-[420px]:flex-row
          min-[420px]:items-center
          min-[420px]:justify-between
        "
      >
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <StatusPill status={app.status} />
          <RecommendationPill recommendation={app.aiRecommendation} />
        </div>
        <span className="text-xs text-slate-400 shrink-0">
          {relativeDate(app.appliedAt)}
        </span>
      </div>

      {rec && (
        <div className="flex items-center gap-0.5 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200"
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        {/* Actions are always visible on touch devices; hover-reveal only kicks in at lg+ */}
        <div
          className="
            flex items-center gap-1
            opacity-100
            lg:opacity-0
            lg:group-hover:opacity-100
            lg:group-focus-within:opacity-100
            transition-opacity
          "
        >
          {quickActions.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              aria-label={label}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          Open
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}

function ApplicationCardSkeleton() {
  return (
    <div className="min-w-0 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white p-3.5 min-[375px]:p-4 sm:p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="size-10 sm:size-12 rounded-full bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-3 w-32 bg-slate-100 rounded" />
          <div className="h-2.5 w-40 bg-slate-100 rounded" />
          <div className="h-2.5 w-24 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
        <div className="h-6 w-24 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

function ApplicationGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ApplicationCardSkeleton key={i} />
      ))}
    </div>
  );
}

function getPageWindow(current: number, total: number, size = 5): number[] {
  if (total <= size) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, current - Math.floor(size / 2));
  let end = start + size - 1;
  if (end > total) {
    end = total;
    start = end - size + 1;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function RecruiterApplicationsList() {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [recommendation, setRecommendation] = useState<
    ApplicationRecommendation | ""
  >("");
  const [sortValue, setSortValue] = useState("appliedAt-desc");
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchInput, 400);
  const activeSort =
    SORT_OPTIONS.find((o) => o.value === sortValue) ?? SORT_OPTIONS[0];
  const query: GetRecruiterApplicationsQuery = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: status || undefined,
      recommendation: recommendation || undefined,
      sortBy: activeSort.sortBy,
      sortOrder: activeSort.sortOrder,
    }),
    [page, debouncedSearch, status, recommendation, activeSort],
  );
  const { applications, pagination, loading, error, refetch } =
    useAllRecruiterApplications(query);
  const hasActiveFilters = Boolean(status || recommendation || debouncedSearch);
  const resetFilters = () => {
    setSearchInput("");
    setStatus("");
    setRecommendation("");
    setSortValue("appliedAt-desc");
    setPage(1);
  };

  const updateFilter = <T,>(setter: (v: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = () => {
    toast.info("Export CSV isn't wired to an endpoint yet.");
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isFilterSheetOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterSheetOpen]);

  const stats = useMemo(() => {
    const interview = applications.filter(
      (a) => a.status === "INTERVIEW_SCHEDULED",
    ).length;
    const selected = applications.filter((a) => a.status === "SELECTED").length;
    const strongMatch = applications.filter(
      (a) => a.aiRecommendation === "STRONG_MATCH",
    ).length;
    return { interview, selected, strongMatch };
  }, [applications]);

  const isInitialLoad = loading && applications.length === 0 && page === 1;

  return (
    <div className="min-h-dvh bg-slate-50">
      <Header />

      <div className="flex">
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <Sidebar activeItem="applications" />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-400 px-3 min-[375px]:px-4 sm:px-6 lg:px-8">
            <ApplicationsHeader
              onRefresh={handleRefresh}
              refreshing={refreshing}
              onExport={handleExport}
              total={pagination?.total ?? applications.length}
            />
          </div>

          <div className="mx-auto w-full max-w-400 px-3 min-[375px]:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
              {isInitialLoad ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <StatCardSkeleton key={i} />
                ))
              ) : (
                <>
                  <StatCard
                    icon={Users}
                    label="Applications"
                    value={pagination?.total ?? applications.length}
                    meta="total"
                    tint="indigo"
                  />
                  <StatCard
                    icon={CalendarClock}
                    label="Interviews"
                    value={stats.interview}
                    meta="this page"
                    tint="amber"
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="Selected"
                    value={stats.selected}
                    meta="this page"
                    tint="emerald"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="AI Strong Match"
                    value={stats.strongMatch}
                    meta="this page"
                    tint="violet"
                  />
                </>
              )}
            </div>

            <div
              className="
                relative
                sm:sticky sm:top-16
                z-30
                py-2 sm:py-3
                bg-slate-50/95
                sm:backdrop-blur-md
                -mx-3 px-3
                min-[375px]:-mx-4 min-[375px]:px-4
                sm:-mx-6 sm:px-6
                lg:-mx-8 lg:px-8
              "
            >
              <div className="bg-white/90 backdrop-blur border border-slate-100 rounded-2xl shadow-sm p-3">
                {isInitialLoad ? (
                  <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                ) : (
                  <>
                    <div className="hidden lg:flex gap-2">
                      <div className="relative flex-1 min-w-0">
                        <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          ref={searchRef}
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(1);
                          }}
                          placeholder="Search candidates by name or email…"
                          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                        />
                        {searchInput ? (
                          <button
                            onClick={() => {
                              setSearchInput("");
                              setPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">
                            /
                          </kbd>
                        )}
                      </div>

                      <div className="relative shrink-0">
                        <select
                          value={status}
                          onChange={(e) =>
                            updateFilter(
                              setStatus,
                              e.target.value as ApplicationStatus | "",
                            )
                          }
                          className="appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 cursor-pointer"
                        >
                          <option value="">All statuses</option>
                          {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
                            <option key={value} value={value}>
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="relative shrink-0">
                        <select
                          value={recommendation}
                          onChange={(e) =>
                            updateFilter(
                              setRecommendation,
                              e.target.value as ApplicationRecommendation | "",
                            )
                          }
                          className="appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 cursor-pointer"
                        >
                          <option value="">All AI recommendations</option>
                          {Object.entries(RECOMMENDATION_CONFIG).map(
                            ([value, cfg]) => (
                              <option key={value} value={value}>
                                {cfg.label}
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="relative shrink-0">
                        <select
                          value={sortValue}
                          onChange={(e) => {
                            setSortValue(e.target.value);
                            setPage(1);
                          }}
                          className="appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 cursor-pointer"
                        >
                          {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <ChevronDown className="w-3.5 h-3.5 text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 min-[400px]:flex-row lg:hidden">
                      <div className="relative min-w-0 flex-1">
                        <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(1);
                          }}
                          placeholder="Search candidates…"
                          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                        />
                        {searchInput && (
                          <button
                            onClick={() => {
                              setSearchInput("");
                              setPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setIsFilterSheetOpen(true)}
                        className={cn(
                          "relative inline-flex min-h-11 w-full min-[400px]:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-colors",
                          hasActiveFilters
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
                        )}
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {hasActiveFilters && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isFilterSheetOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
                  onClick={() => setIsFilterSheetOpen(false)}
                />
                <div
                  className="
                    absolute inset-x-0 bottom-0
                    max-h-[85dvh]
                    overflow-y-auto
                    rounded-t-3xl
                    bg-white
                    p-4 sm:p-5
                    pb-[calc(1.25rem+env(safe-area-inset-bottom))]
                    shadow-2xl
                    space-y-4
                    animate-in slide-in-from-bottom duration-200
                  "
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Filters
                    </h3>
                    <button
                      onClick={() => setIsFilterSheetOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) =>
                        updateFilter(
                          setStatus,
                          e.target.value as ApplicationStatus | "",
                        )
                      }
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                    >
                      <option value="">All statuses</option>
                      {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
                        <option key={value} value={value}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                      AI Recommendation
                    </label>
                    <select
                      value={recommendation}
                      onChange={(e) =>
                        updateFilter(
                          setRecommendation,
                          e.target.value as ApplicationRecommendation | "",
                        )
                      }
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                    >
                      <option value="">All AI recommendations</option>
                      {Object.entries(RECOMMENDATION_CONFIG).map(
                        ([value, cfg]) => (
                          <option key={value} value={value}>
                            {cfg.label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                      Sort by
                    </label>
                    <select
                      value={sortValue}
                      onChange={(e) => {
                        setSortValue(e.target.value);
                        setPage(1);
                      }}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          resetFilters();
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setIsFilterSheetOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                    >
                      Show results
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                className="
                  flex flex-col gap-3
                  rounded-2xl
                  border border-red-100
                  bg-red-50
                  p-4
                  sm:flex-row
                  sm:items-start
                "
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-700">
                      Couldn't load applications
                    </p>
                    <p className="text-xs text-red-500 mt-0.5">{error}</p>
                  </div>
                </div>
                <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
                  <button
                    onClick={refetch}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg bg-white border border-red-200"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                  <a
                    href="/recruiter/dashboard"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg bg-white border border-slate-200"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Go Dashboard
                  </a>
                </div>
              </div>
            )}

            {loading && !isInitialLoad && <ApplicationGridSkeleton count={6} />}

            {isInitialLoad && <ApplicationGridSkeleton count={6} />}

            {!loading && !error && applications.length === 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm py-16 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <Inbox className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {hasActiveFilters
                    ? "No applications match your filters"
                    : "No applications yet"}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {hasActiveFilters
                    ? "Try adjusting or clearing your search and filters."
                    : "Post your first job to start receiving candidates."}
                </p>
                {hasActiveFilters ? (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg bg-indigo-50"
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      window.location.assign("/recruiter/job-editor")
                    }
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Job
                  </button>
                )}
              </div>
            )}

            {!loading && !error && applications.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                {applications.map((app: RecruiterApplication, i: number) => (
                  <ApplicationCard
                    key={app.applicationId}
                    app={app}
                    index={i}
                  />
                ))}
              </div>
            )}

            {!loading && !error && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                {/* Desktop: full "Showing x-y of z" + numbered pages */}
                <div className="hidden sm:flex items-center justify-between w-full">
                  <p className="text-xs text-slate-400">
                    Showing{" "}
                    <span className="font-semibold text-slate-600">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>
                    –
                    <span className="font-semibold text-slate-600">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-600">
                      {pagination.total}
                    </span>
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPreviousPage}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {getPageWindow(
                        pagination.page,
                        pagination.totalPages,
                      ).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={cn(
                            "w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors",
                            p === pagination.page
                              ? "bg-indigo-600 text-white"
                              : "text-slate-500 hover:bg-slate-100",
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNextPage}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex sm:hidden items-center justify-between w-full">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPreviousPage}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNextPage}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
