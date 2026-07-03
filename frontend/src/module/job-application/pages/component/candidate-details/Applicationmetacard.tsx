import React, { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";

import type { JobApplication } from "@/module/job-application/types/jobApplication.types";
import type { Job } from "@/module/jobs/types/job.types";

import { formatDate, formatDateShort } from "./Formatters";

interface ApplicationMetaCardProps {
  application: JobApplication;
  job: Job;
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400 shrink-0 pt-0.5">
        {label}
      </span>

      <div className="text-xs font-medium text-slate-700 text-right">
        {children}
      </div>
    </div>
  );
}

export function ApplicationMetaCard({
  application,
  job,
}: ApplicationMetaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(application.applicationNumber);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        Application Info
      </h3>

      <InfoRow label="Application No">
        <span className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-blue-600">
            {application.applicationNumber}
          </span>

          <button
            onClick={handleCopy}
            className="p-1 hover:bg-slate-100 rounded-md transition"
            title="Copy application number"
          >
            {copied ? (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </span>
      </InfoRow>

      <InfoRow label="Applied">
        {formatDateShort(application.appliedAt)}
      </InfoRow>

      <InfoRow label="Last Updated">
        {formatDate(application.updatedAt)}
      </InfoRow>

      {job.expiresAt && (
        <InfoRow label="Expires">
          {formatDateShort(job.expiresAt)}
        </InfoRow>
      )}
    </div>
  );
}