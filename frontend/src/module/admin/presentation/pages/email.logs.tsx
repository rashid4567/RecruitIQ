import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { useEmailLogs } from "../hooks/useEmailLogs";
import { EmailLogsHeader } from "../components/email-logs/EmailLogsHeader";
import { EmailLogsFilters } from "../components/email-logs/EmailLogsFilters";
import { EmailLogsTable } from "../components/email-logs/EmailLogsTable";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function EmailLogsPage() {
  const { logs, loading, error, refreshing, fetchLogs } = useEmailLogs();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SENT" | "FAILED">(
    "ALL", 
  );
  const [typeFilter, setTypeFilter] = useState<"ALL" | "TEST" | "REAL">("ALL");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredLogs = logs.filter((log) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      log.getRecipient().toLowerCase().includes(searchLower) ||
      log.getSubject().toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" || log.getStatus() === statusFilter;
    const matchesType = typeFilter === "ALL" || log.getType() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedLogs = filteredLogs.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit,
  );

  const totalPages = Math.ceil(filteredLogs.length / pagination.limit);

  const handleRefresh = () => {
    fetchLogs(true);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((p) => ({ ...p, limit, page: 1 }));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedLogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedLogs.map((log) => log.getId()));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <EmailLogsHeader
          onRefresh={handleRefresh}
          isRefreshing={refreshing || loading}
        />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            {error ? (
              <Card className="border-rose-200/70 bg-rose-50/40 shadow-sm">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
                  <p className="text-rose-800 font-medium">{error}</p>
                  <Button
                    size="sm"
                    className="mt-4 bg-rose-600 hover:bg-rose-700"
                    onClick={handleRefresh}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-12 gap-7">
                <div className="lg:col-span-3 xl:col-span-2">
                  <EmailLogsFilters
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(value) => {
                      setStatusFilter(value as any);
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                    typeFilter={typeFilter}
                    onTypeFilterChange={(value) => {
                      setTypeFilter(value as any);
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                    onClearFilters={handleClearFilters}
                  />
                </div>

                <div className="lg:col-span-9 xl:col-span-10">
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
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    perPageOptions={PER_PAGE_OPTIONS}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}