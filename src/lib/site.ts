import { serviceData } from "@/lib/content"

/** Servizi: slug nuovo -> articolo del vecchio sito da cui arrivano i testi */
export const SERVICES = [
  {
    slug: "muratura",
    legacy: "imprese-edili-e-ditte-specializzate-in-lavori-di-muratura",
    short: "Muratura",
    number: "01",
    image: "bricklayer-wearing-hard-hat-working-on-brick-wall",
  },
  {
    slug: "coperture",
    legacy: "coperture",
    short: "Coperture",
    number: "02",
    image: "cantiere-12-37-17-2",
  },
  {
    slug: "chiavi-in-mano",
    legacy: "lavori-chiavi-in-mano",
    short: "Chiavi in mano",
    number: "03",
    image: "construction-site-with-plans-hard-hat-and-cranes",
  },
] as const

export type ServiceSlug = (typeof SERVICES)[number]["slug"]

export const serviceBySlug = (slug: ServiceSlug) => {
  const s = SERVICES.find((x) => x.slug === slug)!
  return { ...s, data: serviceData(s.legacy) }
}

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/chi-siamo", label: "Chi Siamo" },
  { to: "/servizi", label: "Servizi", children: SERVICES.map((s) => ({ to: `/servizi/${s.slug}`, label: s.short })) },
  { to: "/galleria", label: "Galleria" },
  { to: "/contatti", label: "Contatti" },
] as const

/**
 * Foto reali dei cantieri (galleria del vecchio sito, senza didascalie).
 * Categoria e didascalia sono scritte da Altalogik guardando le foto: DA FAR CONFERMARE AL CLIENTE.
 */
export const GALLERY: { id: string; cat: "coperture" | "piscine"; caption: string }[] = [
  { id: "cantiere-12-37-17-2", cat: "coperture", caption: "Copertura in lamiera su capannone industriale" },
  { id: "cantiere-12-37-17-4", cat: "coperture", caption: "Posa di lastre ondulate su copertura a falde" },
  { id: "cantiere-12-37-17-5", cat: "coperture", caption: "Lamiera grecata e colmo in fase di posa" },
  { id: "cantiere-12-37-17-3", cat: "coperture", caption: "Nuova copertura su capannone agricolo" },
  { id: "cantiere-12-37-17", cat: "coperture", caption: "Copertura in lamiera grecata di grande superficie" },
  { id: "cantiere-12-37-17-1", cat: "coperture", caption: "Copertura in lamiera con impianto fotovoltaico" },
  { id: "cantiere-12-37-19", cat: "piscine", caption: "Vasca di una piscina in costruzione" },
  { id: "cantiere-12-37-18-1", cat: "piscine", caption: "Rivestimento della vasca in corso" },
  { id: "cantiere-12-37-18", cat: "piscine", caption: "Piscina terminata con pavimentazione esterna" },
]

export const contactLink = (subject: string, message?: string) => {
  const q = new URLSearchParams({ oggetto: subject })
  if (message) q.set("messaggio", message)
  return `/contatti?${q.toString()}#preventivo`
}

/** Data dell’ultimo aggiornamento di Privacy e Cookie Policy */
export const LEGAL_UPDATED = "12 novembre 2026"
