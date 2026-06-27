export const JOB_TYPE_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  "full-time": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  "part-time": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  contract: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  internship: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
};