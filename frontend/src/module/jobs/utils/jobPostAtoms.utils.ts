export const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export const formatSalary = (s: { currency: string; min: number; max: number }) =>
  `${s.currency} ${s.min.toLocaleString()} – ${s.max.toLocaleString()}`;

export const locationLabel = (
  loc: { city: string; state: string; country: string },
  isRemote: boolean
) => {
  if (isRemote) return "Remote";
  return (
    [loc.city, loc.state, loc.country].filter(Boolean).join(", ") ||
    "Not specified"
  );
};

export const expRange = (min: number, max: number) => `${min} – ${max} yrs`;