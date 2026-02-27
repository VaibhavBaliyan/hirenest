import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Card Component
 *
 * A flexible card container with optional hover effects and padding options
 *
 * @param {Object} props
 * @param {'none' | 'sm' | 'md' | 'lg'} props.padding - Internal padding size
 * @param {boolean} props.hoverable - Enables hover lift effect
 * @param {boolean} props.clickable - Shows pointer cursor
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 */
export default function Card({
  padding = "md",
  hoverable = false,
  clickable = false,
  className,
  children,
  ...props
}) {
  const baseStyles = cn(
    "bg-white rounded-xl shadow-md",
    "transition-all duration-300",
    clickable && "cursor-pointer",
  );

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const cardStyles = cn(baseStyles, paddingStyles[padding], className);

  const CardWrapper = hoverable || clickable ? motion.div : "div";

  const motionProps =
    hoverable || clickable
      ? {
          whileHover: {
            y: -4,
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
          },
          transition: { duration: 0.3 },
        }
      : {};

  return (
    <CardWrapper className={cardStyles} {...motionProps} {...props}>
      {children}
    </CardWrapper>
  );
}

// Subcomponents for semantic card sections
Card.Header = function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-xl font-bold text-gray-900", className)} {...props}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-gray-600 text-sm", className)} {...props}>
      {children}
    </p>
  );
};

Card.Content = function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};
