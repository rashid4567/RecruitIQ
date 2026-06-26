export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(dateStr?: string | Date): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatSalary(
  min?: number,
  max?: number,
  currency = "INR",
) {
  if (min == null && max == null) {
    return "Not disclosed";
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min != null && max == null) {
    return `${formatter.format(min)}+`;
  }

  if (min == null && max != null) {
    return formatter.format(max);
  }

  return `${formatter.format(min!)} – ${formatter.format(max!)}`;
}