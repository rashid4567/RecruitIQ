import React from "react";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Layers,
} from "lucide-react";
import { fmtFull } from "./Indexs";
import { RM } from "./Index";

export function RecBanner({
  rec,
  analyzedAt,
  overallScore,
}: {
  rec: (typeof RM)[string];
  analyzedAt: Date;
  overallScore: number;
}) {
  return (
    <div
      className={`rounded-2xl border-2 ${rec.border} ${rec.bg} overflow-hidden`}
    >
      <div className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-white border ${rec.border} flex items-center justify-center shadow-sm ${rec.color}`}
          >
            <rec.Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              AI Recommendation
            </p>
            <p className={`text-xl font-bold mt-0.5 ${rec.color}`}>
              {rec.label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzed {fmtFull(analyzedAt)}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-3xl font-black tabular-nums ${rec.color}`}>
            {overallScore}
            <span className="text-lg font-semibold">/100</span>
          </p>
          <p className="text-xs text-slate-400">overall score</p>
        </div>
      </div>
      <div className={`h-2 w-full ${rec.bar}`}>
        <div
          className={`h-full ${rec.fill} transition-all duration-1000`}
          style={{ width: `${overallScore}%` }}
        />
      </div>
    </div>
  );
}

export function FeedbackColumn({
  title,
  items,
  accent,
  BgIcon,
  ItemIcon,
  emptyText,
}: {
  title: string;
  items: string[];
  accent: {
    bg: string;
    border: string;
    header: string;
    dot: string;
    chip: string;
    chipText: string;
  };
  BgIcon: React.ElementType;
  ItemIcon: React.ElementType;
  emptyText: string;
}) {
  return (
    <div
      className={`rounded-2xl border ${accent.border} ${accent.bg} p-5 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BgIcon className={`w-4 h-4 ${accent.header}`} />
          <span
            className={`text-xs font-bold uppercase tracking-widest ${accent.header}`}
          >
            {title}
          </span>
        </div>
        {items.length > 0 && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${accent.chip} ${accent.chipText}`}
          >
            {items.length}
          </span>
        )}
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <ItemIcon
                className={`w-3.5 h-3.5 ${accent.dot} mt-0.5 shrink-0`}
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-400 italic">{emptyText}</p>
      )}
    </div>
  );
}

export function StrengthsColumn({ items }: { items: string[] }) {
  return (
    <FeedbackColumn
      title="Strengths"
      items={items}
      BgIcon={TrendingUp}
      ItemIcon={CheckCircle}
      emptyText="No strengths identified."
      accent={{
        bg: "bg-emerald-50/60",
        border: "border-emerald-100",
        header: "text-emerald-700",
        dot: "text-emerald-500",
        chip: "bg-emerald-100",
        chipText: "text-emerald-700",
      }}
    />
  );
}

export function GapsColumn({ items }: { items: string[] }) {
  return (
    <FeedbackColumn
      title="Gaps"
      items={items}
      BgIcon={AlertCircle}
      ItemIcon={XCircle}
      emptyText="No gaps detected."
      accent={{
        bg: "bg-red-50/60",
        border: "border-red-100",
        header: "text-red-700",
        dot: "text-red-400",
        chip: "bg-red-100",
        chipText: "text-red-700",
      }}
    />
  );
}

export function MissingSkillsColumn({ items }: { items: string[] }) {
  return (
    <FeedbackColumn
      title="Missing Skills"
      items={items}
      BgIcon={Layers}
      ItemIcon={AlertCircle}
      emptyText="All critical skills present."
      accent={{
        bg: "bg-orange-50/60",
        border: "border-orange-100",
        header: "text-orange-700",
        dot: "text-orange-400",
        chip: "bg-orange-100",
        chipText: "text-orange-700",
      }}
    />
  );
}
