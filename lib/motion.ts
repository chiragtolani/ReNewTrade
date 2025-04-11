"use client"

import type { MotionProps, Variant } from "framer-motion"

export const fadeIn = (direction: "up" | "down" | "left" | "right", delay = 0): MotionProps => {
  return {
    initial: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }
}

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const cardVariants: Record<string, Variant> = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export const listItemVariants: Record<string, Variant> = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
}
