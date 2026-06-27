import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/admin/sideBar";

import { useActivityLogs } from "../hooks/useActivityLogs";
import { ActivityLogsHeader } from "./components/activity.logger/ActivityLogsHeader";
import { ActivityLogsStats } from "./components/activity.logger/ActivityStats";
import { ActivityLogsSearch } from "./components/activity.logger/ActivitySearch";
import { ActivityLogsTable } from "./components/activity.logger/Activitylogstable";
import { ActivityLogsError } from "./components/activity.logger/Activitylogserror";

export default function ActivityLogsPage() {
  const {
    filtered,
    paginated,
    loading,
    error,
    refreshing,
    search,
    setSearch,
    pagination,
    totalPages,
    changePage,
    changeLimit,
    fetchLogs,
    stats,
  } = useActivityLogs();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <ActivityLogsHeader
            loading={loading}
            refreshing={refreshing}
            onRefresh={() => fetchLogs(true)}
          />

          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              {error ? (
                <ActivityLogsError
                  message={error}
                  onRetry={() => fetchLogs()}
                />
              ) : (
                <>
                  {/* Stats row */}
                  <ActivityLogsStats
                    total={stats.total}
                    errors={stats.errors}
                    today={stats.today}
                    mostRecentUser={stats.mostRecentUser}
                  />

                  {/* Search */}
                  <ActivityLogsSearch
                    search={search}
                    onSearch={(v) => {
                      setSearch(v);
                      changePage(1);
                    }}
                    resultCount={filtered.length}
                    totalCount={stats.total}
                  />

                  {/* Table */}
                  <ActivityLogsTable
                    paginated={paginated}
                    filtered={filtered}
                    loading={loading}
                    pagination={pagination}
                    totalPages={totalPages}
                    onChangePage={changePage}
                    onChangeLimit={changeLimit}
                    search={search}
                  />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
