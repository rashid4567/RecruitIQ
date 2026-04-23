import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Eye,
  Calendar,
  Building2,
  Layers,
  Ban,
  CheckCircle,
  X,
  Globe,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { JobPostEntity, JobStatus, JobType } from "../../../domain/entities/jobpost.entity";


function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSalary(s: JobPostEntity["salary"]) {
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: s.currency,
    maximumFractionDigits: 0,
  });
  return `${fmt.format(s.min)} – ${fmt.format(s.max)}`;
}

function locationLabel(
  loc: JobPostEntity["location"],
  isRemote: boolean
): string {
  if (isRemote) return "Remote";
  return [loc.city, loc.state, loc.country].filter(Boolean).join(", ") || "Not specified";
}

function expRange(min: number, max: number): string {
  if (min === 0 && max === 0) return "Entry Level";
  if (min === max) return `${min} years`;
  return `${min} – ${max} years`;
}



function StatusBadge({ status, isBlocked }: { status: JobStatus; isBlocked: boolean }) {
  if (isBlocked) {
    return (
      <Badge className="bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/10">
        <Ban className="w-3 h-3 mr-1" />
        Blocked
      </Badge>
    );
  }

  const styles: Record<JobStatus, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    draft:  "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    expired: "bg-slate-500/10 text-slate-400 border border-slate-500/30",
  };

  return (
    <Badge className={cn("capitalize hover:bg-transparent", styles[status] ?? styles.draft)}>
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
      )}
      {status}
    </Badge>
  );
}

function TypeBadge({ jobType, isRemote }: { jobType: JobType; isRemote: boolean }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Badge variant="outline" className="capitalize bg-white/10 border-white/20 text-white/80">
        <Clock className="w-3 h-3 mr-1 text-white/40" />
        {jobType.replace("-", " ")}
      </Badge>
      {isRemote && (
        <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
          <Globe className="w-3 h-3 mr-1" />
          Remote
        </Badge>
      )}
    </div>
  );
}

function SkillBadges({
  skills,
  variant = "required",
}: {
  skills: string[];
  variant?: "required" | "preferred";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge
          key={skill}
          variant="outline"
          className={cn(
            "font-medium transition-colors",
            variant === "required"
              ? "bg-slate-900 text-white border-slate-700 hover:bg-slate-800"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          )}
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
  iconCls,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconCls?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition-colors">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconCls ?? "bg-slate-900 text-white")}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function DateItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
      <div>
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}


interface JobPostDetailModalProps {
  job: JobPostEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBlock: (job: JobPostEntity) => void;
}

export function JobPostDetailModal({
  job,
  isOpen,
  onClose,
  onToggleBlock,
}: JobPostDetailModalProps) {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 rounded-3xl overflow-hidden border-0 shadow-2xl bg-white!">

        {/* ── Dark header ── */}
        <div className="relative bg-slate-900 px-8 pt-8 pb-10 overflow-hidden">
          {/* linear layers */}
          <div className="absolute inset-0 bg-linear-to-br from-slate-800 via-slate-900 to-slate-950" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-cyan-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex items-start gap-5">
            {/* White icon box */}
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-lg">
              <Briefcase className="w-8 h-8 text-slate-900" />
            </div>

            <div className="flex-1 min-w-0">
              <DialogHeader className="space-y-0">
                <DialogTitle className="text-2xl font-bold text-white leading-tight">
                  {job.title}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-2 mt-3 text-slate-300">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{job.department}</span>
              </div>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <TypeBadge jobType={job.jobType} isRemote={job.isRemote} />
                <StatusBadge status={job.status} isBlocked={job.isBlocked} />
              </div>

              <p className="text-xs text-slate-500 mt-4 font-mono">ID: {job.id}</p>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <ScrollArea className="max-h-[55vh] bg-white">
          <div className="p-8 space-y-6">

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatItem
                icon={MapPin}
                label="Location"
                value={locationLabel(job.location, job.isRemote)}
                iconCls="bg-cyan-500 text-white"
              />
              <StatItem
                icon={DollarSign}
                label="Salary Range"
                value={formatSalary(job.salary)}
                iconCls="bg-emerald-500 text-white"
              />
              <StatItem
                icon={Users}
                label="Applications"
                value={`${job.applicationsCount} received`}
                iconCls="bg-blue-500 text-white"
              />
              <StatItem
                icon={Eye}
                label="Views"
                value={`${job.views.toLocaleString()} total`}
                iconCls="bg-amber-500 text-white"
              />
            </div>

            <Separator />

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-3">
              <InfoCard
                icon={TrendingUp}
                label="Experience"
                value={expRange(job.experienceMin, job.experienceMax)}
              />
              <InfoCard
                icon={Users}
                label="Positions"
                value={`${job.positions} open`}
              />
              <InfoCard
                icon={Clock}
                label="Job Type"
                value={job.jobType.replace("-", " ")}
              />
            </div>

            {/* Date cards */}
            <div className="grid grid-cols-3 gap-3">
              <DateItem label="Posted"  value={formatDate(job.postedOn)} />
              <DateItem label="Expires" value={formatDate(job.expiresAt)} />
              <DateItem label="Created" value={formatDate(job.createdAt)} />
            </div>

            {/* Required skills */}
            {job.requiredSkills.length > 0 && (
              <div className="p-5 rounded-2xl bg-linear-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Required Skills</h4>
                    <p className="text-xs text-slate-500">Must-have qualifications</p>
                  </div>
                </div>
                <SkillBadges skills={job.requiredSkills} variant="required" />
              </div>
            )}

            {/* Preferred skills */}
            {job.preferredSkills.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Preferred Skills</h4>
                    <p className="text-xs text-slate-500">Nice-to-have qualifications</p>
                  </div>
                </div>
                <SkillBadges skills={job.preferredSkills} variant="preferred" />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-4 px-8 py-5 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Last updated {formatDate(job.createdAt)}
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 px-5 border-slate-200 hover:bg-white"
            >
              Close
            </Button>

            {job.isBlocked ? (
              <Button
                onClick={() => { onToggleBlock(job); onClose(); }}
                className="gap-2 rounded-xl h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Unblock Job
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => { onToggleBlock(job); onClose(); }}
                disabled={job.status !== "active"}
                className="gap-2 rounded-xl h-10 px-5 shadow-sm"
              >
                <Ban className="w-4 h-4" />
                Block Job
              </Button>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}