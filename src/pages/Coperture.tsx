import { useState } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

import { OtherServices, ServiceCTA, ServiceHeader, ServiceIntro, ServiceSections, useService } from "@/components/sections/ServiceParts"
import { QuestionBand } from "@/components/sections/QuestionBand"
import { SplitWords } from "@/components/motion/Reveal"
import { Button } from "@/components/ui/button"
import { img, p } from "@/lib/content"
import { contactLink } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function Coperture() {
  const s = useService("coperture")
  const blocks = s.data.blocks
  return (
    <>
      <ServiceHeader slug="coperture" />
      <ServiceIntro
        blocks={blocks}
        aside={
          <figure className="overflow-hidden rounded-lg">
            <img src={img("cantiere-12-37-17-5").thumb} alt="Lamiera grecata e colmo in fase di posa" loading="lazy" className="aspect-[3/4] w-full object-cover" />
            <figcaption className="bg-ice p-3 text-[13px] text-graphite">Un cantiere GAV: colmo in lamiera in fase di posa.</figcaption>
          </figure>
        }
      />
      <RoofDiagnosis reference={p(blocks, "La manutenzione o il rifacimento")} />
      <ServiceSections blocks={blocks} tone="navy" />
      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <ServiceCTA slug="coperture" />
      </section>
      <OtherServices current="coperture" />
      <QuestionBand />
    </>
  )
}

/*
  Le opzioni riprendono le parole della pagina originale:
  "deterioramento, infiltrazioni o altre problematiche legate all'usura", "manutenzione o rifacimento",
  "privati, aziende e proprietari di immobili".
*/
const SIGNS = [
  { id: "infiltrazioni", label: "Infiltrazioni" },
  { id: "deterioramento", label: "Deterioramento o usura" },
  { id: "rifacimento", label: "Voglio rifare la copertura" },
  { id: "altro", label: "Altro, vorrei un parere" },
] as const
const BUILDINGS = [
  { id: "casa", label: "Abitazione privata" },
  { id: "capannone", label: "Capannone o edificio aziendale" },
  { id: "immobile", label: "Altro immobile" },
] as const

type Sign = (typeof SIGNS)[number]["id"]
type Building = (typeof BUILDINGS)[number]["id"]

function RoofDiagnosis({ reference }: { reference: string }) {
  const [step, setStep] = useState(0)
  const [sign, setSign] = useState<Sign | null>(null)
  const [building, setBuilding] = useState<Building | null>(null)
  const signLabel = SIGNS.find((s) => s.id === sign)?.label
  const buildingLabel = BUILDINGS.find((b) => b.id === building)?.label
  const kind = sign === "rifacimento" ? "rifacimento" : sign === "altro" ? "valutazione" : "manutenzione o rifacimento"

  return (
    <section className="bg-ice py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="eyebrow text-graphite">Diagnosi della copertura</p>
        <h2 className="mt-4 max-w-[20ch] text-[clamp(2.2rem,4.8vw,4.2rem)] font-bold leading-[1] tracking-[-0.03em] text-navy">
          <SplitWords text="Com'è messo il suo tetto?" />
        </h2>

        <div className="mt-12 grid overflow-hidden rounded-lg border border-line bg-white lg:grid-cols-2">
          <div className="relative min-h-[320px] bg-[linear-gradient(180deg,#dfe7ee,#f9f9f9)] md:min-h-[440px]">
            <RoofScene sign={sign} building={building} />
            <div className="absolute left-4 top-4 flex gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className={cn("h-1.5 w-8 rounded-full transition-colors", i <= step ? "bg-orange" : "bg-navy/15")} />
              ))}
            </div>
          </div>

          <div className="relative p-6 md:p-10" aria-live="polite">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <Step key="s0" title="Che cosa sta notando sulla copertura?" n={1}>
                  <Options items={SIGNS} value={sign} onPick={(v) => { setSign(v); setStep(1) }} />
                </Step>
              )}
              {step === 1 && (
                <Step key="s1" title="Su che tipo di edificio?" n={2}>
                  <Options items={BUILDINGS} value={building} onPick={(v) => { setBuilding(v); setStep(2) }} />
                  <button type="button" onClick={() => setStep(0)} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy">
                    <ArrowLeft className="size-4" /> Indietro
                  </button>
                </Step>
              )}
              {step === 2 && sign && building && (
                <Step key="s2" title="Il quadro è chiaro" n={3}>
                  <dl className="grid grid-cols-2 gap-4 rounded-md bg-ice p-4 text-sm">
                    <div>
                      <dt className="text-graphite">Segnale</dt>
                      <dd className="font-display font-semibold text-navy">{signLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-graphite">Edificio</dt>
                      <dd className="font-display font-semibold text-navy">{buildingLabel}</dd>
                    </div>
                  </dl>
                  <blockquote className="mt-6 border-l-2 border-orange pl-4 text-graphite">“{reference}”</blockquote>
                  <p className="mt-4 text-sm text-graphite">
                    Il passo successivo è una valutazione: GAV considera le condizioni della copertura esistente e le caratteristiche dell’edificio per definire con Lei la soluzione più adatta.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link
                        to={contactLink(
                          `Copertura: ${kind}`,
                          `Segnale: ${signLabel}\nEdificio: ${buildingLabel}\nZona: Lombardia\n\n`,
                        )}
                      >
                        Richieda una valutazione <ArrowRight />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-navy"
                      onClick={() => {
                        setSign(null)
                        setBuilding(null)
                        setStep(0)
                      }}
                    >
                      <RotateCcw /> Ricomincia
                    </Button>
                  </div>
                </Step>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({ title, n, children }: { title: string; n: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="eyebrow text-[11px] text-orange">Passo {n} di 3</p>
      <h3 className="mt-3 text-2xl font-semibold text-navy md:text-3xl">{title}</h3>
      <div className="mt-8">{children}</div>
    </motion.div>
  )
}

function Options<T extends string>({
  items,
  value,
  onPick,
}: {
  items: readonly { id: T; label: string }[]
  value: T | null
  onPick: (v: T) => void
}) {
  return (
    <ul className="grid gap-2">
      {items.map((it, i) => (
        <motion.li key={it.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
          <button
            type="button"
            onClick={() => onPick(it.id)}
            aria-pressed={value === it.id}
            className={cn(
              "group flex w-full items-center justify-between rounded-md border px-5 py-4 text-left font-display font-semibold transition",
              value === it.id ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-navy hover:bg-ice",
            )}
          >
            {it.label}
            <ArrowRight className="size-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
          </button>
        </motion.li>
      ))}
    </ul>
  )
}

/** Sezione del tetto in SVG che reagisce alle risposte */
function RoofScene({ sign, building }: { sign: Sign | null; building: Building | null }) {
  const shed = building === "capannone"
  const ribs = Array.from({ length: 22 })
  // falda sinistra e destra: da colmo (200,70|shed: 200,110) alle gronde
  const ridgeY = shed ? 120 : 70
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Schema di una copertura">
      <defs>
        <linearGradient id="rs-steel" x1="0" x2="1">
          <stop offset="0" stopColor="#7c8089" />
          <stop offset=".5" stopColor="#c9ccd1" />
          <stop offset="1" stopColor="#8a8e96" />
        </linearGradient>
        <clipPath id="rs-left">
          <polygon points={`200,${ridgeY} 40,${shed ? 170 : 175} 40,${shed ? 182 : 187} 200,${ridgeY + 12}`} />
        </clipPath>
        <clipPath id="rs-right">
          <polygon points={`200,${ridgeY} 360,${shed ? 170 : 175} 360,${shed ? 182 : 187} 200,${ridgeY + 12}`} />
        </clipPath>
      </defs>
      {/* edificio */}
      <motion.rect
        animate={{ x: shed ? 50 : 70, width: shed ? 300 : 260, y: shed ? 176 : 180 }}
        height="100"
        fill="#ffffff"
        stroke="#01253e"
        strokeOpacity=".15"
      />
      {!shed && <motion.rect initial={false} animate={{ opacity: 1 }} x="182" y="222" width="36" height="58" fill="#01253e" opacity=".08" />}
      {shed && <rect x="150" y="215" width="100" height="65" fill="#01253e" opacity=".08" />}
      {/* falde */}
      {(["left", "right"] as const).map((side) => (
        <g key={side} clipPath={`url(#rs-${side})`}>
          <rect x="30" y="40" width="340" height="160" fill="url(#rs-steel)" />
          <motion.rect x="30" y="40" width="340" height="160" fill="#8b5a3c" initial={false} animate={{ opacity: sign === "deterioramento" ? 0.55 : 0 }} />
          {ribs.map((_, i) => (
            <rect key={i} x={30 + i * 16} y="40" width="5" height="160" fill="#041121" opacity=".18" />
          ))}
        </g>
      ))}
      {/* nuove lastre che scorrono (rifacimento) */}
      <AnimatePresence>
        {sign === "rifacimento" &&
          (["left", "right"] as const).map((side) => (
            <g key={side} clipPath={`url(#rs-${side})`}>
              <motion.rect
                initial={{ x: side === "left" ? -340 : 340 }}
                animate={{ x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                y="40"
                width="340"
                height="160"
                fill="#ffa100"
                opacity=".55"
              />
            </g>
          ))}
      </AnimatePresence>
      {/* crepe (usura) */}
      <AnimatePresence>
        {sign === "deterioramento" &&
          [
            "M120 120 l10 8 l-6 6 l9 9",
            "M270 118 l-8 9 l7 5 l-6 10",
            "M95 145 l12 3 l-4 7",
          ].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="#041121"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            />
          ))}
      </AnimatePresence>
      {/* gocce (infiltrazioni) */}
      {sign === "infiltrazioni" &&
        [150, 205, 255, 180, 235].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={shed ? 150 : 140}
            r="4"
            fill="#2b7bd6"
            style={{ animation: `drip 1.6s ${i * 0.32}s infinite ease-in` }}
          />
        ))}
      {/* colmo */}
      <motion.line animate={{ y1: ridgeY, y2: ridgeY }} x1="190" x2="210" stroke="#01253e" strokeWidth="5" strokeLinecap="round" />
      <line x1="0" y1="280" x2="400" y2="280" stroke="#01253e" strokeOpacity=".25" />
    </svg>
  )
}
