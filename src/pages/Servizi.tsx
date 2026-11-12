import { useRef } from "react"
import { Link } from "react-router"
import { motion, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { PageHero } from "@/components/sections/PageHero"
import { QuestionBand } from "@/components/sections/QuestionBand"
import { Reveal } from "@/components/motion/Reveal"
import { useMeta } from "@/hooks/useMeta"
import { useProgress } from "@/hooks/useProgress"
import { h, img, p, pageBlocks, pageMeta } from "@/lib/content"
import { SERVICES, serviceBySlug } from "@/lib/site"
import { cn } from "@/lib/utils"

const b = pageBlocks("servizi")

export default function Servizi() {
  const meta = pageMeta("servizi")
  useMeta("Servizi | Muratura, coperture e lavori chiavi in mano in Lombardia | GAV SRLS", meta.description)
  return (
    <>
      <PageHero eyebrow={h(b, "GAV SRLS")} title={h(b, "Servizi")} crumbs={[{ to: "/servizi", label: "Servizi" }]}>
        <p className="font-display text-xl font-semibold text-navy">{h(b, "La nostra attività nasce")}</p>
        <p className="mt-4">{p(b, "Nel settore delle costruzioni")}</p>
      </PageHero>
      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <ul className="space-y-6 md:space-y-10">
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.slug} slug={s.slug} index={i} />
          ))}
        </ul>
      </section>
      <QuestionBand />
    </>
  )
}

function ServiceRow({ slug, index }: { slug: (typeof SERVICES)[number]["slug"]; index: number }) {
  const s = serviceBySlug(slug)
  const ref = useRef<HTMLLIElement>(null)
  const prog = useProgress(ref, ["start end", "end start"])
  const y = useTransform(prog, [0, 1], ["-12%", "12%"])
  const flip = index % 2 === 1
  return (
    <li ref={ref}>
      <Link
        to={`/servizi/${s.slug}`}
        className={cn(
          "group grid overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-500 hover:shadow-[0_40px_80px_-50px_rgba(1,37,62,.6)] md:grid-cols-2",
        )}
      >
        <div className={cn("relative h-72 overflow-hidden md:h-[460px]", flip && "md:order-2")}>
          <motion.img
            src={img(s.image).src}
            alt=""
            loading="lazy"
            style={{ y }}
            className="absolute inset-0 h-[125%] w-full -translate-y-[10%] object-cover transition-transform duration-[1.4s] group-hover:scale-105"
          />
          <span className="absolute left-5 top-5 rounded bg-navy-deep/85 px-3 py-1.5 font-display text-sm font-semibold text-white backdrop-blur">
            {s.number}
          </span>
        </div>
        <Reveal className="flex flex-col justify-between gap-10 p-7 md:p-12">
          <div>
            <p className="eyebrow text-orange">{s.short}</p>
            <h2 className="mt-4 text-[clamp(1.7rem,3vw,2.6rem)] font-semibold leading-tight text-navy">{s.data.title}</h2>
            <p className="mt-6 text-graphite">{s.data.excerpt}…</p>
          </div>
          <span className="eyebrow inline-flex items-center gap-3 text-navy">
            <span className="grid size-12 place-items-center rounded-full bg-orange text-navy-deep transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-5" />
            </span>
            Leggi di più
          </span>
        </Reveal>
      </Link>
    </li>
  )
}
