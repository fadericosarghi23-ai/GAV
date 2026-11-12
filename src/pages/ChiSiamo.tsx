import { useEffect, useState } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"

import { PageHero } from "@/components/sections/PageHero"
import { QuestionBand } from "@/components/sections/QuestionBand"
import { ParallaxImage, Reveal, ScrollHighlight, SplitWords } from "@/components/motion/Reveal"
import { Button } from "@/components/ui/button"
import { useMeta } from "@/hooks/useMeta"
import { business, h, img, p, pageBlocks, pageMeta, sectionAfter, tel } from "@/lib/content"
import { cn } from "@/lib/utils"

const b = pageBlocks("chi-siamo")

export default function ChiSiamo() {
  const meta = pageMeta("chi-siamo")
  useMeta("Chi Siamo | GAV SRLS, impresa edile in Lombardia", meta.description)
  return (
    <>
      <PageHero
        eyebrow={h(b, "Costruiamo Qualità")}
        title={h(b, "Chi Siamo")}
        crumbs={[{ to: "/chi-siamo", label: "Chi Siamo" }]}
        image={img("cantiere-12-37-17-4").src}
        imageAlt="Squadra GAV al lavoro sulla posa di una copertura"
      />

      <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] tracking-[-0.04em] text-navy">
            <SplitWords text={h(b, "GAV SRLS")} />
          </h2>
        </div>
        <div className="space-y-8 lg:col-span-7 lg:col-start-6">
          <ScrollHighlight
            text={p(b, "GAV SRLS è un")}
            className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] font-semibold leading-[1.25] text-navy"
          />
          <div className="grid gap-8 text-graphite md:grid-cols-2">
            {[p(b, "Nel settore delle costruzioni"), p(b, "Ci occupiamo di lavori"), p(b, "La nostra presenza sul territorio")].map((t, i) => (
              <Reveal key={i} delay={i * 0.08} className={cn(i === 2 && "md:col-span-2")}>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Mission />
      <Hours />
      <QuestionBand />
    </>
  )
}

function Mission() {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white">
      <div className="ribs pointer-events-none absolute inset-0 text-steel/40" aria-hidden />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-2 lg:px-10">
        <ParallaxImage
          src={img("bricklayer-wearing-hard-hat-working-on-brick-wall").src}
          alt=""
          className="aspect-[4/3] rounded-lg"
        />
        <div>
          <p className="eyebrow text-orange">{h(b, "La nostra missione")}</p>
          <Reveal>
            <p className="mt-6 font-display text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold leading-[1.25]">
              {sectionAfter(b, "La nostra missione")[0]}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Button asChild className="mt-10">
              <Link to="/contatti#preventivo">
                Richiedi un Preventivo <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Orari reali del sito, con indicatore "aperto ora" calcolato sull'ora italiana */
function useOpenNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  const parts = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now)
  const wd = parts.find((x) => x.type === "weekday")?.value ?? ""
  const day = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"].findIndex((d) => wd.toLowerCase().startsWith(d))
  const mins = Number(parts.find((x) => x.type === "hour")?.value) * 60 + Number(parts.find((x) => x.type === "minute")?.value)
  const toM = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3))
  const slot = business.hours.find((x) => x.days.includes(day))
  const open = !!slot && mins >= toM(slot.open) && mins < toM(slot.close)
  return { day, open, mins }
}

function Hours() {
  const { day, open, mins } = useOpenNow()
  const toM = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3))
  const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
  return (
    <section className="mx-auto grid max-w-[1400px] gap-14 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:px-10">
      <div className="lg:col-span-5">
        <h2 className="text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[1] tracking-[-0.03em] text-navy">
          <SplitWords text={h(b, "Perché scegliere GAV SRLS")} />
        </h2>
        <Reveal>
          <p className="mt-8 font-display text-xl font-semibold text-navy">{h(b, "Scegliere GAV SRLS significa")}</p>
          <p className="mt-6 text-graphite">{p(b, "Mettiamo impegno")}</p>
          <p className="mt-4 text-graphite">{business.hoursText}</p>
        </Reveal>
      </div>
      <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
        <div className="rounded-lg border border-line bg-white p-6 shadow-[0_30px_60px_-40px_rgba(1,37,62,.5)] md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow text-graphite">Orari</p>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-display text-[13px] font-semibold",
                open ? "bg-[#e7f6ea] text-[#17692b]" : "bg-ice text-graphite",
              )}
            >
              <span className={cn("relative size-2 rounded-full", open ? "bg-[#1f9a3a]" : "bg-graphite/50")}>
                {open && <span className="absolute inset-0 animate-ping rounded-full bg-[#1f9a3a]" />}
              </span>
              {open ? "Disponibili adesso" : "Ora non disponibili"}
            </span>
          </div>
          <ul className="mt-8">
            {days.map((name, i) => {
              const dIdx = (i + 1) % 7
              const slot = business.hours.find((x) => x.days.includes(dIdx))
              const today = dIdx === day
              const pct = slot && today ? Math.min(100, Math.max(0, ((mins - toM(slot.open)) / (toM(slot.close) - toM(slot.open))) * 100)) : 0
              return (
                <li key={name} className={cn("relative grid grid-cols-[1fr_auto] items-center gap-4 border-t border-line py-4", today && "font-semibold")}>
                  <span className="flex items-center gap-3 text-navy">
                    {today && <span className="h-5 w-1 rounded bg-orange" />}
                    {name}
                  </span>
                  <span className="font-display tabular-nums text-navy">{slot ? `${slot.open} alle ${slot.close}` : "Chiuso"}</span>
                  {slot && (
                    <div className="col-span-2 h-1 overflow-hidden rounded bg-ice">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: today ? `${pct}%` : "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("h-full", today ? "bg-orange" : "bg-navy/15")}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <Button asChild variant="navy" className="mt-8 w-full">
            <a href={tel}>
              <Phone /> {business.phoneDisplay}
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
