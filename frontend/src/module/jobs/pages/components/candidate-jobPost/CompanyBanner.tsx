import React from "react";
import {
  Linkedin,
  Twitter,
  MapPin,
  Briefcase,
  Globe,
  Users,
  TrendingUp,
} from "lucide-react";
import type { Job } from "@/module/jobs/types/job.types";
import { useJobRotator } from "../../../hooks/candidate-jobPost.hooks/useJobRotator";

interface CompanyBannerProps {
  total: number;
  jobs: Job[];
}

export const CompanyBanner: React.FC<CompanyBannerProps> = ({
  total,
  jobs,
}) => {
  const { currentJob, currentIndex, goTo, isAnimating } = useJobRotator(jobs);

  const companyName = jobs[0]?.companyName ?? "Company";
  const initials = companyName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const getLocationLabel = (job: Job): string => {
    if (job.isRemote) return "Remote";
    const { city, state, country } = job.location;
    return [city, state, country].filter(Boolean).join(", ") || "—";
  };

  const remoteCount = jobs.filter((j) => j.isRemote).length;
  const departments = [
    ...new Set(jobs.map((j) => j.department).filter(Boolean)),
  ].slice(0, 3);

  return (
    <div className="relative mt-16 bg-linear-to-br from-indigo-950 via-indigo-900 to-violet-900 overflow-hidden">
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-linear(circle at 1.5px 1.5px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="absolute top-0 right-1/4 w-56 h-56 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-400/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-400/25 to-violet-400/25 border border-white/20 flex items-center justify-center text-white font-black text-sm tracking-wide">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-indigo-900 shadow-lg" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-lg font-black text-white tracking-tight leading-none">
                {companyName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {total} open roles
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {remoteCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/8 border border-white/12 px-2.5 py-0.5 text-[11px] font-medium text-white/60">
                  <Globe className="w-3 h-3 shrink-0" />
                  {remoteCount} remote
                </span>
              )}
              {jobs[0]?.location?.country && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/8 border border-white/12 px-2.5 py-0.5 text-[11px] font-medium text-white/60">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {[jobs[0].location.city, jobs[0].location.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
              {departments.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/8 border border-white/12 px-2.5 py-0.5 text-[11px] font-medium text-white/60">
                  <Users className="w-3 h-3 shrink-0" />
                  {departments.join(" · ")}
                </span>
              )}
              {total > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-400/20 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  Actively hiring
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {jobs.length > 0 && currentJob !== null && (
              <div className="hidden md:flex flex-col gap-2 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-3 w-64">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-indigo-500/25 border border-indigo-400/20 flex items-center justify-center shrink-0">
                      <Briefcase className="w-2.5 h-2.5 text-indigo-300" />
                    </div>
                    <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
                      Now hiring
                    </p>
                  </div>
                  <span className="text-[10px] text-white/25 tabular-nums font-medium">
                    {currentIndex + 1} / {jobs.length}
                  </span>
                </div>

                <div
                  className={[
                    "min-w-0 transition-all duration-300",
                    isAnimating
                      ? "opacity-0 translate-y-1.5"
                      : "opacity-100 translate-y-0",
                  ].join(" ")}
                >
                  <p className="text-sm font-bold text-white truncate leading-tight mb-1">
                    {currentJob.title}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {currentJob.department.length > 0 && (
                      <span className="text-[11px] text-indigo-300 font-medium truncate">
                        {currentJob.department}
                      </span>
                    )}
                    <span className="text-white/20 text-[11px]">·</span>
                    <span className="text-[11px] text-white/40 truncate">
                      {getLocationLabel(currentJob)}
                    </span>
                    {currentJob.salary?.max != null && (
                      <>
                        <span className="text-white/20 text-[11px]">·</span>
                        <span className="text-[11px] text-emerald-400/80 font-semibold">
                          {currentJob.salary?.currency ?? "INR"}{" "}
                          {(currentJob.salary.max / 100000).toFixed(0)}L
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-0.5">
                  {jobs.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={"Go to job " + (i + 1)}
                      className={[
                        "h-0.5 rounded-full transition-all duration-300",
                        i === currentIndex
                          ? "w-5 bg-indigo-400"
                          : "w-1.5 bg-white/20 hover:bg-white/40",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="hidden md:block w-px h-10 bg-white/10" />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-200"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Twitter"
                className="w-8 h-8 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-200"
              >
                <Twitter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
