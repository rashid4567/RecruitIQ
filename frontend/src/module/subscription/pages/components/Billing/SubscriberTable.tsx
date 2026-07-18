import {
  AlertCircle,
  Inbox,
  MoreVertical,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable } from "@/shared/table/DataTable";
import type { SubscribersListItem } from "@/module/subscription/types/subscriber.types";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "expired": return "bg-red-50 text-red-600 border border-red-200";
    case "cancelled": return "bg-orange-50 text-orange-600 border border-orange-200";
    case "pending": return "bg-amber-50 text-amber-600 border border-amber-200";
    default: return "bg-gray-50 text-gray-600 border border-gray-200";
  }
};

const getAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-";

function SubscriberSkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-5"><div className="h-3.5 bg-gray-100 rounded w-24" /></td>
      <td className="px-6 py-5"><div className="h-9 bg-gray-100 rounded-xl w-36" /></td>
      <td className="px-6 py-5"><div className="h-3.5 bg-gray-100 rounded w-40" /></td>
      <td className="px-6 py-5"><div className="h-3.5 bg-gray-100 rounded w-28" /></td>
      <td className="px-6 py-5"><div className="h-3.5 bg-gray-100 rounded w-20" /></td>
      <td className="px-6 py-5"><div className="h-3.5 bg-gray-100 rounded w-20" /></td>
      <td className="px-6 py-5"><div className="h-6 bg-gray-100 rounded-full w-18" /></td>
      <td className="px-6 py-5"><div className="h-7 w-7 bg-gray-100 rounded-xl mx-auto" /></td>
    </tr>
  );
}

function SubscriberTableHeader() {
  return (
    <thead className="bg-gray-50 border-b border-gray-100">
      <tr>
        {["ID", "Recruiter", "Company", "Plan", "Start Date", "End Date", "Status", "Action"].map((col) => (
          <th
            key={col}
            className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${col === "Action" ? "text-center" : ""}`}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}


function SubscriberCard({ sub }: { sub: SubscribersListItem }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={getAvatar(sub.recruiterName)}
            alt={sub.recruiterName}
            className="w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{sub.recruiterName}</p>
            <p className="text-xs text-gray-500 truncate">{sub.companyName}</p>
          </div>
        </div>
        <button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all shrink-0">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold text-gray-800">{sub.planName}</span>
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(sub.status)}`}>
          {sub.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" /> {formatDate(sub.startDate)}
        </span>
        <span className="text-gray-300">→</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" /> {formatDate(sub.endDate)}
        </span>
      </div>

      <p className="mt-2 font-mono text-[10px] text-gray-400">#{sub.id}</p>
    </div>
  );
}

function SubscriberSkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-100 rounded w-32" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="h-3.5 bg-gray-100 rounded w-20" />
        <div className="h-6 bg-gray-100 rounded-full w-16" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-full mt-3" />
    </div>
  );
}

interface MobilePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function MobilePagination({ page, totalPages, onPageChange }: MobilePaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-1 pt-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Prev
      </button>
      <span className="text-xs font-semibold text-gray-500">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50"
      >
        Next <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface SubscriberTableProps {
  subscribers: SubscribersListItem[];
  loading: boolean;
  isError: boolean;
  onRetry: () => void;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  onPageChange: (page: number) => void;
}

export function SubscriberTable({
  subscribers,
  loading,
  isError,
  onRetry,
  pagination,
  onPageChange,
}: SubscriberTableProps) {
  return (
    <>
      {/* Table view — md and up */}
      <div className="hidden md:block">
        <DataTable
          loading={loading}
          isError={isError}
          errorState={
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-sm text-red-500">Unable to load subscription data</p>
                <button
                  onClick={onRetry}
                  className="px-5 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-100 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          }
          isEmpty={subscribers.length === 0}
          skeletonRows={Array(pagination.limit).fill(0).map((_, i) => <SubscriberSkeletonRow key={i} />)}
          emptyState={
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">No matching subscribers found</p>
              </div>
            </div>
          }
          header={<SubscriberTableHeader />}
          pagination={pagination}
          onPageChange={onPageChange}
        >
          {subscribers.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors group">
              <td className="px-6 py-4 font-mono text-xs text-gray-400">{sub.id}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatar(sub.recruiterName)}
                    alt={sub.recruiterName}
                    className="w-9 h-9 rounded-xl border border-gray-100 bg-gray-50"
                  />
                  <span className="text-sm font-medium text-gray-800">{sub.recruiterName}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{sub.companyName}</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">{sub.planName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(sub.startDate)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(sub.endDate)}</td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(sub.status)}`}>
                  {sub.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      {/* Card view — below md */}
      <div className="md:hidden">
        {isError ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm text-red-500">Unable to load subscription data</p>
              <button
                onClick={onRetry}
                className="px-5 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-100 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {Array(pagination.limit).fill(0).map((_, i) => (
              <SubscriberSkeletonCard key={i} />
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                <Inbox className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No matching subscribers found</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {subscribers.map((sub) => (
                <SubscriberCard key={sub.id} sub={sub} />
              ))}
            </div>
            <MobilePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </>
  );
}