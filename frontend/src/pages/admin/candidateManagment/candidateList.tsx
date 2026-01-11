"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  UserCheck, 
  UserX, 
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { Sidebar } from "../../../components/admin/sideBar"
import { candidateService } from "../../../services/admin/admin.candidate.service"
import type { Candidate,CandidateStatus } from "../../../types/admin/candidate.types"
import  {useNavigate} from "react-router-dom"
export default function CandidateManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch] = useDebounce(searchTerm, 500)
  const [filterStatus, setFilterStatus] = useState<"All" | CandidateStatus>("All")
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate() 
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch candidates on mount and when filters change
  useEffect(() => {
    loadCandidates()
  }, [pagination.page, debouncedSearch, filterStatus])

  const loadCandidates = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status: filterStatus === "All" ? undefined : filterStatus
      }

      const response = await candidateService.getCandidates(params)
      
      setCandidates(response.candidates)
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: Math.ceil(response.pagination.total / prev.limit)
      }))
    } catch (err: any) {
      console.error("Failed to load candidates:", err)
      setError(err.response?.data?.message || "Failed to load candidates")
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUnblock = async (candidateId: string, currentStatus: CandidateStatus) => {
    try {
      setActionLoading(true)
      
      if (currentStatus === "Active") {
        await candidateService.blockCandidate(candidateId)
        // Update local state
        setCandidates(prev => prev.map(candidate =>
          candidate.id === candidateId ? { ...candidate, status: "Blocked" } : candidate
        ))
      } else {
        await candidateService.unblockCandidate(candidateId)
        // Update local state
        setCandidates(prev => prev.map(candidate =>
          candidate.id === candidateId ? { ...candidate, status: "Active" } : candidate
        ))
      }
      
      setShowActionsMenu(null)
    } catch (err: any) {
      console.error("Failed to update candidate status:", err)
      alert(err.response?.data?.message || "Failed to update candidate status")
    } finally {
      setActionLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const handleExport = () => {
    // Export functionality - you can implement CSV/Excel export here
    console.log("Export candidates functionality")
  }

  const getStatusColor = (status: CandidateStatus) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800 border border-green-200" 
      : "bg-red-100 text-red-800 border border-red-200"
  }

  const getExperienceColor = (years: number) => {
    if (years >= 8) return "bg-purple-100 text-purple-800"
    if (years >= 5) return "bg-blue-100 text-blue-800"
    if (years >= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  // Loading state
  if (loading && candidates.length === 0) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} flex items-center justify-center`}>
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading candidates...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Candidate Management</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage and monitor all candidate accounts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter size={20} />
                  Filters
                </button>
              </div>
              
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
              >
                <Download size={20} />
                Export Candidates
              </button>
            </div>
          </div>

          {/* Filter Tabs and Stats */}
          <div className="flex items-center justify-between px-6 pb-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              {["All", "Active", "Blocked"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setFilterStatus(filter as "All" | CandidateStatus)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filterStatus === filter 
                      ? "bg-blue-100 text-blue-700 border border-blue-300" 
                      : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-600">
                  Active: {candidates.filter(c => c.status === "Active").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">
                  Blocked: {candidates.filter(c => c.status === "Blocked").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Candidates</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadCandidates}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Candidates Found</h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || filterStatus !== "All" 
                  ? "No candidates match your search criteria. Try adjusting your filters."
                  : "There are no candidates in the system yet."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterStatus("All")
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="border-b border-slate-200">
                  <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-slate-600 bg-slate-50">
                    <div className="col-span-3">Candidate</div>
                    <div className="col-span-2">Skills</div>
                    <div className="col-span-1 text-center">Experience</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-1 text-center">Applications</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Registered</div>
                    <div className="col-span-1 text-center">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-200">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Candidate Info */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            candidate.status === "Active" ? "bg-green-500" : "bg-red-500"
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{candidate.name}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{candidate.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <span 
                              key={skill} 
                              className="px-2 py-1 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded border border-blue-100"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="col-span-1 text-center">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${getExperienceColor(candidate.experience)}`}>
                          <Briefcase className="h-3 w-3" />
                          <span className="font-medium">{candidate.experience}y</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{candidate.location}</span>
                        </div>
                      </div>

                      {/* Applications */}
                      <div className="col-span-1 text-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                          <span className="font-semibold">{candidate.applications}</span>
                          <span className="text-xs">apps</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                          <div className={`w-2 h-2 rounded-full ${candidate.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                          {candidate.status}
                        </div>
                      </div>

                      {/* Registered Date */}
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-700">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{candidate.registeredDate}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 text-center relative">
                        <button 
                          onClick={() => setShowActionsMenu(showActionsMenu === candidate.id ? null : candidate.id)}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors relative"
                          disabled={actionLoading}
                        >
                          {actionLoading && selectedCandidate?.id === candidate.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          ) : (
                            <MoreVertical size={18} className="text-slate-600" />
                          )}
                        </button>

                        {/* Actions Dropdown */}
                        {showActionsMenu === candidate.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowActionsMenu(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    navigate(`/admin/candidates/${candidate.id}`);
                                    setShowActionsMenu(null)
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Profile
                                </button>
                                
                                {candidate.status === "Active" ? (
                                  <button
                                    onClick={() => handleBlockUnblock(candidate.id, candidate.status)}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                  >
                                    <UserX className="h-4 w-4" />
                                    Block Candidate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBlockUnblock(candidate.id, candidate.status)}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                    Unblock Candidate
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-semibold">
                    {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span> candidates
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = pagination.page - 2 + i
                      }

                      return pageNum <= pagination.totalPages ? (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                            pagination.page === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ) : null
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsRight size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Rows per page:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => {
                      setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))
                    }}
                    className="border border-slate-300 rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} HireSmart Admin. All rights reserved.
        </div>
      </main>
    </div>
  )
}