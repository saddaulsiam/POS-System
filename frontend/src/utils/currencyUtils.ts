/**
 * Currency formatting utilities
 * Uses POS Settings for currency symbol and position
 */

interface CurrencySettings {
  currencySymbol?: string;
  currencyPosition?: string;
}

/**
 * Format a number as currency using POS settings
 * @param amount - The numeric amount to format
 * @param settings - Currency settings (symbol and position)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(100, { currencySymbol: "$", currencyPosition: "before" }) // "$100.00"
 * formatCurrency(100, { currencySymbol: "€", currencyPosition: "after" })  // "100.00€"
 */
export const formatCurrency = (amount: number, settings?: CurrencySettings | null, decimals: number = 2): string => {
  // Default to $ before if settings not available
  const symbol = settings?.currencySymbol || "$";
  const position = settings?.currencyPosition || "before";

  const formattedAmount = amount.toFixed(decimals);

  if (position === "after") {
    return `${formattedAmount}${symbol}`;
  }

  return `${symbol}${formattedAmount}`;
};

/**
 * Format currency with sign (for negative amounts like discounts)
 * @param amount - The numeric amount to format
 * @param settings - Currency settings
 * @param showPositiveSign - Whether to show + for positive numbers
 * @returns Formatted currency string with sign
 *
 * @example
 * formatCurrencyWithSign(-10, settings) // "-$10.00"
 * formatCurrencyWithSign(10, settings, true) // "+$10.00"
 */
export const formatCurrencyWithSign = (
  amount: number,
  settings?: CurrencySettings | null,
  showPositiveSign: boolean = false
): string => {
  const symbol = settings?.currencySymbol || "$";
  const position = settings?.currencyPosition || "before";
  const absAmount = Math.abs(amount).toFixed(2);

  let sign = "";
  if (amount < 0) {
    sign = "-";
  } else if (amount > 0 && showPositiveSign) {
    sign = "+";
  }

  if (position === "after") {
    return `${sign}${absAmount}${symbol}`;
  }

  return `${sign}${symbol}${absAmount}`;
};

/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse
 * @param settings - Currency settings
 * @returns Numeric value
 *
 * @example
 * parseCurrency("$100.00", settings) // 100
 * parseCurrency("100.00€", settings) // 100
 */
export const parseCurrency = (currencyString: string, settings?: CurrencySettings | null): number => {
  const symbol = settings?.currencySymbol || "$";

  // Remove currency symbol and any whitespace
  const cleanString = currencyString.replace(symbol, "").replace(/\s/g, "").trim();

  return parseFloat(cleanString) || 0;
};
