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
  minWidth = "min-w-[760px]",
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
    <Card className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {showHeader && (
        <CardHeader className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 lg:px-5">
          {headerContent ?? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                {title && (
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {title}
                  </CardTitle>
                )}

                {description && (
                  <CardDescription className="mt-1 text-sm text-slate-500">
                    {description}
                  </CardDescription>
                )}
              </div>

              {rightSlot && (
                <div className="w-full md:w-auto">{rightSlot}</div>
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
        <div className="overflow-x-auto">
          <table
            className={cn(
              "w-full border-collapse text-sm",
              minWidth
            )}
          >
            {header}

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? skeletonRows : children}
            </tbody>
          </table>
        </div>
      )}

      {showFooter && pagination && onPageChange && (
        <DataTablePagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}