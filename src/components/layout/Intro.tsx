import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { prefersReducedMotion, useLenis } from "@/components/motion/SmoothScroll"
import { business } from "@/lib/content"

/**
 * Animazione d'apertura del sito: il logo GAV si disegna, una linea arancio si riempie,
 * poi le strisce si sollevano come lastre di lamiera e scoprono la pagina.
 * Una sola volta per visita (sessionStorage), saltata con "riduci movimento".
 */

const KEY = "gav-intro-vista"
const HOLD = 1.55 // secondi prima che le lastre si sollevino
const SHEETS = 12
const ease = [0.76, 0, 0.24, 1] as const

/** Ritardo (in secondi) che le animazioni d'ingresso devono aggiungere mentre l'apertura è in corso */
const IntroContext = createContext(0)
export const useIntroDelay = () => useContext(IntroContext)

function shouldPlay() {
  if (typeof window === "undefined" || prefersReducedMotion()) return false
  try {
    return !sessionStorage.getItem(KEY)
  } catch {
    return true // storage non disponibile: mostriamo comunque l'apertura
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [play] = useState(shouldPlay)
  const [visible, setVisible] = useState(play)
  const lenis = useLenis()

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, "1")
    } catch {
      /* niente da fare */
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    lenis?.stop()
    document.documentElement.style.overflow = "hidden"
    const t = setTimeout(() => setVisible(false), (HOLD + 0.35) * 1000)
    return () => clearTimeout(t)
  }, [visible, lenis])

  useEffect(() => {
    if (visible) return
    document.documentElement.style.overflow = ""
    lenis?.start()
  }, [visible, lenis])

  return (
    <IntroContext.Provider value={play ? HOLD + 0.5 : 0}>
      {children}
      <AnimatePresence>{visible && <IntroOverlay />}</AnimatePresence>
    </IntroContext.Provider>
  )
}

function IntroOverlay() {
  const tagline = business.tagline.replace(/^GAV SRLS:/, "").trim()
  return (
    <motion.div className="fixed inset-0 z-[100]" aria-hidden exit={{ pointerEvents: "none" }}>
      {/* lastre */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: SHEETS }).map((_, i) => (
          <motion.span
            key={i}
            className="relative h-full flex-1 bg-navy-deep"
            initial={{ y: "0%" }}
            exit={{ y: "-101%", transition: { duration: 0.85, ease, delay: i * 0.045 } }}
          >
            <span className="absolute inset-y-0 right-0 w-px bg-white/[0.06]" />
          </motion.span>
        ))}
      </div>

      {/* logo, linea e slogan */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      >
        <motion.img
          src="/brand/logo-gav.svg"
          alt=""
          width={1565}
          height={1005}
          className="w-[min(64vw,300px)] rounded-[4px]"
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
          animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
        />
        <div className="mt-8 h-px w-40 overflow-hidden bg-white/15">
          <motion.div
            className="h-full origin-left bg-orange"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.35 }}
          />
        </div>
        <motion.p
          className="eyebrow mt-5 text-center text-[10px] text-white/60 md:text-[11px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {tagline}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
