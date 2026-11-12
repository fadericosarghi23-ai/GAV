import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"

import { PageHero } from "@/components/sections/PageHero"
import { QuestionBand } from "@/components/sections/QuestionBand"
import { useLenis } from "@/components/motion/SmoothScroll"
import { useMeta } from "@/hooks/useMeta"
import { first, h, img, pageBlocks } from "@/lib/content"
import { GALLERY } from "@/lib/site"
import { cn } from "@/lib/utils"

const b = pageBlocks("galleria")
const FILTERS = [
  { id: "tutte", label: "Tutte" },
  { id: "coperture", label: "Coperture" },
  { id: "piscine", label: "Piscine" },
] as const

export default function Galleria() {
  useMeta("Galleria lavori | Coperture e piscine realizzate da GAV SRLS in Lombardia")
  // ordine e foto dalla galleria importata; categorie e didascalie da GALLERY
  const ids = first(b, "gallery")?.images ?? []
  const all = ids.map((id) => ({ ...GALLERY.find((g) => g.id === id)!, image: img(id) })).filter((x) => x.cat)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("tutte")
  const [open, setOpen] = useState<number | null>(null)
  const list = filter === "tutte" ? all : all.filter((x) => x.cat === filter)

  return (
    <>
      <PageHero eyebrow="Lavori realizzati" title={h(b, "Galleria")} crumbs={[{ to: "/galleria", label: "Galleria" }]}>
        <p>Le foto dei cantieri GAV: coperture in lamiera e piscine realizzate in Lombardia.</p>
      </PageHero>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:py-24 lg:px-10">
        <div role="tablist" aria-label="Filtra per categoria" className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const n = f.id === "tutte" ? all.length : all.filter((x) => x.cat === f.id).length
            const on = filter === f.id
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f.id)}
                className={cn("relative rounded-full border px-5 py-2.5 font-display text-sm font-semibold transition-colors", on ? "border-navy text-white" : "border-line text-navy hover:border-navy")}
              >
                {on && <motion.span layoutId="gal-pill" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">
                  {f.label} <span className={cn("ml-1 tabular-nums", on ? "text-orange" : "text-graphite")}>{n}</span>
                </span>
              </button>
            )
          })}
        </div>

        <motion.ul layout className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          <AnimatePresence mode="popLayout">
            {list.map((it, i) => (
              <motion.li
                key={it.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
                className="break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative block w-full overflow-hidden rounded-lg bg-ice text-left"
                  aria-label={`Apri la foto: ${it.caption}`}
                >
                  <img
                    src={it.image.thumb}
                    alt={it.caption}
                    width={it.image.width}
                    height={it.image.height}
                    loading="lazy"
                    className="h-auto w-full transition duration-[1.1s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,17,33,.85),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-4 p-5 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span>
                      <span className="eyebrow block text-[11px] text-orange">{it.cat}</span>
                      <span className="mt-1 block font-display font-semibold">{it.caption}</span>
                    </span>
                    <Expand className="size-5 shrink-0" />
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>

      <AnimatePresence>{open !== null && <Lightbox items={list} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}</AnimatePresence>
      <QuestionBand />
    </>
  )
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: { id: string; caption: string; cat: string; image: ReturnType<typeof img> }[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const lenis = useLenis()
  const it = items[index]
  const go = useCallback((d: number) => onIndex((index + d + items.length) % items.length), [index, items.length, onIndex])
  useEffect(() => {
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      lenis?.start()
    }
  }, [go, onClose, lenis])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={it.caption}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col bg-navy-deep/95 backdrop-blur"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="font-display text-sm tabular-nums text-white/60">
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={onClose} autoFocus className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Chiudi">
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <AnimatePresence mode="wait">
          <motion.img
            key={it.id}
            src={it.image.src}
            alt={it.caption}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="max-h-full max-w-full rounded object-contain"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1)
              else if (info.offset.x > 60) go(-1)
            }}
          />
        </AnimatePresence>
        {(["prev", "next"] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(dir === "next" ? 1 : -1)
            }}
            aria-label={dir === "next" ? "Foto successiva" : "Foto precedente"}
            className={cn(
              "absolute top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-orange hover:text-navy-deep md:grid",
              dir === "next" ? "right-4" : "left-4",
            )}
          >
            {dir === "next" ? <ChevronRight /> : <ChevronLeft />}
          </button>
        ))}
      </div>
      <p className="p-5 text-center font-display text-white" onClick={(e) => e.stopPropagation()}>
        {it.caption}
      </p>
    </motion.div>
  )
}
