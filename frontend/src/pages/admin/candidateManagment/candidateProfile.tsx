import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { candidateService } from "../../../services/admin/admin.candidate.service"
import type { CandidateProfile } from "../../../types/admin/candidate.types"
import { ScoreBar } from "../../../components/admin/scoreBar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  Download,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  FileText,
  Activity,
  Ban,
  UserCheck,
  MessageSquare,
} from "lucide-react"

const CandidateProfileView: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false)

  useEffect(() => {
    if (candidateId) {
      fetchCandidateProfile(candidateId)
    }
  }, [candidateId])

  const fetchCandidateProfile = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await candidateService.getCandidateProfile(id)
      setProfile(data)
    } catch (err) {
      setError("Failed to load candidate profile")
      console.error("Error fetching candidate profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockCandidate = async () => {
    if (!candidateId || !profile) return

    try {
      setActionLoading(true)
      await candidateService.blockCandidate(candidateId)
      setProfile({ ...profile, status: "Blocked" })
      setBlockDialogOpen(false)
    } catch (err) {
      setError("Failed to block candidate")
      console.error("Error blocking candidate:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnblockCandidate = async () => {
    if (!candidateId || !profile) return

    try {
      setActionLoading(true)
      await candidateService.unblockCandidate(candidateId)
      setProfile({ ...profile, status: "Active" })
      setUnblockDialogOpen(false)
    } catch (err) {
      setError("Failed to unblock candidate")
      console.error("Error unblocking candidate:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
          <Card className="overflow-hidden border-0 shadow-sm">
            <div className="h-32 bg-linear-to-r from-slate-200 to-slate-100 animate-pulse" />
            <CardContent className="relative pb-8 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">
                <Skeleton className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg" />
                <div className="flex-1 space-y-4 pt-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-3">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-28 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-56 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="flex flex-col items-center text-center py-12 px-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-xl text-slate-900 mb-2">Error Loading Profile</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <Button onClick={() => candidateId && fetchCandidateProfile(candidateId)} className="gap-2">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="flex flex-col items-center text-center py-12 px-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-xl text-slate-900 mb-2">No Profile Found</h3>
            <p className="text-slate-500">The candidate profile you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <Card className="overflow-hidden border-0 shadow-sm">
          <div
            className={`h-32 ${
              profile.status === "Active"
                ? "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
                : "bg-linear-to-r from-slate-400 via-slate-500 to-slate-600"
            }`}
          />
          <CardContent className="relative pb-8 pt-0">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 -mt-16">
              {/* Avatar with status ring */}
              <div className="relative">
                <Avatar
                  className={`h-32 w-32 rounded-2xl border-4 border-white shadow-xl ${
                    profile.status === "Blocked" ? "grayscale" : ""
                  }`}
                >
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center ${
                    profile.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                >
                  {profile.status === "Active" ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <Ban className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 pt-4 lg:pt-0">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{profile.name}</h1>
                  {profile.jobTitle && <p className="text-lg text-slate-600 font-medium mt-1">{profile.jobTitle}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2 hover:text-slate-700 transition-colors">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-2 hover:text-slate-700 transition-colors">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-2 hover:text-slate-700 transition-colors">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={`px-3 py-1.5 text-sm font-medium gap-1.5 ${
                      profile.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {profile.status === "Active" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Ban className="h-3.5 w-3.5" />
                    )}
                    {profile.status}
                  </Badge>
                  <Badge
                    className={`px-3 py-1.5 text-sm font-medium gap-1.5 ${
                      profile.verified
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {profile.verified ? (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    )}
                    {profile.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0">
                <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200">
                  <Download className="h-4 w-4" />
                  Download CV
                </Button>

                {/* Block/Unblock with confirmation dialogs */}
                {profile.status === "Active" ? (
                  <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2 shadow-sm">
                        <Ban className="h-4 w-4" />
                        Block Candidate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-md">
                      <AlertDialogHeader className="text-center sm:text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                          <Ban className="h-8 w-8 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-xl">Block this candidate?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 pt-2">
                          You are about to block <span className="font-semibold text-slate-700">{profile.name}</span>.
                          This action will:
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="bg-red-50 rounded-lg p-4 my-4 space-y-2">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-700">Prevent them from applying to any jobs</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-700">Restrict access to their account</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-700">Hide their profile from recruiters</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 text-center">You can unblock them at any time.</p>
                      <AlertDialogFooter className="sm:justify-center gap-3 mt-4">
                        <AlertDialogCancel className="mt-0 px-6">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleBlockCandidate}
                          disabled={actionLoading}
                          className="bg-red-600 text-white hover:bg-red-700 px-6"
                        >
                          {actionLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Blocking...
                            </span>
                          ) : (
                            "Block Candidate"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <AlertDialog open={unblockDialogOpen} onOpenChange={setUnblockDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                        <UserCheck className="h-4 w-4" />
                        Unblock Candidate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-md">
                      <AlertDialogHeader className="text-center sm:text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
                          <UserCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <AlertDialogTitle className="text-xl">Unblock this candidate?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 pt-2">
                          You are about to unblock <span className="font-semibold text-slate-700">{profile.name}</span>.
                          This will:
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="bg-emerald-50 rounded-lg p-4 my-4 space-y-2">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-emerald-700">Restore their ability to apply to jobs</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-emerald-700">Restore full account access</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-emerald-700">Make their profile visible to recruiters</p>
                        </div>
                      </div>
                      <AlertDialogFooter className="sm:justify-center gap-3 mt-4">
                        <AlertDialogCancel className="mt-0 px-6">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleUnblockCandidate}
                          disabled={actionLoading}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 px-6"
                        >
                          {actionLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Unblocking...
                            </span>
                          ) : (
                            "Unblock Candidate"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{profile.summary}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8 pb-8 last:pb-0">
                      {index !== profile.experience.length - 1 && (
                        <div className="absolute left-2.75 top-8 bottom-0 w-0.5 bg-linear-to-b from-blue-300 to-slate-200" />
                      )}
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                        <Briefcase className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                        <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                        <p className="text-sm font-medium text-blue-600 mt-0.5">{exp.company}</p>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                  </div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="relative pl-8 pb-8 last:pb-0">
                      {index !== profile.education.length - 1 && (
                        <div className="absolute left-2.75 top-8 bottom-0 w-0.5 bg-linear-to-b from-emerald-300 to-slate-200" />
                      )}
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                        <GraduationCap className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                        <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                        <p className="text-sm font-medium text-emerald-600 mt-0.5">{edu.school}</p>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-linear-to-br from-indigo-50 to-indigo-100/50 p-5 text-center">
                    <p className="text-4xl font-bold text-indigo-600">{profile.statistics.applications}</p>
                    <p className="text-sm font-medium text-indigo-600/70 mt-1">Applications</p>
                  </div>
                  <div className="rounded-xl bg-linear-to-br from-emerald-50 to-emerald-100/50 p-5 text-center">
                    <p className="text-4xl font-bold text-emerald-600">{profile.statistics.interviews}</p>
                    <p className="text-sm font-medium text-emerald-600/70 mt-1">Interviews</p>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-700">Profile Completeness</p>
                    <span className="text-sm font-bold text-indigo-600">{profile.statistics.completeness}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                      style={{ width: `${profile.statistics.completeness}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  AI Analysis Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <ScoreBar label="Technical Skills" value={profile.aiAnalysis?.technical ?? 0} color="bg-blue-500" />
                <ScoreBar label="Experience" value={profile.aiAnalysis?.experience ?? 0} color="bg-violet-500" />
                <ScoreBar label="Education" value={profile.aiAnalysis?.education ?? 0} color="bg-emerald-500" />

                <Separator className="bg-slate-100" />

                <div className="flex items-center justify-between bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-slate-700">Overall Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                      {profile.aiAnalysis?.overall ?? 0}
                    </span>
                    <span className="text-lg font-semibold text-slate-400">%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile.riskFlags && profile.riskFlags.length > 0 && (
              <Card className="border-0 shadow-sm border-l-4 border-l-amber-400 bg-linear-to-r from-amber-50 to-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-amber-700">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    Risk Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.riskFlags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-600">{flag}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Calendar className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registered</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(profile.registeredDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Clock className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Last Active</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(profile.lastActive)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateProfileView
