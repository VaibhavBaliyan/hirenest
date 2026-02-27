/**
 * Framer Motion Animation Variants
 * Reusable animation configurations for consistent motion design
 */

// Page Transition Variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

// Fade In Variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Slide Up Variants
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Slide Down Variants
export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

// Scale In Variants
export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

// Stagger Children Container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
  }),
};

// Stagger Child
export const staggerChild = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
  },
};

// Typing Animation Container
export const typingContainer = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
  }),
};

// Typing Animation Child (per character)
export const typingChild = {
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    x: 20,
  },
};

// Card Hover Animation
export const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Button Tap Animation
export const buttonTapVariants = {
  tap: {
    scale: 0.98,
  },
};

// Modal Variants
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
};

// Dropdown/Menu Variants
export const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};
