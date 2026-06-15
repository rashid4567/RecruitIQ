import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { StatusBadge } from "./Statusbadge";
import type { ApplicationRow } from "./Application.types";

interface ApplicationTableRowProps {
  row: ApplicationRow;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function ApplicationTableRow({
  row,
  isSelected,
  onToggleSelect,
}: ApplicationTableRowProps) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/recruiter/application-detail/${row.id}`)}
      className={`cursor-pointer hover:bg-slate-50 transition-colors ${
        isSelected ? "bg-blue-50/60" : "bg-white"
      }`}
    >
    
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(row.id)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {row.profileImage ? (
            <img
              src={row.profileImage}
              alt={row.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
              {row.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{row.name}</p>
            <p className="text-xs text-slate-400 truncate">{row.email}</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
        {row.applicationDate}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${row.scoreBarColor}`}
              style={{ width: `${row.aiScore}%` }}
            />
          </div>
          <span className="text-slate-700 font-medium tabular-nums">
            {row.aiScore}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${row.matchPercent}%` }}
            />
          </div>
          <span className="text-slate-700 font-medium tabular-nums">
            {row.matchPercent}%
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={row.status} />
      </td>

      <td className="px-5 py-4 whitespace-nowrap">
        <span className="text-slate-300 text-xs">—</span>
      </td>

      {/* Actions menu — stop propagation so it doesn't navigate */}
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <button className="text-slate-300 hover:text-slate-600 transition p-1 rounded hover:bg-slate-100">
          <EllipsisVertical size={16} />
        </button>
      </td>
    </tr>
  );
}