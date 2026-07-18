import { useState } from "react";
import { Briefcase, SlidersHorizontal } from "lucide-react";
import type { Job } from "@/module/jobs/types/job.types";
import type { JobPostFilters } from "../../../types/JobPostDTO";

import { CompanyBanner } from "./CompanyBanner";
import { SearchBar } from "./SearchBar";
import { FilterSidebar } from "./FilterSidebar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { JobCard } from "./JobCard";
import { Pagination } from "./Pagination";
import { Testimonials } from "./Testimonials";
import { Footer } from "./Footer";
import Header from "@/module/auth/pages/home/header";

interface JobPostListProps {
  jobs: Job[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onApplyClick: (job: Job) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: Partial<JobPostFilters>) => void;
  filters: JobPostFilters;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;
}

function countActiveFilters(filters: JobPostFilters): number {
  let count = 0;
  if (filters.department !== undefined) count++;
  if (filters.jobType !== undefined) count++;
  if (filters.isRemote !== undefined) count++;
  if (filters.experienceMin !== undefined || filters.experienceMax !== undefined) count++;
  return count;
}

export default function JobPostList({
  jobs,
  loading,
  currentPage,
  totalPages,
  onApplyClick,
  onPageChange,
  onFilterChange,
  filters,
  searchInput,
  onSearchChange,
  onResetFilters,
}: JobPostListProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const activeFilterCount = countActiveFilters(filters);

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (

    <div className="min-h-screen bg-slate-50">
      <Header />
      <CompanyBanner total={jobs.length} jobs={jobs} />

      <SearchBar
        searchInput={searchInput}
        onSearchInputChange={onSearchChange}
        onClear={handleClearSearch}
        onMobileFilterOpen={() => setMobileFilterOpen(true)}
        filters={filters}
      />

      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        filters={filters}
        onClose={() => setMobileFilterOpen(false)}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />


   <main className="w-full px-4 sm:px-5 lg:pl-2 lg:pr-8 py-8">
        <div className="flex gap-6">
          <div className="hidden lg:block shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onResetFilters}
              className="lg:sticky lg:top-6 lg:self-start"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">
                  {loading ? (
                    <span className="inline-block w-24 h-4 bg-slate-200 animate-pulse rounded" />
                  ) : (
                    <>
                      <span className="font-bold text-slate-800">{jobs.length}</span>{" "}
                      {jobs.length === 1 ? "job" : "jobs"} found
                    </>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden relative flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white hover:border-slate-300 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              <select
                value={filters.limit ?? 9}
                onChange={(e) => onFilterChange({ limit: Number(e.target.value) })}
                className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
              >
                <option value={9}>9 / page</option>
                <option value={18}>18 / page</option>
                <option value={27}>27 / page</option>
              </select>
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: filters.limit ?? 9 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && jobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Briefcase className="w-7 h-7 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1.5">No jobs found</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs">
                  Try adjusting your filters or searching with different keywords.
                </p>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {!loading && jobs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={onApplyClick}
                      style={{ animationDelay: `${index * 40}ms` }}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      total={jobs.length}
                      limit={filters.limit ?? 9}
                      onPageChange={onPageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Testimonials />
      <Footer />
    </div>
  );
}