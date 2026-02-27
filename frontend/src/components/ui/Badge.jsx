import { cn } from "../../lib/utils";

/**
 * Badge Component
 *
 * Small label for statuses, categories, or counts
 *
 * @param {Object} props
 * @param {'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'} props.variant - Badge color variant
 * @param {'sm' | 'md' | 'lg'} props.size - Badge size
 * @param {boolean} props.dot - Shows a dot indicator
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Badge content
 */
export default function Badge({
  variant = "primary",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}) {
  const baseStyles = cn(
    "inline-flex items-center gap-1.5",
    "font-medium rounded-full",
    "whitespace-nowrap",
  );

  const variants = {
    primary: "bg-primary-100 text-primary-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-orange-100 text-orange-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    neutral: "bg-gray-100 text-gray-700",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const badgeStyles = cn(baseStyles, variants[variant], sizes[size], className);

  return (
    <span className={badgeStyles} {...props}>
      {dot && (
        <span
          className={cn(
            "rounded-full",
            dotSizes[size],
            variant === "primary" && "bg-primary-500",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-orange-500",
            variant === "error" && "bg-red-500",
            variant === "info" && "bg-blue-500",
            variant === "neutral" && "bg-gray-500",
          )}
        />
      )}
      {children}
    </span>
  );
}
