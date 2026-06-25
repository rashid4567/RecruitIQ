import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  CheckCheck,
  Inbox,
  FileText,
} from "lucide-react";
import { useNotifications } from "../hook/useNotifications";
import Header from "@/pages/landing/sections/Header";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TypeMeta {
  icon: React.ReactNode;
  tile: string;
  accent: string;
}

const TYPE_META: Record<string, TypeMeta> = {
  JOB_APPLIED:              { icon: <FileText className="w-4 h-4" />,  tile: "bg-blue-50 text-blue-700",   accent: "border-l-blue-500" },
  APPLICATION_SHORTLISTED:  { icon: <Star className="w-4 h-4" />,      tile: "bg-amber-50 text-amber-700", accent: "border-l-amber-500" },
  APPLICATION_REJECTED:     { icon: <X className="w-4 h-4" />,         tile: "bg-red-50 text-red-700",     accent: "border-l-red-400" },
  APPLICATION_WITHDRAWN:    { icon: <ArrowLeft className="w-4 h-4" />, tile: "bg-slate-100 text-slate-500", accent: "border-l-slate-300" },
  INTERVIEW_SCHEDULED:      { icon: <Calendar className="w-4 h-4" />,  tile: "bg-green-50 text-green-700", accent: "border-l-green-500" },
  INTERVIEW_RESCHEDULED:    { icon: <Calendar className="w-4 h-4" />,  tile: "bg-amber-50 text-amber-700", accent: "border-l-amber-500" },
  INTERVIEW_CANCELLED:      { icon: <Calendar className="w-4 h-4" />,  tile: "bg-red-50 text-red-700",     accent: "border-l-red-400" },
  SUBSCRIPTION_PURCHASED:   { icon: <Building2 className="w-4 h-4" />, tile: "bg-purple-50 text-purple-700", accent: "border-l-purple-500" },
  SUBSCRIPTION_RENEWED:     { icon: <RefreshCw className="w-4 h-4" />, tile: "bg-purple-50 text-purple-700", accent: "border-l-purple-500" },
  SUBSCRIPTION_EXPIRING:    { icon: <Clock className="w-4 h-4" />,     tile: "bg-amber-50 text-amber-700", accent: "border-l-amber-500" },
  SUBSCRIPTION_EXPIRED:     { icon: <Lock className="w-4 h-4" />,      tile: "bg-red-50 text-red-700",     accent: "border-l-red-400" },
  VERIFICATION_APPROVED:    { icon: <Shield className="w-4 h-4" />,    tile: "bg-green-50 text-green-700", accent: "border-l-green-500" },
  VERIFICATION_REJECTED:    { icon: <Shield className="w-4 h-4" />,    tile: "bg-red-50 text-red-700",     accent: "border-l-red-400" },
  SYSTEM_NOTIFICATION:      { icon: <Settings className="w-4 h-4" />,  tile: "bg-slate-100 text-slate-500", accent: "border-l-slate-300" },
};

const FALLBACK_META: TypeMeta = {
  icon: <Bell className="w-4 h-4" />,
  tile: "bg-slate-100 text-slate-500",
  accent: "border-l-slate-300",
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

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: "all",         label: "All",          icon: <Inbox className="w-3.5 h-3.5" /> },
  { id: "application", label: "Applications", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "shortlist",   label: "Shortlisted",  icon: <Star className="w-3.5 h-3.5" /> },
  { id: "interview",   label: "Interviews",   icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: "system",      label: "System",       icon: <Settings className="w-3.5 h-3.5" /> },
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

const ITEMS_PER_PAGE = 6;

export default function NotificationCenter() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  const [selectedTab, setSelectedTab] = useState<TabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesTab =
        selectedTab === "all" || TYPE_TAB[n.type] === selectedTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [notifications, selectedTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
      (n) => !n.isRead && (tab === "all" || TYPE_TAB[n.type] === tab)
    ).length;

  const totalUnread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-20">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-1.5 text-slate-400 hover:text-blue-600 text-sm font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Page header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">
                Notifications
              </h1>
              {totalUnread > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold">
                  {totalUnread}
                </span>
              )}
            </div>
            <p className="text-[13px] text-slate-400">Alerts and updates from RecruitIQ</p>
          </div>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notifications…"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const badge = getTabBadge(tab.id);
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
                )}
              >
                {tab.icon}
                {tab.label}
                {badge > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold leading-none",
                      isActive ? "bg-white/25 text-white" : "bg-red-500 text-white"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <span className="text-[12px] font-medium text-slate-500">
              Inbox · {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1 ? "notification" : "notifications"}
            </span>
            {totalUnread > 0 && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {totalUnread} unread
              </span>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification) => {
                const isExpanded = expandedId === notification.id;
                const isRead = notification.isRead;
                const meta = TYPE_META[notification.type] ?? FALLBACK_META;

                return (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "flex items-start gap-3 px-4 py-3.5 border-l-[3px] cursor-pointer transition-colors",
                        meta.accent,
                        !isRead
                          ? "bg-blue-50/30 hover:bg-blue-50/60"
                          : "hover:bg-slate-50/70"
                      )}
                      onClick={() => handleToggleExpand(notification.id, isRead)}
                    >
                      {/* Unread dot */}
                      <div className="w-2 flex justify-center shrink-0 mt-3.5">
                        {!isRead && (
                          <span className="block w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>

                
                      <div
                        className={cn(
                          "w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 mt-0.5",
                          meta.tile
                        )}
                      >
                        {meta.icon}
                      </div>

          
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-[13px] leading-snug",
                            !isRead
                              ? "font-semibold text-slate-900"
                              : "font-medium text-slate-600"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
                          {notification.message}
                        </p>
                      </div>

               
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {formatTimestamp(notification.createdAt)}
                        </span>
                        <button
                          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(notification.id, isRead);
                          }}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      </div>
                    </div>

               
                    {isExpanded && (
                      <div className="mx-4 mb-3 ml-13 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-[12px] text-slate-600 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          {(notification.actionUrl ?? null) && (
                            <a
                              href={notification.actionUrl as string}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-lg hover:bg-blue-700 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              View details
                            </a>
                          )}
                          <button
                            className="px-3 py-1.5 border border-slate-200 bg-white text-slate-500 text-[11px] font-semibold rounded-lg hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition"
                            onClick={(e) => handleDismiss(e, notification.id)}
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
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {searchQuery ? "No results found" : "You're all caught up"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {searchQuery
                      ? "Try a different search term"
                      : "New notifications will appear here"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/80">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-xs font-semibold transition",
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-[11px] text-slate-300">
          © 2025 RecruitIQ · All rights reserved
        </footer>
      </main>
    </div>
  );
}