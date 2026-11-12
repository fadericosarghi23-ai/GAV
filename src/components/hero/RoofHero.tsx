import { useRef } from "react"
import { Link } from "react-router"
import { motion, useTransform } from "framer-motion"
import { ArrowRight, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Counter } from "@/components/motion/Reveal"
import { useProgress } from "@/hooks/useProgress"
import { useIntroDelay } from "@/components/layout/Intro"
import { business, first, h, img, p, pageBlocks, tel } from "@/lib/content"
import { GALLERY, SERVICES } from "@/lib/site"

const ease = [0.22, 1, 0.36, 1] as const
const SHEETS = 12 // strisce dell'apertura: come lastre di lamiera posate una accanto all'altra
const HERO_PHOTO = "cantiere-12-37-17-2"

/**
 * Hero fotografica: la foto vera di un cantiere GAV si scopre a lastre verticali all'apertura,
 * poi solo una parallasse leggera allo scroll. Nessuna sezione bloccata.
 */
export function RoofHero() {
  const home = pageBlocks("home")
  const counter = first(home, "counter")!
  const photo = img(HERO_PHOTO)
  const caption = GALLERY.find((g) => g.id === HERO_PHOTO)?.caption
  const section = useRef<HTMLElement>(null)
  const scroll = useProgress(section, ["start start", "end start"])
  const photoY = useTransform(scroll, [0, 1], ["0%", "18%"])
  const textY = useTransform(scroll, [0, 1], ["0%", "-30%"])
  const textO = useTransform(scroll, [0, 0.6], [1, 0])
  // se è appena passata l'animazione d'apertura, le lastre le ha già fatte lei: i testi entrano subito dopo
  const intro = useIntroDelay()
  const d = intro ? intro - 0.75 : 0

  return (
    <section ref={section} className="relative isolate flex min-h-svh flex-col overflow-hidden bg-navy-deep" aria-label="GAV SRLS">
      {/* foto del cantiere */}
      <motion.div style={{ y: photoY }} className="absolute inset-0 -z-20">
        <motion.img
          src={photo.src}
          alt={caption ?? ""}
          width={photo.width}
          height={photo.height}
          fetchPriority="high"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 2.6, ease, delay: d }}
          className="h-full w-full object-cover"
        />
      </motion.div>
      {/* velature per la leggibilità */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,17,33,.88)_0%,rgba(4,17,33,.6)_42%,rgba(4,17,33,.15)_75%)] max-md:bg-[linear-gradient(0deg,rgba(4,17,33,.92)_0%,rgba(4,17,33,.7)_50%,rgba(4,17,33,.25)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(180deg,rgba(4,17,33,.55),transparent)]" />

      {/* apertura a lastre: ogni striscia blu scorre via e scopre la foto */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex">
        {!intro && Array.from({ length: SHEETS }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: "0%" }}
            animate={{ y: "-101%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 + i * 0.05 }}
            className="relative h-full flex-1 bg-navy-deep"
          >
            <span className="absolute inset-y-0 right-0 w-px bg-white/10" />
          </motion.span>
        ))}
      </div>

      <motion.div
        style={{ y: textY, opacity: textO }}
        className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-4 pb-12 pt-32 text-white sm:px-6 md:justify-center md:pb-16 lg:px-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: d + 0.9 }}
          className="eyebrow flex items-center gap-3 text-white/80"
        >
          <span className="h-px w-10 bg-orange" />
          {h(home, "GAV SRLS")}
        </motion.p>
        <h1 className="mt-6 max-w-[15ch] font-display text-[clamp(2.4rem,5.2vw,4.9rem)] font-bold leading-[1.04] tracking-[-0.025em]">
          {h(home, "Costruiamo Qualità")
            .split(" ")
            .map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease, delay: d + 1 + i * 0.06 }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: d + 1.35 }}
          className="mt-6 max-w-[34rem] text-[15px] leading-relaxed text-white/80 md:text-[17px]"
        >
          {p(home, "GAV SRLS è un")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: d + 1.5 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Button asChild size="lg">
            <Link to="/contatti#preventivo">
              Richiedi un Preventivo <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-white hover:border-white hover:bg-white hover:text-navy">
            <a href={tel}>
              <Phone /> {business.phoneDisplay}
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d + 1.8 }}
          className="absolute bottom-[104px] right-4 hidden max-w-xs text-right text-[12px] text-white/60 sm:right-6 md:block lg:right-10"
        >
          Cantiere GAV · {caption}
        </motion.p>
      )}

      {/* fascia con i dati dell'azienda */}
      <div className="relative border-t border-white/10 bg-navy text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 py-4 sm:px-6 md:py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-bold leading-none tracking-[-0.03em] text-orange md:text-4xl">
              <Counter from={counter.from} to={counter.to} suffix={counter.suffix} />
            </span>
            <span className="eyebrow max-w-[9rem] text-[10px] leading-tight text-white/70 md:text-[11px]">{counter.label}</span>
          </div>
          <nav aria-label="Servizi" className="hidden items-center gap-8 md:flex">
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/servizi/${s.slug}`} className="group flex items-center gap-2 font-display text-[15px] font-semibold">
                <span className="text-[12px] text-orange">{s.number}</span>
                <span className="bg-[linear-gradient(#ffa100,#ffa100)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  {s.short}
                </span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 font-display text-[13px] font-semibold md:text-[15px]">
            <MapPin className="size-4 shrink-0 text-orange" />
            {business.area}
          </div>
        </div>
      </div>
    </section>
  )
}
