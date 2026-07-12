import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Download,
  ArrowRight,
  Mail,
  RefreshCw,
  Plus,
  Users,
  TrendingUp,
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

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
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

function ApplicationsHeader({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-linear-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 sm:px-8 py-7 rounded-b-3xl shadow-lg shadow-indigo-200/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Applications
          </h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-md">
            Manage every candidate, interview and AI recommendation from one
            place.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => navigate("/recruiter/jobs/new")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-indigo-700 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Job
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
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tints[tint]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide truncate">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">{value}</span>
          <span className="text-[11px] text-slate-400 truncate">{meta}</span>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ app }: { app: RecruiterApplication }) {
  const navigate = useNavigate();
  const rec = app.aiRecommendation
    ? RECOMMENDATION_CONFIG[app.aiRecommendation]
    : null;
  const goToDetail = () =>
    navigate(`/recruiter/application-detail/${app.applicationId}`);
  const quickActions = [
    {
      label: "Resume",
      icon: Download,
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
    },
    {
      label: "Email",
      icon: Mail,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `mailto:${app.candidateEmail}`;
      },
    },
    {
      label: "Interview",
      icon: CalendarClock,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate("/recruiter/interviews");
      },
    },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToDetail()}
      className="group relative bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/60 hover:border-indigo-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {app.candidateProfileImage ? (
            <img
              src={app.candidateProfileImage}
              alt={app.candidateName}
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
              {initials(app.candidateName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {app.candidateName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {app.jobTitle}
            </p>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-1.5">
              <Mail className="w-3 h-3 shrink-0" />
              {app.candidateEmail}
            </p>
          </div>
        </div>

        {typeof app.aiScore === "number" && <ScoreRing score={app.aiScore} />}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 flex-wrap">
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
              className={`w-3 h-3 ${i < rec.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-3">
          {quickActions.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Open
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
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

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar activeItem="applications" />

      <section className="flex-1">
        <ApplicationsHeader onRefresh={handleRefresh} refreshing={refreshing} />

        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
          </div>

          <div className="bg-white/80 backdrop-blur border border-slate-100 rounded-2xl shadow-sm p-3 mb-5">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by candidate name or email…"
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
                  {Object.entries(RECOMMENDATION_CONFIG).map(([value, cfg]) => (
                    <option key={value} value={value}>
                      {cfg.label}
                    </option>
                  ))}
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
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Couldn't load applications
                </p>
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg bg-white border border-red-200 shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 bg-slate-100 rounded" />
                      <div className="h-2.5 w-40 bg-slate-100 rounded" />
                      <div className="h-2.5 w-24 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                    <div className="h-6 w-20 bg-slate-100 rounded-full" />
                    <div className="h-6 w-24 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm py-16 flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {hasActiveFilters
                  ? "No applications match your filters"
                  : "No applications yet"}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {hasActiveFilters
                  ? "Try adjusting or clearing your search and filters."
                  : "New applications for your jobs will show up here."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg bg-indigo-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {applications.map((app: RecruiterApplication) => (
                <ApplicationCard key={app.applicationId} app={app} />
              ))}
            </div>
          )}

          {!loading && !error && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
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
                <span className="px-3 py-1.5 text-xs font-semibold text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
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
          )}
        </div>
      </section>
    </main>
  );
}
