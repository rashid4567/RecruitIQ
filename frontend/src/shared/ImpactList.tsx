import { cn } from "@/lib/utils";

interface ImpactListProps {
  label: string;
  items: ReadonlyArray<string>;
  tone?: "danger" | "success" | "warning" | "neutral";
}
const TONE_STYLES = {
  danger: "border-red-100 bg-red-50/60 text-red-700",
  success: "border-emerald-100 bg-emerald-50/60 text-emerald-700",
  warning: "border-amber-100 bg-amber-50/60 text-amber-700",
  neutral: "border-gray-100 bg-gray-50/60 text-gray-700",
};

export function ImpactList({ label, items, tone = "neutral" }: ImpactListProps) {
  return (
    <div className={cn("w-full rounded-xl border p-4", TONE_STYLES[tone])}>
      <p className="mb-1 text-sm font-semibold">{label}</p>
      <ul className="space-y-1 text-xs font-normal">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}