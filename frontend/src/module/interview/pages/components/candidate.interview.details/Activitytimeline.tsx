import { CheckCircle2 } from "lucide-react";
import type { TimelineItem } from "./Interviewdetails.types"; 

export default function ActivityTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="relative flex gap-3 pb-5 last:pb-0">
          {idx < items.length - 1 && (
            <span
              className={`absolute left-[6.5px] top-4 bottom-0 w-px ${item.done ? "bg-emerald-200" : "bg-slate-200"}`}
            />
          )}
          <span
            className={`mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
              item.done
                ? item.muted
                  ? "bg-slate-300"
                  : "bg-emerald-500"
                : "border-2 border-slate-200 bg-white"
            }`}
          >
            {item.done && (
              <CheckCircle2 size={9} className="text-white" strokeWidth={3} />
            )}
          </span>
          <div className="min-w-0 -mt-0.5">
            <p
              className={`text-xs ${item.done ? (item.muted ? "text-slate-400" : "text-slate-700 font-medium") : "text-slate-400"}`}
            >
              {item.label}
            </p>
            {item.time && item.time !== "—" && (
              <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}