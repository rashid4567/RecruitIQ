"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  ArrowLeft,
  Star,
  Award,
  Target,
  Zap,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Edit,
  Share2,
  Eye,
  Clock3,
  Building,
  BookOpen,
  Code,
  Languages,
  Users as UsersIcon,
  Heart,
  ThumbsUp,
  Search,
  Filter,
} from "lucide-react"

const CandidateProfileView: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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
      month: "short",
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
          {/* Back button skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Profile header skeleton */}
          <Card className="border border-gray-300 rounded-xl shadow-sm overflow-hidden">
            <div className="h-40 bg-gray-200 animate-pulse" />
            <CardContent className="relative pb-8 pt-0">
              <div className="flex flex-col lg:flex-row lg:items-end gap-6 -mt-20">
                <Skeleton className="h-40 w-40 rounded-2xl border-4 border-white shadow-lg" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-72" />
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-3">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-32 rounded-lg" />
                  <Skeleton className="h-10 w-36 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-56 rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-72 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border border-gray-300 rounded-xl shadow-lg">
          <CardContent className="flex flex-col items-center text-center py-12 px-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => candidateId && fetchCandidateProfile(candidateId)}
              className="gap-2 bg-black hover:bg-gray-900"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border border-gray-300 rounded-xl shadow-lg">
          <CardContent className="flex flex-col items-center text-center py-12 px-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">No Profile Found</h3>
            <p className="text-gray-600 mb-6">The candidate profile you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="border-b border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Candidates
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">Candidate Profile</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 hover:bg-gray-50">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Profile Header Card */}
        <Card className="border border-gray-300 rounded-xl shadow-sm overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-gray-900 to-gray-800" />
          <CardContent className="relative pb-8 pt-0">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 -mt-24">
              {/* Avatar Section */}
              <div className="relative">
                <div className="relative">
                  <Avatar className="h-48 w-48 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} className="object-cover" />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-2 -right-2 h-10 w-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${
                      profile.status === "Active" ? "bg-gradient-to-r from-emerald-500 to-green-400" : "bg-gradient-to-r from-red-500 to-pink-500"
                    }`}
                  >
                    {profile.status === "Active" ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Ban className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-5 pt-4 lg:pt-0">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{profile.name}</h1>
                    {profile.experience?.length > 5 && (
                      <Badge className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        <Star className="h-3 w-3 mr-1" />
                        Top Talent
                      </Badge>
                    )}
                  </div>
                  {profile.jobTitle && (
                    <p className="text-lg font-medium text-gray-600">{profile.jobTitle}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">{profile.email}</span>
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{profile.phone}</span>
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{profile.location}</span>
                    </span>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                    <Github className="h-4 w-4 text-gray-700" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                    <Globe className="h-4 w-4 text-emerald-600" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={`px-4 py-2 text-sm font-medium gap-2 border-0 ${
                      profile.status === "Active"
                        ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800"
                        : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800"
                    }`}
                  >
                    {profile.status === "Active" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                    {profile.status}
                  </Badge>
                  <Badge
                    className={`px-4 py-2 text-sm font-medium gap-2 border-0 ${
                      profile.verified
                        ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800"
                        : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800"
                    }`}
                  >
                    {profile.verified ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <ShieldAlert className="h-4 w-4" />
                    )}
                    {profile.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0">
                <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-gray-300">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-gray-300">
                  <Download className="h-4 w-4" />
                  Resume
                </Button>
                <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-gray-300">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>

                {/* Block/Unblock Actions */}
                {profile.status === "Active" ? (
                  <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                    <Button variant="destructive" className="gap-2 shadow-sm" onClick={() => setBlockDialogOpen(true)}>
                      <Ban className="h-4 w-4" />
                      Block
                    </Button>
                    <AlertDialogContent className="sm:max-w-md">
                      <AlertDialogHeader className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                          <Ban className="h-8 w-8 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-xl font-bold">Block this candidate?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 pt-2">
                          Blocking <span className="font-semibold text-gray-900">{profile.name}</span> will restrict their access to the platform.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-3 my-4">
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-700">Cannot apply to jobs</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-700">Account access restricted</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-red-700">Profile hidden from recruiters</p>
                        </div>
                      </div>
                      <AlertDialogFooter className="gap-3 mt-4">
                        <AlertDialogCancel className="px-6 border-gray-300 hover:bg-gray-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleBlockCandidate}
                          disabled={actionLoading}
                          className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 px-6"
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
                    <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 shadow-sm" onClick={() => setUnblockDialogOpen(true)}>
                      <UserCheck className="h-4 w-4" />
                      Unblock
                    </Button>
                    <AlertDialogContent className="sm:max-w-md">
                      <AlertDialogHeader className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
                          <UserCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <AlertDialogTitle className="text-xl font-bold">Unblock this candidate?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 pt-2">
                          Unblocking <span className="font-semibold text-gray-900">{profile.name}</span> will restore their platform access.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-3 my-4">
                        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-emerald-700">Can apply to jobs</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-emerald-700">Account access restored</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-emerald-700">Profile visible to recruiters</p>
                        </div>
                      </div>
                      <AlertDialogFooter className="gap-3 mt-4">
                        <AlertDialogCancel className="px-6 border-gray-300 hover:bg-gray-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleUnblockCandidate}
                          disabled={actionLoading}
                          className="bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 px-6"
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-xl">
          {["overview", "experience", "education", "skills", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary */}
            <Card className="border border-gray-300 rounded-xl shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 leading-relaxed">{profile.summary}</p>
              </CardContent>
            </Card>

            {/* Skills Grid */}
            <Card className="border border-gray-300 rounded-xl shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <Code className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{skill}</span>
                      <div className="ml-auto flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4 ? "text-amber-500 fill-amber-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience Timeline */}
            <Card className="border border-gray-300 rounded-xl shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
                    <Briefcase className="h-5 w-5 text-emerald-600" />
                  </div>
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-md">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-700">{exp.company}</span>
                            </div>
                          </div>
                          <Badge className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                            {exp.duration}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-4 leading-relaxed">{exp.description}</p>
                        {exp.technologies && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {exp.technologies.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="px-3 py-1 text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border border-gray-300 rounded-xl shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-700 font-medium mt-1">{edu.school}</p>
                        <p className="text-gray-600 text-sm mt-2">{edu.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-500">{edu.duration}</span>
                          {edu.gpa && (
                            <Badge className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800">
                              GPA: {edu.gpa}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <Card className="border border-gray-300 rounded-xl shadow-sm overflow-hidden">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-white">{profile.statistics.applications}</p>
                    <p className="text-sm font-medium text-gray-300 mt-2">Applications</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-white">{profile.statistics.interviews}</p>
                    <p className="text-sm font-medium text-emerald-100 mt-2">Interviews</p>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">Profile Completeness</p>
                    <span className="text-sm font-bold text-gray-900">{profile.statistics.completeness}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-700 ease-out"
                      style={{ width: `${profile.statistics.completeness}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{profile.statistics.matchRate || 85}%</p>
                    <p className="text-xs text-gray-600 mt-1">Match Rate</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{profile.statistics.responseTime || 24}h</p>
                    <p className="text-xs text-gray-600 mt-1">Avg. Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Card */}
            <Card className="border border-gray-300 rounded-xl shadow-sm overflow-hidden">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  AI Analysis Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <ScoreBar 
                  label="Technical Skills" 
                  value={profile.aiAnalysis?.technical ?? 0} 
                  color="bg-gradient-to-r from-blue-500 to-indigo-600"
                  icon={<Code className="h-4 w-4" />}
                />
                <ScoreBar 
                  label="Experience" 
                  value={profile.aiAnalysis?.experience ?? 0} 
                  color="bg-gradient-to-r from-purple-500 to-pink-600"
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <ScoreBar 
                  label="Education" 
                  value={profile.aiAnalysis?.education ?? 0} 
                  color="bg-gradient-to-r from-emerald-500 to-green-400"
                  icon={<GraduationCap className="h-4 w-4" />}
                />

                <Separator className="bg-gray-200" />

                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Overall Score</p>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold text-white">
                          {profile.aiAnalysis?.overall ?? 0}
                        </span>
                        <span className="text-lg font-semibold text-gray-400">%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Rank</p>
                      <p className="text-2xl font-bold text-white">Top 15%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Flags */}
            {profile.riskFlags && profile.riskFlags.length > 0 && (
              <Card className="border border-amber-300 rounded-xl shadow-sm bg-gradient-to-r from-amber-50 to-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-bold text-amber-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    Risk Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.riskFlags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200 shadow-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">{flag}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card className="border border-gray-300 rounded-xl shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Registered Date</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(profile.registeredDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Last Active</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(profile.lastActive)}</p>
                  </div>
                </div>

                {profile.languages && (
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Languages className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Languages</p>
                      <p className="text-sm font-bold text-gray-900">{profile.languages.join(", ")}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Target className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Employment Status</p>
                    <p className="text-sm font-bold text-gray-900">Active Job Seeker</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-gray-300 rounded-xl shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2 h-auto py-3 flex-col border-gray-300 hover:bg-gray-50">
                    <ThumbsUp className="h-5 w-5" />
                    <span className="text-xs font-medium">Shortlist</span>
                  </Button>
                  <Button variant="outline" className="gap-2 h-auto py-3 flex-col border-gray-300 hover:bg-gray-50">
                    <Heart className="h-5 w-5" />
                    <span className="text-xs font-medium">Save</span>
                  </Button>
                  <Button variant="outline" className="gap-2 h-auto py-3 flex-col border-gray-300 hover:bg-gray-50">
                    <Search className="h-5 w-5" />
                    <span className="text-xs font-medium">Find Similar</span>
                  </Button>
                  <Button variant="outline" className="gap-2 h-auto py-3 flex-col border-gray-300 hover:bg-gray-50">
                    <Filter className="h-5 w-5" />
                    <span className="text-xs font-medium">Compare</span>
                  </Button>
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