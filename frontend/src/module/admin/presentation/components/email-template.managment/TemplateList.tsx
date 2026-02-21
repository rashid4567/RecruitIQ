import { 
  Mail, 
  Search, 
  X, 
  Eye, 
  Edit, 
  Send, 
  ToggleLeft, 
  ToggleRight, 
  Trash2,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EmailTemplate } from "@/module/admin/domain/entities/email-template.entity";
import { cn } from "@/lib/utils";

interface TemplateListProps {
  loading: boolean;
  templates: EmailTemplate[];
  search: string;
  onSearchChange: (value: string) => void;
  pagination: { page: number; limit: number };
  onPaginationChange: (pagination: any) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onTestEmail: (template: EmailTemplate) => void;
  onToggle: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
}

export function TemplateList({
  loading,
  templates,
  search,
  onSearchChange,
  pagination,
  onPaginationChange,
  onView,
  onEdit,
  onTestEmail,
  onToggle,
  onDelete,
}: TemplateListProps) {
  const navigate = useNavigate();

  const getEventDisplay = (event: string) =>
    event
      .replace(/_/g, " → ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 bg-slate-200 rounded-lg animate-pulse"
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <Input
            placeholder="Search template name or subject..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPaginationChange({ ...pagination, page: 1 });
            }}
            className="h-10 pl-10 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 rounded-lg"
          />
          {search && (
            <button
              onClick={() => {
                onSearchChange("");
                onPaginationChange({ ...pagination, page: 1 });
              }}
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
            onChange={(e) =>
              onPaginationChange({
                ...pagination,
                limit: Number(e.target.value),
                page: 1,
              })
            }
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
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="py-16 text-center border-dashed border-slate-300">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No templates found
          </h3>
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
          {templates.map((template) => {
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
                        {new Date(template.getCreatedAt()).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
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

                  <Badge
                    variant="secondary"
                    className="px-3 py-1 text-xs bg-slate-100/80 border border-slate-200 rounded-full"
                  >
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
                      onClick={() => onView(template.getId())}
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50"
                      onClick={() => onEdit(template.getId())}
                    >
                      <Edit className="h-4.5 w-4.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50"
                      onClick={() => onTestEmail(template)}
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
                      onClick={() => onToggle(template)}
                    >
                      {isActive ? (
                        <ToggleLeft className="h-5 w-5" />
                      ) : (
                        <ToggleRight className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50"
                      onClick={() => onDelete(template.getId())}
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
    </div>
  );
}