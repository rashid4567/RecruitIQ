import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onRefresh?: () => void;
  onClearFilters?: () => void;
}

export function EmptyState({
  icon,
  title,
  description = "Try adjusting your search or filters, or check back later.",
  onRefresh,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-6 bg-slate-100 rounded-2xl mb-6 shadow-sm">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md">{description}</p>
      <div className="flex gap-3">
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        {onRefresh && (
          <Button size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
}