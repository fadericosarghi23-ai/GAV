import { useState } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

import { OtherServices, ServiceCTA, ServiceHeader, ServiceIntro, ServiceSections, useService } from "@/components/sections/ServiceParts"
import { QuestionBand } from "@/components/sections/QuestionBand"
import { Reveal, SplitWords } from "@/components/motion/Reveal"
import { Button } from "@/components/ui/button"
import { p } from "@/lib/content"
import { contactLink } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function Muratura() {
  const s = useService("muratura")
  const blocks = s.data.blocks
  return (
    <>
      <ServiceHeader slug="muratura" />
      <ServiceIntro blocks={blocks} />
      <BrickConfigurator source={p(blocks, "I nostri servizi possono")} />
      <ServiceSections blocks={blocks} />
      <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10">
        <ServiceCTA slug="muratura" />
      </section>
      <OtherServices current="muratura" />
      <QuestionBand />
    </>
  )
}

/*
  Tipologie e destinatari sono presi alla lettera dai testi della pagina originale:
  "interventi di muratura, opere edili, manutenzione e lavori di ristrutturazione"
  "privati, aziende e proprietari di immobili"
*/
const TYPES = ["Interventi di muratura", "Opere edili", "Manutenzione", "Lavori di ristrutturazione"]
const WHO = ["Privato", "Azienda", "Proprietario di immobili"]

// muro a corsi sfalsati: null = mattone di riempimento, numero = tipologia
const ROWS: (number | null)[][] = [
  [null, 0, null, null],
  [null, null, 1, null, null],
  [2, null, null, null],
  [null, null, null, 3, null],
]

function BrickConfigurator({ source }: { source: string }) {
  const [type, setType] = useState<number | null>(null)
  const [who, setWho] = useState<number | null>(null)
  const ready = type !== null && who !== null
  const message = ready ? `Tipo di intervento: ${TYPES[type]}\nRichiedente: ${WHO[who]}\nZona: Lombardia\n\n` : ""

  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-white md:py-32">
      <div aria-hidden className="ribs pointer-events-none absolute inset-0 text-steel/30" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-orange">Il suo intervento, mattone per mattone</p>
            <h2 className="mt-5 text-[clamp(2.2rem,4.8vw,4.2rem)] font-bold leading-[1] tracking-[-0.03em]">
              <SplitWords text="Scelga il mattone giusto" />
            </h2>
          </div>
          <Reveal className="text-white/70 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-[15px]">“{source}”</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* il muro */}
          <div className="lg:col-span-7" role="group" aria-label="Tipologia di intervento">
            <div className="space-y-2 [perspective:900px]">
              {ROWS.map((row, r) => (
                <div key={r} className={cn("flex gap-2", r % 2 === 1 && "-ml-[9%]")}>
                  {row.map((cell, c) => {
                    const isType = cell !== null
                    const active = isType && type === cell
                    return (
                      <motion.button
                        key={c}
                        type="button"
                        disabled={!isType}
                        aria-pressed={isType ? active : undefined}
                        tabIndex={isType ? 0 : -1}
                        onClick={() => isType && setType(cell)}
                        initial={{ opacity: 0, y: -40, rotateX: 50 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 180, damping: 18, delay: (r * row.length + c) * 0.035 }}
                        whileHover={isType ? { z: 30, y: -4 } : undefined}
                        animate={active ? { z: 60, scale: 1.04 } : { z: 0, scale: 1 }}
                        className={cn(
                          "relative h-16 flex-1 rounded-[3px] text-left md:h-20",
                          isType
                            ? "cursor-pointer bg-[linear-gradient(160deg,#4a5a6b,#2a3a4c)] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_6px_14px_-6px_rgba(0,0,0,.6)] outline-none focus-visible:ring-2 focus-visible:ring-orange md:px-5"
                            : "bg-[linear-gradient(160deg,#1a2a3d,#0f1d2e)] shadow-[inset_0_1px_0_rgba(255,255,255,.04)]",
                          active && "bg-[linear-gradient(160deg,#ffb733,#ffa100)] text-navy-deep",
                        )}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {isType && (
                          <span className="flex h-full items-center gap-2 font-display text-[13px] font-semibold leading-tight md:text-base">
                            {active && <Check className="size-4 shrink-0" />}
                            {TYPES[cell]}
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              ))}
            </div>
            <p className="mt-6 text-[13px] text-white/50">Tocchi un mattone chiaro per sceglierlo.</p>
          </div>

          {/* riepilogo */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8">
              <p className="eyebrow text-[11px] text-white/60">Per chi è l'intervento?</p>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Richiedente">
                {WHO.map((w, i) => (
                  <button
                    key={w}
                    type="button"
                    aria-pressed={who === i}
                    onClick={() => setWho(i)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition",
                      who === i ? "border-orange bg-orange text-navy-deep" : "border-white/20 hover:border-white/60",
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="eyebrow text-[11px] text-white/60">La sua richiesta</p>
                <dl className="mt-4 space-y-3">
                  <Row label="Intervento" value={type !== null ? TYPES[type] : null} />
                  <Row label="Richiedente" value={who !== null ? WHO[who] : null} />
                  <Row label="Zona" value="Lombardia" />
                </dl>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={ready ? "ok" : "no"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8"
                >
                  {ready ? (
                    <Button asChild className="w-full">
                      <Link to={contactLink(`Muratura: ${TYPES[type]}`, message)}>
                        Continua con il preventivo <ArrowRight />
                      </Link>
                    </Button>
                  ) : (
                    <p className="text-sm text-white/50">Scelga un intervento e il richiedente: prepariamo noi il modulo.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-sm text-white/60">{label}</dt>
      <dd className={cn("text-right font-display font-semibold", !value && "text-white/30")}>
        <AnimatePresence mode="wait">
          <motion.span key={value ?? "-"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-block">
            {value ?? "da scegliere"}
          </motion.span>
        </AnimatePresence>
      </dd>
    </div>
  )
}
