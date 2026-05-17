export function formatDate(date?: string) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function formatSalary(s: { min: number; max: number; currency: string }) {
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency", currency: s.currency, maximumFractionDigits: 0,
  });
  return `${fmt.format(s.min)} – ${fmt.format(s.max)}`;
}

export function locationLabel(
  location: { city: string; state: string; country: string },
  isRemote: boolean,
) {
  if (isRemote) return "Remote";
  return [location.city, location.state, location.country].filter(Boolean).join(", ") || "Not specified";
}

export function expRange(min: number, max: number) {
  if (min === 0 && max === 0) return "Entry Level";
  if (min === max) return `${min} yrs`;
  return `${min}–${max} yrs`;
}