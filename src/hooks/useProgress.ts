import { useScroll, useTransform, type MotionValue } from "framer-motion"
import type { RefObject } from "react"

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"]

/**
 * Avanzamento dello scroll come MotionValue "normale" (calcolato in JS).
 * framer-motion altrimenti delega opacità e trasformazioni alla ScrollTimeline nativa,
 * che con Lenis e le sezioni sticky calcola intervalli diversi.
 */
export function useProgress(target: RefObject<HTMLElement | null>, offset: Offset): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset })
  return useTransform(scrollYProgress, (v) => v)
}
