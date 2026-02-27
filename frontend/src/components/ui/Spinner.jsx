import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Spinner Component
 *
 * Loading spinner with multiple sizes and variants
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - Spinner size
 * @param {'primary' | 'white' | 'current'} props.variant - Color variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullScreen - Center in full screen
 */
export default function Spinner({
  size = "md",
  variant = "primary",
  className,
  fullScreen = false,
  ...props
}) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const variants = {
    primary: "text-primary-500",
    white: "text-white",
    current: "text-current",
  };

  const spinner = (
    <Loader2
      className={cn("animate-spin", variants[variant], className)}
      size={sizes[size]}
      {...props}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {spinner}
        </motion.div>
      </div>
    );
  }

  return spinner;
}

/**
 * LoadingOverlay Component
 *
 * Overlay with spinner and optional message
 */
export function LoadingOverlay({ message, size = "lg" }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Spinner size={size} variant="primary" />
        {message && (
          <p className="text-gray-600 text-lg font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}

/**
 * InlineLoader Component
 *
 * Small inline loader for buttons and inline elements
 */
export function InlineLoader({ className }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Spinner size="sm" variant="current" />
      <span>Loading...</span>
    </div>
  );
}
