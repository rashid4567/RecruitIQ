export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function fakeAiScore(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(hash % 100) + 1;
}

export function fakeMatchPercent(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 17 + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(hash % 100) + 1;
}

export function aiScoreBarColor(score: number): string {
  if (score < 40) return "bg-red-400";
  if (score < 70) return "bg-gradient-to-r from-amber-400 to-yellow-300";
  return "bg-gradient-to-r from-emerald-400 to-green-500";
}

export function formatDate(value: string | Date | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}