import { useRef } from "react"
import { Link } from "react-router"
import { motion, useTransform } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"
import { useProgress } from "@/hooks/useProgress"

import { Button } from "@/components/ui/button"
import { SplitWords } from "@/components/motion/Reveal"
import { business, h, p, pageBlocks, tel } from "@/lib/content"

/** Sezione "Hai qualche domanda?" del vecchio sito, riproposta come fascia finale */
export function QuestionBand() {
  const home = pageBlocks("home")
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useProgress(ref, ["start end", "end start"])
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"])
  return (
    <section ref={ref} className="relative overflow-hidden bg-navy text-white">
      <motion.div
        aria-hidden
        style={{ x }}
        className="pointer-events-none absolute -right-10 top-1/2 h-[180%] w-[55%] -translate-y-1/2 rotate-[-40deg] bg-[linear-gradient(90deg,#5d616a,#a5a8ae_40%,#e4e6ea_50%,#82858d_70%,#5d616a)] opacity-25"
      />
      <div className="ribs pointer-events-none absolute inset-0 text-white/40" aria-hidden />
      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7">
          <p className="eyebrow text-orange">{h(home, "Ristrutturazioni Chiavi in Mano")}</p>
          <h2 className="mt-5 text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            <SplitWords text={h(home, "Hai qualche domanda?")} />
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-8 lg:col-span-5">
          <p className="text-white/80">{p(home, "La nostra presenza sul territorio lombardo")}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={tel}>
                <Phone /> {business.phoneDisplay}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white hover:border-white hover:bg-white hover:text-navy">
              <Link to="/contatti#preventivo">
                Richiedi un preventivo <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
