import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  Download,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Users,
  RefreshCw,
  ShieldCheck,
  Clock,
  XCircle,
  Ban,
  Shield,
  AlertCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Recruiter } from "../../domain/entities/recruiter.entity";
import { getRecruiterListUC, rejectRecruiterUC, verifyRecruiterUC } from "../di/recruiter.di";
import { blockUserUC, unblockUserUC } from "../di/user.di";

type FilterTab = "all" | "pending" | "verified" | "blocked";

export default function RecruiterManagement() {
  const navigate = useNavigate();

  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [tab, setTab] = useState<FilterTab>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [confirm, setConfirm] = useState<{
    open: boolean;
    recruiter: Recruiter | null;
    action: "verify" | "reject" | "block" | "unblock" | null;
  }>({ open: false, recruiter: null, action: null });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ─── Fetch Recruiters ─────────────────────────────────────────────────────
  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    try {
      const query: any = { page, limit };
      if (debouncedSearch) query.search = debouncedSearch;
      if (tab !== "all") {
        if (tab === "pending") query.verificationStatus = "pending";
        if (tab === "verified") query.verificationStatus = "verified";
        if (tab === "blocked") query.isActive = false;
      }

      const res = await getRecruiterListUC.execute(query);
      setRecruiters(res.recruiters ?? []);
      setTotal(res.total ?? 0);
    } catch {
      toast.error("Failed to load recruiters");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, tab]);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  // ─── Confirmation Flow ────────────────────────────────────────────────────
  const requestAction = (recruiter: Recruiter, action: typeof confirm.action) => {
    setConfirm({ open: true, recruiter, action });
  };

  const handleConfirmed = async () => {
    if (!confirm.recruiter || !confirm.action) return;

    const { id } = confirm.recruiter;
    const name = confirm.recruiter.companyName || confirm.recruiter.name || "Recruiter";
    setActionLoading(id);

    try {
      switch (confirm.action) {
        case "verify":
          await verifyRecruiterUC.execute(id);
          toast.success(`${name} has been verified`);
          break;
        case "reject":
          await rejectRecruiterUC.execute(id);
          toast.success(`${name} has been rejected`);
          break;
        case "block":
          await blockUserUC.execute(id);
          toast.success(`${name} has been blocked`);
          break;
        case "unblock":
          await unblockUserUC.execute(id);
          toast.success(`${name} has been unblocked`);
          break;
      }
      await fetchRecruiters();
    } catch (err: any) {
      toast.error(err?.message || "Action failed");
    } finally {
      setActionLoading(null);
      setConfirm({ open: false, recruiter: null, action: null });
    }
  };

  // ─── Badge & Initials Helpers ─────────────────────────────────────────────
  const getVerificationBadge = (status?: string) => {
    const s = (status || "").toLowerCase();

    if (s === "verified")
      return {
        label: "Verified",
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-300",
      };
    if (s === "pending")
      return {
        label: "Pending Approval",
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-300",
      };
    if (s === "rejected")
      return {
        label: "Rejected",
        bg: "bg-rose-100",
        text: "text-rose-800",
        border: "border-rose-300",
      };
    return {
      label: "Unknown",
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-300",
    };
  };

  const getInitials = (str = "") =>
    str
      .split(" ")
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "?";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-5 sm:px-8 py-4 shadow-md">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-full shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Recruiter Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-gray-300 hover:bg-gray-100 shadow-sm"
                onClick={fetchRecruiters}
                disabled={loading}
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 sticky top-[60px] sm:top-[72px] z-20 px-5 sm:px-8 py-4 shadow-md">
          <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex flex-wrap gap-2">
              {["All", "Pending Approval", "Verified", "Blocked"].map((label) => {
                const value = label.toLowerCase().replace(" approval", "").replace(" ", "") as FilterTab;
                return (
                  <Button
                    key={label}
                    variant={tab === value ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 sm:h-10 px-4 sm:px-5 text-sm font-medium shadow-md transition-all duration-200",
                      tab === value
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => {
                      setTab(value);
                      setPage(1);
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
              <Input
                placeholder="Search recruiters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 sm:h-11 pl-11 pr-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 shadow-md rounded-full"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-5 sm:p-8 bg-gray-100">
          <Card className="border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50 px-6 py-5 border-b">
              <CardTitle className="text-xl font-bold text-gray-900">
                Recruiters
              </CardTitle>
            </CardHeader>

            {loading ? (
              <div className="py-24 flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            ) : recruiters.length === 0 ? (
              <div className="py-24 text-center text-gray-600">
                <AlertCircle className="mx-auto h-14 w-14 mb-4 opacity-80" />
                <p className="text-lg font-medium">No recruiters found matching your criteria.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">Recruiter Profile</th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">Verification Status</th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">Subscription</th>
                        <th className="px-6 py-4 text-center font-medium text-gray-700">Jobs Posted</th>
                        <th className="px-6 py-4 text-center font-medium text-gray-700">Account Status</th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">Joined Date</th>
                        <th className="px-6 py-4 text-right font-medium text-gray-700 pr-10">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recruiters.map((r) => {
                        const badge = getVerificationBadge(r.verificationStatus);
                        const isActive = r.isActive ?? true;
                        const isLoading = actionLoading === r.id;

                        return (
                          <tr key={r.id} className="hover:bg-blue-50 transition-colors duration-200">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11 ring-2 ring-gray-200">
                                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-base">
                                    {getInitials(r.companyName || r.name || "")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium text-gray-900 truncate text-base">
                                    {r.companyName || r.name}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate mt-0.5">{r.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <Badge
                                className={cn(
                                  "px-3 py-1.5 text-xs font-medium border shadow-md",
                                  badge.bg,
                                  badge.text,
                                  badge.border
                                )}
                              >
                                {badge.label}
                              </Badge>
                            </td>

                            <td className="px-6 py-5">
                              <Badge variant="outline" className="px-3 py-1.5 text-xs font-medium border-gray-300 bg-white shadow-sm">
                                {r.subscriptionStatus
                                  ? r.subscriptionStatus.charAt(0).toUpperCase() + r.subscriptionStatus.slice(1)
                                  : "—"}
                              </Badge>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <div className="inline-flex items-center gap-3">
                                <div className="w-28 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-md">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                    style={{ width: `${Math.min(100, (r.jobPostsUsed || 0) * 5)}%` }}
                                  />
                                </div>
                                <span className="font-medium text-gray-800">{r.jobPostsUsed || 0}</span>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <Switch
                                checked={isActive}
                                onCheckedChange={() => requestAction(r, isActive ? "block" : "unblock")}
                                disabled={isLoading}
                                className={cn(
                                  "data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-rose-600 shadow-md",
                                  isLoading && "opacity-70 cursor-not-allowed"
                                )}
                              />
                            </td>

                            <td className="px-6 py-5 text-gray-600 text-sm">
                              {r.joinedDate
                                ? new Date(r.joinedDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>

                            <td className="px-6 py-5 text-right pr-10">
                              <div className="flex items-center justify-end gap-2">
                                {/* View Button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                                  onClick={() => navigate(`/admin/recruiters/${r.id}`)}
                                >
                                  <Eye className="h-4.5 w-4.5 text-gray-600" />
                                </Button>

                                {/* Pending: Verify + Reject Buttons */}
                                {r.verificationStatus === "pending" && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-9 border-emerald-300 hover:bg-emerald-100 text-emerald-700 shadow-sm"
                                      onClick={() => requestAction(r, "verify")}
                                      disabled={isLoading}
                                    >
                                      <ShieldCheck className="mr-1.5 h-4 w-4" />
                                      Verify
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-9 border-rose-300 hover:bg-rose-100 text-rose-700 shadow-sm"
                                      onClick={() => requestAction(r, "reject")}
                                      disabled={isLoading}
                                    >
                                      <XCircle className="mr-1.5 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>
                                )}

                                {/* Dropdown with Extra Actions */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                      <MoreVertical className="h-4.5 w-4.5 text-gray-600" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl bg-white border border-gray-200">
                                    {r.verificationStatus === "pending" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => requestAction(r, "verify")}
                                          disabled={isLoading}
                                          className="text-emerald-700 hover:bg-emerald-50 rounded-lg py-2.5 px-4 font-medium"
                                        >
                                          <ShieldCheck className="mr-2.5 h-4.5 w-4.5" />
                                          Verify Recruiter
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => requestAction(r, "reject")}
                                          disabled={isLoading}
                                          className="text-rose-700 hover:bg-rose-50 rounded-lg py-2.5 px-4 font-medium"
                                        >
                                          <XCircle className="mr-2.5 h-4.5 w-4.5" />
                                          Reject Recruiter
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1" />
                                      </>
                                    )}
                                    {isActive ? (
                                      <DropdownMenuItem
                                        onClick={() => requestAction(r, "block")}
                                        disabled={isLoading}
                                        className="text-rose-700 hover:bg-rose-50 rounded-lg py-2.5 px-4 font-medium"
                                      >
                                        <Ban className="mr-2.5 h-4.5 w-4.5" />
                                        Block Recruiter
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() => requestAction(r, "unblock")}
                                        disabled={isLoading}
                                        className="text-emerald-700 hover:bg-emerald-50 rounded-lg py-2.5 px-4 font-medium"
                                      >
                                        <Shield className="mr-2.5 h-4.5 w-4.5" />
                                        Unblock Recruiter
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-5 px-4 py-6">
                  {recruiters.map((r) => {
                    const badge = getVerificationBadge(r.verificationStatus);
                    const isActive = r.isActive ?? true;
                    const isLoading = actionLoading === r.id;

                    return (
                      <Card
                        key={r.id}
                        className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden"
                      >
                        <CardContent className="p-5 sm:p-6">
                          {/* Profile */}
                          <div className="flex items-start gap-4 mb-5">
                            <Avatar className="h-14 w-14 ring-2 ring-gray-200">
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                                {getInitials(r.companyName || r.name || "")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 text-lg truncate">
                                {r.companyName || r.name}
                              </div>
                              <div className="text-sm text-gray-600 truncate mt-1">{r.email}</div>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm mb-6">
                            <div>
                              <div className="text-gray-500 text-xs mb-1.5">Verification</div>
                              <Badge
                                className={cn(
                                  "px-3 py-1 text-xs font-medium border shadow-md",
                                  badge.bg,
                                  badge.text,
                                  badge.border
                                )}
                              >
                                {badge.label}
                              </Badge>
                            </div>

                            <div>
                              <div className="text-gray-500 text-xs mb-1.5">Subscription</div>
                              <Badge variant="outline" className="px-3 py-1 text-xs shadow-sm">
                                {r.subscriptionStatus || "—"}
                              </Badge>
                            </div>

                            <div>
                              <div className="text-gray-500 text-xs mb-1.5">Jobs Posted</div>
                              <div className="font-medium text-gray-800">{r.jobPostsUsed || 0}</div>
                            </div>

                            <div>
                              <div className="text-gray-500 text-xs mb-1.5">Joined</div>
                              <div className="font-medium text-gray-800">
                                {r.joinedDate
                                  ? new Date(r.joinedDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "—"}
                              </div>
                            </div>
                          </div>

                          {/* Actions & Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-gray-200">
                            <div className="flex items-center gap-3.5">
                              <Switch
                                checked={isActive}
                                onCheckedChange={() => requestAction(r, isActive ? "block" : "unblock")}
                                disabled={isLoading}
                                className={cn(
                                  "data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-rose-600 shadow-md",
                                  isLoading && "opacity-70 cursor-not-allowed"
                                )}
                              />
                              <span className={cn("text-sm font-medium", isActive ? "text-emerald-700" : "text-rose-700")}>
                                {isActive ? "Active" : "Blocked"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* View */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 border-gray-300 hover:bg-gray-100 shadow-sm"
                                onClick={() => navigate(`/admin/recruiters/${r.id}`)}
                              >
                                <Eye className="mr-1.5 h-4 w-4" />
                                View
                              </Button>

                              {/* Pending: Verify & Reject */}
                              {r.verificationStatus === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 border-emerald-300 hover:bg-emerald-100 text-emerald-700 shadow-sm"
                                    onClick={() => requestAction(r, "verify")}
                                    disabled={isLoading}
                                  >
                                    <ShieldCheck className="mr-1.5 h-4 w-4" />
                                    Verify
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 border-rose-300 hover:bg-rose-100 text-rose-700 shadow-sm"
                                    onClick={() => requestAction(r, "reject")}
                                    disabled={isLoading}
                                  >
                                    <XCircle className="mr-1.5 h-4 w-4" />
                                    Reject
                                  </Button>
                                </div>
                              )}

                              {/* Block/Unblock */}
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "h-10 shadow-sm",
                                  isActive
                                    ? "border-rose-300 hover:bg-rose-100 text-rose-700"
                                    : "border-emerald-300 hover:bg-emerald-100 text-emerald-700"
                                )}
                                onClick={() => requestAction(r, isActive ? "block" : "unblock")}
                                disabled={isLoading}
                              >
                                {isActive ? (
                                  <>
                                    <Ban className="mr-1.5 h-4 w-4" />
                                    Block
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-1.5 h-4 w-4" />
                                    Unblock
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {total > limit && (
                  <div className="px-5 sm:px-8 py-6 border-t bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600 shadow-md">
                    <div className="text-center sm:text-left font-medium">
                      Showing {(page - 1) * limit + 1} – {Math.min(page * limit, total)} of {total}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-gray-300 hover:bg-gray-100 shadow-sm"
                        disabled={page === 1}
                        onClick={() => setPage(1)}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-gray-300 hover:bg-gray-100 shadow-sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="px-4 py-2 bg-white rounded-full border border-gray-300 font-medium shadow-md">
                        Page {page} of {Math.ceil(total / limit)}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-gray-300 hover:bg-gray-100 shadow-sm"
                        disabled={page * limit >= total}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-gray-300 hover:bg-gray-100 shadow-sm"
                        disabled={page * limit >= total}
                        onClick={() => setPage(Math.ceil(total / limit))}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </main>

        {/* ─── Improved Confirmation Modal ─────────────────────────────────────── */}
        <AlertDialog open={confirm.open} onOpenChange={(open) => !open && setConfirm({ ...confirm, open: false })}>
          <AlertDialogContent className="max-w-md sm:max-w-lg rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white">
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 px-8 pt-10 pb-8">
              <AlertDialogHeader>
                <div
                  className={cn(
                    "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full shadow-xl ring-2 ring-white",
                    confirm.action === "verify" && "bg-emerald-100",
                    confirm.action === "reject" && "bg-rose-100",
                    confirm.action === "block" && "bg-rose-100",
                    confirm.action === "unblock" && "bg-emerald-100"
                  )}
                >
                  {confirm.action === "verify" && <ShieldCheck className="h-8 w-8 text-emerald-700" />}
                  {confirm.action === "reject" && <XCircle className="h-8 w-8 text-rose-700" />}
                  {confirm.action === "block" && <Ban className="h-8 w-8 text-rose-700" />}
                  {confirm.action === "unblock" && <Shield className="h-8 w-8 text-emerald-700" />}
                </div>

                <AlertDialogTitle className="text-2xl font-bold text-center text-gray-900">
                  {confirm.action === "verify" ? "Verify Recruiter?" :
                   confirm.action === "reject" ? "Reject Recruiter?" :
                   confirm.action === "block" ? "Block Recruiter?" :
                   "Unblock Recruiter?"}
                </AlertDialogTitle>

                <AlertDialogDescription className="text-center text-base text-gray-600 mt-3 leading-relaxed">
                  Are you absolutely sure you want to{" "}
                  <span className="font-semibold text-gray-900 capitalize">{confirm.action}</span>{" "}
                  <span className="font-bold text-blue-700">
                    {confirm.recruiter?.companyName || confirm.recruiter?.name || "this recruiter"}
                  </span>
                  ? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-end">
                <AlertDialogCancel className="h-11 sm:h-12 px-8 rounded-full border-gray-300 hover:bg-gray-100 font-medium text-base shadow-md">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmed}
                  disabled={!!actionLoading}
                  className={cn(
                    "h-11 sm:h-12 px-8 rounded-full font-semibold shadow-md hover:shadow-xl transition-all duration-200 text-base min-w-[140px]",
                    confirm.action === "verify" && "bg-emerald-600 hover:bg-emerald-700 text-white",
                    confirm.action === "reject" && "bg-rose-600 hover:bg-rose-700 text-white",
                    confirm.action === "block" && "bg-rose-600 hover:bg-rose-700 text-white",
                    confirm.action === "unblock" && "bg-emerald-600 hover:bg-emerald-700 text-white"
                  )}
                >
                  {actionLoading && <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />}
                  {confirm.action === "verify" ? "Verify" :
                   confirm.action === "reject" ? "Reject" :
                   confirm.action === "block" ? "Block" : "Unblock"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}