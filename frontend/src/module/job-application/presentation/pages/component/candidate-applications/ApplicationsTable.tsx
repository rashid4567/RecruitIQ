import React from "react";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { type JobApplication } from "../../../../domain/entity/job-application.entity";
import { ApplicationRow } from "./Applicationrow";

const TABLE_HEADERS = [
  "Company & Job",
  "Applied",
  "Status",
  "Interview Details",
  "Resume",
  "",
];

interface Props {
  applications: JobApplication[];
  onWithdraw: (app: JobApplication) => void;
  page: number;
  perPage: number;
  onPageChange: (p: number) => void;
}

export const ApplicationsTable: React.FC<Props> = ({
  applications,
  onWithdraw,
  page,
  perPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(applications.length / perPage));
  const paginated = applications.slice((page - 1) * perPage, page * perPage);

  const from = Math.min((page - 1) * perPage + 1, applications.length);
  const to = Math.min(page * perPage, applications.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {TABLE_HEADERS.map((h, i) => (
                <th
                  key={i}
                  className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length}>
                  <div className="py-20 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Briefcase size={24} className="text-slate-300" />
                    </div>
                    <p className="text-[13px] font-medium text-slate-400">
                      No applications found
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Try adjusting your search or filter
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((app, i) => (
                <ApplicationRow
                  key={app.getId()}
                  app={app}
                  onWithdraw={onWithdraw}
                  index={i}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {applications.length > perPage && (
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
          <p className="text-[11px] text-slate-400 font-medium">
            Showing{" "}
            <span className="text-slate-600">
              {from}–{to}
            </span>{" "}
            of <span className="text-slate-600">{applications.length}</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-200 disabled:opacity-30 transition text-slate-500"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
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
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-200 disabled:opacity-30 transition text-slate-500"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
