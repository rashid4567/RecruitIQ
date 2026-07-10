import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  minWidth = "min-w-225",
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
    <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
      {showHeader && (
        <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200/70">
          {headerContent ?? (
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-sm text-slate-600 mt-1">
                    {description}
                  </CardDescription>
                )}
              </div>
              {rightSlot}
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
          <table className={`w-full ${minWidth}`}>
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