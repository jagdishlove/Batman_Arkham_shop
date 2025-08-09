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

/**
 * Format date string to readable format
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @param {string} options.format - Format type ('full', 'short', 'time')
 * @param {string} options.locale - Locale code (default: 'en-GB')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const { format = "full", locale = "en-GB" } = options;

  // Handle invalid dates
  if (!date) return "Invalid Date";

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj)) return "Invalid Date";

    const formatOptions = {
      full: {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
      short: {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
      time: {
        hour: "2-digit",
        minute: "2-digit",
      },
    };

    return new Intl.DateTimeFormat(
      locale,
      formatOptions[format] || formatOptions.full
    ).format(dateObj);
  } catch (error) {
    console.error("Date formatting error:", error);
    // Fallback to basic format
    return new Date(date).toLocaleString();
  }
};

// Usage examples:
// formatDate('2023-08-10T14:30:00Z') => "10 August 2023, 14:30"
// formatDate('2023-08-10', { format: 'short' }) => "10 Aug 2023"
// formatDate('2023-08-10T14:30:00Z', { format: 'time' }) => "14:30"
