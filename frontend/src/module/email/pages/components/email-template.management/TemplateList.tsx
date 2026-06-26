import {
  Mail,
  Search,
  X,
  Pencil,
  Send,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { EmailTemplate } from "@/module/email/types/email.types";
import { cn } from "@/lib/utils";

interface TemplatePagination {
  page: number;
  limit: number;
}

interface TemplateListProps {
  loading: boolean;
  templates: EmailTemplate[];
  search: string;
  onSearchChange: (value: string) => void;
  pagination: TemplatePagination;
  onPaginationChange: (pagination: TemplatePagination) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onTestEmail: (template: EmailTemplate) => void;
  onToggle: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
}

const getEventDisplay = (event: string) =>
  event
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const getEventAccent = (event: string) => {
  if (event.includes("application"))
    return {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
      dot: "bg-violet-400",
    };
  if (event.includes("interview"))
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-400",
    };
  if (event.includes("account"))
    return {
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      dot: "bg-sky-400",
    };
  if (event.includes("subscription"))
    return {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
      dot: "bg-teal-400",
    };
  return {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };
};

const SkeletonCard = () => (
  <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
    <CardContent className="p-0">
      <div className="h-1 w-full bg-slate-100 rounded-t-2xl" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-3 w-1/3 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="h-5 w-28 bg-slate-100 rounded-full animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-5/6 bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-2/3 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="flex gap-1.5">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ActionBtn = ({
  onClick,
  icon: Icon,
  label,
  className,
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  className?: string;
}) => (
  <button
    onClick={onClick}
    title={label}
    className={cn(
      "group/btn relative h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150",
      className,
    )}
  >
    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />

    <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/btn:opacity-100 z-10">
      {label}
    </span>
  </button>
);

const TemplateCard = ({
  template,
  onView,
  onEdit,
  onTestEmail,
  onToggle,
  onDelete,
}: {
  template: EmailTemplate;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onTestEmail: (t: EmailTemplate) => void;
  onToggle: (t: EmailTemplate) => void;
  onDelete: (id: string) => void;
}) => {
  const isActive = template.isActive;
  const eventAccent = getEventAccent(template.event);
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300 group cursor-default",
        hovered
          ? "shadow-lg shadow-slate-200/80 -translate-y-0.5 border-slate-300/70"
          : "shadow-sm",
      )}
    >
      <CardContent className="p-0">
        <div
          className={cn(
            "h-1 w-full transition-all duration-300",
            isActive
              ? "bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500"
              : "bg-linear-to-r from-slate-200 to-slate-300",
          )}
        />

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                  isActive
                    ? "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-500/30"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                )}
              >
                <Mail className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate text-[15px] leading-snug">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 text-slate-350" />
                  <p className="text-[11px] text-slate-400">
                    {new Date(template.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <span
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isActive ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border",
              eventAccent.bg,
              eventAccent.text,
              eventAccent.border,
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full shrink-0",
                eventAccent.dot,
              )}
            />
            <Zap className="h-3 w-3 shrink-0" strokeWidth={2} />
            {getEventDisplay(template.event)}
          </div>

          <p className="text-[13px] text-slate-500 line-clamp-2 min-h-10 leading-relaxed">
            {template.subject}
          </p>

          <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/80">
            <span className="text-[11px] text-slate-350 font-medium tracking-wide uppercase">
              Actions
            </span>

            <div className="flex items-center gap-1">
              <ActionBtn
                onClick={() => onView(template.id)}
                icon={Eye}
                label="View"
                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              />
              <ActionBtn
                onClick={() => onEdit(template.id)}
                icon={Pencil}
                label="Edit"
                className="text-slate-400 hover:text-violet-600 hover:bg-violet-50"
              />
              <ActionBtn
                onClick={() => onTestEmail(template)}
                icon={Send}
                label="Send Test"
                className="text-slate-400 hover:text-sky-600 hover:bg-sky-50"
              />
              <ActionBtn
                onClick={() => onToggle(template)}
                icon={isActive ? ToggleLeft : ToggleRight}
                label={isActive ? "Deactivate" : "Activate"}
                className={
                  isActive
                    ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                    : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                }
              />

              <div className="w-px h-4 bg-slate-200 mx-0.5" />
              <ActionBtn
                onClick={() => onDelete(template.id)}
                icon={Trash2}
                label="Delete"
                className="text-slate-300 hover:text-rose-600 hover:bg-rose-50"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name or subject…"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPaginationChange({ ...pagination, page: 1 });
            }}
            className="h-10 pl-10 pr-9 bg-white shadow-sm border-slate-200/80 focus-visible:ring-indigo-500/30 rounded-xl text-sm placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => {
                onSearchChange("");
                onPaginationChange({ ...pagination, page: 1 });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-350 hover:text-slate-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 h-10 shadow-sm">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Show</span>
            <select
              value={pagination.limit}
              onChange={(e) =>
                onPaginationChange({
                  ...pagination,
                  limit: Number(e.target.value),
                  page: 1,
                })
              }
              className="text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={18}>18</option>
            </select>
          </div>

          <Button
            onClick={() => navigate("/admin/email-templates/create")}
            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-600/20 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            New Template
          </Button>
        </div>
      </div>

      {!loading && templates.length > 0 && (
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <p className="text-[12px] text-slate-400 font-medium">
            Showing{" "}
            <span className="text-slate-600 font-semibold">
              {templates.length}
            </span>{" "}
            template{templates.length !== 1 ? "s" : ""}
            {search && (
              <>
                {" "}
                for{" "}
                <span className="text-indigo-600 font-semibold">
                  "{search}"
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="relative mb-5">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Mail className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Search className="h-3 w-3 text-indigo-500" strokeWidth={2.5} />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-700 mb-1.5">
            {search ? "No matching templates" : "No templates yet"}
          </h3>
          <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed mb-6">
            {search
              ? `We couldn't find any templates matching "${search}". Try a different search or clear the filter.`
              : "You haven't created any email templates yet. Start by creating your first one."}
          </p>
          <div className="flex items-center gap-2">
            {search && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSearchChange("")}
                className="rounded-xl border-slate-200 text-slate-600 h-9 px-4 text-sm"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Clear search
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => navigate("/admin/email-templates/create")}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-4 text-sm shadow-sm shadow-indigo-600/20 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Create Template
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onView={onView}
              onEdit={onEdit}
              onTestEmail={onTestEmail}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
