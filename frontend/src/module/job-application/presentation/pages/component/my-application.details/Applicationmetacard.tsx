import React, { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import type { JobApplication } from "../../../../domain/entity/job-application.entity";
import { formatDate, formatDateShort  } from "./Formatters";
import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";

interface ApplicationMetaCardProps {
  application: JobApplication;
  job: Job;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400 shrink-0 pt-0.5">{label}</span>
      <div className="text-xs font-medium text-slate-700 text-right">{children}</div>
    </div>
  );
}

export function ApplicationMetaCard({ application, job }: ApplicationMetaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(application.getId());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        Application info
      </h3>
      <InfoRow label="App ID">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="truncate max-w-22.5">{application.getId()}</span>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-slate-100 rounded-md transition shrink-0"
          >
            {copied ? (
              <CheckCheck className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </span>
      </InfoRow>
      <InfoRow label="Applied">{formatDateShort(application.getAppliedAt())}</InfoRow>
      <InfoRow label="Updated">{formatDate(application.getUpdatedAt())}</InfoRow>
      {job.expiresAt && (
        <InfoRow label="Expires">{formatDateShort(job.expiresAt)}</InfoRow>
      )}
    </div>
  );
}