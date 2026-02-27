import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * TypingHero Component
 *
 * Animated typing effect inspired by JobHub
 * Types out text character by character with cursor
 *
 * @param {Object} props
 * @param {string[]} props.phrases - Array of phrases to cycle through
 * @param {number} props.typingSpeed - Speed of typing in ms (default: 100)
 * @param {number} props.deletingSpeed - Speed of deleting in ms (default: 50)
 * @param {number} props.pauseDuration - Pause after completing phrase in ms (default: 2000)
 * @param {string} props.staticText - Text that appears before the typed text
 * @param {string} props.className - Additional CSS classes
 */
export default function TypingHero({
  phrases = [
    "Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "UI/UX Designer",
  ],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  staticText = "Find your dream ",
  className = "",
}) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let timeout;

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    if (!isDeleting && currentText === currentPhrase) {
      // Finished typing, pause then start deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === "") {
      // Finished deleting — defer state updates to avoid synchronous setState-in-effect
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 0);
    } else if (!isDeleting) {
      // Typing
      timeout = setTimeout(() => {
        setCurrentText(currentPhrase.slice(0, currentText.length + 1));
      }, typingSpeed);
    } else {
      // Deleting
      timeout = setTimeout(() => {
        setCurrentText(currentPhrase.slice(0, currentText.length - 1));
      }, deletingSpeed);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(cursorInterval);
    };
  }, [
    currentText,
    isDeleting,
    currentPhraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <div className={className}>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
        <span className="text-gray-900">{staticText}</span>
        <br />
        <span className="text-primary-500">
          {currentText}
          <motion.span
            className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-primary-500 ml-1"
            animate={{ opacity: showCursor ? 1 : 0 }}
            transition={{ duration: 0 }}
          />
        </span>
      </h1>
    </div>
  );
}

// Alternative version with character-by-character animation (more like JobHub)
export function TypingHeroAnimated({
  text = "Discover the best jobs in Artificial Intelligence.",
  className = "",
}) {
  const characters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
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

  return (
    <motion.h1
      className={`text-5xl md:text-6xl lg:text-7xl font-bold ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={child}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
