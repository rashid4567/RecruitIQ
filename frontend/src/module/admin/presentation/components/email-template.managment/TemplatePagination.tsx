import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplatePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function TemplatePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TemplatePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-4 py-5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
      <div>
        Showing {(currentPage - 1) * pageSize + 1}–
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-1 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const num =
              i + Math.max(1, Math.min(currentPage - 3, totalPages - 6));
            if (num < 1 || num > totalPages) return null;
            return (
              <Button
                key={num}
                variant={num === currentPage ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 text-sm rounded-md",
                  num === currentPage &&
                    "bg-indigo-600 hover:bg-indigo-700 text-white"
                )}
                onClick={() => onPageChange(num)}
              >
                {num}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}