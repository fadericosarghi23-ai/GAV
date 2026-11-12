import { Link } from "react-router"
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react"

import { PageHero } from "@/components/sections/PageHero"
import { Reveal, ScrollHighlight, SplitWords } from "@/components/motion/Reveal"
import { Button } from "@/components/ui/button"
import { useMeta } from "@/hooks/useMeta"
import { business, img, intro, tel, type Block } from "@/lib/content"
import { contactLink, SERVICES, serviceBySlug, type ServiceSlug } from "@/lib/site"
import { cn } from "@/lib/utils"

export function useService(slug: ServiceSlug) {
  const s = serviceBySlug(slug)
  useMeta(`${s.data.title} in Lombardia | GAV SRLS`, s.data.description)
  return s
}

export function ServiceHeader({ slug }: { slug: ServiceSlug }) {
  const s = serviceBySlug(slug)
  const photo = img(s.image)
  return (
    <PageHero
      eyebrow={`Servizi · ${s.number}`}
      title={s.data.title}
      number={s.number}
      crumbs={[
        { to: "/servizi", label: "Servizi" },
        { to: `/servizi/${s.slug}`, label: s.short },
      ]}
      image={photo.src}
      imageAlt={photo.kind === "foto-cantiere" ? "Cantiere GAV" : ""}
    />
  )
}

/** I paragrafi introduttivi importati dal vecchio articolo: il primo "si accende" allo scroll */
export function ServiceIntro({ blocks, aside }: { blocks: Block[]; aside?: React.ReactNode }) {
  const [lead, ...rest] = intro(blocks)
  return (
    <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:px-10">
      <div className="lg:col-span-8">
        <ScrollHighlight
          text={lead}
          className="font-display text-[clamp(1.45rem,2.7vw,2.25rem)] font-semibold leading-[1.25] text-navy"
        />
        <div className="mt-12 grid gap-8 text-graphite md:grid-cols-2">
          {rest.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{t}</p>
            </Reveal>
          ))}
        </div>
      </div>
      {aside && <div className="lg:col-span-3 lg:col-start-10">{aside}</div>}
    </section>
  )
}

/** Sezioni con sottotitolo (h2) dell'articolo originale */
export function ServiceSections({ blocks, tone = "light" }: { blocks: Block[]; tone?: "light" | "navy" }) {
  const sections: { title: string; paragraphs: string[] }[] = []
  for (const b of blocks) {
    if (b.type === "heading" && b.level === 2) sections.push({ title: b.text, paragraphs: [] })
    else if (b.type === "text" && sections.length) sections[sections.length - 1].paragraphs.push(...b.paragraphs)
  }
  return (
    <>
      {sections.map((s, i) => (
        <section
          key={s.title}
          className={cn(
            "relative overflow-hidden",
            tone === "navy" && i % 2 === 0 ? "bg-navy-deep text-white" : i % 2 === 0 ? "bg-ice" : "bg-white",
          )}
        >
          {tone === "navy" && i % 2 === 0 && <div aria-hidden className="ribs pointer-events-none absolute inset-0 text-steel/40" />}
          <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:px-10">
            <h2
              className={cn(
                "text-[clamp(2rem,4.2vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em] lg:col-span-5 lg:sticky lg:top-32 lg:self-start",
                tone === "navy" && i % 2 === 0 ? "text-white" : "text-navy",
              )}
            >
              <SplitWords text={s.title} />
            </h2>
            <div className="space-y-6 lg:col-span-6 lg:col-start-7">
              {s.paragraphs.map((t, j) => (
                <Reveal key={j} delay={j * 0.06}>
                  <p className={cn(tone === "navy" && i % 2 === 0 ? "text-white/80" : "text-graphite", j === 0 && "text-lg")}>{t}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function ServiceCTA({ slug }: { slug: ServiceSlug }) {
  const s = serviceBySlug(slug)
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild size="lg">
        <Link to={contactLink(`Preventivo ${s.short}`)}>
          Richiedi un Preventivo <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="text-navy">
        <a href={tel}>
          <Phone /> {business.phoneDisplay}
        </a>
      </Button>
    </div>
  )
}

export function OtherServices({ current }: { current: ServiceSlug }) {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="eyebrow text-graphite">Altri servizi</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {SERVICES.filter((s) => s.slug !== current).map((s) => {
            const d = serviceBySlug(s.slug).data
            return (
              <li key={s.slug}>
                <Link
                  to={`/servizi/${s.slug}`}
                  className="group flex items-center gap-5 rounded-lg border border-line p-4 transition hover:border-navy hover:bg-ice"
                >
                  <img src={img(s.image).thumb} alt="" loading="lazy" className="size-20 shrink-0 rounded object-cover md:size-24" />
                  <span className="flex-1">
                    <span className="eyebrow text-[11px] text-orange">{s.number}</span>
                    <span className="mt-1 block font-display text-lg font-semibold leading-tight text-navy md:text-xl">{d.title}</span>
                  </span>
                  <ArrowUpRight className="size-6 shrink-0 text-navy transition-transform group-hover:rotate-45" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
