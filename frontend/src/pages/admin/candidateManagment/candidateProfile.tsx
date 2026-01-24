import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidateService } from "../../../services/admin/admin.candidate.service";
import type { CandidateProfile } from "../../../types/admin/candidate.types";
import { ScoreBar } from "../../../components/admin/scoreBar";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
  Users,
  Award,
  Target,
  Star,
  BarChart3,
  ChevronLeft,
  ExternalLink,
  Link,
  Globe,
  Building,
  BookOpen,
  Code,
  Heart,
  Zap,
} from "lucide-react";
import Sidebar from "../../../components/admin/sideBar";

const CandidateProfileView: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);

  useEffect(() => {
    if (candidateId) {
      fetchCandidateProfile(candidateId);
    }
  }, [candidateId]);

  const fetchCandidateProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await candidateService.getCandidateProfile(id);
      setProfile(data);
    } catch (err) {
      setError("Failed to load candidate profile");
      console.error("Error fetching candidate profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCandidate = async () => {
    if (!candidateId || !profile) return;

    try {
      setActionLoading(true);
      await candidateService.blockCandidate(candidateId);
      setProfile({ ...profile, status: "Blocked" });
      setBlockDialogOpen(false);
    } catch (err) {
      setError("Failed to block candidate");
      console.error("Error blocking candidate:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockCandidate = async () => {
    if (!candidateId || !profile) return;

    try {
      setActionLoading(true);
      await candidateService.unblockCandidate(candidateId);
      setProfile({ ...profile, status: "Active" });
      setUnblockDialogOpen(false);
    } catch (err) {
      setError("Failed to unblock candidate");
      console.error("Error unblocking candidate:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "NA";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800 border border-green-200" 
      : "bg-red-100 text-red-800 border border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading candidate profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-white border border-red-200 rounded-xl p-8 shadow-sm">
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 bg-red-100 rounded-xl">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                </div>
                <Button
                  onClick={() => candidateId && fetchCandidateProfile(candidateId)}
                  className="gap-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="inline-flex p-6 bg-gray-100 rounded-xl mb-6">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Candidate Not Found</h3>
              <p className="text-gray-600 mb-8">
                The candidate profile you're looking for doesn't exist or has been removed.
              </p>
              <Button
                onClick={() => navigate('/admin/candidates')}
                className="gap-2"
              >
                <ChevronLeft size={18} />
                Back to Candidates
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <button 
                  onClick={() => navigate('/admin/candidates')}
                  className="hover:text-gray-700 flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Candidate Management</span>
                </button>
                <span>›</span>
                <span className="text-gray-900 font-medium">Profile View</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-600" />
                Candidate Profile
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/admin/candidates')}
              >
                <ArrowLeft size={18} />
                Back to List
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => fetchCandidateProfile(candidateId!)}
              >
                <Zap size={18} />
                Refresh
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                onClick={() => {/* Download CV logic */}}
              >
                <Download size={18} />
                Download CV
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg">
                  <AvatarImage
                    src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                    alt={profile.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl">
                    {getInitials(profile?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                  profile.status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}>
                  {profile.status === "Active" ? (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  ) : (
                    <Ban className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(profile.status)}`}>
                        {profile.status === "Active" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Ban className="w-4 h-4" />
                        )}
                        {profile.status}
                      </div>
                      {profile.jobTitle && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{profile.jobTitle}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{profile.email}</span>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                      </div>
                      {profile.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="gap-2">
                      <MessageSquare size={18} />
                      Message
                    </Button>
                    
                    {profile.status === "Active" ? (
                      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="gap-2">
                            <Ban size={18} />
                            Block
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Block Candidate</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to block {profile.name}? This will prevent them from applying to jobs.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBlockCandidate} disabled={actionLoading}>
                              {actionLoading ? "Blocking..." : "Block Candidate"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog open={unblockDialogOpen} onOpenChange={setUnblockDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button className="gap-2 bg-green-600 hover:bg-green-700">
                            <UserCheck size={18} />
                            Unblock
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Unblock Candidate</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to unblock {profile.name}? This will restore their access.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleUnblockCandidate} disabled={actionLoading}>
                              {actionLoading ? "Unblocking..." : "Unblock Candidate"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 leading-relaxed">{profile.summary}</p>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Code className="w-5 h-5 text-purple-600" />
                    </div>
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {profile?.experience?.map((exp, index) => (
                      <div key={index} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-200">
                        <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-blue-500"></div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Building className="w-4 h-4" />
                            <span className="font-medium">{exp.company}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {profile?.education?.map((edu, index) => (
                      <div key={index} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-200">
                        <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-green-500"></div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <BookOpen className="w-4 h-4" />
                            <span className="font-medium">{edu.school}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{edu.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar Content */}
            <div className="space-y-6">
              {/* Statistics Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-orange-600" />
                    </div>
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{profile?.statistics?.applications || 0}</p>
                      <p className="text-sm font-medium text-blue-600/70 mt-1">Applications</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{profile?.statistics?.interviews || 0}</p>
                      <p className="text-sm font-medium text-green-600/70 mt-1">Interviews</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                      <span className="text-sm font-bold text-indigo-600">{profile?.statistics?.completeness || 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${profile?.statistics?.completeness || 0}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    AI Analysis Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <ScoreBar
                      label="Technical Skills"
                      value={profile.aiAnalysis?.technical || 0}
                      color="bg-blue-500"
                    />
                    <ScoreBar
                      label="Experience"
                      value={profile.aiAnalysis?.experience || 0}
                      color="bg-violet-500"
                    />
                    <ScoreBar
                      label="Education"
                      value={profile.aiAnalysis?.education || 0}
                      color="bg-emerald-500"
                    />

                    <Separator />

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">Overall Score</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {profile.aiAnalysis?.overall || 0}
                          </span>
                          <span className="text-lg font-semibold text-gray-400">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Flags Card (if any) */}
              {profile.riskFlags && profile.riskFlags.length > 0 && (
                <Card className="border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
                  <CardHeader className="border-b border-amber-100">
                    <CardTitle className="flex items-center gap-3 text-lg text-amber-800">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      </div>
                      Risk Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {profile.riskFlags.map((flag, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm border border-amber-100">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{flag}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Meta Information Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Registered</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatDate(profile.registeredDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Last Active</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatDate(profile.lastActive)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {profile.verified !== undefined && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {profile.verified ? (
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                            ) : (
                              <ShieldAlert className="w-4 h-4 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Verification</p>
                            <p className="text-sm font-semibold text-gray-700">
                              {profile.verified ? "Verified" : "Unverified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileView;