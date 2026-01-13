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
  ChevronsRight,
  X,
  CheckCircle,
  Shield,
  TrendingUp,
  Users,
  FileText,
  Star,
  Building,
  Phone
} from "lucide-react"
import { Sidebar } from "../../../components/admin/sideBar"
import { candidateService } from "../../../services/admin/admin.candidate.service"
import type { Candidate, CandidateStatus } from "../../../types/admin/candidate.types"
import { useNavigate } from "react-router-dom"
import { getError } from "@/utils/getError"

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
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    applications: 0
  })

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
      
      // Ensure all candidates have required properties
      const safeCandidates = response.candidates.map(candidate => ({
        ...candidate,
        registeredDate: candidate.registeredDate || "Jan 1, 2024",
        location: candidate.location || "Not specified",
        skills: candidate.skills || [],
        applications: candidate.applications || 0,
        experience: candidate.experience || 0,
       
        email: candidate.email || "Not provided"
      }))
      
      setCandidates(safeCandidates)
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: Math.ceil(response.pagination.total / prev.limit)
      }))

      // Calculate stats
      const active = safeCandidates.filter(c => c.status === "Active").length
      const blocked = safeCandidates.filter(c => c.status === "Blocked").length
      const applications = safeCandidates.reduce((acc, c) => acc + (c.applications || 0), 0)
      
      setStats({
        total: response.pagination.total,
        active,
        blocked,
        applications
      })
    } catch (err: unknown) {
      console.error("Failed to load candidates:", err)
      setError(getError(err, "Failed to load candidates"))
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUnblock = async (candidateId: string, currentStatus: CandidateStatus) => {
    try {
      setActionLoading(true)
      const candidate = candidates.find(c => c.id === candidateId)
      setSelectedCandidate(candidate || null)
      
      if (currentStatus === "Active") {
        await candidateService.blockCandidate(candidateId)
        // Update local state
        setCandidates(prev => prev.map(candidate =>
          candidate.id === candidateId ? { ...candidate, status: "Blocked" } : candidate
        ))
      } else {
        await candidateService.unblockCandidate(candidateId)
        setCandidates(prev => prev.map(candidate =>
          candidate.id === candidateId ? { ...candidate, status: "Active" } : candidate
        ))
      }
      
      setShowActionsMenu(null)
      loadCandidates() // Refresh stats
    } catch (err: unknown) {
      console.error("Failed to update candidate status:", err)
      alert(getError(err || "Failed to update candidate status"))
    } finally {
      setActionLoading(false)
      setSelectedCandidate(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleExport = () => {
    // Export functionality - you can implement CSV/Excel export here
    console.log("Export candidates functionality")
  }

  const getStatusColor = (status: CandidateStatus) => {
    return status === "Active" 
      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
      : "bg-rose-50 text-rose-700 border-rose-200"
  }

  const getExperienceColor = (years: number) => {
    if (years >= 8) return "bg-violet-100 text-violet-800 border-violet-200"
    if (years >= 5) return "bg-blue-100 text-blue-800 border-blue-200"
    if (years >= 3) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not provided"
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Not provided"
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return "Not provided"
    }
  }

  // Loading state
  if (loading && candidates.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} flex items-center justify-center`}>
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
              <Users className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Candidates</h3>
              <p className="text-gray-600 max-w-md">Fetching candidate data and preparing the dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} overflow-y-auto`}>
        {/* Header - Matching sidebar theme */}
        <div className="sticky top-0 z-50 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Manage and monitor all candidate accounts
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2.5 w-80 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent shadow-sm transition-all duration-200 hover:border-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow">
                  <Filter size={18} />
                  <span className="font-medium">Filter</span>
                </button>
                
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-200 shadow hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download size={18} />
                  <span className="font-semibold">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards - Matching sidebar theme */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 pb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Candidates</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Users className="w-6 h-6 text-gray-900" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Updated in real-time</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-emerald-700">{stats.active}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <UserCheck className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              <div className="mt-3">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total ? (stats.active / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Blocked</p>
                  <p className="text-3xl font-bold text-rose-700">{stats.blocked}</p>
                </div>
                <div className="p-3 bg-rose-100 rounded-xl">
                  <UserX className="w-6 h-6 text-rose-700" />
                </div>
              </div>
              <div className="mt-3">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total ? (stats.blocked / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-violet-700">{stats.applications}</p>
                </div>
                <div className="p-3 bg-violet-100 rounded-xl">
                  <FileText className="w-6 h-6 text-violet-700" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                <span className="text-violet-600 font-medium">Active applicants</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between px-6 pb-4">
            <div className="flex items-center gap-2">
              {["All", "Active", "Blocked"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setFilterStatus(filter as "All" | CandidateStatus)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    filterStatus === filter 
                      ? "bg-black text-white shadow" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-gray-700 font-medium">Active: {stats.active}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-gray-700 font-medium">Blocked: {stats.blocked}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-rose-200 rounded-xl p-8 shadow">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-rose-100 rounded-xl">
                    <AlertCircle className="w-12 h-12 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Candidates</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                  </div>
                  <button
                    onClick={loadCandidates}
                    className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all duration-200 shadow hover:shadow-lg"
                  >
                    Retry Loading
                  </button>
                </div>
              </div>
            </div>
          ) : candidates.length === 0 ? (
            <div className="max-w-lg mx-auto">
              <div className="bg-white border border-gray-300 rounded-xl p-12 text-center shadow-sm">
                <div className="inline-flex p-6 bg-gray-100 rounded-xl mb-6">
                  <Users className="w-16 h-16 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Candidates Found</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {searchTerm || filterStatus !== "All" 
                    ? "No candidates match your search criteria. Try adjusting your filters."
                    : "Ready to onboard your first candidate. Let's get started!"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterStatus("All")
                    }}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-200 shadow hover:shadow-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Table Container */}
              <div className="bg-white border border-gray-300 rounded-xl shadow overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-300">
                  <div className="grid grid-cols-12 gap-4 p-5 text-sm font-semibold text-gray-700">
                    <div className="col-span-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>CANDIDATE PROFILE</span>
                    </div>
                    <div className="col-span-1 text-center flex items-center justify-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>EXP</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>LOCATION</span>
                    </div>
                    <div className="col-span-1 text-center flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>APPS</span>
                    </div>
                    <div className="col-span-1 text-center flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>STATUS</span>
                    </div>
                    <div className="col-span-2 text-center flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>REGISTERED DATE</span>
                    </div>
                    <div className="col-span-1 text-center">ACTIONS</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-300">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-gray-50 transition-all duration-300 group"
                    >
                      {/* Candidate Info */}
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                            alt={candidate.name}
                            className="relative w-12 h-12 rounded-full ring-2 ring-white shadow transform group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            candidate.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate text-lg">{candidate.name || "Not provided"}</p>
                            {(candidate.experience || 0) >= 5 && (
                              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full border border-amber-200 font-medium">
                                PRO
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3.5 w-3.5" />
                              <span className="truncate">{candidate.email || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{ "Not provided"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="col-span-1 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getExperienceColor(candidate.experience || 0)} transform hover:scale-105 transition-transform duration-200`}>
                          <Briefcase className="h-4 w-4" />
                          <span className="font-bold">{candidate.experience || 0}</span>
                          <span className="text-xs opacity-80">yrs</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                          <MapPin className="h-5 w-5 text-gray-600" />
                          <div>
                            <span className="font-medium text-gray-900">{candidate.location || "Not specified"}</span>
                            <div className="text-xs text-gray-500">Location</div>
                          </div>
                        </div>
                      </div>

                      {/* Applications */}
                      <div className="col-span-1 text-center">
                        <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 shadow-sm">
                          <FileText className="h-4 w-4" />
                          <div className="text-center">
                            <div className="font-bold text-xl">{candidate.applications || 0}</div>
                            <div className="text-xs opacity-75">apps</div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1 text-center">
                        <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border ${getStatusColor(candidate.status)} shadow-sm`}>
                          <div className={`w-3 h-3 rounded-full ${candidate.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                          <span className="font-semibold">{candidate.status}</span>
                          {candidate.status === "Active" && (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                      </div>

                      {/* Registered Date */}
                      <div className="col-span-2 text-center">
                        <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-300">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="font-semibold">{formatDate(candidate.registeredDate)}</div>
                            <div className="text-xs text-gray-500">Registered</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 text-center relative">
                        <button 
                          onClick={() => setShowActionsMenu(showActionsMenu === candidate.id ? null : candidate.id)}
                          className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow relative group/action"
                          disabled={actionLoading}
                        >
                          {actionLoading && selectedCandidate?.id === candidate.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-black" />
                          ) : (
                            <div className="relative">
                              <MoreVertical size={20} className="text-gray-600 group-hover/action:text-gray-900 transition-colors" />
                              <div className="absolute -inset-1 bg-black/10 rounded-full opacity-0 group-hover/action:opacity-100 transition-opacity"></div>
                            </div>
                          )}
                        </button>

                        {/* Actions Dropdown */}
                        {showActionsMenu === candidate.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setShowActionsMenu(null)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-300 z-50 overflow-hidden">
                              <div className="p-2">
                                <div className="px-3 py-2 mb-2 border-b border-gray-200">
                                  <p className="font-semibold text-gray-900">Quick Actions</p>
                                  <p className="text-xs text-gray-500">{candidate.name}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    navigate(`/admin/candidates/${candidate.id}`);
                                    setShowActionsMenu(null)
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 group/action-item"
                                >
                                  <div className="p-2 bg-gray-200 rounded-lg group-hover/action-item:bg-gray-300 transition-colors">
                                    <Eye className="h-4 w-4 text-gray-900" />
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium">View Full Profile</div>
                                    <div className="text-xs text-gray-500">Complete details & history</div>
                                  </div>
                                </button>
                                
                                {candidate.status === "Active" ? (
                                  <button
                                    onClick={() => handleBlockUnblock(candidate.id, candidate.status)}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 group/action-item"
                                  >
                                    <div className="p-2 bg-rose-100 rounded-lg group-hover/action-item:bg-rose-200 transition-colors">
                                      <UserX className="h-4 w-4 text-rose-700" />
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium">Block Candidate</div>
                                      <div className="text-xs text-gray-500">Restrict account access</div>
                                    </div>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBlockUnblock(candidate.id, candidate.status)}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 group/action-item"
                                  >
                                    <div className="p-2 bg-emerald-100 rounded-lg group-hover/action-item:bg-emerald-200 transition-colors">
                                      <UserCheck className="h-4 w-4 text-emerald-700" />
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium">Unblock Candidate</div>
                                      <div className="text-xs text-gray-500">Restore account access</div>
                                    </div>
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-white border border-gray-300 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-700 font-medium">
                    Showing{" "}
                    <span className="font-bold text-gray-900">
                      {(pagination.page - 1) * pagination.limit + 1} -{" "}
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    of <span className="font-bold text-gray-900">{pagination.total}</span> candidates
                  </div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <div className="text-sm text-gray-500">
                    Page <span className="font-semibold text-black">{pagination.page}</span> of{" "}
                    <span className="font-semibold text-gray-700">{pagination.totalPages}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 border border-transparent hover:border-gray-300"
                  >
                    <ChevronsLeft size={20} />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 border border-transparent hover:border-gray-300"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1 mx-2">
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
                          className={`w-11 h-11 flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${
                            pagination.page === pageNum
                              ? "bg-black text-white shadow transform scale-105"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-300"
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
                    className="p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 border border-transparent hover:border-gray-300"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 border border-transparent hover:border-gray-300"
                  >
                    <ChevronsRight size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-700 font-medium">Rows per page:</div>
                  <select
                    value={pagination.limit}
                    onChange={(e) => {
                      setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))
                    }}
                    className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
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
        <div className="border-t border-gray-300 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">© {new Date().getFullYear()} RecruitIQ Admin.</span> All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                System Status: Operational
              </span>
              <span>Last updated: Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}