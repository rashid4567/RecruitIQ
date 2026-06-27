import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CandidateEmptyStateProps {
  onRefresh: () => void;
  onClearFilters?: () => void;
}

export function CandidateEmptyState({ onRefresh, onClearFilters }: CandidateEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-6 bg-slate-100 rounded-2xl mb-6 shadow-sm">
        <Users className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">No candidates found</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md">
        Try adjusting your search or filters, or check back later.
      </p>
      <div className="flex gap-3">
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        <Button size="sm" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </div>
  );
}