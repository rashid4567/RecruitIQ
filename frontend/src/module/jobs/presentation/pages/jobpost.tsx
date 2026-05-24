import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJobs } from "../hooks/Recruiter-jobPost/useJobs";
import Sidebar from "../../../recruiter/presentation/pages/components/layout/Sidebar";
import Header from "@/components/candidate/header";
import StatsOverview from "./components/jobpost/StatsOverview";
import JobCard from "./components/jobpost/JobCard";
import JobListRow from "./components/jobpost/JobListRow";
import QuickViewModal from "./components/jobpost/QuickView.modal";

export default function JobsPage() {
  const {
    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredJobs,
    loading,
    error,
    stats,
    navigate,
    selectedJob,
    isModalOpen,
    activeTab,
    setActiveTab,
    handleViewClick,
    handleCloseModal,
    handleJobDeleted,
  } = useJobs();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="jobs" />

      <div className="flex-1 overflow-x-hidden">
        <Header />

        <main className="p-8 mt-6 max-w-7xl mx-auto w-full">
          <StatsOverview stats={stats} jobs={filteredJobs} />

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 pl-11 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all w-48"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Expired">Expired</option>
                  <option value="Draft">Draft</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white p-1 border border-gray-200 rounded-xl flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" /> Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" /> List
                </button>
              </div>

              <Button
                onClick={() => navigate("/recruiter/job-editor")}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3"
              >
                <Plus className="w-4 h-4" />
                Create New Job
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onViewClick={handleViewClick} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="text-left py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="text-left py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="text-left py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      AI Score
                    </th>
                    <th className="text-left py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <JobListRow
                      key={job.id}
                      job={job}
                      onViewClick={handleViewClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

   
          {filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                We couldn't find any jobs matching your criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      <QuickViewModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDeleted={handleJobDeleted}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
