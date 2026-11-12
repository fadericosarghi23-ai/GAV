import { useRef, useState } from "react"
import { motion, useTransform } from "framer-motion"

import { OtherServices, ServiceCTA, ServiceHeader, ServiceIntro, useService } from "@/components/sections/ServiceParts"
import { QuestionBand } from "@/components/sections/QuestionBand"
import { Reveal, SplitWords } from "@/components/motion/Reveal"
import { useProgress } from "@/hooks/useProgress"
import { h, p, sectionAfter } from "@/lib/content"
import { cn } from "@/lib/utils"

export default function ChiaviInMano() {
  const s = useService("chiavi-in-mano")
  const blocks = s.data.blocks
  return (
    <>
      <ServiceHeader slug="chiavi-in-mano" />
      <ServiceIntro blocks={blocks} />
      <OnePoint
        title={h(blocks, "Un unico punto di riferimento")}
        lead={p(blocks, "Affidarsi a un")}
        compare={p(blocks, "La nostra filosofia")}
      />
      <Path title={h(blocks, "Il tuo progetto")} paragraphs={sectionAfter(blocks, "Un unico punto di riferimento").slice(1)} />
      <section className="bg-ice">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
          <Reveal>
            <p className="max-w-3xl font-display text-xl font-semibold text-navy md:text-2xl">{p(blocks, "GAV SRLS è a disposizione")}</p>
          </Reveal>
          <div className="mt-10">
            <ServiceCTA slug="chiavi-in-mano" />
          </div>
        </div>
      </section>
      <OtherServices current="chiavi-in-mano" />
      <QuestionBand />
    </>
  )
}

/*
  Fasi citate nel testo originale: "dalla pianificazione iniziale fino alla conclusione dei lavori",
  "coordinando le attività necessarie", "diverse lavorazioni edili".
*/
const PHASES = ["Pianificazione iniziale", "Lavorazioni edili", "Coordinamento delle attività", "Conclusione dei lavori"]

function OnePoint({ title, lead, compare }: { title: string; lead: string; compare: string }) {
  const [mode, setMode] = useState<"separata" | "gav">("gav")
  const gav = mode === "gav"
  const ys = [50, 130, 210, 290]
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-white md:py-32">
      <div aria-hidden className="ribs pointer-events-none absolute inset-0 text-steel/30" />
      <div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <h2 className="text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[1] tracking-[-0.03em]">
            <SplitWords text={title} />
          </h2>
          <Reveal>
            <p className="mt-8 text-white/80">{lead}</p>
          </Reveal>
          <div role="radiogroup" aria-label="Confronto" className="mt-10 inline-flex rounded-full border border-white/15 bg-white/5 p-1">
            {(
              [
                ["separata", "Gestione separata"],
                ["gav", "Chiavi in mano GAV"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={mode === k}
                onClick={() => setMode(k)}
                className={cn("relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors md:px-6", mode === k ? "text-navy-deep" : "text-white/70")}
              >
                {mode === k && <motion.span layoutId="cm-pill" className="absolute inset-0 rounded-full bg-orange" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
          <p className="mt-6 max-w-md text-[15px] text-white/60">{compare}</p>
        </div>

        <div className="lg:col-span-7">
          <div className="relative rounded-lg border border-white/10 bg-white/[0.03] p-4 md:p-6">
            <div className="mb-2 flex items-center justify-between text-[13px] text-white/60">
              <span>Interlocutori per il cliente</span>
              <motion.span key={mode} initial={{ scale: 1.6, color: "#ffa100" }} animate={{ scale: 1, color: "#ffffff" }} className="font-display text-3xl font-bold">
                {gav ? 1 : PHASES.length}
              </motion.span>
            </div>
            <svg viewBox="0 0 620 340" className="h-auto w-full" role="img" aria-label={gav ? "Il cliente parla solo con GAV, che coordina tutte le fasi" : "Il cliente gestisce da solo ogni fase"}>
              {/* linee cliente -> fasi (gestione separata) */}
              {ys.map((y, i) => (
                <motion.path
                  key={`s${i}`}
                  d={`M90 170 C 200 ${170 + (i - 1.5) * 140}, 300 ${y + (i % 2 ? 60 : -60)}, 400 ${y}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity=".5"
                  strokeWidth="1.5"
                  strokeDasharray="5 6"
                  initial={false}
                  animate={{ pathLength: gav ? 0 : 1, opacity: gav ? 0 : 1 }}
                  transition={{ duration: 0.8, delay: gav ? 0 : i * 0.12 }}
                />
              ))}
              {/* incroci tra fasi (gestione separata) */}
              {[0, 1, 2].map((i) => (
                <motion.path
                  key={`x${i}`}
                  d={`M400 ${ys[i]} C 330 ${ys[i] + 60}, 330 ${ys[i + 1] + (i === 1 ? 80 : -40)}, 400 ${ys[(i + 2) % 4]}`}
                  fill="none"
                  stroke="#ffa100"
                  strokeOpacity=".5"
                  strokeWidth="1.2"
                  initial={false}
                  animate={{ pathLength: gav ? 0 : 1, opacity: gav ? 0 : 1 }}
                  transition={{ duration: 0.8, delay: gav ? 0 : 0.5 + i * 0.1 }}
                />
              ))}
              {/* cliente -> GAV -> fasi in sequenza */}
              <motion.path d="M90 170 L 230 170" stroke="#ffa100" strokeWidth="3" initial={false} animate={{ pathLength: gav ? 1 : 0 }} transition={{ duration: 0.6 }} />
              {ys.map((y, i) => (
                <motion.path
                  key={`g${i}`}
                  d={`M290 170 C 340 170, 350 ${y}, 400 ${y}`}
                  fill="none"
                  stroke="#ffa100"
                  strokeWidth="2.5"
                  initial={false}
                  animate={{ pathLength: gav ? 1 : 0, opacity: gav ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: gav ? 0.4 + i * 0.12 : 0 }}
                />
              ))}
              {/* nodi */}
              <g>
                <circle cx="70" cy="170" r="30" fill="#ffffff" />
                <text x="70" y="175" textAnchor="middle" className="fill-navy font-display text-[13px] font-semibold">Lei</text>
              </g>
              <motion.g initial={false} animate={{ opacity: gav ? 1 : 0, scale: gav ? 1 : 0.6 }} style={{ transformOrigin: "260px 170px" }} transition={{ duration: 0.5 }}>
                <rect x="226" y="140" width="68" height="60" rx="6" fill="#ffa100" />
                <text x="260" y="176" textAnchor="middle" className="fill-navy-deep font-display text-[16px] font-bold">GAV</text>
              </motion.g>
              {PHASES.map((ph, i) => (
                <g key={ph}>
                  <text x="412" y={ys[i] + 9} className="fill-orange text-[26px] font-bold md:hidden">{i + 1}</text>
                  <rect x="400" y={ys[i] - 22} width="212" height="44" rx="6" fill="#ffffff" fillOpacity={gav ? 0.1 : 0.06} stroke="#ffffff" strokeOpacity=".25" />
                  <text x="412" y={ys[i] + 5} className="fill-white text-[12px] font-semibold max-md:hidden">
                    {String(i + 1).padStart(2, "0")} {ph}
                  </text>
                </g>
              ))}
            </svg>
            <ol className="mt-4 grid grid-cols-2 gap-2 text-[13px] text-white/80 md:hidden">
              {PHASES.map((ph, i) => (
                <li key={ph} className="flex gap-2">
                  <span className="font-bold text-orange">{i + 1}</span> {ph}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Percorso a tappe che si riempie allo scroll, con i paragrafi originali */
function Path({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const prog = useProgress(ref, ["start 70%", "end 60%"])
  const height = useTransform(prog, [0, 1], ["0%", "100%"])
  return (
    <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:px-10">
      <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <h2 className="text-[clamp(2rem,4.2vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em] text-navy">
          <SplitWords text={title} />
        </h2>
        {paragraphs.map((t, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className="mt-6 text-graphite">{t}</p>
          </Reveal>
        ))}
      </div>
      <div ref={ref} className="relative lg:col-span-6 lg:col-start-7">
        <div className="absolute bottom-0 left-[19px] top-0 w-[2px] bg-line" aria-hidden>
          <motion.div style={{ height }} className="w-full bg-orange" />
        </div>
        <ol className="space-y-14">
          {PHASES.map((ph, i) => (
            <Reveal as="li" key={ph} className="relative pl-16">
              <span className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border-2 border-orange bg-white font-display text-sm font-bold text-navy">
                {i + 1}
              </span>
              <h3 className="pt-1.5 text-xl font-semibold text-navy md:text-2xl">{ph}</h3>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
