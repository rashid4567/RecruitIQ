'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Building2,
  Settings,
  Shield,
  Loader2,
} from 'lucide-react';

import { useNotifications } from '../hook/useNotifications';
import type { NotificationType } from '../../domain/entity/Notification';

// ── icon map ──────────────────────────────────────────────────────────────────
const TYPE_ICON: Record<string, React.ReactNode> = {
  JOB_APPLIED: <Users className="w-6 h-6" />,
  APPLICATION_SHORTLISTED: <Building2 className="w-6 h-6" />,
  APPLICATION_REJECTED: <Building2 className="w-6 h-6" />,
  APPLICATION_WITHDRAWN: <Building2 className="w-6 h-6" />,
  INTERVIEW_SCHEDULED: <Calendar className="w-6 h-6" />,
  INTERVIEW_RESCHEDULED: <Calendar className="w-6 h-6" />,
  INTERVIEW_CANCELLED: <Calendar className="w-6 h-6" />,
  SUBSCRIPTION_PURCHASED: <Settings className="w-6 h-6" />,
  SUBSCRIPTION_RENEWED: <Settings className="w-6 h-6" />,
  SUBSCRIPTION_EXPIRING: <Settings className="w-6 h-6" />,
  SUBSCRIPTION_EXPIRED: <Settings className="w-6 h-6" />,
  VERIFICATION_APPROVED: <Shield className="w-6 h-6" />,
  VERIFICATION_REJECTED: <Shield className="w-6 h-6" />,
  SYSTEM_NOTIFICATION: <Settings className="w-6 h-6" />,
};

// ── tab definitions ───────────────────────────────────────────────────────────
type TabId = 'all' | 'application' | 'shortlist' | 'interview' | 'system';

const APPLICATION_TYPES: NotificationType[] = [
  'JOB_APPLIED',
  'APPLICATION_REJECTED',
  'APPLICATION_WITHDRAWN',
];
const SHORTLIST_TYPES: NotificationType[] = ['APPLICATION_SHORTLISTED'];
const INTERVIEW_TYPES: NotificationType[] = [
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_RESCHEDULED',
  'INTERVIEW_CANCELLED',
];
const SYSTEM_TYPES: NotificationType[] = [
  'SUBSCRIPTION_PURCHASED',
  'SUBSCRIPTION_RENEWED',
  'SUBSCRIPTION_EXPIRING',
  'SUBSCRIPTION_EXPIRED',
  'VERIFICATION_APPROVED',
  'VERIFICATION_REJECTED',
  'SYSTEM_NOTIFICATION',
];

function typeMatchesTab(type: NotificationType, tab: TabId): boolean {
  if (tab === 'all') return true;
  if (tab === 'application') return APPLICATION_TYPES.includes(type);
  if (tab === 'shortlist') return SHORTLIST_TYPES.includes(type);
  if (tab === 'interview') return INTERVIEW_TYPES.includes(type);
  if (tab === 'system') return SYSTEM_TYPES.includes(type);
  return false;
}

function formatTimestamp(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// ── props ─────────────────────────────────────────────────────────────────────
interface NotificationCenterProps {
  notificationDI: {
    getNotificationsUC: {
      execute: (page?: number, limit?: number) => Promise<import('../../domain/entity/Notification').Notification[]>;
    };
    getUnreadNotificationCountUC: { execute: () => Promise<number> };
    markNotificationAsReadUC: { execute: (notificationId: string) => Promise<void> };
    markAllNotificationsAsReadUC: { execute: () => Promise<void> };
    deleteNotificationUC: { execute: (notificationId: string) => Promise<void> };
  };
}

// ── component ─────────────────────────────────────────────────────────────────
export default function NotificationCenter({ notificationDI }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(notificationDI);

  const [selectedTab, setSelectedTab] = useState<TabId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesTab = typeMatchesTab(n.getType(), selectedTab);
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        n.getTitle().toLowerCase().includes(q) ||
        n.getMessage().toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [notifications, selectedTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));
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
    if (!isRead) {
      await markAsRead(id);
    }
  };

  const handleDismiss = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
    if (expandedId === id) setExpandedId(null);
  };

  const getTabBadge = (tab: TabId): number => {
    return notifications.filter(
      (n) => !n.isRead() && typeMatchesTab(n.getType(), tab),
    ).length;
  };

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'application', label: 'New Application' },
    { id: 'shortlist', label: 'Shortlist' },
    { id: 'interview', label: 'Interview' },
    { id: 'system', label: 'System Alerts' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RI</span>
              </div>
              <span className="font-bold text-lg text-blue-600">RecruitIQ</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
                Dashboard
              </a>
              <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
                Jobs
              </a>
              <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
                Application
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Notification Center</h1>
          <p className="text-slate-600">Manage all your application alerts and updates here.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const badge = getTabBadge(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                {badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={markAllAsRead}
            className="ml-auto px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-bold text-slate-900">
              Inbox ({filteredNotifications.length})
            </h2>
            <p className="text-sm text-slate-600">Recent notifications from RecruitIQ.</p>
          </div>

          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="px-6 py-12 flex items-center justify-center gap-2 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading notifications…</span>
              </div>
            ) : paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification) => {
                const isExpanded = expandedId === notification.getId();
                const isRead = notification.isRead();
                const icon = TYPE_ICON[notification.getType()] ?? <Bell className="w-6 h-6" />;

                return (
                  <div
                    key={notification.getId()}
                    className={`px-6 py-4 hover:bg-slate-50 transition cursor-pointer ${
                      !isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleToggleExpand(notification.getId(), isRead)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Unread dot */}
                      <div className="flex-shrink-0 mt-1">
                        {!isRead && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                        )}
                      </div>

                      {/* Type icon */}
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 mt-1">
                        {icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {notification.getTitle()}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.getMessage()}
                        </p>
                      </div>

                      {/* Timestamp + chevron */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {formatTimestamp(notification.getCreatedAt())}
                        </span>
                        <button
                          className="p-1 hover:bg-slate-200 rounded transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(notification.getId(), isRead);
                          }}
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded panel */}
                    {isExpanded && (
                      <div className="mt-4 ml-12 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600">{notification.getMessage()}</p>
                        <div className="flex gap-2 mt-4">
                          {notification.getActionUrl() && (
                            <a
                              href={notification.getActionUrl()}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded font-medium hover:bg-blue-700 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Details
                            </a>
                          )}
                          <button
                            className="px-3 py-1.5 border border-slate-200 text-slate-700 text-sm rounded font-medium hover:bg-slate-50 transition"
                            onClick={(e) => handleDismiss(e, notification.getId())}
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
              <div className="px-6 py-12 text-center">
                <p className="text-slate-500">No notifications found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded font-medium transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>© 2025 RecruitFlow. All rights reserved. | Privacy Policy</p>
        </footer>
      </main>
    </div>
  );
}