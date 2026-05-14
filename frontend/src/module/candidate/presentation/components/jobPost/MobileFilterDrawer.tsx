import React, { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import type { JobPostFilters } from "@/module/candidate/domain/dto/JobPostDTO";
import { FilterSidebar } from "./FilterSidebar";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  filters: JobPostFilters;
  onClose: () => void;
  onFilterChange: (f: Partial<JobPostFilters>) => void;
  onReset: () => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  filters,
  onClose,
  onFilterChange,
  onReset,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />


      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter jobs"
        className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col"
      >

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Filters</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={handleReset}
          />
        </div>
        <div className="shrink-0 px-5 py-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
