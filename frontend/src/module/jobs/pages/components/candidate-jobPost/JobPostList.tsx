import { useState } from "react";
import { Briefcase } from "lucide-react";
import type { Job } from "@/module/jobs/types/job.types";
import type { JobPostFilters } from "../../../types/JobPostDTO";
import Header from "../../../../../pages/landing/sections/Header"
import { CompanyBanner } from "./CompanyBanner";
import { SearchBar } from "./SearchBar";
import { FilterSidebar } from "./FilterSidebar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { JobCard } from "./JobCard";
import { Pagination } from "./Pagination";
import { Testimonials } from "./Testimonials";
import { Footer } from "./Footer";

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


      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
   
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onResetFilters}
            />
          </div>


          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                {loading ? (
                  <span className="inline-block w-24 h-4 bg-slate-200 animate-pulse rounded" />
                ) : (
                  <>
                    <span className="font-bold text-slate-800">
                      {jobs.length}
                    </span>{" "}
                    jobs found
                  </>
                )}
              </p>
              <select
                value={filters.limit ?? 9}
                onChange={(e) =>
                  onFilterChange({ limit: Number(e.target.value) })
                }
                className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Briefcase className="w-7 h-7 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1.5">
                  No jobs found
                </h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs">
                  Try adjusting your filters or searching with different
                  keywords.
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={jobs.length}
                    limit={filters.limit ?? 9}
                    onPageChange={onPageChange}
                  />
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