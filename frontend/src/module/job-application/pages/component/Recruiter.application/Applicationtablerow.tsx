import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { StatusBadge } from "./Statusbadge";
import type { ApplicationRow } from "./Application.types";

interface ApplicationTableRowProps {
  row: ApplicationRow;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

type ScoreTier = "excellent" | "good" | "average" | "poor";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "average";
  return "poor";
}

const TIER_ROW_BG: Record<ScoreTier, string> = {
  excellent: "bg-emerald-50/60",
  good: "bg-sky-50/50",
  average: "bg-amber-50/50",
  poor: "bg-red-50/50",
};

const TIER_ROW_HOVER: Record<ScoreTier, string> = {
  excellent: "hover:bg-emerald-50",
  good: "hover:bg-sky-50",
  average: "hover:bg-amber-50",
  poor: "hover:bg-red-50",
};

const TIER_ACCENT: Record<ScoreTier, string> = {
  excellent: "border-l-emerald-400",
  good: "border-l-sky-400",
  average: "border-l-amber-400",
  poor: "border-l-red-400",
};

const TIER_BAR: Record<ScoreTier, string> = {
  excellent: "bg-linearr-to-r from-emerald-400 to-emerald-500",
  good: "bg-linearr-to-r from-sky-400 to-sky-500",
  average: "bg-linearr-to-r from-amber-400 to-amber-500",
  poor: "bg-linearr-to-r from-red-400 to-red-500",
};

const TIER_TEXT: Record<ScoreTier, string> = {
  excellent: "text-emerald-700",
  good: "text-sky-700",
  average: "text-amber-700",
  poor: "text-red-600",
};

const TIER_RING: Record<ScoreTier, string> = {
  excellent: "ring-emerald-200",
  good: "ring-sky-200",
  average: "ring-amber-200",
  poor: "ring-red-200",
};

function ScoreBar({
  value,
  tier,
  label,
}: {
  value: number;
  tier: ScoreTier;
  label: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className="flex items-center gap-2.5 min-w-25"
      aria-label={`${label}: ${value}`}
    >
      <div className="relative w-16 h-2 rounded-full bg-slate-100 overflow-hidden shrink-0">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${TIER_BAR[tier]} transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span
        className={`text-xs font-bold tabular-nums ${TIER_TEXT[tier]} min-w-8.5`}
      >
        {value}%
      </span>
    </div>
  );
}

export function ApplicationTableRow({
  row,
  isSelected,
  onToggleSelect,
}: ApplicationTableRowProps) {
  const navigate = useNavigate();

  const tier = getScoreTier(row.aiScore);
  const matchTier = getScoreTier(row.matchPercent);

  const rowBg = isSelected ? "bg-blue-50/80" : TIER_ROW_BG[tier];
  const rowHover = isSelected ? "hover:bg-blue-50" : TIER_ROW_HOVER[tier];
  const accent = isSelected ? "border-l-blue-500" : TIER_ACCENT[tier];

  return (
    <tr
      onClick={() => navigate(`/recruiter/application-detail/${row.id}`)}
      className={`cursor-pointer transition-colors duration-150 ${rowBg} ${rowHover}`}
    >
      <td
        className={`px-5 py-4 border-l-4 ${accent}`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(row.id)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
          aria-label={`Select ${row.name}`}
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {row.profileImage ? (
            <img
              src={row.profileImage}
              alt={row.name}
              className={`w-9 h-9 rounded-full object-cover shrink-0 ring-2 ${TIER_RING[tier]}`}
            />
          ) : (
            <div
              className={`w-9 h-9 rounded-full bg-linearr-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ${TIER_RING[tier]} shadow-sm`}
            >
              {row.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate text-[13px] leading-snug">
              {row.name}
            </p>
            <p className="text-xs text-slate-400 truncate">{row.email}</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
        {row.applicationDate}
      </td>

      <td className="px-5 py-4">
        <ScoreBar value={row.aiScore} tier={tier} label="AI score" />
      </td>

      <td className="px-5 py-4">
        <ScoreBar
          value={row.matchPercent}
          tier={matchTier}
          label="Match score"
        />
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={row.status} />
      </td>

      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label={`More actions for ${row.name}`}
          className="p-1.5 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100/80 transition-colors"
        >
          <MoreVertical size={15} />
        </button>
      </td>
    </tr>
  );
}
