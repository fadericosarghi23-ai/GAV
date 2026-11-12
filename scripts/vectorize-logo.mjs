// Nota: potrace non è tra le dipendenze del sito (ha dipendenze con vulnerabilità note).
// Per rigenerare il logo: npm i --no-save potrace && node scripts/vectorize-logo.mjs
// Vettorializza il logo originale (PNG 1565x1005, unico formato presente sul sito)
// in livelli: bianco (testi e filetti) e acciaio (fasce e tetto).
// Uso: node scripts/vectorize-logo.mjs
import fs from "node:fs/promises"
import sharp from "sharp"
import potrace from "potrace"

const SRC = "brand/logo-originale.png"
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info

// area del tetto: i riflessi chiari sono acciaio, non bianco
const inRoof = (i) => { const x = i % W, y = Math.floor(i / W); return y > 185 && y < 500 && x < 1345 && x > 795 + (495 - y) * (350 / 305) }
async function mask(test) {
  const out = Buffer.alloc(W * H)
  for (let i = 0; i < W * H; i++) {
    const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2]
    out[i] = test(r, g, b, i) ? 0 : 255 // nero = forma
  }
  return sharp(out, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer()
}
const trace = (buf) =>
  new Promise((res, rej) =>
    potrace.trace(buf, { threshold: 128, turdSize: 20, optTolerance: 0.3, alphaMax: 1 }, (err, svg) => (err ? rej(err) : res(svg.match(/ d="([^"]+)"/)[1]))),
  )

const lum = (r, g, b) => (r + g + b) / 3
const white = await trace(await mask((r, g, b, i) => lum(r, g, b) > 200 && !inRoof(i)))
const steel = await trace(await mask((r, g, b, i) => lum(r, g, b) > 58 && (lum(r, g, b) <= 200 || inRoof(i))))

await fs.writeFile("brand/logo-paths.json", JSON.stringify({ width: W, height: H, white, steel }))
console.log("white path", white.length, "steel path", steel.length)

// ---- file finali ----
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10))
const w = round(white), s = round(steel)
const grad = `<linearGradient id="gav-steel" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#b9bcc2"/><stop offset=".45" stop-color="#7c8089"/><stop offset=".7" stop-color="#a5a8ae"/><stop offset="1" stop-color="#5d616a"/></linearGradient>`
await fs.mkdir("public/brand", { recursive: true })
await fs.writeFile(
  "public/brand/logo-gav.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="GAV s.r.l.s. Coperture, rimozione e bonifica amianto, edilizia, realizzazione piscine"><defs>${grad}</defs><rect width="${W}" height="${H}" fill="#041121"/><path fill="url(#gav-steel)" d="${s}"/><path fill="#fff" d="${w}"/></svg>\n`,
)
// favicon: solo il tetto del logo su fondo blu
await fs.writeFile(
  "public/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="760 90 600 600"><defs>${grad}<clipPath id="r"><polygon points="800,495 1150,190 1215,190 1345,495"/></clipPath></defs><rect x="760" y="90" width="600" height="600" rx="110" fill="#041121"/><path fill="url(#gav-steel)" clip-path="url(#r)" transform="translate(-12,48)" d="${s}"/></svg>\n`,
)
console.log("scritti public/brand/logo-gav.svg e public/favicon.svg")
