import { useEffect, useRef, type ReactNode } from "react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,

  useTransform,
  type MotionValue,
} from "framer-motion"
import { useProgress } from "@/hooks/useProgress"

import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: "div" | "li" | "section" | "p" | "article"
}) {
  const C = motion[as]
  return (
    <C
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </C>
  )
}

/** Titolo che entra parola per parola, da sotto una maschera */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  immediate = false,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  immediate?: boolean
}) {
  const words = text.split(" ")
  const variants = {
    hidden: { y: "110%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 0.9, ease, delay: delay + i * stagger } }),
  }
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            custom={i}
            variants={variants}
            initial="hidden"
            {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true } })}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Numero che conta quando entra in vista */
export function Counter({ from = 0, to, suffix = "", className }: { from?: number; to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(from)
  useEffect(() => {
    if (!inView) return
    const c = animate(mv, to, { duration: 2, ease: [0.16, 1, 0.3, 1] })
    const unsub = mv.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
    })
    return () => {
      c.stop()
      unsub()
    }
  }, [inView, mv, to, suffix])
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {from}
      {suffix}
    </span>
  )
}

/** Immagine con parallasse verticale dentro una cornice */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  strength = 12,
  width,
  height,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  strength?: number
  width?: number
  height?: number
  priority?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = useProgress(ref, ["start end", "end start"])
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ y, scale: 1 + strength / 50 }}
        className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
      />
    </div>
  )
}

/** Testo che si "accende" parola per parola mentre si scorre */
export function ScrollHighlight({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const scrollYProgress = useProgress(ref, ["start 85%", "end 45%"])
  const words = text.split(" ")
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  )
}
