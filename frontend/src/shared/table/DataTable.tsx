import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./DataTablePagination";
import type { DataTableProps } from "./types";

export function DataTable({
  title,
  description,
  rightSlot,
  headerContent,
  loading,
  isError = false,
  errorState,
  isEmpty,
  skeletonRows,
  emptyState,
  header,
  children,
  pagination,
  onPageChange,
  hideFooterOnSinglePage = false,
  minWidth = "min-w-[700px] lg:min-w-[950px]",
}: DataTableProps) {
  const showHeader = Boolean(headerContent || title || rightSlot);
  const showFooter =
    !loading &&
    !isError &&
    pagination &&
    pagination.total > 0 &&
    onPageChange &&
    (!hideFooterOnSinglePage || pagination.totalPages > 1);

  return (
    <Card
      className="
        w-full min-w-0
        overflow-hidden
        rounded-lg sm:rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-shadow
        hover:shadow-md
      "
    >
      {showHeader && (
        <CardHeader
          className="
            border-b border-slate-200/70
            bg-slate-50
            px-4 py-4
            sm:px-5
            lg:px-6
          "
        >
          {headerContent ?? (
            <div
              className="
                flex flex-col gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="min-w-0">
                {title && (
                  <CardTitle className="text-base font-semibold text-slate-900 sm:text-lg">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="mt-1 text-sm text-slate-600">
                    {description}
                  </CardDescription>
                )}
              </div>
              {rightSlot && (
                <div className="flex w-full shrink-0 sm:w-auto">{rightSlot}</div>
              )}
            </div>
          )}
        </CardHeader>
      )}

      {!loading && isError ? (
        errorState
      ) : !loading && isEmpty ? (
        emptyState
      ) : (
        <div className="w-full overflow-x-auto overscroll-x-contain">
          <table className={cn("w-full text-sm border-collapse", minWidth)}>
            {header}
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? skeletonRows : children}
            </tbody>
          </table>
        </div>
      )}

      {showFooter && pagination && onPageChange && (
        <DataTablePagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </Card>
  );
}