import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, ChevronDown, SlidersHorizontal, Check } from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/domain/entity/job-application.entity";
import type { UpdateApplicationStatusDTO } from "@/module/job-application/domain/dto/updateApplicationStatus.dto";
import { useUpdateApplicationStatus } from "../../../hooks/recruiter/useUpdateApplicationStatus";
import type { SortOption } from "./Application.types";

type RecruiterSetableStatus = UpdateApplicationStatusDTO["status"];

interface FilterToolbarProps {
  searchQuery: string;
  sortBy: SortOption;
  statusFilter: ApplicationStatus | "All";
  matchScoreMin: number;
  matchScoreMax: number;
  selectedIds: string[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onStatusChange: (value: ApplicationStatus | "All") => void;
  onMatchScoreMinChange: (value: number) => void;
  onMatchScoreMaxChange: (value: number) => void;
  onClearSelection: () => void;
  onBulkSuccess: () => void;
}

const MIN_GAP = 1;

const SCORE_PRESETS: {
  label: string;
  min: number;
  max: number;
  dot: string;
}[] = [
  { label: "All", min: 0, max: 100, dot: "bg-slate-300" },
  { label: "Top", min: 80, max: 100, dot: "bg-emerald-400" },
  { label: "Good", min: 60, max: 99, dot: "bg-sky-400" },
  { label: "Average", min: 40, max: 79, dot: "bg-amber-400" },
  { label: "Low", min: 0, max: 39, dot: "bg-red-400" },
];

function ScoreRangeSlider({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const pctFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    return Math.round(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: PointerEvent) => {
      const pct = pctFromClientX(e.clientX);
      if (dragging === "min") {
        onMinChange(Math.min(pct, max - MIN_GAP));
      } else {
        onMaxChange(Math.max(pct, min + MIN_GAP));
      }
    };
    const handleUp = () => setDragging(null);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging, min, max, onMinChange, onMaxChange, pctFromClientX]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (e.target !== trackRef.current) return;
    const pct = pctFromClientX(e.clientX);
    const distToMin = Math.abs(pct - min);
    const distToMax = Math.abs(pct - max);
    if (distToMin <= distToMax) {
      onMinChange(Math.min(pct, max - MIN_GAP));
    } else {
      onMaxChange(Math.max(pct, min + MIN_GAP));
    }
  };

  const handleKeyDown = (handle: "min" | "max") => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
    if (delta === 0) return;
    e.preventDefault();
    if (handle === "min") {
      onMinChange(Math.min(Math.max(0, min + delta), max - MIN_GAP));
    } else {
      onMaxChange(Math.min(100, Math.max(max + delta, min + MIN_GAP)));
    }
  };

  const zoneGradient =
    "linear-gradient(to right, #fca5a5 0%, #fca5a5 40%, #fcd34d 40%, #fcd34d 60%, #7dd3fc 60%, #7dd3fc 80%, #6ee7b7 80%, #6ee7b7 100%)";

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      className="relative h-2 rounded-full cursor-pointer select-none"
      style={{ background: zoneGradient }}
    >
      <div
        className="absolute inset-y-0 left-0 bg-white/80 rounded-l-full pointer-events-none"
        style={{ width: `${min}%` }}
      />
      <div
        className="absolute inset-y-0 right-0 bg-white/80 rounded-r-full pointer-events-none"
        style={{ width: `${100 - max}%` }}
      />

      <div
        role="slider"
        tabIndex={0}
        aria-label="Minimum score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={min}
        onPointerDown={(e) => {
          e.preventDefault();
          setDragging("min");
        }}
        onKeyDown={handleKeyDown("min")}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-indigo-500 shadow-md cursor-grab active:cursor-grabbing focus:ring-2 focus:ring-indigo-300 focus:outline-none z-10"
        style={{ left: `${min}%` }}
      />

      <div
        role="slider"
        tabIndex={0}
        aria-label="Maximum score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={max}
        onPointerDown={(e) => {
          e.preventDefault();
          setDragging("max");
        }}
        onKeyDown={handleKeyDown("max")}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-indigo-500 shadow-md cursor-grab active:cursor-grabbing focus:ring-2 focus:ring-indigo-300 focus:outline-none z-10"
        style={{ left: `${max}%` }}
      />
    </div>
  );
}

function ScoreFilterPopover({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [minText, setMinText] = useState(String(min));
  const [maxText, setMaxText] = useState(String(max));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMinText(String(min)), [min]);
  useEffect(() => setMaxText(String(max)), [max]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const commitMin = (raw: string) => {
    const n = raw === "" ? 0 : Math.round(Number(raw));
    if (Number.isNaN(n)) return setMinText(String(min));
    const clamped = Math.min(Math.max(0, n), max - MIN_GAP);
    onMinChange(clamped);
    setMinText(String(clamped));
  };

  const commitMax = (raw: string) => {
    const n = raw === "" ? 100 : Math.round(Number(raw));
    if (Number.isNaN(n)) return setMaxText(String(max));
    const clamped = Math.max(Math.min(100, n), min + MIN_GAP);
    onMaxChange(clamped);
    setMaxText(String(clamped));
  };

  const isDefault = min === 0 && max === 100;
  const activeDot =
    SCORE_PRESETS.find((p) => p.min === min && p.max === max)?.dot ??
    "bg-indigo-400";

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-xl border text-sm font-medium transition ${
          open
            ? "border-indigo-300 ring-2 ring-indigo-100 text-indigo-700 bg-indigo-50/60"
            : isDefault
              ? "border-slate-200 text-slate-600 bg-white hover:border-slate-300"
              : "border-indigo-200 text-indigo-700 bg-indigo-50/60 hover:bg-indigo-50"
        }`}
      >
        <SlidersHorizontal
          size={14}
          className={isDefault ? "text-slate-400" : "text-indigo-500"}
        />
        <span>
          {isDefault ? (
            "Score: All"
          ) : (
            <>
              Score:{" "}
              <span className="tabular-nums font-semibold">
                {min}–{max}%
              </span>
            </>
          )}
        </span>
        {!isDefault && (
          <span className={`w-1.5 h-1.5 rounded-full ${activeDot}`} />
        )}
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 p-4 z-30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest">
              Filter by score
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full tabular-nums">
              {min}% – {max}%
            </span>
          </div>

          <ScoreRangeSlider
            min={min}
            max={max}
            onMinChange={onMinChange}
            onMaxChange={onMaxChange}
          />

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[0.65rem] text-slate-400 font-medium">
                Min
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={minText}
                onChange={(e) => setMinText(e.target.value)}
                onBlur={(e) => commitMin(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  commitMin((e.target as HTMLInputElement).value)
                }
                className="w-full px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent tabular-nums"
              />
            </div>
            <span className="text-slate-300 text-sm mt-4">–</span>
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[0.65rem] text-slate-400 font-medium">
                Max
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={maxText}
                onChange={(e) => setMaxText(e.target.value)}
                onBlur={(e) => commitMax(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  commitMax((e.target as HTMLInputElement).value)
                }
                className="w-full px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent tabular-nums"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-4 flex-wrap">
            {SCORE_PRESETS.map((preset) => {
              const active = min === preset.min && max === preset.max;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    onMinChange(preset.min);
                    onMaxChange(preset.max);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                    active
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${preset.dot}`} />
                  {preset.label}
                  {active && <Check size={11} className="text-indigo-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterToolbar({
  searchQuery,
  sortBy,
  statusFilter,
  matchScoreMin,
  matchScoreMax,
  selectedIds,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onMatchScoreMinChange,
  onMatchScoreMaxChange,
  onClearSelection,
  onBulkSuccess,
}: FilterToolbarProps) {
  const { loading, updateStatus } = useUpdateApplicationStatus();

  const handleBulkUpdate = useCallback(
    async (status: RecruiterSetableStatus) => {
      if (selectedIds.length === 0) return;
      const results = await Promise.all(
        selectedIds.map((applicationId) =>
          updateStatus({ applicationId, status }),
        ),
      );
      if (results.every(Boolean)) {
        onClearSelection();
        onBulkSuccess();
      }
    },
    [selectedIds, updateStatus, onClearSelection, onBulkSuccess],
  );

  const selectedCount = selectedIds.length;
  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "All" ||
    matchScoreMin !== 0 ||
    matchScoreMax !== 100;

  return (
    <div className="bg-white border-b border-slate-200/70 px-6 py-3 shrink-0">
      {/* Main filter row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative min-w-50 max-w-70">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search name, email, ID…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-slate-50 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.7rem] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
              Sort
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-7 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white cursor-pointer hover:border-slate-300 transition"
              >
                <option>Application Date</option>
                <option>Match Score</option>
                <option>AI Score</option>
                <option>Name</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {hasActiveFilters && (
            <button
              onClick={() => {
                onSearchChange("");
                onStatusChange("All");
                onMatchScoreMinChange(0);
                onMatchScoreMaxChange(100);
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition font-medium"
            >
              <X size={12} />
              Clear filters
            </button>
          )}

          <ScoreFilterPopover
            min={matchScoreMin}
            max={matchScoreMax}
            onMinChange={onMatchScoreMinChange}
            onMaxChange={onMatchScoreMaxChange}
          />
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[0.65rem] font-bold flex items-center justify-center tabular-nums">
              {selectedCount}
            </div>
            <span className="text-sm text-slate-700 font-semibold">
              selected
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1">
            <button
              disabled={loading}
              onClick={() => handleBulkUpdate("SHORTLISTED")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Shortlist
            </button>
            <button
              disabled={loading}
              onClick={() => handleBulkUpdate("SELECTED")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Schedule Interview
            </button>
            <button
              disabled={loading}
              onClick={() => handleBulkUpdate("REJECTED")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reject
            </button>
          </div>

          {loading && (
            <span className="text-slate-400 text-xs flex items-center gap-1.5">
              <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin inline-block" />
              Updating…
            </span>
          )}

          <button
            onClick={onClearSelection}
            className="ml-auto text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded transition"
          >
            <X size={11} />
            Deselect all
          </button>
        </div>
      )}
    </div>
  );
}
