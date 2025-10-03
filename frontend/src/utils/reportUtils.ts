/**
 * Format a number as currency (USD)
 * @param n - Number to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (n: number): string => {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

/**
 * Format a Date object as YYYY-MM-DD string
 * @param date - Date to format
 * @returns Formatted date string (e.g., "2025-10-04")
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

/**
 * Get date range for common periods
 */
export const getDateRange = (period: "today" | "week" | "month" | "year"): { start: string; end: string } => {
  const now = new Date();
  const end = formatDate(now);
  let start: string;

  switch (period) {
    case "today":
      start = end;
      break;
    case "week":
      start = formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
      break;
    case "month":
      start = formatDate(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000));
      break;
    case "year":
      start = formatDate(new Date(Date.now() - 364 * 24 * 60 * 60 * 1000));
      break;
  }

  return { start, end };
};
