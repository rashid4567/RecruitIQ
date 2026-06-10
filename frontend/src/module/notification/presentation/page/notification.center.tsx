import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Building2,
  Settings,
  Shield,
  Loader2,
  Star,
  Clock,
  RefreshCw,
  Lock,
  ArrowLeft,
  ExternalLink,
  X,
} from "lucide-react";
import { useNotifications } from "../hook/useNotifications";
import Header from "@/pages/landing/sections/Header";
import { useNavigate } from "react-router-dom";

interface TypeMeta {
  icon: React.ReactNode;
  color: "blue" | "amber" | "red" | "green" | "purple" | "slate";
}

const TYPE_META: Record<string, TypeMeta> = {
  JOB_APPLIED: { icon: <Users className="w-4 h-4" />, color: "blue" },
  APPLICATION_SHORTLISTED: {
    icon: <Star className="w-4 h-4" />,
    color: "amber",
  },
  APPLICATION_REJECTED: { icon: <X className="w-4 h-4" />, color: "red" },
  APPLICATION_WITHDRAWN: {
    icon: <ArrowLeft className="w-4 h-4" />,
    color: "slate",
  },
  INTERVIEW_SCHEDULED: {
    icon: <Calendar className="w-4 h-4" />,
    color: "green",
  },
  INTERVIEW_RESCHEDULED: {
    icon: <Calendar className="w-4 h-4" />,
    color: "amber",
  },
  INTERVIEW_CANCELLED: { icon: <Calendar className="w-4 h-4" />, color: "red" },
  SUBSCRIPTION_PURCHASED: {
    icon: <Building2 className="w-4 h-4" />,
    color: "purple",
  },
  SUBSCRIPTION_RENEWED: {
    icon: <RefreshCw className="w-4 h-4" />,
    color: "purple",
  },
  SUBSCRIPTION_EXPIRING: {
    icon: <Clock className="w-4 h-4" />,
    color: "amber",
  },
  SUBSCRIPTION_EXPIRED: { icon: <Lock className="w-4 h-4" />, color: "red" },
  VERIFICATION_APPROVED: {
    icon: <Shield className="w-4 h-4" />,
    color: "green",
  },
  VERIFICATION_REJECTED: { icon: <Shield className="w-4 h-4" />, color: "red" },
  SYSTEM_NOTIFICATION: {
    icon: <Settings className="w-4 h-4" />,
    color: "slate",
  },
};

const ICON_TILE_COLORS: Record<TypeMeta["color"], string> = {
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  slate: "bg-slate-100 text-slate-600",
};

type TabId = "all" | "application" | "shortlist" | "interview" | "system";

const TYPE_TAB: Record<string, TabId> = {
  JOB_APPLIED: "application",
  APPLICATION_REJECTED: "application",
  APPLICATION_WITHDRAWN: "application",
  APPLICATION_SHORTLISTED: "shortlist",
  INTERVIEW_SCHEDULED: "interview",
  INTERVIEW_RESCHEDULED: "interview",
  INTERVIEW_CANCELLED: "interview",
  SUBSCRIPTION_PURCHASED: "system",
  SUBSCRIPTION_RENEWED: "system",
  SUBSCRIPTION_EXPIRING: "system",
  SUBSCRIPTION_EXPIRED: "system",
  VERIFICATION_APPROVED: "system",
  VERIFICATION_REJECTED: "system",
  SYSTEM_NOTIFICATION: "system",
};

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "all", label: "All" },
  { id: "application", label: "Applications" },
  { id: "shortlist", label: "Shortlisted" },
  { id: "interview", label: "Interviews" },
  { id: "system", label: "System" },
];

function formatTimestamp(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const ITEMS_PER_PAGE = 5;

export default function NotificationCenter() {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [selectedTab, setSelectedTab] = useState<TabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesTab =
        selectedTab === "all" || TYPE_TAB[n.getType()] === selectedTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        n.getTitle().toLowerCase().includes(q) ||
        n.getMessage().toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [notifications, selectedTab, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE),
  );

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleTabChange = (tab: TabId) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleExpand = async (id: string, isRead: boolean) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (!isRead) await markAsRead(id);
  };

  const handleDismiss = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
    if (expandedId === id) setExpandedId(null);
  };

  const getTabBadge = (tab: TabId): number =>
    notifications.filter(
      (n) => !n.isRead() && (tab === "all" || TYPE_TAB[n.getType()] === tab),
    ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-3xl mx-auto px-5 py-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          Notification Center
        </h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          Manage all your application alerts and updates in one place.
        </p>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications…"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {TABS.map((tab) => {
            const badge = getTabBadge(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition whitespace-nowrap ${
                  selectedTab === tab.id
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full leading-none">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={markAllAsRead}
            className="ml-auto px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Mark all as read
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
            <div>
              <p className="text-sm font-medium text-slate-800">Inbox</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Recent notifications from RecruitIQ
              </p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1">
              {filteredNotifications.length} total
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-14 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading notifications…
              </div>
            ) : paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification) => {
                const isExpanded = expandedId === notification.getId();
                const isRead = notification.isRead();
                const meta = TYPE_META[notification.getType()] ?? {
                  icon: <Bell className="w-4 h-4" />,
                  color: "slate" as const,
                };
                const tileClass = ICON_TILE_COLORS[meta.color];

                return (
                  <div
                    key={notification.getId()}
                    className={`px-5 py-4 cursor-pointer transition-colors ${
                      !isRead
                        ? "bg-blue-50/60 hover:bg-blue-50"
                        : "hover:bg-slate-50/70"
                    }`}
                    onClick={() =>
                      handleToggleExpand(notification.getId(), isRead)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 pt-1.5">
                        {!isRead ? (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        ) : (
                          <div className="w-2 h-2" />
                        )}
                      </div>

                      <div
                        className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${tileClass}`}
                      >
                        {meta.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 leading-snug">
                          {notification.getTitle()}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate leading-relaxed">
                          {notification.getMessage()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {formatTimestamp(notification.getCreatedAt())}
                        </span>
                        <button
                          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-200 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(notification.getId(), isRead);
                          }}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 ml-13 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {notification.getMessage()}
                        </p>
                        <div className="flex gap-2 mt-3">
                          {(notification.getActionUrl() ?? null) && (
                            <a
                              href={notification.getActionUrl() as string}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              View details
                            </a>
                          )}
                          <button
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white transition"
                            onClick={(e) =>
                              handleDismiss(e, notification.getId())
                            }
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-14 text-center text-slate-400 text-sm">
                <Bell className="w-7 h-7 mx-auto mb-3 opacity-30" />
                No notifications found.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <footer className="mt-10 pt-5 border-t border-slate-100 text-center text-xs text-slate-400">
          © 2025 RecruitIQ. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
