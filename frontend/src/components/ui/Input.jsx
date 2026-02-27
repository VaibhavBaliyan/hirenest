import { forwardRef } from "react";
import { cn } from "../../lib/utils";

/**
 * Input Component
 *
 * Form input field with label, error states, and helper text
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text below input
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {boolean} props.fullWidth - Makes input full width
 * @param {string} props.className - Additional CSS classes for input
 * @param {string} props.containerClassName - Additional CSS classes for container
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    containerClassName,
    id,
    ...props
  },
  ref,
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const inputStyles = cn(
    "block w-full px-4 py-3",
    "text-gray-900 placeholder-gray-400",
    "bg-white border rounded-lg",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-1",
    error
      ? "border-error focus:ring-error focus:border-error"
      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
    leftIcon && "pl-11",
    rightIcon && "pr-11",
    className,
  );

  const containerStyles = cn(fullWidth ? "w-full" : "", containerClassName);

  return (
    <div className={containerStyles}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input ref={ref} id={inputId} className={inputStyles} {...props} />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
