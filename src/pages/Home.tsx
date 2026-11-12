import { useState } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react"

import { RoofHero } from "@/components/hero/RoofHero"
import { ParallaxImage, Reveal, ScrollHighlight, SplitWords } from "@/components/motion/Reveal"
import { QuestionBand } from "@/components/sections/QuestionBand"
import { Button } from "@/components/ui/button"
import { useMeta } from "@/hooks/useMeta"
import { first, h, img, p, pageBlocks, pageMeta } from "@/lib/content"
import { GALLERY, SERVICES, serviceBySlug } from "@/lib/site"
import { cn } from "@/lib/utils"

const home = pageBlocks("home")

export default function Home() {
  const meta = pageMeta("home")
  useMeta("GAV SRLS | Impresa edile in Lombardia: muratura, coperture, chiavi in mano", meta.description)
  return (
    <>
      <RoofHero />
      <About />
      <Services />
      <WorkStrip />
      <WhyUs />
      <Testimonials />
      <QuestionBand />
    </>
  )
}

function About() {
  return (
    <section className="relative mx-auto grid max-w-[1400px] gap-14 px-4 py-24 sm:px-6 md:py-36 lg:grid-cols-12 lg:px-10">
      <div className="lg:col-span-7">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-graphite">
            <span className="h-px w-10 bg-orange" /> {h(home, "Chi siamo")}
          </p>
        </Reveal>
        <ScrollHighlight
          text={h(home, "Ogni intervento viene affrontato")}
          className="mt-6 font-display text-[clamp(1.7rem,3.4vw,2.9rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-navy"
        />
        <div className="mt-10 grid gap-6 text-graphite md:grid-cols-2">
          <Reveal>
            <p>{p(home, "Nel settore delle costruzioni")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>{p(home, "Ci occupiamo di lavori di muratura")}</p>
          </Reveal>
        </div>
        <Reveal className="mt-10">
          <Button asChild variant="navy">
            <Link to="/chi-siamo">
              {h(home, "Chi siamo")} <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
      <div className="relative lg:col-span-5">
        <ParallaxImage
          src={img("cantiere-12-37-17-5").src}
          alt="Lamiera grecata e colmo in fase di posa"
          className="aspect-[4/5] rounded-lg"
          strength={10}
        />
      </div>
    </section>
  )
}

function Services() {
  const [active, setActive] = useState(0)
  return (
    <section className="bg-ice py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-navy">
            <SplitWords text={h(home, "Cosa Offriamo")} />
          </h2>
          <Reveal>
            <Button asChild variant="outline" className="text-navy">
              <Link to="/servizi">
                Tutti i Servizi <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-3 lg:h-[560px] lg:flex-row">
          {SERVICES.map((s, i) => {
            const d = serviceBySlug(s.slug).data
            const on = active === i
            return (
              <motion.div
                key={s.slug}
                layout
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                transition={{ layout: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                className={cn(
                  "group relative min-h-[380px] overflow-hidden rounded-lg bg-navy-deep text-white lg:min-h-0",
                  on ? "lg:flex-[2.4]" : "lg:flex-1",
                )}
              >
                <img
                  src={img(s.image).src}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition duration-[1.2s]",
                    on ? "scale-100 opacity-55" : "scale-110 opacity-35",
                  )}
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,17,33,.95)_10%,rgba(4,17,33,.2)_70%)]" />
                <Link to={`/servizi/${s.slug}`} className="relative flex h-full flex-col justify-between p-7 md:p-9">
                  <span className="flex items-center justify-between">
                    <span className="eyebrow text-orange">{s.number}</span>
                    <span className="grid size-12 place-items-center rounded-full border border-white/30 transition group-hover:rotate-45 group-hover:border-orange group-hover:bg-orange group-hover:text-navy-deep">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </span>
                  <span>
                    <h3 className="max-w-[18ch] text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight">{d.title}</h3>
                    <motion.p
                      initial={false}
                      animate={{ opacity: on ? 1 : 0.0, height: on ? "auto" : 0 }}
                      className="max-w-[46ch] overflow-hidden text-[15px] text-white/80 max-lg:!h-auto max-lg:!opacity-100"
                    >
                      <span className="block pt-4">{d.excerpt}…</span>
                    </motion.p>
                    <span className="eyebrow mt-6 inline-flex items-center gap-2 text-[12px] text-white">
                      Leggi di più <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Le foto reali dei cantieri, con una parallasse leggera (nessuno scroll bloccato) */
function WorkStrip() {
  const gallery = first(home, "gallery")!
  const items = gallery.images.slice(0, 4).map((id) => ({ id, meta: GALLERY.find((g) => g.id === id) }))
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="max-w-[18ch] text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-navy">
            <SplitWords text={h(home, "Lavori di Muratura")} />
          </h2>
          <Link to="/galleria" className="eyebrow hidden shrink-0 items-center gap-2 text-navy hover:text-orange md:flex">
            Galleria <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map(({ id, meta }, i) => (
            <Reveal as="li" key={id} delay={i * 0.08}>
              <figure>
                <ParallaxImage src={img(id).thumb} alt={meta?.caption ?? ""} className="aspect-[3/4] rounded-md" strength={6} />
                {meta && <figcaption className="mt-3 text-[13px] leading-snug text-graphite">{meta.caption}</figcaption>}
              </figure>
            </Reveal>
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-10 text-navy md:hidden">
          <Link to="/galleria">
            Galleria <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function WhyUs() {
  const features = home.filter((b) => b.type === "feature").slice(3, 6)
  return (
    <section className="mx-auto grid max-w-[1400px] gap-14 px-4 py-24 sm:px-6 md:py-36 lg:grid-cols-12 lg:px-10">
      <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-graphite">
            <span className="h-px w-10 bg-orange" /> {h(home, "Soluzioni Edili Affidabili")}
          </p>
        </Reveal>
        <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.4rem)] font-bold leading-[0.95] tracking-[-0.03em] text-navy">
          <SplitWords text={h(home, "Perché scegliere noi")} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-8 text-graphite">{p(home, "Scegliere GAV SRLS significa")}</p>
          <Button asChild variant="navy" className="mt-8">
            <Link to="/contatti">Contatti</Link>
          </Button>
        </Reveal>
      </div>
      <ol className="lg:col-span-6 lg:col-start-7">
        {features.map((f, i) => (
          <Reveal key={i} as="li" delay={i * 0.08} className="group relative border-t border-line py-10 last:border-b">
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.1 }}
              className="absolute -top-px left-0 h-[2px] w-full origin-left bg-orange"
            />
            <div className="flex items-baseline gap-6 md:gap-10">
              <span className="steel-text font-display text-[clamp(3rem,7vw,5.5rem)] font-bold leading-none tracking-[-0.04em] transition-[background-position] duration-1000 group-hover:[background-position:0%_0]">
                0{i + 1}.
              </span>
              <h3 className="text-[clamp(1.3rem,2.4vw,2rem)] font-semibold text-navy transition-transform duration-500 group-hover:translate-x-2">
                {f.type === "feature" ? f.text : ""}
              </h3>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

function Testimonials() {
  const t = first(home, "testimonials")!
  return (
    <section className="relative overflow-hidden bg-ice py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="eyebrow text-graphite">{h(home, "Testimonianze")}</p>
        <h2 className="mt-4 text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1] tracking-[-0.03em] text-navy">
          <SplitWords text={h(home, "Cosa dicono")} />
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.12} className={cn(i === 1 && "md:translate-y-12")}>
              <motion.figure
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex h-full flex-col rounded-lg border border-line bg-white p-8 shadow-[0_20px_50px_-35px_rgba(1,37,62,.45)]"
              >
                <Quote className="size-9 text-orange" />
                <h3 className="mt-6 font-display text-xl font-semibold text-navy">“{item.title}”</h3>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-graphite">“{item.text}”</blockquote>
                <figcaption className="eyebrow mt-8 border-t border-line pt-5 text-[11px] text-navy">{item.author}</figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
