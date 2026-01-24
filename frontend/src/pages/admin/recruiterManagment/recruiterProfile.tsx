"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Linkedin,
  Twitter,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  ShieldAlert,
  Mail,
  MapPin,
  Calendar,
  Clock as ClockIcon,
  ExternalLink,
  Download,
  Building,
  Briefcase,
  Users,
  FileText,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  Phone,
  Award,
  Target,
  TrendingUp,
  Zap,
  Eye,
  Edit,
} from "lucide-react";
import { adminRecruiterService } from "../../../services/admin/admin.recruiter.service";
import type {
  RecruiterProfile,
  VerificationStatus,
  SubscriptionStatus,
} from "../../../types/admin/recruiter.types";
import type { JSX } from "react/jsx-runtime";
import { getError } from "@/utils/getError";
import Sidebar from "../../../components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RecruiterProfilePage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [recruiter, setRecruiter] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showVerificationMenu, setShowVerificationMenu] = useState(false);

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState<{
    isOpen: boolean;
    status: VerificationStatus | null;
  }>({ isOpen: false, status: null });

  const recruiterId = params.id;

  useEffect(() => {
    if (recruiterId) {
      loadRecruiterProfile();
    } else {
      setError("Recruiter ID is missing");
      setLoading(false);
    }
  }, [recruiterId]);

  const loadRecruiterProfile = async () => {
    if (!recruiterId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await adminRecruiterService.getRecruiterProfile(recruiterId);
      setRecruiter(data);
    } catch (err: unknown) {
      console.error("Failed to load recruiter profile:", err);
      setError(getError(err || "Failed to load recruiter profile"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationChange = async (newStatus: VerificationStatus) => {
    if (!recruiter || updating) return;

    try {
      setUpdating(true);
      await adminRecruiterService.verifyRecruiter(recruiter.id, newStatus);

      setRecruiter({
        ...recruiter,
        verificationStatus: newStatus,
      });
      setShowVerificationMenu(false);
      setShowVerificationModal({ isOpen: false, status: null });
    } catch (err: unknown) {
      console.error("Failed to update verification status:", err);
      setError(getError(err || "Failed to update verification status"));
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!recruiter || updating) return;

    try {
      setUpdating(true);
      await adminRecruiterService.updateRecruiterStatus(
        recruiter.id,
        !recruiter.isActive
      );

      setRecruiter({
        ...recruiter,
        isActive: !recruiter.isActive,
      });
      setShowStatusModal(false);
    } catch (err: unknown) {
      console.error("Failed to update status:", err);
      setError(getError(err || "Failed to update status"));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!recruiter) return;

    try {
      setUpdating(true);
      console.log("Delete functionality not implemented yet");
      setShowDeleteModal(false);
      navigate("/admin/recruiters");
    } catch (err) {
      console.error("Failed to delete recruiter:", err);
    } finally {
      setUpdating(false);
    }
  };

  const openVerificationModal = (status: VerificationStatus) => {
    setShowVerificationModal({ isOpen: true, status });
  };

  // Format subscription status for display
  const getSubscriptionDisplay = (status: SubscriptionStatus) => {
    const map: Record<SubscriptionStatus, string> = {
      free: "FREE",
      active: "PREMIUM",
      expired: "EXPIRED",
    };
    return map[status] || status.toUpperCase();
  };

  const getSubscriptionColor = (status: SubscriptionStatus) => {
    const map: Record<SubscriptionStatus, string> = {
      free: "bg-gray-100 text-gray-700 border border-gray-200",
      active: "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200",
      expired: "bg-red-50 text-red-700 border border-red-200",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const getVerificationColor = (status: VerificationStatus) => {
    const map: Record<VerificationStatus, string> = {
      pending: "bg-amber-100 text-amber-800 border border-amber-200",
      verified: "bg-green-100 text-green-800 border border-green-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const getVerificationIcon = (status: VerificationStatus) => {
    const map: Record<VerificationStatus, JSX.Element> = {
      pending: <Clock className="h-4 w-4" />,
      verified: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };
    return map[status] || <Clock className="h-4 w-4" />;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };

  const getVerificationStatusText = (status: VerificationStatus) => {
    const map: Record<VerificationStatus, string> = {
      pending: "Pending Review",
      verified: "Verified",
      rejected: "Rejected",
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading recruiter profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recruiter) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-white border border-red-200 rounded-xl p-8 shadow-sm">
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 bg-red-100 rounded-xl">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h3>
                  <p className="text-gray-600 mb-6">
                    {error || "The recruiter profile doesn't exist or has been removed."}
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="gap-2"
                  >
                    <ArrowLeft size={18} />
                    Go Back
                  </Button>
                  <Button
                    onClick={loadRecruiterProfile}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      label: "Jobs Posted",
      value: String(recruiter.quickStats?.jobsPosted ?? 0),
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Interviews Scheduled",
      value: String(recruiter.quickStats?.interviewsScheduled ?? 0),
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Candidates Contacted",
      value: String(recruiter.quickStats?.candidatesContacted ?? 0),
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
  ];

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
                  onClick={() => navigate('/admin/recruiters')}
                  className="hover:text-gray-700 flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Recruiter Management</span>
                </button>
                <span>›</span>
                <span className="text-gray-900 font-medium">Profile View</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building className="w-8 h-8 text-indigo-600" />
                Recruiter Profile
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/admin/recruiters')}
              >
                <ArrowLeft size={18} />
                Back to List
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={loadRecruiterProfile}
              >
                <Zap size={18} />
                Refresh
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                onClick={() => {/* Download data */}}
              >
                <Download size={18} />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={recruiter.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recruiter.name}`}
                  alt={recruiter.name}
                  className="w-24 h-24 rounded-xl border-4 border-white shadow-lg"
                />
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                  recruiter.isActive ? "bg-green-500" : "bg-red-500"
                }`}>
                  {recruiter.isActive ? (
                    <CheckCircle className="w-3 h-3 text-white" />
                  ) : (
                    <XCircle className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{recruiter.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-600">{recruiter.role}</span>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getVerificationColor(recruiter.verificationStatus)}`}>
                        {getVerificationIcon(recruiter.verificationStatus)}
                        {getVerificationStatusText(recruiter.verificationStatus)}
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(recruiter.isActive)}`}>
                        <div className={`w-2 h-2 rounded-full ${recruiter.isActive ? "bg-green-500" : "bg-red-500"}`} />
                        {getStatusText(recruiter.isActive)}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{recruiter.email}</span>
                        </div>
                        {recruiter.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{recruiter.phone}</span>
                          </div>
                        )}
                      </div>
                      {recruiter.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{recruiter.location}</span>
                        </div>
                      )}
                      {recruiter.company && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="w-4 h-4" />
                          <span>{recruiter.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="gap-2">
                      <Edit size={18} />
                      Edit
                    </Button>
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={() => setShowStatusModal(true)}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : recruiter.isActive ? (
                        <>
                          <UserX size={18} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck size={18} />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="destructive"
                      className="gap-2"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 size={18} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats & Info */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {quickStats.map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                              <p className="text-xs text-gray-500">Last 30 days</p>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <a href="#" className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Linkedin size={18} />
                        LinkedIn
                      </Button>
                    </a>
                    <a href="#" className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Twitter size={18} />
                        Twitter
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className={`rounded-lg p-4 ${getSubscriptionColor(recruiter.subscription?.plan ?? "free")}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold">{getSubscriptionDisplay(recruiter.subscription?.plan ?? "free")}</span>
                      <Badge variant={recruiter.subscription?.plan === "active" ? "default" : "secondary"}>
                        {recruiter.subscription?.plan === "active" ? "Paid" : "Free"}
                      </Badge>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium capitalize">{recruiter.subscription?.status ?? "free"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium capitalize">{recruiter.subscription?.plan ?? "free"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    {["Overview", "Jobs", "Candidates", "Activity"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === tab.toLowerCase()
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Bio/Summary */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Professional Summary</h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-600 leading-relaxed">
                            {recruiter.bio || "No professional biography provided."}
                          </p>
                        </div>
                      </div>

                      {/* Career Timeline */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Career Timeline</h3>
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-4">
                            <div className="relative pl-10">
                              <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white"></div>
                              <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-bold text-gray-900">{recruiter.role}</h4>
                                <p className="text-sm text-gray-600 mt-1">{recruiter.company || "Current Company"}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Current
                                  </Badge>
                                  <span className="text-xs text-gray-500">• Full-time</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Core Competencies</h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Technical Sourcing",
                            "Candidate Screening",
                            "Interviewing",
                            "ATS Management",
                            "Talent Strategy",
                            "Employer Branding",
                          ].map((skill, i) => (
                            <Badge key={i} variant="secondary" className="px-3 py-2">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab !== "overview" && (
                    <div className="text-center py-12">
                      <div className="inline-block p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                        <p className="text-gray-600 mb-4">
                          The {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section is under development.
                        </p>
                        <Button onClick={() => setActiveTab("overview")} variant="outline">
                          Back to Overview
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      <AlertDialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {recruiter?.isActive ? "Deactivate Recruiter" : "Activate Recruiter"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {recruiter?.isActive
                ? `Are you sure you want to deactivate ${recruiter?.name}? They will lose access to their account.`
                : `Are you sure you want to activate ${recruiter?.name}? They will regain full access to their account.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusToggle}
              disabled={updating}
              className={recruiter?.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {updating ? "Processing..." : recruiter?.isActive ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recruiter Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {recruiter?.name}'s account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={updating}
              className="bg-red-600 hover:bg-red-700"
            >
              {updating ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Verification Modal */}
      {showVerificationModal.isOpen && (
        <AlertDialog open={showVerificationModal.isOpen} onOpenChange={() => setShowVerificationModal({ isOpen: false, status: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {showVerificationModal.status === "verified"
                  ? "Verify Recruiter"
                  : showVerificationModal.status === "rejected"
                  ? "Reject Verification"
                  : "Mark as Pending"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {showVerificationModal.status === "verified"
                  ? `Are you sure you want to verify ${recruiter?.name}?`
                  : showVerificationModal.status === "rejected"
                  ? `Are you sure you want to reject ${recruiter?.name}'s verification?`
                  : `Are you sure you want to mark ${recruiter?.name}'s verification as pending?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => showVerificationModal.status && handleVerificationChange(showVerificationModal.status)}
                disabled={updating}
                className={
                  showVerificationModal.status === "verified"
                    ? "bg-green-600 hover:bg-green-700"
                    : showVerificationModal.status === "rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }
              >
                {updating ? "Processing..." : showVerificationModal.status === "verified" ? "Verify" : showVerificationModal.status === "rejected" ? "Reject" : "Mark as Pending"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}