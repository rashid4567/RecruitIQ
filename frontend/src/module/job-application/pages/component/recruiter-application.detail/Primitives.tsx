import React from "react";

export function Section({
  title,
  subtitle,
  Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  Icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-slate-500" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <p className="text-sm text-slate-400 italic text-center py-6">{text}</p>
  );
}

export function Ring({
  value,
  color,
  size = 84,
  sw = 7,
}: {
  value: number;
  color: string;
  size?: number;
  sw?: number;
}) {
  const r = (size - sw * 2) / 2;
  const c = 2 * Math.PI * r;
  const o = c - (Math.min(value, 100) / 100) * c;
  const cx = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={sw}
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={c}
        strokeDashoffset={o}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </svg>
  );
}

export function ScoreTile({
  label,
  value,
  color,
  Icon,
}: {
  label: string;
  value: number;
  color: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
      <div className="relative" style={{ width: 84, height: 84 }}>
        <Ring value={value} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-900 tabular-nums">
            {value}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export function ScoreBar({
  label,
  value,
  fill,
}: {
  label: string;
  value: number;
  fill: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${fill} transition-all duration-700`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 w-7 text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}
