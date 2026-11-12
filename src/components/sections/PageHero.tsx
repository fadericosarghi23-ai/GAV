import { useRef, type ReactNode } from "react"
import { Link } from "react-router"
import { motion, useTransform } from "framer-motion"
import { ChevronRight } from "lucide-react"

import { SplitWords } from "@/components/motion/Reveal"
import { useProgress } from "@/hooks/useProgress"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

export function PageHero({
  eyebrow,
  title,
  crumbs = [],
  image,
  imageAlt = "",
  children,
  number,
  className,
}: {
  eyebrow?: string
  title: string
  crumbs?: { to: string; label: string }[]
  image?: string
  imageAlt?: string
  children?: ReactNode
  number?: string
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const prog = useProgress(ref, ["start start", "end start"])
  const imgY = useTransform(prog, [0, 1], ["0%", "22%"])
  const titleY = useTransform(prog, [0, 1], ["0%", "-30%"])
  return (
    <section ref={ref} className={cn("relative overflow-hidden bg-ice pt-32 md:pt-40", className)}>
      <div aria-hidden className="ribs pointer-events-none absolute inset-y-0 right-0 w-1/2 text-navy/30 [mask-image:linear-gradient(90deg,transparent,#000)]" />
      {number && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
          className="steel-text pointer-events-none absolute -right-4 top-20 select-none font-display text-[38vw] font-bold leading-none tracking-[-0.06em] opacity-60 md:text-[22rem]"
        >
          {number}
        </motion.span>
      )}
      <motion.div style={{ y: titleY }} className="relative mx-auto max-w-[1400px] px-4 pb-14 sm:px-6 md:pb-20 lg:px-10">
        <nav aria-label="Percorso" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1 text-[13px] text-graphite">
            <li>
              <Link to="/" className="hover:text-navy">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.to} className="flex items-center gap-1">
                <ChevronRight className="size-3.5" />
                <Link to={c.to} className="hover:text-navy">{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="eyebrow mb-6 flex items-center gap-3 text-graphite"
          >
            <span className="h-px w-10 bg-orange" /> {eyebrow}
          </motion.p>
        )}
        <h1 className="max-w-[18ch] text-[clamp(2.6rem,7.5vw,7rem)] font-bold leading-[0.95] tracking-[-0.035em] text-navy">
          <SplitWords text={title} immediate delay={0.45} stagger={0.06} />
        </h1>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.8 }}
            className="mt-8 max-w-2xl text-graphite md:text-lg"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
      {image && (
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.3, ease, delay: 0.55 }}
          className="relative mx-auto h-[46vh] max-w-[1400px] overflow-hidden md:h-[62vh] lg:rounded-t-lg"
        >
          <motion.img
            src={image}
            alt={imageAlt}
            style={{ y: imgY }}
            className="absolute inset-0 h-[120%] w-full -translate-y-[10%] object-cover"
          />
        </motion.div>
      )}
    </section>
  )
}
