/**
 * Example usage of design system tokens in components
 *
 * Using CSS Variables:
 * <div style={{ color: 'var(--purple-500)' }}>Purple Text</div>
 *
 * Using Tailwind:
 * <div className="text-primary-500">Purple Text</div>
 *
 * Using Framer Motion:
 * import { motion } from 'framer-motion';
 * import { fadeInVariants } from '@/lib/motion';
 *
 * <motion.div variants={fadeInVariants} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 */

export const designSystemExample = {
  colors: {
    primary: "var(--purple-500)",
    background: "var(--gray-50)",
  },
  spacing: {
    small: "var(--space-2)",
    medium: "var(--space-4)",
    large: "var(--space-8)",
  },
  typography: {
    heading: "var(--text-4xl)",
    body: "var(--text-base)",
  },
};
