import { TooltipProvider } from "@/components/ui/tooltip";
import { useActivityLogs } from "../hooks/useActivityLogs";
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
      <div className="flex flex-1 flex-col min-w-0 bg-slate-50">
        <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
          <div className="mx-auto w-full max-w-425 space-y-4 lg:space-y-6">
            {error ? (
              <ActivityLogsError message={error} onRetry={() => fetchLogs()} />
            ) : (
              <>
                <ActivityLogsStats
                  total={stats.total}
                  errors={stats.errors}
                  today={stats.today}
                  mostRecentUser={stats.mostRecentUser}
                />

                <ActivityLogsSearch
                  search={search}
                  onSearch={(v) => {
                    setSearch(v);
                    changePage(1);
                  }}
                  resultCount={filtered.length}
                  totalCount={stats.total}
                />

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
    </TooltipProvider>
  );
}
