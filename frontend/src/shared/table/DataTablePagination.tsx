import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationInfo } from "./types";

interface DataTablePaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  pagination,
  onPageChange,
}: DataTablePaginationProps) {
  const { page, limit, total, totalPages } = pagination;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
      <div>
        Showing <span className="font-medium text-slate-700">{startItem}</span>
        {" – "}
        <span className="font-medium text-slate-700">{endItem}</span>
        {" of "}
        <span className="font-medium text-slate-700">{total}</span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md disabled:opacity-50"
            disabled={page === 1}
            onClick={() => onPageChange(1)}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md disabled:opacity-50"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-sm text-slate-400 select-none">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-md text-sm",
                    p === page && "bg-indigo-600 text-white hover:bg-indigo-700",
                  )}
                  onClick={() => onPageChange(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}