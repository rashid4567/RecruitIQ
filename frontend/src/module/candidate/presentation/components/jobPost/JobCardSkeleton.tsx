import React from "react";

export const JobCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
      </div>
      <div className="h-6 w-20 bg-slate-100 rounded-full ml-3" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
      <div className="h-3 bg-slate-100 rounded-lg w-2/5" />
      <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
    </div>
    <div className="flex gap-2 mb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-6 w-14 bg-slate-100 rounded-lg" />
      ))}
    </div>
    <div className="flex justify-between pt-3 border-t border-slate-100">
      <div className="h-3 w-14 bg-slate-100 rounded" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  </div>
);