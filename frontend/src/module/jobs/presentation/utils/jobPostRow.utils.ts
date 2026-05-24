export function formatDate(date?: Date | string | null): string {
  if (!date) {
    return "N/A";
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatSalary(salary: {
  min: number;
  max: number;
  currency: string;
}): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: salary.currency,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(salary.min)} – ${formatter.format(salary.max)}`;
}

export function locationLabel(
  location: {
    city: string;
    state: string;
    country: string;
  },
  isRemote: boolean,
): string {
  if (isRemote) {
    return "Remote";
  }

  return (
    [location.city, location.state, location.country]
      .filter(Boolean)
      .join(", ") || "Not specified"
  );
}

export function expRange(min: number, max: number): string {
  if (min === 0 && max === 0) {
    return "Entry Level";
  }

  if (min === max) {
    return `${min} yrs`;
  }

  return `${min} - ${max} yrs`;
}
