// Importa tutti i contenuti dal sito attuale gavsrls.it (WordPress + Elementor).
// Uso: npm run import:content
// Produce src/content/content.json e le foto WebP in public/img.
// I testi vengono copiati così come sono: l'unica normalizzazione è la sostituzione
// dei trattini lunghi/medi (regola Altalogik) e di un refuso d'accento ("Perchè").
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "node-html-parser"
import sharp from "sharp"

const ORIGIN = "https://gavsrls.it"
const ROOT = path.resolve(import.meta.dirname, "..")
const IMG_DIR = path.join(ROOT, "public", "img")
const OUT = path.join(ROOT, "src", "content", "content.json")
const UA = { "User-Agent": "Mozilla/5.0 (compatible; content-import)" }
const MAX_BYTES = 300 * 1024

const fetchText = async (url) => {
  const r = await fetch(url, { headers: UA })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.text()
}

const clean = (s) =>
  s
    .replace(/ /g, " ")
    .replace(/\s*[–—]\s*/g, ", ")
    .replace(/Perchè/g, "Perché")
    .replace(/\s+/g, " ")
    .trim()

// ---------- immagini ----------
const images = new Map() // url originale -> record
const fullSize = (u) => u.replace(/-\d+x\d+(?=\.(jpe?g|png|webp)$)/i, "")
const slugify = (u) =>
  path
    .basename(u)
    .replace(/\.(jpe?g|png|webp)$/i, "")
    .replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-utc(-scaled)?$/i, "")
    .replace(/-scaled$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

function registerImage(rawUrl, alt = "") {
  if (!rawUrl || !/wp-content\/uploads/.test(rawUrl)) return null
  const url = fullSize(rawUrl.startsWith("http") ? rawUrl : ORIGIN + rawUrl)
  if (!images.has(url)) {
    const isReal = /whatsapp-image/i.test(url)
    images.set(url, {
      id: slugify(url).replace(/^whatsapp-image-2026-10-06-at-/, "cantiere-"),
      source: url,
      kind: isReal ? "foto-cantiere" : "stock",
      alt: alt && alt !== "blank" ? clean(alt) : "",
    })
  }
  return images.get(url).id
}

const imgSrc = (el) =>
  el.getAttribute("data-wpfc-original-src") ||
  el.getAttribute("data-src") ||
  el.getAttribute("src")

async function processImages() {
  await fs.mkdir(IMG_DIR, { recursive: true })
  for (const rec of images.values()) {
    const target = path.join(IMG_DIR, `${rec.id}.webp`)
    if (process.argv.includes("--skip-existing")) {
      try {
        const m = await sharp(target).metadata()
        Object.assign(rec, { src: `/img/${rec.id}.webp`, thumb: `/img/${rec.id}-800.webp`, width: m.width, height: m.height, bytes: m.size })
        continue
      } catch {}
    }
    const buf = Buffer.from(await (await fetch(rec.source, { headers: UA })).arrayBuffer())
    const base = sharp(buf).rotate()
    const meta = await base.metadata()
    for (const [suffix, width] of [["", 1920], ["-800", 800]]) {
      let q = 74
      let out
      do {
        out = await sharp(buf).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: q }).toBuffer({ resolveWithObject: true })
        q -= 6
      } while (out.data.length > MAX_BYTES && q > 40)
      await fs.writeFile(path.join(IMG_DIR, `${rec.id}${suffix}.webp`), out.data)
      if (!suffix) {
        rec.src = `/img/${rec.id}.webp`
        rec.width = out.info.width
        rec.height = out.info.height
        rec.bytes = out.data.length
      } else rec.thumb = `/img/${rec.id}${suffix}.webp`
    }
    rec.originalBytes = buf.length
    rec.originalSize = `${meta.width}x${meta.height}`
    console.log(`  img ${rec.id}  ${Math.round(rec.originalBytes / 1024)} KB -> ${Math.round(rec.bytes / 1024)} KB`)
  }
}

// ---------- blocchi Elementor ----------
function widgetType(el) {
  const cls = el.getAttribute("class") || ""
  // solo il nome del widget: esclude le classi responsive (elementor-widget-tablet__width-initial) e le varianti (divider--view-line)
  const m = cls.split(/\s+/).filter((c) => /^elementor-widget-[a-z0-9-]+$/.test(c) && !c.includes("--"))
  const names = m.map((x) => x.replace("elementor-widget-", "")).filter((x) => !["container", "wrap"].includes(x))
  return names[0] || null
}

function readWidget(el, type) {
  switch (type) {
    case "heading":
    case "elementskit-heading": {
      const h = el.querySelector("h1,h2,h3,h4,h5,h6")
      if (!h) return null
      return { type: "heading", level: Number(h.tagName[1]), text: clean(h.text) }
    }
    case "text-editor": {
      // mantiene i sottotitoli (h2/h3…) presenti dentro il testo
      const out = []
      let current = null
      for (const n of el.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li")) {
        const text = clean(n.text)
        if (!text) continue
        if (/^h\d$/i.test(n.tagName)) {
          out.push({ type: "heading", level: Number(n.tagName[1]), text })
          current = null
        } else {
          if (!current) out.push((current = { type: "text", paragraphs: [] }))
          current.paragraphs.push(text)
        }
      }
      if (!out.length && clean(el.text)) out.push({ type: "text", paragraphs: [clean(el.text)] })
      return out.length ? out : null
    }
    case "counter": {
      const n = el.querySelector("[data-to-value]")
      return {
        type: "counter",
        from: Number(n?.getAttribute("data-from-value") || 0),
        to: Number(n?.getAttribute("data-to-value") || 0),
        suffix: clean(el.querySelector(".elementor-counter-number-suffix")?.text || ""),
        label: clean(el.querySelector(".elementor-counter-title")?.text || ""),
      }
    }
    case "icon-box":
      return { type: "feature", text: clean(el.text) }
    case "button": {
      const a = el.querySelector("a")
      return { type: "button", text: clean(el.text), href: a?.getAttribute("href") || "" }
    }
    case "image": {
      const img = el.querySelector("img")
      const id = img && registerImage(imgSrc(img), img.getAttribute("alt"))
      return id ? { type: "image", image: id } : null
    }
    case "image-carousel":
    case "image-gallery": {
      const ids = el
        .querySelectorAll("img")
        .map((img) => registerImage(imgSrc(img), img.getAttribute("alt")))
        .filter(Boolean)
      return ids.length ? { type: "gallery", images: [...new Set(ids)] } : null
    }
    case "elementskit-testimonial": {
      const items = el.querySelectorAll(".elemntskit-testimonial-item").map((it) => {
        const raw = clean(it.querySelector(".elementskit-commentor-content p")?.text || "")
        const m = raw.match(/^“([^”]+)”\s*“(.+)”$/)
        return {
          title: m ? m[1] : "",
          text: m ? m[2] : raw,
          author: clean(it.querySelector(".elementskit-author-name")?.text || ""),
        }
      })
      return { type: "testimonials", items }
    }
    case "divider":
    case "spacer":
    case "icon":
    case "raven-posts":
    case "elementskit-contact-form7":
      return null // decorazioni o elenchi generati: i contenuti arrivano da altre fonti
    default:
      return undefined
  }
}

function walk(node, out) {
  for (const child of node.childNodes) {
    if (child.nodeType !== 1) continue
    const type = widgetType(child)
    if (type && type !== "wrap") {
      const b = readWidget(child, type)
      if (Array.isArray(b)) out.push(...b)
      else if (b) out.push(b)
      if (b !== undefined) continue // tipo gestito (anche se vuoto)
      // tipo non gestito: si scende nei figli per non perdere contenuti
    }
    walk(child, out)
  }
}

function readPage(html) {
  const root = parse(html)
  const main = root.querySelector("main") || root.querySelector("body")
  const blocks = []
  walk(main, blocks)
  // Il contatore di Elementor ha suffisso ed etichetta in due titoli separati: li uniamo.
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type !== "counter" || b.label) continue
    if (blocks[i + 1]?.type === "heading" && blocks[i + 1].text.length <= 2) b.suffix = blocks.splice(i + 1, 1)[0].text
    if (blocks[i + 1]?.type === "heading") b.label = blocks.splice(i + 1, 1)[0].text
  }
  return {
    seoTitle: clean(root.querySelector("title")?.text || ""),
    description: clean(root.querySelector('meta[name="description"]')?.getAttribute("content") || ""),
    blocks,
  }
}

// ---------- main ----------
const PAGES = [
  ["home", "/"],
  ["chi-siamo", "/chi-siamo/"],
  ["servizi", "/servizi/"],
  ["galleria", "/galleria/"],
  ["contatti", "/contatti/"],
]

console.log("Lettura sitemap…")
const sitemap = await fetchText(`${ORIGIN}/post-sitemap.xml`)
const postUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const content = { importedAt: new Date().toISOString(), source: ORIGIN, pages: {}, services: {}, legacyLegal: {}, business: {} }

for (const [slug, p] of PAGES) {
  console.log("Pagina", p)
  content.pages[slug] = { oldUrl: p, ...readPage(await fetchText(ORIGIN + p)) }
}

const posts = await (await fetch(`${ORIGIN}/wp-json/wp/v2/posts?per_page=50&_fields=slug,title,date,excerpt`, { headers: UA })).json()
for (const url of postUrls) {
  const slug = new URL(url).pathname.replace(/\//g, "")
  console.log("Servizio", slug)
  const meta = posts.find((x) => x.slug === slug)
  content.services[slug] = {
    oldUrl: new URL(url).pathname,
    title: clean(parse(meta?.title?.rendered || slug).text),
    excerpt: clean(parse(meta?.excerpt?.rendered || "").text).replace(/\s*\[…\]$|\s*\[&hellip;\]$/, ""),
    date: meta?.date,
    ...readPage(await fetchText(url)),
  }
}

// Pagine legali del vecchio sito: importate solo come riferimento.
// Non vengono pubblicate perché indicano un titolare del trattamento diverso da GAV SRLS.
const legal = await (await fetch(`${ORIGIN}/wp-json/wp/v2/pages?per_page=50&_fields=slug,title,content`, { headers: UA })).json()
for (const pg of legal.filter((x) => /cookie|informativa/.test(x.slug))) {
  const root = parse(pg.content.rendered)
  content.legacyLegal[pg.slug] = {
    oldUrl: `/${pg.slug}/`,
    title: clean(parse(pg.title.rendered).text),
    paragraphs: root.querySelectorAll("p,li,h2,h3,h4").map((n) => clean(n.text)).filter(Boolean),
  }
}

// Dati aziendali dal footer e dalle pagine
const homeHtml = await fetchText(ORIGIN + "/")
const footerText = clean(parse(homeHtml).querySelector("footer")?.text || parse(homeHtml).text)
const chi = content.pages["chi-siamo"].blocks.flatMap((b) => (b.type === "text" ? b.paragraphs : b.type === "heading" ? [b.text] : []))
const tel = homeHtml.match(/href="tel:([+\d]+)"/)?.[1] || ""
content.business = {
  name: "GAV SRLS",
  phone: tel,
  phoneDisplay: tel.replace(/^\+39(\d{3})(\d{3})(\d{4})$/, "+39 $1 $2 $3"),
  email: (homeHtml.match(/href="mailto:([^"]+)"/)?.[1] || "").toLowerCase(),
  vat: footerText.match(/P\.?\s?Iva\s*(\d{11})/i)?.[1] || "",
  area: content.pages.contatti.blocks.find((b) => b.type === "feature" && b.text.startsWith("Indirizzo"))?.text.replace(/^Indirizzo\s*/, "") || "",
  hoursText: chi.find((t) => /dalle \d{2}:\d{2}/.test(t)) || "",
  hours: [
    // ricavati dalla frase "dal lunedì al venerdì dalle 07:00 alle 18:00 e il sabato dalle 07:00 alle 12:00"
    { days: [1, 2, 3, 4, 5], label: "Lunedì a venerdì", open: "07:00", close: "18:00" },
    { days: [6], label: "Sabato", open: "07:00", close: "12:00" },
  ],
  tagline: footerText.match(/GAV SRLS: [^.]+./)?.[0] || "",
  copyright: footerText.match(/Copyrights?[^|]+/)?.[0]?.trim() || "",
}

console.log(`Immagini da convertire: ${images.size}`)
await processImages()
content.images = Object.fromEntries([...images.values()].map((r) => [r.id, r]))

await fs.mkdir(path.dirname(OUT), { recursive: true })
await fs.writeFile(OUT, JSON.stringify(content, null, 2) + "\n")
console.log("Fatto:", path.relative(ROOT, OUT))
