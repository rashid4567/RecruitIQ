import { useState } from "react";
import { Braces, MousePointerClick, ChevronRight, Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Variable {
  name: string;
  description: string;
}

interface VariablesSidebarProps {
  variables: Variable[];
  onInsertVariable: (variable: string) => void;
}

const VAR_COLORS = [
  { ring: "ring-violet-400/40", dot: "bg-violet-400", text: "text-violet-700", bg: "bg-violet-50", hover: "hover:bg-violet-50/80 hover:ring-violet-400/60" },
  { ring: "ring-sky-400/40",    dot: "bg-sky-400",    text: "text-sky-700",    bg: "bg-sky-50",    hover: "hover:bg-sky-50/80 hover:ring-sky-400/60" },
  { ring: "ring-emerald-400/40",dot: "bg-emerald-400",text: "text-emerald-700",bg: "bg-emerald-50",hover: "hover:bg-emerald-50/80 hover:ring-emerald-400/60" },
  { ring: "ring-amber-400/40",  dot: "bg-amber-400",  text: "text-amber-700",  bg: "bg-amber-50",  hover: "hover:bg-amber-50/80 hover:ring-amber-400/60" },
  { ring: "ring-rose-400/40",   dot: "bg-rose-400",   text: "text-rose-700",   bg: "bg-rose-50",   hover: "hover:bg-rose-50/80 hover:ring-rose-400/60" },
  { ring: "ring-indigo-400/40", dot: "bg-indigo-400", text: "text-indigo-700", bg: "bg-indigo-50", hover: "hover:bg-indigo-50/80 hover:ring-indigo-400/60" },
  { ring: "ring-teal-400/40",   dot: "bg-teal-400",   text: "text-teal-700",   bg: "bg-teal-50",   hover: "hover:bg-teal-50/80 hover:ring-teal-400/60" },
  { ring: "ring-orange-400/40", dot: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50", hover: "hover:bg-orange-50/80 hover:ring-orange-400/60" },
];

export function VariablesSidebar({ variables, onInsertVariable }: VariablesSidebarProps) {
  const [lastInserted, setLastInserted] = useState<string | null>(null);

  function handleInsert(name: string) {
    onInsertVariable(name);
    setLastInserted(name);
    setTimeout(() => setLastInserted(null), 1200);
  }

  return (
    <aside className="sticky top-24 flex flex-col gap-0 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <Braces className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Variables</h3>
        </div>
        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
          <MousePointerClick className="w-3 h-3" />
          Click to insert at cursor
        </p>
      </div>

      {/* Variable list */}
      <div className="p-3 flex flex-col gap-1.5">
        {variables.map((v, i) => {
          const palette = VAR_COLORS[i % VAR_COLORS.length];
          const isJustInserted = lastInserted === v.name;

          return (
            <Tooltip key={v.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleInsert(v.name)}
                  className={cn(
                    "group w-full text-left px-3 py-2.5 rounded-xl ring-1 transition-all duration-200 active:scale-[0.97]",
                    isJustInserted
                      ? `${palette.bg} ${palette.ring} ring-2 scale-[0.98]`
                      : `bg-white ring-slate-200/80 ${palette.hover}`
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", palette.dot)} />
                      <code className={cn(
                        "text-[11px] font-mono font-semibold truncate",
                        isJustInserted ? palette.text : "text-slate-700 group-hover:" + palette.text
                      )}>
                        {"{{" + v.name + "}}"}
                      </code>
                    </div>
                    <ChevronRight className={cn(
                      "w-3 h-3 flex-shrink-0 transition-all duration-200",
                      isJustInserted
                        ? `${palette.text} translate-x-0.5`
                        : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5"
                    )} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 pl-3.5 leading-tight line-clamp-1 group-hover:text-slate-500 transition-colors">
                    {v.description}
                  </p>
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-56 text-xs">
                <span className="font-medium">{v.description}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Pro tip */}
      <div className="mx-3 mb-3 p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold text-amber-900 mb-0.5">Pro tip</p>
            <p className="text-[10px] text-amber-700/90 leading-relaxed">
              Click inside the editor first to position your cursor, then click a variable to insert it precisely.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}