import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Briefcase,
  Calendar,
  CheckCheck,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  CreditCard,
  Info,
  Loader2,
  MailOpen,
  ShieldCheck,
  ShieldX,
  Trash2,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  BadgeCheck,
  Send,
  Handshake,
  Play,
} from "lucide-react";
import { useNotifications } from "@/module/notification/hook/useNotifications";
import type {
  Notification,
  NotificationType,
} from "../../../../notification/types/notification.types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface TypeConfig {
  icon: React.ReactNode;
  accent: string;
  dot: string;
  badge: string;
  badgeColor: string;
}

function getTypeConfig(type: NotificationType): TypeConfig {
  switch (type) {
    case "JOB_APPLIED":
      return {
        icon: <Briefcase className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-violet-500 to-violet-600",
        dot: "bg-violet-500",
        badge: "Application",
        badgeColor: "bg-violet-100 text-violet-700",
      };

    case "APPLICATION_SHORTLISTED":
      return {
        icon: <UserCheck className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-amber-400 to-amber-500",
        dot: "bg-amber-500",
        badge: "Shortlisted",
        badgeColor: "bg-amber-100 text-amber-700",
      };

    case "APPLICATION_SELECTED":
      return {
        icon: <CircleCheck className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-emerald-500 to-emerald-600",
        dot: "bg-emerald-500",
        badge: "Selected",
        badgeColor: "bg-emerald-100 text-emerald-700",
      };

    case "APPLICATION_REJECTED":
      return {
        icon: <UserX className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-red-400 to-red-500",
        dot: "bg-red-500",
        badge: "Rejected",
        badgeColor: "bg-red-100 text-red-600",
      };

    case "INTERVIEW_SCHEDULED":
      return {
        icon: <Calendar className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-blue-500 to-blue-600",
        dot: "bg-blue-500",
        badge: "Interview",
        badgeColor: "bg-blue-100 text-blue-700",
      };

    case "INTERVIEW_STARTED":
      return {
        icon: <Play className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-green-500 to-green-600",
        dot: "bg-green-500",
        badge: "Interview",
        badgeColor: "bg-green-100 text-green-700",
      };

    case "INTERVIEW_ACCEPTED":
      return {
        icon: <Handshake className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-emerald-500 to-emerald-600",
        dot: "bg-emerald-500",
        badge: "Accepted",
        badgeColor: "bg-emerald-100 text-emerald-700",
      };

    case "INTERVIEW_DECLINED":
      return {
        icon: <CircleX className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-red-500 to-red-600",
        dot: "bg-red-500",
        badge: "Declined",
        badgeColor: "bg-red-100 text-red-700",
      };

    case "INTERVIEW_RESCHEDULED":
      return {
        icon: <Clock className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-indigo-400 to-indigo-500",
        dot: "bg-indigo-500",
        badge: "Rescheduled",
        badgeColor: "bg-indigo-100 text-indigo-700",
      };

    case "INTERVIEW_RESCHEDULE_REQUESTED":
      return {
        icon: <Clock className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-yellow-400 to-yellow-500",
        dot: "bg-yellow-500",
        badge: "Request",
        badgeColor: "bg-yellow-100 text-yellow-700",
      };

    case "INTERVIEW_RESCHEDULE_REQUEST_APPROVED":
      return {
        icon: <CircleCheck className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-emerald-500 to-emerald-600",
        dot: "bg-emerald-500",
        badge: "Approved",
        badgeColor: "bg-emerald-100 text-emerald-700",
      };

    case "INTERVIEW_RESCHEDULE_REQUEST_REJECTED":
      return {
        icon: <CircleX className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-red-400 to-red-500",
        dot: "bg-red-500",
        badge: "Rejected",
        badgeColor: "bg-red-100 text-red-700",
      };

    case "INTERVIEW_CANCELLED":
      return {
        icon: <CircleX className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-rose-400 to-rose-500",
        dot: "bg-rose-500",
        badge: "Cancelled",
        badgeColor: "bg-rose-100 text-rose-600",
      };

    case "OFFER_SENT":
      return {
        icon: <Send className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-cyan-500 to-cyan-600",
        dot: "bg-cyan-500",
        badge: "Offer",
        badgeColor: "bg-cyan-100 text-cyan-700",
      };

    case "OFFER_ACCEPTED":
      return {
        icon: <BadgeCheck className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-green-500 to-green-600",
        dot: "bg-green-500",
        badge: "Offer",
        badgeColor: "bg-green-100 text-green-700",
      };

    case "OFFER_REJECTED":
      return {
        icon: <CircleX className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-red-500 to-red-600",
        dot: "bg-red-500",
        badge: "Offer",
        badgeColor: "bg-red-100 text-red-700",
      };

    case "SUBSCRIPTION_CREATED":
    case "SUBSCRIPTION_RENEWED":
    case "SUBSCRIPTION_UPGRADED":
      return {
        icon: <CreditCard className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-teal-500 to-teal-600",
        dot: "bg-teal-500",
        badge: "Subscription",
        badgeColor: "bg-teal-100 text-teal-700",
      };

    case "SUBSCRIPTION_EXPIRING":
    case "SUBSCRIPTION_EXPIRED":
      return {
        icon: <CreditCard className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-orange-400 to-orange-500",
        dot: "bg-orange-500",
        badge: "Subscription",
        badgeColor: "bg-orange-100 text-orange-700",
      };

    case "RECRUITER_VERIFIED":
      return {
        icon: <ShieldCheck className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-emerald-500 to-emerald-600",
        dot: "bg-emerald-500",
        badge: "Verified",
        badgeColor: "bg-emerald-100 text-emerald-700",
      };

    case "RECRUITER_REJECTED":
      return {
        icon: <ShieldX className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-red-400 to-red-500",
        dot: "bg-red-500",
        badge: "Verification",
        badgeColor: "bg-red-100 text-red-600",
      };

    case "JOB_APPROVED":
      return {
        icon: <BriefcaseBusiness className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-green-500 to-green-600",
        dot: "bg-green-500",
        badge: "Job",
        badgeColor: "bg-green-100 text-green-700",
      };

    case "JOB_REJECTED":
      return {
        icon: <Briefcase className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-red-400 to-red-500",
        dot: "bg-red-500",
        badge: "Job",
        badgeColor: "bg-red-100 text-red-700",
      };

    default:
      return {
        icon: <Info className="h-4 w-4 text-white" />,
        accent: "bg-linear-to-br from-slate-500 to-slate-600",
        dot: "bg-slate-500",
        badge: "Notification",
        badgeColor: "bg-slate-100 text-slate-600",
      };
  }
}
interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationRow({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationRowProps) {
  const cfg = getTypeConfig(notification.type);
  const isUnread = !notification.isRead;
  const actionUrl = notification.actionUrl;

  const handleClick = useCallback(() => {
    if (isUnread) onMarkAsRead(notification.id);
    if (actionUrl) window.location.href = actionUrl;
  }, [isUnread, actionUrl, notification, onMarkAsRead]);

  return (
    <div
      className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
        isUnread
          ? "border-violet-200/60 bg-violet-50/40 hover:bg-violet-50/70"
          : "border-slate-200/50 bg-white hover:border-slate-300/50"
      }`}
    >
      {isUnread && (
        <span
          className={`absolute top-4 right-4 h-2 w-2 rounded-full ${cfg.dot} ring-2 ring-white`}
        />
      )}

      <div
        className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${cfg.accent}`}
      >
        {cfg.icon}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeColor}`}
          >
            {cfg.badge}
          </span>
          <span className="text-xs text-slate-400">
            {timeAgo(notification.createdAt)}
          </span>
        </div>

        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {notification.title}
        </p>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center gap-3 pt-1">
          {actionUrl && (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
            >
              View details
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
          {isUnread && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MailOpen className="h-3 w-3" />
              Mark as read
            </button>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
        aria-label="Delete notification"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-violet-100 to-violet-200 flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-violet-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">
        You're all caught up
      </h3>
      <p className="text-sm text-slate-500 max-w-xs">
        No notifications yet. We'll let you know when something needs your
        attention.
      </p>
    </div>
  );
}

export function NotificationsSection() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-violet-500 to-violet-600" />

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25 relative">
                <Bell className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-slate-900">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "All notifications read"}
                </CardDescription>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="border-violet-200 text-violet-700 hover:bg-violet-50 gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {unread.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      New
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                      {unread.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {unread.map((n) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              )}

              {unread.length > 0 && read.length > 0 && (
                <Separator className="bg-slate-200/50" />
              )}

              {read.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Earlier
                  </span>

                  <div className="space-y-2">
                    {read.map((n) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
