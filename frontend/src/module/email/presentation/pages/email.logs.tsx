import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { useEmailLogs } from "../../../email/presentation/hooks/EmailLog-Hooks/useEmailLogs";
import { EmailLogsHeader } from "../components/email-logs/EmailLogsHeader";
import { EmailLogsFilters } from "../components/email-logs/EmailLogsFilters";
import { EmailLogsTable } from "../components/email-logs/EmailLogsTable";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

type StatusFilter = "ALL" | "SENT" | "FAILED";
type TypeFilter = "ALL" | "TEST" | "REAL";

const STATUS_VALUES: StatusFilter[] = ["ALL", "SENT", "FAILED"];
const TYPE_VALUES: TypeFilter[] = ["ALL", "TEST", "REAL"];

function toStatusFilter(value: string): StatusFilter {
  return STATUS_VALUES.includes(value as StatusFilter)
    ? (value as StatusFilter)
    : "ALL";
}

function toTypeFilter(value: string): TypeFilter {
  return TYPE_VALUES.includes(value as TypeFilter)
    ? (value as TypeFilter)
    : "ALL";
}

export default function EmailLogsPage() {
  const { logs, loading, error, refreshing, fetchLogs } = useEmailLogs();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredLogs = logs.filter((log) => {
    const searchLower = search.toLowerCase();
    return (
      (log.getRecipient().toLowerCase().includes(searchLower) ||
        log.getSubject().toLowerCase().includes(searchLower)) &&
      (statusFilter === "ALL" || log.getStatus() === statusFilter) &&
      (typeFilter === "ALL" || log.getType() === typeFilter)
    );
  });

  const paginatedLogs = filteredLogs.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit,
  );

  const totalPages = Math.ceil(filteredLogs.length / pagination.limit);

  const handleRefresh = () => fetchLogs(true);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPagination((p) => ({ ...p, page: 1 }));
  };
  const handleSelectAll = () => {
    const allPageIds = paginatedLogs.map((log) => log.getId() ?? "");
    const allSelected = allPageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allPageIds])));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1">
        <EmailLogsHeader
          onRefresh={handleRefresh}
          isRefreshing={refreshing || loading}
        />

        <EmailLogsFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={(value: string) => {
            setStatusFilter(toStatusFilter(value));
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          typeFilter={typeFilter}
          onTypeFilterChange={(value: string) => {
            setTypeFilter(toTypeFilter(value));
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          onClearFilters={handleClearFilters}
        />

        <main className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
          {error ? (
            <Card className="border-rose-200 bg-rose-50">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                <p className="text-rose-800 font-medium">{error}</p>
                <Button onClick={handleRefresh} className="mt-6">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <EmailLogsTable
              logs={paginatedLogs}
              loading={loading}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              pagination={{
                page: pagination.page,
                limit: pagination.limit,
                total: filteredLogs.length,
                totalPages,
              }}
              onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
              onLimitChange={(limit) =>
                setPagination((p) => ({ ...p, limit, page: 1 }))
              }
              perPageOptions={PER_PAGE_OPTIONS}
            />
          )}
        </main>
      </div>
    </div>
  );
}
