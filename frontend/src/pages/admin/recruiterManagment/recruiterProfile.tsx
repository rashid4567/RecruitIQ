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
} from "lucide-react";
import { adminRecruiterService } from "../../../services/admin/admin.recruiter.service";
import type {
  RecruiterProfile,
  VerificationStatus,
  SubscriptionStatus,
} from "../../../types/admin/recruiter.types";
import type { JSX } from "react/jsx-runtime";


interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success";
  loading?: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    success: "bg-green-600 hover:bg-green-700",
  };

  const iconClasses = {
    danger: "text-red-600",
    warning: "text-yellow-600",
    success: "text-green-600",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                  variant === "danger"
                    ? "bg-red-100"
                    : variant === "warning"
                    ? "bg-yellow-100"
                    : "bg-green-100"
                } sm:mx-0 sm:h-10 sm:w-10`}
              >
                <ShieldAlert className={`h-6 w-6 ${iconClasses[variant]}`} />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              disabled={loading}
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto`}
              onClick={onConfirm}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {confirmText}
            </button>
            <button
              type="button"
              disabled={loading}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    } catch (err: any) {
      console.error("Failed to load recruiter profile:", err);
      setError(
        err.response?.data?.message || "Failed to load recruiter profile"
      );
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
    } catch (err: any) {
      console.error("Failed to update verification status:", err);
      setError(
        err.response?.data?.message || "Failed to update verification status"
      );
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
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!recruiter) return;

    try {
      setUpdating(true);
      // Note: The service doesn't have a delete method, you might need to add it
      console.log("Delete functionality not implemented yet");
      setShowDeleteModal(false);
      // Navigate back after deletion
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
      free: "bg-gray-100 text-gray-800 border border-gray-300",
      active:
        "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200",
      expired: "bg-gray-100 text-gray-800 border border-gray-300",
    };
    return map[status] || "bg-gray-100 text-gray-800 border border-gray-300";
  };

  const getVerificationColor = (status: VerificationStatus) => {
    const map: Record<VerificationStatus, string> = {
      pending: "bg-yellow-50 text-yellow-800 border border-yellow-200",
      verified: "bg-green-50 text-green-800 border border-green-200",
      rejected: "bg-red-50 text-red-800 border border-red-200",
    };
    return map[status] || "bg-gray-100 text-gray-800 border border-gray-300";
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
      ? "bg-blue-50 text-blue-800 border border-blue-200"
      : "bg-gray-100 text-gray-800 border border-gray-300";
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-20 rounded-full"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">
            Loading recruiter profile...
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            Fetching details from the database
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !recruiter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="relative">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 blur-xl opacity-20 rounded-full"></div>
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">
            Profile Not Found
          </h3>
          <p className="mt-2 text-gray-600">
            {error ||
              "The recruiter profile you're looking for doesn't exist or has been removed."}
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-200 font-medium shadow-sm hover:shadow"
            >
              Go Back
            </button>
            <button
              onClick={loadRecruiterProfile}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4" />
                Retry
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      label: "Jobs Posted",
      value: recruiter.quickStats.jobsPosted.toString(),
      icon: "📋",
      description: "Active job listings",
    },
    {
      label: "Interviews Scheduled",
      value: recruiter.quickStats.interviewsScheduled.toString(),
      icon: "📅",
      description: "This month",
    },
    {
      label: "Candidates Contacted",
      value: recruiter.quickStats.candidatesContacted.toString(),
      icon: "👥",
      description: "Total outreach",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <span className="text-sm text-gray-500">Recruiters /</span>
                <span className="text-lg font-semibold text-gray-900 ml-2">
                  {recruiter.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={recruiter.profileImage || "/placeholder.svg"}
                    alt={recruiter.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      recruiter.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowVerificationMenu(!showVerificationMenu)
                    }
                    className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:shadow ${getVerificationColor(
                      recruiter.verificationStatus
                    )}`}
                  >
                    {getVerificationIcon(recruiter.verificationStatus)}
                    {getVerificationStatusText(recruiter.verificationStatus)}
                  </button>

                  {/* Verification Status Dropdown */}
                  {showVerificationMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[200px] overflow-hidden">
                      <div className="py-1">
                        <button
                          onClick={() => openVerificationModal("pending")}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                            recruiter.verificationStatus === "pending"
                              ? "bg-yellow-50"
                              : ""
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${
                              recruiter.verificationStatus === "pending"
                                ? "bg-yellow-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Clock className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Mark as Pending</span>
                            <span className="text-xs text-gray-500">
                              Requires review
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => openVerificationModal("verified")}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                            recruiter.verificationStatus === "verified"
                              ? "bg-green-50"
                              : ""
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${
                              recruiter.verificationStatus === "verified"
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              Verify Recruiter
                            </span>
                            <span className="text-xs text-gray-500">
                              Approve verification
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => openVerificationModal("rejected")}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                            recruiter.verificationStatus === "rejected"
                              ? "bg-red-50"
                              : ""
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${
                              recruiter.verificationStatus === "rejected"
                                ? "bg-red-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              Reject Verification
                            </span>
                            <span className="text-xs text-gray-500">
                              Deny verification
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`mailto:${recruiter.email}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm group"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="hidden md:inline">{recruiter.email}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                    recruiter.isActive
                  )}`}
                >
                  {recruiter.isActive ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      {getStatusText(recruiter.isActive)}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      {getStatusText(recruiter.isActive)}
                    </div>
                  )}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStatusModal(true)}
                  disabled={updating}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow ${
                    recruiter.isActive
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  }`}
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : recruiter.isActive ? (
                    <>
                      <UserX className="h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={updating}
                  className="p-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete recruiter"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-3 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <img
                      src={recruiter.profileImage || "/placeholder.svg"}
                      alt={recruiter.name}
                      className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 ring-white shadow-lg"
                    />
                    <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <UserCheck className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {recruiter.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{recruiter.role}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {recruiter.company || "No company specified"}
                  </p>

                  {/* Rating if available */}
                  {recruiter.rating !== undefined && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-full border border-amber-200">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(recruiter.rating!)
                                ? "text-amber-400 fill-current"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">
                        {recruiter.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({recruiter.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t border-gray-200 pt-6">
                  {recruiter.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-500">{recruiter.location}</p>
                      </div>
                    </div>
                  )}
                  {recruiter.timezone && (
                    <div className="flex items-center gap-3 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <ClockIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Timezone</p>
                        <p className="text-gray-500">{recruiter.timezone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Joined Date</p>
                      <p className="text-gray-500">{recruiter.joinedDate}</p>
                    </div>
                  </div>
                  {recruiter.lastActive && (
                    <div className="flex items-center gap-3 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                      <div>
                        <p className="font-medium">Last Active</p>
                        <p className="text-gray-500">{recruiter.lastActive}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>Social Links</span>
                    <span className="text-xs text-gray-500">• Connect</span>
                  </h3>
                  <div className="flex gap-2">
                    {[
                      {
                        icon: Linkedin,
                        label: "LinkedIn",
                        color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
                      },
                      {
                        icon: Twitter,
                        label: "Twitter",
                        color: "bg-sky-50 text-sky-600 hover:bg-sky-100",
                      },
                      {
                        icon: Globe,
                        label: "Website",
                        color: "bg-gray-50 text-gray-600 hover:bg-gray-100",
                      },
                    ].map((social, i) => (
                      <a
                        key={i}
                        href="#"
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${social.color} hover:scale-105`}
                        title={social.label}
                      >
                        <social.icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <span>Performance Metrics</span>
                    <span className="text-xs text-gray-500">
                      • Last 30 days
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {quickStats.map((stat, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{stat.icon}</span>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">
                                {stat.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {stat.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-gray-900">
                            {stat.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-6 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-6">
                  <div className="flex gap-8">
                    {[
                      "Overview",
                      "Jobs",
                      "Candidates",
                      "Activity",
                      "Notes",
                    ].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`pb-4 font-medium text-sm transition-all duration-200 relative ${
                          activeTab === tab.toLowerCase()
                            ? "text-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab}
                        {activeTab === tab.toLowerCase() && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                  <div className="p-6 space-y-8">
                    {/* Bio/Summary */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>Professional Summary</span>
                        <span className="text-xs text-gray-500 font-normal">
                          • Biography
                        </span>
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {recruiter.bio ||
                            "No professional biography provided. This recruiter hasn't added a summary about their background and expertise."}
                        </p>
                      </div>
                    </div>

                    {/* Work History */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>Career Timeline</span>
                        <span className="text-xs text-gray-500 font-normal">
                          • Work History
                        </span>
                      </h3>
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200"></div>
                        <div className="space-y-6 pl-8">
                          <div className="relative">
                            <div className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white"></div>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                              <h4 className="font-bold text-gray-900 text-sm">
                                {recruiter.role}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {recruiter.company || "Current Company"}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                  Current
                                </span>
                                <span className="text-xs text-gray-500">
                                  • Full-time
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Skills */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>Core Competencies</span>
                        <span className="text-xs text-gray-500 font-normal">
                          • Top Skills
                        </span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Technical Sourcing",
                          "Candidate Screening",
                          "Interviewing",
                          "ATS Management",
                          "Talent Strategy",
                          "Employer Branding",
                        ].map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-gradient-to-r from-gray-50 to-white text-gray-700 rounded-lg text-sm border border-gray-200 hover:border-blue-300 transition-colors hover:shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== "overview" && (
                  <div className="p-12 text-center">
                    <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                      <div className="text-4xl mb-4">📊</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Coming Soon
                      </h3>
                      <p className="text-gray-600 max-w-sm">
                        The{" "}
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                        section is currently under development.
                      </p>
                      <button
                        onClick={() => setActiveTab("overview")}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow transition-all"
                      >
                        Back to Overview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-blue-600" />
                  <span>Admin Controls</span>
                </h3>

                {/* Verification Status */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>Verification Management</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getVerificationColor(
                        recruiter.verificationStatus
                      )}`}
                    >
                      {recruiter.verificationStatus.toUpperCase()}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => openVerificationModal("pending")}
                      className={`w-full px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-3 transition-all duration-200 ${
                        recruiter.verificationStatus === "pending"
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border-2 border-yellow-200 shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          recruiter.verificationStatus === "pending"
                            ? "bg-yellow-100"
                            : "bg-gray-200"
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Set as Pending</span>
                    </button>
                    <button
                      onClick={() => openVerificationModal("verified")}
                      className={`w-full px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-3 transition-all duration-200 ${
                        recruiter.verificationStatus === "verified"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          recruiter.verificationStatus === "verified"
                            ? "bg-green-100"
                            : "bg-gray-200"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Verify Account</span>
                    </button>
                    <button
                      onClick={() => openVerificationModal("rejected")}
                      className={`w-full px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-3 transition-all duration-200 ${
                        recruiter.verificationStatus === "rejected"
                          ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200 shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          recruiter.verificationStatus === "rejected"
                            ? "bg-red-100"
                            : "bg-gray-200"
                        }`}
                      >
                        <XCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Reject Verification</span>
                    </button>
                  </div>
                </div>

                {/* Subscription */}
                <div className="py-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Subscription Details
                  </h4>
                  <div
                    className={`px-4 py-3 rounded-lg ${getSubscriptionColor(
                      recruiter.subscription.plan
                    )} mb-3`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        {getSubscriptionDisplay(recruiter.subscription.plan)}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded">
                        {recruiter.subscription.plan === "active"
                          ? "💰 Paid"
                          : "🆓 Free"}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <span className="font-medium">
                        {recruiter.subscription.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Plan Type:</span>
                      <span className="font-medium capitalize">
                        {recruiter.subscription.plan}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </button>
                </div>

                {/* Interview Time */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <ClockIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Total Interview Time
                        </h4>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          4 hrs 30 min
                        </div>
                        <p className="text-xs text-gray-600">
                          Across all platforms this month
                        </p>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close verification dropdown */}
        {showVerificationMenu && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowVerificationMenu(false)}
          />
        )}
      </div>

      {/* Status Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusToggle}
        title={
          recruiter?.isActive ? "Deactivate Recruiter" : "Activate Recruiter"
        }
        description={
          recruiter?.isActive
            ? `Are you sure you want to deactivate ${recruiter?.name}? They will lose access to their account and won't be able to post new jobs.`
            : `Are you sure you want to activate ${recruiter?.name}? They will regain full access to their account.`
        }
        confirmText={recruiter?.isActive ? "Yes, Deactivate" : "Yes, Activate"}
        variant={recruiter?.isActive ? "danger" : "success"}
        loading={updating}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Recruiter Account"
        description={`This action cannot be undone. This will permanently delete ${recruiter?.name}'s account and all associated data including job postings and candidate information.`}
        confirmText="Delete Account"
        variant="danger"
        loading={updating}
      />

      {/* Verification Change Modal */}
      <ConfirmationModal
        isOpen={showVerificationModal.isOpen}
        onClose={() =>
          setShowVerificationModal({ isOpen: false, status: null })
        }
        onConfirm={() =>
          showVerificationModal.status &&
          handleVerificationChange(showVerificationModal.status)
        }
        title={
          showVerificationModal.status === "verified"
            ? "Verify Recruiter"
            : showVerificationModal.status === "rejected"
            ? "Reject Verification"
            : "Mark as Pending"
        }
        description={
          showVerificationModal.status === "verified"
            ? `Are you sure you want to verify ${recruiter?.name}? They will receive verification status and gain access to verified features.`
            : showVerificationModal.status === "rejected"
            ? `Are you sure you want to reject ${recruiter?.name}'s verification? They will need to re-apply for verification.`
            : `Are you sure you want to mark ${recruiter?.name}'s verification as pending? This will require manual review.`
        }
        confirmText={
          showVerificationModal.status === "verified"
            ? "Verify"
            : showVerificationModal.status === "rejected"
            ? "Reject"
            : "Mark as Pending"
        }
        variant={
          showVerificationModal.status === "verified"
            ? "success"
            : showVerificationModal.status === "rejected"
            ? "danger"
            : "warning"
        }
        loading={updating}
      />
    </>
  );
}
