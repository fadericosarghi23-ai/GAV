import { useEffect } from "react"
import { useLocation, useOutlet } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useLenis } from "@/components/motion/SmoothScroll"

const ease = [0.76, 0, 0.24, 1] as const

export function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const lenis = useLenis()

  // ancore (#preventivo) dopo il cambio pagina
  useEffect(() => {
    if (!location.hash) return
    const t = setTimeout(() => {
      const el = document.querySelector<HTMLElement>(location.hash)
      if (!el) return
      if (lenis) lenis.scrollTo(el, { offset: -100 })
      else el.scrollIntoView()
    }, 750)
    return () => clearTimeout(t)
  }, [location.pathname, location.hash, location.search, lenis])

  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-orange focus:px-4 focus:py-2"
      >
        Vai al contenuto
      </a>
      <Navbar />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
          else window.scrollTo(0, 0)
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }}
      >
        <motion.div key={location.pathname} initial="initial" animate="enter" exit="exit">
          <Curtain />
          <motion.main
            id="contenuto"
            variants={{
              initial: { opacity: 0, y: 40 },
              enter: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 } },
              exit: { opacity: 0, y: -30, transition: { duration: 0.35, ease } },
            }}
          >
            {outlet}
          </motion.main>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  )
}

/** Transizione tra pagine: una lastra blu con la fascia d'acciaio diagonale del logo */
function Curtain() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] origin-top bg-navy-deep"
        variants={{
          initial: { scaleY: 1 },
          enter: { scaleY: 0, transition: { duration: 0.6, ease, delay: 0.05 } },
          exit: { scaleY: 0 },
        }}
      >
        <CurtainArt />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] origin-bottom bg-navy-deep"
        variants={{
          initial: { scaleY: 0 },
          enter: { scaleY: 0 },
          exit: { scaleY: 1, transition: { duration: 0.45, ease } },
        }}
      >
        <CurtainArt />
      </motion.div>
    </>
  )
}

function CurtainArt() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="ribs absolute inset-0 text-steel/50" />
      <div className="absolute left-1/2 top-1/2 h-[24vmax] w-[220vmax] -translate-x-1/2 -translate-y-1/2 rotate-[-38deg] border-y-[6px] border-white bg-[linear-gradient(90deg,#5d616a,#a5a8ae_40%,#e4e6ea_50%,#82858d_70%,#5d616a)] shadow-[0_0_0_14px_#041121,0_0_0_20px_#fff]" />
    </div>
  )
}
