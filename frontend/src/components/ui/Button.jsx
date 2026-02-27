import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.loading - Shows loading spinner
 * @param {boolean} props.disabled - Disables the button
 * @param {boolean} props.fullWidth - Makes button full width
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {string} props.className - Additional CSS classes
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  leftIcon,
  rightIcon,
  className,
  type = "button",
  ...props
}) {
  // Base styles
  const baseStyles = cn(
    "inline-flex items-center justify-center",
    "font-semibold",
    "rounded-full", // Pill shape
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "select-none",
  );

  // Variant styles
  const variants = {
    primary: cn(
      "bg-primary-500 text-white",
      "hover:bg-primary-600 hover:shadow-purple-sm",
      "active:bg-primary-700",
      "focus:ring-primary-500",
      "disabled:hover:bg-primary-500 disabled:hover:shadow-none",
    ),
    secondary: cn(
      "bg-white text-primary-600 border-2 border-primary-500",
      "hover:bg-primary-50",
      "active:bg-primary-100",
      "focus:ring-primary-500",
      "disabled:hover:bg-white",
    ),
    ghost: cn(
      "bg-transparent text-primary-600",
      "hover:bg-primary-50",
      "active:bg-primary-100",
      "focus:ring-primary-500",
      "disabled:hover:bg-transparent",
    ),
    danger: cn(
      "bg-error text-white",
      "hover:bg-red-600",
      "active:bg-red-700",
      "focus:ring-error",
      "disabled:hover:bg-error",
    ),
  };

  // Size styles
  const sizes = {
    sm: "text-sm px-4 py-2 gap-2",
    md: "text-base px-6 py-3 gap-2",
    lg: "text-lg px-8 py-4 gap-3",
  };

  // Full width style
  const widthStyle = fullWidth ? "w-full" : "";

  const buttonStyles = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    widthStyle,
    className,
  );

  return (
    <motion.button
      type={type}
      className={buttonStyles}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Left Icon */}
      {!loading && leftIcon && (
        <span className="shrink-0">{leftIcon}</span>
      )}

      {/* Loading Spinner */}
      {loading && (
        <Loader2
          className="animate-spin shrink-0"
          size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        />
      )}

      {/* Button Text */}
      <span>{children}</span>

      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  );
}
