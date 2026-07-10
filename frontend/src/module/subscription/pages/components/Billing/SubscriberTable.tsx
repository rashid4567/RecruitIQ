import { AlertCircle, Inbox, MoreVertical } from "lucide-react";
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
  );
}