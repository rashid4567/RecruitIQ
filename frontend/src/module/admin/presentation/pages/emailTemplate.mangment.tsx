"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Plus,
  Search,
  Eye,
  Edit,
  Copy,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Loader2,
  X,
  ToggleLeft,
  ToggleRight,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

import type { EmailTemplate } from "@/module/admin/domain/entities/email-template.entity";
import {
  GetEmailTemplateUC,
  DeleteEmailTemplateUC,
  ToggleEmailTempleteUC,
  sendTestEmailUC,
} from "../di/email-template.di";

import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "All Templates", icon: Mail, value: "all" },
  { label: "Application Status", icon: Send, value: "application_status" },
  { label: "Interview Related", icon: Send, value: "interview_related" },
  { label: "Account Related", icon: Send, value: "account_related" },
  { label: "Subscription Related", icon: Send, value: "subscription_related" },
];

export default function EmailTemplateManagement() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleTemplate, setToggleTemplate] = useState<EmailTemplate | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetEmailTemplateUC.execute();
      setTemplates(data ?? []);
      setPagination(p => ({ ...p, page: 1, total: data?.length ?? 0 }));
    } catch (err: any) {
      const msg = err?.message || "Failed to load email templates";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filteredTemplates = templates.filter((t) => {
    const nameMatch = t.getName().toLowerCase().includes(search.toLowerCase());
    const categoryMatch =
      activeCategory === "all" ||
      t.getEvent().toLowerCase().includes(activeCategory.toLowerCase());
    return nameMatch && categoryMatch;
  });

  const paginated = filteredTemplates.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const totalPages = Math.ceil(filteredTemplates.length / pagination.limit);

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination(p => ({ ...p, page: newPage }));
  };

  const confirmDelete = (id: string) => setDeleteId(id);
  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await DeleteEmailTemplateUC.execute(deleteId);
      toast.success("Template deleted");
      fetchTemplates();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const confirmToggle = (template: EmailTemplate) => setToggleTemplate(template);
  const executeToggle = async () => {
    if (!toggleTemplate) return;
    try {
      await ToggleEmailTempleteUC.execute(toggleTemplate.getId(), !toggleTemplate.isActive());
      toast.success(`Template ${toggleTemplate.isActive() ? "deactivated" : "activated"}`);
      fetchTemplates();
    } catch {
      toast.error("Status update failed");
    } finally {
      setToggleTemplate(null);
    }
  };

  const handleTestEmail = (template: EmailTemplate) => {
    const email = prompt("Test recipient email:", "test@example.com");
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    toast.promise(
      sendTestEmailUC.execute(template.getId(), email),
      {
        loading: "Sending test email...",
        success: "Test email sent!",
        error: "Failed to send test email",
      }
    );
  };

  const getEventDisplay = (event: string) =>
    event
      .replace(/_/g, " → ")
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const SkeletonCard = () => (
    <Card className="border-slate-200/70 shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
        </div>
        <div className="h-5 w-32 bg-slate-200 rounded-full animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-9 w-9 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/70 sticky top-0 z-40 px-6 py-4 shadow-sm">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Email Templates</h1>
                <p className="text-sm text-slate-500">Manage notification & automation email content</p>
              </div>
            </div>

            <Button
              size="sm"
              className="h-9 bg-indigo-600 hover:bg-indigo-700 gap-1.5 shadow-sm"
              onClick={() => navigate("/admin/email-templates/create")}
            >
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">

            {error && (
              <Card className="border-rose-200/70 bg-rose-50/40">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
                  <p className="text-rose-800 font-medium">{error}</p>
                  <Button
                    size="sm"
                    className="mt-4 bg-rose-600 hover:bg-rose-700"
                    onClick={fetchTemplates}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {!error && (
              <div className="grid lg:grid-cols-12 gap-7">

                {/* Categories */}
                <div className="lg:col-span-3">
                  <Card className="border-slate-200/70 shadow-sm sticky top-20">
                    <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-1">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => {
                              setActiveCategory(cat.value);
                              setPagination(p => ({ ...p, page: 1 }));
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                              activeCategory === cat.value
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-700"
                            )}
                          >
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main area */}
                <div className="lg:col-span-9 space-y-6">

                  {/* Search + controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                      <Input
                        placeholder="Search template name or subject..."
                        value={search}
                        onChange={e => {
                          setSearch(e.target.value);
                          setPagination(p => ({ ...p, page: 1 }));
                        }}
                        className="h-10 pl-10 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 rounded-lg"
                      />
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span>Show:</span>
                      <select
                        value={pagination.limit}
                        onChange={e => setPagination(p => ({ ...p, limit: Number(e.target.value), page: 1 }))}
                        className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                      >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={18}>18</option>
                      </select>
                    </div>
                  </div>

                  {/* Grid */}
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  ) : paginated.length === 0 ? (
                    <Card className="py-16 text-center border-dashed border-slate-300">
                      <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Mail className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">No templates found</h3>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Try changing category, clearing search, or create a new template.
                      </p>
                      <Button
                        className="mt-6 bg-indigo-600 hover:bg-indigo-700 gap-2"
                        onClick={() => navigate("/admin/email-templates/create")}
                      >
                        <Plus className="h-4 w-4" />
                        Create Template
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginated.map((template) => {
                        const isActive = template.isActive();
                        return (
                          <Card
                            key={template.getId()}
                            className="border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
                          >
                            <CardContent className="p-6 space-y-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-slate-900 truncate text-lg leading-tight">
                                    {template.getName()}
                                  </h3>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {new Date(template.getCreatedAt()).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                                <Badge
                                  className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-full",
                                    isActive
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                      : "bg-amber-100 text-amber-800 border-amber-200"
                                  )}
                                >
                                  {isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>

                              <Badge variant="secondary" className="px-3 py-1 text-xs bg-slate-100/80 border border-slate-200 rounded-full">
                                {getEventDisplay(template.getEvent())}
                              </Badge>

                              <p className="text-sm text-slate-600 line-clamp-3 min-h-[4.5rem]">
                                {template.getSubject()}
                              </p>

                              <div className="flex justify-end gap-1.5 pt-4 border-t border-slate-100">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50"
                                  onClick={() => navigate(`/admin/email-templates/${template.getId()}`)}
                                >
                                  <Eye className="h-4.5 w-4.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50"
                                  onClick={() => navigate(`/admin/email-templates/edit/${template.getId()}`)}
                                >
                                  <Edit className="h-4.5 w-4.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50"
                                  onClick={() => handleTestEmail(template)}
                                >
                                  <Send className="h-4.5 w-4.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "h-9 w-9",
                                    isActive
                                      ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50/50"
                                      : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50"
                                  )}
                                  onClick={() => confirmToggle(template)}
                                >
                                  {isActive ? <ToggleLeft className="h-5 w-5" /> : <ToggleRight className="h-5 w-5" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50"
                                  onClick={() => confirmDelete(template.getId())}
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-4 py-5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
                      <div>
                        Showing {(pagination.page - 1) * pagination.limit + 1}–
                        {Math.min(pagination.page * pagination.limit, filteredTemplates.length)} of {filteredTemplates.length}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9" disabled={pagination.page === 1} onClick={() => changePage(1)}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" disabled={pagination.page === 1} onClick={() => changePage(pagination.page - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex gap-1 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                            const num = i + Math.max(1, Math.min(pagination.page - 3, totalPages - 6));
                            if (num < 1 || num > totalPages) return null;
                            return (
                              <Button
                                key={num}
                                variant={num === pagination.page ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                  "h-8 w-8 p-0 text-sm rounded-md",
                                  num === pagination.page && "bg-indigo-600 hover:bg-indigo-700 text-white"
                                )}
                                onClick={() => changePage(num)}
                              >
                                {num}
                              </Button>
                            );
                          })}
                        </div>

                        <Button variant="ghost" size="icon" className="h-9 w-9" disabled={pagination.page >= totalPages} onClick={() => changePage(pagination.page + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" disabled={pagination.page >= totalPages} onClick={() => changePage(totalPages)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                Delete Email Template
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
                This action is permanent and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="h-10 rounded-md border-slate-300 hover:bg-slate-50">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="h-10 bg-rose-600 hover:bg-rose-700 rounded-md"
                onClick={executeDelete}
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Toggle Dialog */}
        <AlertDialog open={!!toggleTemplate} onOpenChange={() => setToggleTemplate(null)}>
          <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900">
                {toggleTemplate?.isActive() ? "Deactivate" : "Activate"} Template
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
                {toggleTemplate?.isActive()
                  ? "Deactivating will stop automatic sending of this template."
                  : "Activating will allow this template to be used in notifications."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="h-10 rounded-md border-slate-300 hover:bg-slate-50">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={cn(
                  "h-10 rounded-md",
                  toggleTemplate?.isActive()
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
                onClick={executeToggle}
              >
                {toggleTemplate?.isActive() ? "Deactivate" : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}