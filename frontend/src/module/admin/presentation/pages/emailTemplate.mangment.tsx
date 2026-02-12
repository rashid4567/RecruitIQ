"use client";

import { useEffect, useState } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  "All Templates",
  "Application Status",
  "Interview Related",
  "Account Related",
  "Subscription Related",
];

export default function EmailTemplateManagement() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [page, setPage] = useState(1);

  // Confirmation dialogs
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleTemplate, setToggleTemplate] = useState<EmailTemplate | null>(null);

  const ITEMS_PER_PAGE = 6;

  // Fetch
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await GetEmailTemplateUC.execute();
      setTemplates(data);
    } catch (err) {
      toast.error("Failed to load email templates");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.getName().toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All Templates" ||
      t.getEvent().toLowerCase().includes(activeCategory.toLowerCase().replace(/ /g, "_"));

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginated = filteredTemplates.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Actions
  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await DeleteEmailTemplateUC.execute(deleteId);
      toast.success("Template deleted successfully");
      fetchTemplates();
    } catch {
      toast.error("Failed to delete template");
    } finally {
      setDeleteId(null);
    }
  };

  const confirmToggle = (template: EmailTemplate) => {
    setToggleTemplate(template);
  };

  const executeToggle = async () => {
    if (!toggleTemplate) return;
    try {
      await ToggleEmailTempleteUC.execute(toggleTemplate.getId(), !toggleTemplate.isActive());
      toast.success(
        `Template ${toggleTemplate.isActive() ? "deactivated" : "activated"} successfully`
      );
      fetchTemplates();
    } catch {
      toast.error("Failed to update template status");
    } finally {
      setToggleTemplate(null);
    }
  };

  const handleTestEmail = (template: EmailTemplate) => {
    const email = prompt("Enter test recipient email address:", "test@example.com");
    if (!email || !email.includes("@")) {
      toast.error("Valid email required");
      return;
    }

    toast.promise(sendTestEmailUC.execute(template.getId(), email), {
      loading: "Sending test email...",
      success: "Test email sent successfully!",
      error: "Failed to send test email",
    });
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge
      variant="outline"
      className={cn(
        "px-3 py-1 text-xs font-medium",
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
            <p>Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 flex">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 py-8">

          {/* Header + Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
            <div>
              <div className="text-sm text-gray-500 mb-1.5">
                Admin → Notifications & Email Management → Email Templates
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="h-8 w-8 text-indigo-600" />
                Email Template Management
              </h1>
            </div>

            <Button
              className="bg-violet-600 hover:bg-violet-700 shadow-sm gap-2"
              onClick={() => navigate("/admin/email-templates/create")}
            >
              <Plus className="h-4 w-4" />
              Create Custom Template
            </Button>
          </div>

          <div className="grid lg:grid-cols-12 gap-7">

            {/* Categories Sidebar */}
            <div className="lg:col-span-3">
              <Card className="border shadow-sm sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                    <span className="text-indigo-600">Categories</span>
                  </h2>
                  <div className="space-y-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setPage(1);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          activeCategory === cat
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-700"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-7">

              {/* Search */}
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by template name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-12 h-11 bg-white shadow-sm"
                />
              </div>

              {/* Templates Grid */}
              {paginated.length === 0 ? (
                <Card className="py-20 text-center border-dashed">
                  <Mail className="mx-auto h-14 w-14 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">No templates found</h3>
                  <p className="mt-3 text-gray-500">
                    Try changing the category or search term
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginated.map((template) => (
                    <Card
                      key={template.getId()}
                      className="hover:shadow-lg transition-all duration-200 border rounded-xl overflow-hidden group"
                    >
                      <CardContent className="p-6 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                              {template.getName()}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {new Date(template.getCreatedAt()).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                          {getStatusBadge(template.isActive())}
                        </div>

                        <div className="inline-flex px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {template.getEvent().replace(/_/g, " → ")}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 min-h-[4.5rem]">
                          {template.getSubject()}
                        </p>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-600 hover:text-indigo-700"
                            onClick={() => navigate(`/admin/email-templates/${template.getId()}`)}
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-600 hover:text-indigo-700"
                            onClick={() => navigate(`/admin/email-templates/edit/${template.getId()}`)}
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </Button>

                          {/* Duplicate – uncomment when UC is ready */}
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-600 hover:text-indigo-700"
                            onClick={() => handleDuplicate(template.getId())}
                          >
                            <Copy className="h-4.5 w-4.5" />
                          </Button> */}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-600 hover:text-indigo-700"
                            onClick={() => handleTestEmail(template)}
                          >
                            <Mail className="h-4.5 w-4.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => confirmToggle(template)}
                          >
                            <RefreshCw className="h-4.5 w-4.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => confirmDelete(template.getId())}
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
                  <div className="text-sm text-gray-600">
                    Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(page * ITEMS_PER_PAGE, filteredTemplates.length)} of{" "}
                    {filteredTemplates.length} templates
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Prev
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={page === pageNum ? "default" : "outline"}
                            onClick={() => setPage(pageNum)}
                            className="min-w-[38px]"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Template
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The template will be permanently removed from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={executeDelete}
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Toggle Confirmation */}
        <AlertDialog open={!!toggleTemplate} onOpenChange={() => setToggleTemplate(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {toggleTemplate?.isActive() ? "Deactivate" : "Activate"} Template
              </AlertDialogTitle>
              <AlertDialogDescription>
                {toggleTemplate?.isActive()
                  ? "Deactivating this template will prevent it from being sent automatically."
                  : "Activating this template will allow it to be used in the system."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={cn(
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