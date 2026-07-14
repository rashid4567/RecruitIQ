import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/module/notification/hook/useNotifications";
import type {
  Notification,
  NotificationType,
} from "@/module/notification/types/notification.types";
import {
  Bell,
  Search,
  CheckCheck,
  RefreshCw,
  MoreVertical,
  Check,
  Trash2,
  ExternalLink,
  Video,
  FileText,
  PartyPopper,
  XCircle,
  Star,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Ban,
  RotateCcw,
  ClipboardList,
  Inbox,
  type LucideIcon,
} from "lucide-react";



type Category =
  | "applications"
  | "interviews"
  | "offers"
  | "subscriptions"
  | "system";

type FilterKey = "all" | "unread" | Category;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "applications", label: "Applications" },
  { key: "interviews", label: "Interviews" },
  { key: "offers", label: "Offers" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "system", label: "System" },
];

const CATEGORY_BY_TYPE: Record<NotificationType, Category> = {
  JOB_APPLIED: "applications",
  APPLICATION_SHORTLISTED: "applications",
  APPLICATION_REJECTED: "applications",
  APPLICATION_SELECTED: "applications",
  INTERVIEW_SCHEDULED: "interviews",
  INTERVIEW_STARTED: "interviews",
  INTERVIEW_CANCELLED: "interviews",
  INTERVIEW_RESCHEDULED: "interviews",
  INTERVIEW_ACCEPTED: "interviews",
  INTERVIEW_DECLINED: "interviews",
  INTERVIEW_RESCHEDULE_REQUESTED: "interviews",
  INTERVIEW_RESCHEDULE_REQUEST_APPROVED: "interviews",
  INTERVIEW_RESCHEDULE_REQUEST_REJECTED: "interviews",
  OFFER_SENT: "offers",
  OFFER_ACCEPTED: "offers",
  OFFER_REJECTED: "offers",
  SUBSCRIPTION_CREATED: "subscriptions",
  SUBSCRIPTION_RENEWED: "subscriptions",
  SUBSCRIPTION_EXPIRING: "subscriptions",
  SUBSCRIPTION_UPGRADED: "subscriptions",
  SUBSCRIPTION_EXPIRED: "subscriptions",
  RECRUITER_VERIFIED: "system",
  RECRUITER_REJECTED: "system",
  JOB_APPROVED: "system",
  JOB_REJECTED: "system",
};

// ---------- icon / color map ----------

interface TypeMeta {
  icon: LucideIcon;
  bg: string;
  color: string;
}

const TYPE_META: Record<NotificationType, TypeMeta> = {
  JOB_APPLIED: {
    icon: ClipboardList,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  APPLICATION_SHORTLISTED: {
    icon: Star,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },
  APPLICATION_REJECTED: {
    icon: XCircle,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  APPLICATION_SELECTED: {
    icon: PartyPopper,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  INTERVIEW_SCHEDULED: {
    icon: Video,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  INTERVIEW_STARTED: {
    icon: Video,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  INTERVIEW_CANCELLED: { icon: Ban, bg: "bg-red-100", color: "text-red-600" },
  INTERVIEW_RESCHEDULED: {
    icon: RotateCcw,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },
  INTERVIEW_ACCEPTED: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  INTERVIEW_DECLINED: {
    icon: XCircle,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  INTERVIEW_RESCHEDULE_REQUESTED: {
    icon: RotateCcw,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },
  INTERVIEW_RESCHEDULE_REQUEST_APPROVED: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  INTERVIEW_RESCHEDULE_REQUEST_REJECTED: {
    icon: XCircle,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  OFFER_SENT: { icon: FileText, bg: "bg-green-100", color: "text-green-600" },
  OFFER_ACCEPTED: {
    icon: PartyPopper,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  OFFER_REJECTED: { icon: XCircle, bg: "bg-red-100", color: "text-red-600" },
  SUBSCRIPTION_CREATED: {
    icon: CreditCard,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  SUBSCRIPTION_RENEWED: {
    icon: CreditCard,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  SUBSCRIPTION_EXPIRING: {
    icon: CreditCard,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },
  SUBSCRIPTION_UPGRADED: {
    icon: CreditCard,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  SUBSCRIPTION_EXPIRED: {
    icon: CreditCard,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  RECRUITER_VERIFIED: {
    icon: ShieldCheck,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  RECRUITER_REJECTED: {
    icon: XCircle,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  JOB_APPROVED: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  JOB_REJECTED: { icon: XCircle, bg: "bg-red-100", color: "text-red-600" },
};

const DEFAULT_META: TypeMeta = {
  icon: Bell,
  bg: "bg-gray-100",
  color: "text-gray-600",
};

// ---------- formatting utils ----------

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfYesterday && date < startOfToday) return "Yesterday";

  const diffDay = Math.floor(
    (startOfToday.getTime() - date.getTime()) / 86400000,
  );
  if (diffDay < 7) {
    return new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(date);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function getDateGroup(
  dateStr: string,
): "Today" | "Yesterday" | "This Week" | "Earlier" {
  const date = new Date(dateStr);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  if (date >= startOfToday) return "Today";
  if (date >= startOfYesterday) return "Yesterday";
  if (date >= startOfWeek) return "This Week";
  return "Earlier";
}

const GROUP_ORDER = ["Today", "Yesterday", "This Week", "Earlier"] as const;

// ---------- small components ----------

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-5 flex items-center gap-4">
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/50 rounded-xl border border-gray-200/50 p-5 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-200/80 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-40 bg-gray-200/80 rounded-md" />
          <div className="h-3 w-24 bg-gray-200/80 rounded-md" />
        </div>
      </div>
      <div className="h-3 w-full bg-gray-200/80 rounded-md" />
      <div className="h-3 w-2/3 bg-gray-200/80 rounded-md" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 py-20 flex flex-col items-center justify-center text-center">
      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        You're all caught up!
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        No notifications to show right now.
      </p>
    </div>
  );
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onOpen,
  menuOpen,
  onToggleMenu,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen: (notification: Notification) => void;
  menuOpen: boolean;
  onToggleMenu: (id: string | null) => void;
}) {
  const meta = TYPE_META[notification.type] ?? DEFAULT_META;
  const Icon = meta.icon;

  return (
    <div
      onClick={() => onOpen(notification)}
      className={
        "group relative flex gap-4 p-5 rounded-xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 " +
        (notification.isRead
          ? "bg-gray-50/60 border-gray-200/50"
          : "bg-blue-50/60 border-blue-200 border-l-4")
      }
    >
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}
      >
        <Icon className={`h-5 w-5 ${meta.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
            )}
            <h4 className="font-semibold text-gray-900 truncate">
              {notification.title}
            </h4>
          </div>
          <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between mt-3">
          {notification.actionUrl ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
              View <ExternalLink className="h-3 w-3" />
            </span>
          ) : (
            <span />
          )}

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleMenu(menuOpen ? null : notification.id)}
              className="p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200/60 hover:text-gray-600 transition-all"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 w-40 bg-white rounded-lg border border-gray-200 shadow-lg py-1">
                {!notification.isRead && (
                  <button
                    onClick={() => {
                      onMarkAsRead(notification.id);
                      onToggleMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Mark as read
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(notification.id);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- main page ----------

const PAGE_SIZE = 10;

export function NotificationsSection() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications(page, PAGE_SIZE);
  }, [page, fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const counts = useMemo(() => {
    const result = { interviews: 0, offers: 0, applications: 0 };
    for (const n of notifications) {
      const cat = CATEGORY_BY_TYPE[n.type];
      if (cat === "interviews") result.interviews += 1;
      if (cat === "offers") result.offers += 1;
      if (cat === "applications") result.applications += 1;
    }
    return result;
  }, [notifications]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notifications.filter((n) => {
      if (activeFilter === "unread" && n.isRead) return false;
      if (
        activeFilter !== "all" &&
        activeFilter !== "unread" &&
        CATEGORY_BY_TYPE[n.type] !== activeFilter
      ) {
        return false;
      }
      if (
        q &&
        !n.title.toLowerCase().includes(q) &&
        !n.message.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    for (const n of filtered) {
      const g = getDateGroup(n.createdAt);
      if (!groups[g]) groups[g] = [];
      groups[g].push(n);
    }
    return groups;
  }, [filtered]);

  const handleOpen = (notification: Notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    if (notification.actionUrl) navigate(notification.actionUrl);
  };

  const isFirstPage = page === 1;
  const isLastPage = notifications.length < PAGE_SIZE;

  return (
    <div className="max-w-4xl" ref={containerRef}>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" /> Notifications
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with your applications, interviews, offers and account
            activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {unreadCount} unread
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200"
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-1.5" /> Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200"
            onClick={() => refresh()}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={<Bell className="h-5 w-5 text-blue-600" />}
          label="Unread"
          value={unreadCount}
          color="bg-blue-100"
        />
        <SummaryCard
          icon={<Video className="h-5 w-5 text-indigo-600" />}
          label="Interviews"
          value={counts.interviews}
          color="bg-indigo-100"
        />
        <SummaryCard
          icon={<FileText className="h-5 w-5 text-green-600" />}
          label="Offers"
          value={counts.offers}
          color="bg-green-100"
        />
        <SummaryCard
          icon={<ClipboardList className="h-5 w-5 text-amber-600" />}
          label="Applications"
          value={counts.applications}
          color="bg-amber-100"
        />
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8">
        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={
                "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors " +
                (activeFilter === f.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* List */}
        {loading && notifications.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
              <div key={group}>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                  {group}
                </h3>
                <div className="space-y-3">
                  {grouped[group].map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      onOpen={handleOpen}
                      menuOpen={openMenuId === n.id}
                      onToggleMenu={setOpenMenuId}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && notifications.length > 0 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {(page - 1) * PAGE_SIZE + notifications.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200"
                disabled={isFirstPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-700 px-2">
                {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200"
                disabled={isLastPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
