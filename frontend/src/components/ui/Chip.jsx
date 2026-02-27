import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Chip Component
 *
 * Interactive pill-shaped element for filters, tags, or selections
 *
 * @param {Object} props
 * @param {boolean} props.selected - Whether chip is selected/active
 * @param {boolean} props.removable - Shows remove icon
 * @param {Function} props.onRemove - Callback when remove icon is clicked
 * @param {Function} props.onClick - Callback when chip is clicked
 * @param {'sm' | 'md' | 'lg'} props.size - Chip size
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Chip content
 */
export default function Chip({
  selected = false,
  removable = false,
  onRemove,
  onClick,
  size = "md",
  className,
  children,
  ...props
}) {
  const baseStyles = cn(
    "inline-flex items-center gap-1.5",
    "font-medium rounded-full",
    "transition-all duration-200",
    "select-none",
    onClick && "cursor-pointer",
  );

  const sizes = {
    sm: "text-xs px-3 py-1",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };

  const stateStyles = selected
    ? cn(
        "bg-primary-500 text-white",
        "hover:bg-primary-600",
        "active:bg-primary-700",
      )
    : cn(
        "bg-gray-100 text-gray-700",
        "hover:bg-gray-200",
        "active:bg-gray-300",
        "border border-gray-300",
      );

  const chipStyles = cn(baseStyles, sizes[size], stateStyles, className);

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.();
  };

  const ChipWrapper = onClick ? motion.button : motion.div;

  return (
    <ChipWrapper
      type={onClick ? "button" : undefined}
      className={chipStyles}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <span>{children}</span>

      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            "rounded-full p-0.5",
            "hover:bg-black/10",
            "transition-colors duration-150",
            "focus:outline-none",
          )}
          aria-label="Remove"
        >
          <X size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />
        </button>
      )}
    </ChipWrapper>
  );
}
