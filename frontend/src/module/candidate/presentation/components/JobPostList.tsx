import React, { useState } from "react";
import { Briefcase, SlidersHorizontal, X, Search } from "lucide-react";
import type { JobPost } from "../../domain/entities/jobPost";
import type { JobPostFilters } from "../../domain/dto/JobPostDTO";
import Header from "@/components/candidate/header";
import { CompanyBanner } from "./jobPost/CompanyBanner";
import { FilterSidebar } from "./jobPost/FilterSidebar";
import { JobCardSkeleton } from "./jobPost/JobCardSkeleton";
import { JobCard } from "./jobPost/JobCard";
import { Pagination } from "./jobPost/Pagination";
import { Testimonials } from "./jobPost/Testimonials";
import { Footer } from "./jobPost/Footer";

interface JobPostListProps {
  jobs: JobPost[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onApplyClick: (job: JobPost) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: Partial<JobPostFilters>) => void;
  filters: JobPostFilters;
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
}: JobPostListProps) {
  const [searchInput, setSearchInput] = useState<string>(filters.search ?? "");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSearch = () => {
    onFilterChange({ search: searchInput.trim() || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onFilterChange({ search: undefined });
  };

  const handleResetFilters = () => {
    onFilterChange({
      search: undefined,
      jobType: undefined,
      isRemote: undefined,
      skills: [],
      experienceMin: undefined,
      experienceMax: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      department: undefined,
      page: 1,
      limit: filters.limit,
    });
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <CompanyBanner total={jobs.length} />

      {/* Sticky search */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2.5">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, skill, or keyword..."
              className="w-full pl-10 pr-9 h-10 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-5 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 h-10 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                filters={filters}
                onFilterChange={(f) => {
                  onFilterChange(f);
                  setMobileFilterOpen(false);
                }}
                onReset={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Job Listings */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
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

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: filters.limit ?? 9 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
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
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Job Grid */}
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

                {/* Pagination */}
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
