import { clsx } from "clsx";

/**
 * Utility function to merge class names
 * @param {...(string|object)} inputs - Class names or conditional class objects
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format currency with Indian Rupee symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, length = 100) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "John Doe" -> "JD")
 */
export function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
