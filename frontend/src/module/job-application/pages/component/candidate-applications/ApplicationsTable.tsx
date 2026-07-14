import React from "react";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { CandidateApplication } from "@/module/job-application/types/application.types";

import { ApplicationRow } from "./Applicationrow";
import { ApplicationCard } from "./Applicationcard"; 

const TABLE_HEADERS = [
  { label: "Company & Job", width: "26%" },
  { label: "Applied", width: "14%" },
  { label: "Status", width: "16%" },
  { label: "Interview Details", width: "24%" },
  { label: "Resume", width: "14%" },
  { label: "", width: "6%" },
];

interface Props {
  applications: CandidateApplication[];
  onWithdraw: (app: CandidateApplication) => void;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="py-20 flex flex-col items-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
        <Briefcase size={24} className="text-slate-300" />
      </div>

      <p className="text-[14px] font-bold text-slate-500">
        No applications yet
      </p>

      <p className="text-[12px] text-slate-400">
        Start applying to jobs to see them here.
      </p>

      <button
        onClick={() => navigate("/candidate/jobs")}
        className="mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-xl transition"
      >
        Browse jobs
      </button>
    </div>
  );
};

export const ApplicationsTable: React.FC<Props> = ({
  applications,
  onWithdraw,
  page,
  perPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(applications.length / perPage));
  const paginated = applications.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const from = Math.min((page - 1) * perPage + 1, applications.length);
  const to = Math.min(page * perPage, applications.length);
  const isEmpty = paginated.length === 0;

  return (
    <div className="bg-white md:rounded-2xl md:border md:border-slate-100 md:shadow-sm overflow-hidden">

      <div className="md:hidden">
        {isEmpty ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((app, index) => (
              <ApplicationCard
                key={app.applicationId}
                app={app}
                onWithdraw={onWithdraw}
                index={index}
              />
            ))}
          </div>
        )}
      </div>


      <div className="hidden md:block overflow-x-auto max-h-[75vh] overflow-y-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            {TABLE_HEADERS.map((h, i) => (
              <col key={i} style={{ width: h.width }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-100 bg-slate-50/95 backdrop-blur">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h.label}
                  className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              paginated.map((app, index) => (
                <ApplicationRow
                  key={app.applicationId}
                  app={app}
                  onWithdraw={onWithdraw}
                  index={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {applications.length > perPage && (
        <div className="px-4 sm:px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-between bg-slate-50/40 mt-3 md:mt-0 rounded-2xl md:rounded-none border md:border-0">
          <p className="text-[11px] text-slate-400 font-medium">
            Showing{" "}
            <span className="text-slate-600">
              {from}–{to}
            </span>{" "}
            of{" "}
            <span className="text-slate-600">{applications.length}</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex items-center gap-1 px-3 h-8 rounded-xl hover:bg-slate-200 disabled:opacity-30 transition text-slate-500 text-[12px] font-semibold"
            >
              <ChevronLeft size={15} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                aria-label={`Page ${n}`}
                aria-current={page === n ? "page" : undefined}
                className={`w-8 h-8 rounded-xl text-[12px] font-bold transition ${
                  page === n
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-300"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex items-center gap-1 px-3 h-8 rounded-xl hover:bg-slate-200 disabled:opacity-30 transition text-slate-500 text-[12px] font-semibold"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};