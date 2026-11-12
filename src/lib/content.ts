import { pages, services, business, images } from "@/content/content.json"

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "text"; paragraphs: string[] }
  | { type: "counter"; from: number; to: number; suffix: string; label: string }
  | { type: "feature"; text: string }
  | { type: "button"; text: string; href: string }
  | { type: "image"; image: string }
  | { type: "gallery"; images: string[] }
  | { type: "testimonials"; items: { title: string; text: string; author: string }[] }

export type ImageRec = {
  id: string
  src: string
  thumb: string
  width: number
  height: number
  alt: string
  kind: string
}

type PageKey = keyof typeof pages
type ServiceKey = keyof typeof services

export { business }

export const pageBlocks = (key: PageKey) => pages[key].blocks as Block[]
export const serviceData = (key: ServiceKey) => services[key] as unknown as {
  oldUrl: string
  title: string
  excerpt: string
  seoTitle: string
  description: string
  blocks: Block[]
}
export const pageMeta = (key: PageKey) => ({ title: pages[key].seoTitle, description: pages[key].description })

export const img = (id: string): ImageRec => {
  const r = (images as Record<string, ImageRec>)[id]
  if (!r) throw new Error(`Immagine mancante: ${id}`)
  return r
}

/** Tutti i paragrafi dei blocchi testo, nell'ordine */
export const paragraphs = (blocks: Block[]) =>
  blocks.flatMap((b) => (b.type === "text" ? b.paragraphs : []))

/** Il paragrafo importato che inizia con `start` (errore se non esiste: così i testi restano quelli originali) */
export function p(blocks: Block[], start: string): string {
  const hit = paragraphs(blocks).find((t) => t.startsWith(start))
  if (!hit) throw new Error(`Testo non trovato: "${start}"`)
  return hit
}

/** Il titolo importato che inizia con `start` */
export function h(blocks: Block[], start: string): string {
  const hit = blocks.find((b) => b.type === "heading" && b.text.startsWith(start))
  if (!hit || hit.type !== "heading") throw new Error(`Titolo non trovato: "${start}"`)
  return hit.text
}

/** Paragrafi che seguono il titolo `start` fino al titolo successivo */
export function sectionAfter(blocks: Block[], start: string): string[] {
  const i = blocks.findIndex((b) => b.type === "heading" && b.text.startsWith(start))
  if (i < 0) throw new Error(`Sezione non trovata: "${start}"`)
  const out: string[] = []
  for (const b of blocks.slice(i + 1)) {
    if (b.type === "heading") break
    if (b.type === "text") out.push(...b.paragraphs)
  }
  return out
}

/** Paragrafi che precedono il primo sottotitolo (intro di una pagina servizio) */
export function intro(blocks: Block[]): string[] {
  const out: string[] = []
  let started = false
  for (const b of blocks) {
    if (b.type === "heading" && b.level === 1) { started = true; continue }
    if (b.type === "heading" && started && out.length) break
    if (b.type === "text") out.push(...b.paragraphs)
  }
  return out
}

export function first<T extends Block["type"]>(blocks: Block[], type: T) {
  return blocks.find((b) => b.type === type) as Extract<Block, { type: T }> | undefined
}

export const tel = `tel:${business.phone}`
export const mailto = `mailto:${business.email}`
