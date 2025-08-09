/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {object} options - Formatting options
 * @param {string} options.currency - Currency code (default: 'USD')
 * @param {string} options.locale - Locale code (default: 'en-US')
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatPrice = (amount, options = {}) => {
  const { currency = "GBP", locale = "en-GB", decimals = 2 } = options;

  // Handle invalid inputs
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `$0.00`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch (error) {
    console.error("Currency formatting error:", error);
    // Fallback formatting
    return `$${Number(amount).toFixed(decimals)}`;
  }
};
