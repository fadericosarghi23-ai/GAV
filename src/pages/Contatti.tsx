import { useState, type FormEvent } from "react"
import { Link, useSearchParams } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Clock, Mail, MapPin, Phone, Send } from "lucide-react"

import { PageHero } from "@/components/sections/PageHero"
import { Reveal } from "@/components/motion/Reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMeta } from "@/hooks/useMeta"
import { business, h, mailto, p, pageBlocks, pageMeta, tel } from "@/lib/content"

const b = pageBlocks("contatti")

export default function Contatti() {
  const meta = pageMeta("contatti")
  useMeta("Contatti e preventivi | GAV SRLS, impresa edile in Lombardia", meta.description)
  const cards = [
    { icon: MapPin, label: "Indirizzo", value: business.area },
    { icon: Mail, label: "Email", value: business.email, href: mailto },
    { icon: Phone, label: "Telefono", value: business.phoneDisplay, href: tel },
  ]
  return (
    <>
      <PageHero eyebrow={h(b, "GAV SRLS")} title={h(b, "Contatti")} crumbs={[{ to: "/contatti", label: "Contatti" }]}>
        <p>{p(b, "La nostra attività nasce")}</p>
      </PageHero>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-10">
        <div className="space-y-4 lg:col-span-4">
          {cards.map((c, i) => {
            const Inner = (
              <>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-white transition-colors group-hover:bg-orange group-hover:text-navy-deep">
                  <c.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block text-[11px] text-graphite">{c.label}</span>
                  <span className="mt-1 block break-words font-display text-lg font-semibold text-navy">{c.value}</span>
                </span>
              </>
            )
            return (
              <Reveal key={c.label} delay={i * 0.08}>
                {c.href ? (
                  <a href={c.href} className="group flex items-center gap-4 rounded-lg border border-line bg-white p-5 transition hover:border-navy">
                    {Inner}
                  </a>
                ) : (
                  <div className="group flex items-center gap-4 rounded-lg border border-line bg-white p-5">{Inner}</div>
                )}
              </Reveal>
            )
          })}
          <Reveal delay={0.24}>
            <div className="flex items-start gap-4 rounded-lg border border-line bg-white p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-white">
                <Clock className="size-5" />
              </span>
              <span>
                <span className="eyebrow block text-[11px] text-graphite">Orari</span>
                {business.hours.map((x) => (
                  <span key={x.label} className="mt-1 block font-display font-semibold text-navy">
                    {x.label} {x.open} alle {x.close}
                  </span>
                ))}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <MapOnClick />
          </Reveal>
        </div>

        <div id="preventivo" className="scroll-mt-28 lg:col-span-7 lg:col-start-6">
          <QuoteForm title={h(b, "Richiedi un preventivo")} />
        </div>
      </section>
    </>
  )
}

function QuoteForm({ title }: { title: string }) {
  const [params] = useSearchParams()
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle")

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setState("sending")
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState("ok")
      form.reset()
    } catch {
      setState("error")
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-navy-deep p-6 text-white md:p-10">
      <div aria-hidden className="ribs pointer-events-none absolute inset-0 text-steel/25" />
      <div className="relative">
        <h2 className="text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold leading-tight tracking-[-0.02em]">{title}</h2>
        <AnimatePresence mode="wait">
          {state === "ok" ? (
            <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center">
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                className="mx-auto grid size-20 place-items-center rounded-full bg-orange text-navy-deep"
              >
                <Check className="size-9" />
              </motion.span>
              <p className="mt-6 font-display text-2xl font-semibold">Richiesta inviata</p>
              <p className="mt-2 text-white/70">Grazie, La ricontatteremo al più presto.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              name="preventivo"
              method="POST"
              data-netlify="true"
              netlify-honeypot="sito-web"
              onSubmit={onSubmit}
              className="mt-8 grid gap-5 md:grid-cols-2"
            >
              <input type="hidden" name="form-name" value="preventivo" />
              <p className="hidden">
                <label>
                  Non compilare questo campo: <input name="sito-web" tabIndex={-1} autoComplete="off" />
                </label>
              </p>
              <Field id="nome" label="Nome *">
                <Input id="nome" name="nome" required autoComplete="given-name" className="text-navy-deep" />
              </Field>
              <Field id="cognome" label="Cognome *">
                <Input id="cognome" name="cognome" required autoComplete="family-name" className="text-navy-deep" />
              </Field>
              <Field id="email" label="Email *">
                <Input id="email" name="email" type="email" required autoComplete="email" className="text-navy-deep" />
              </Field>
              <Field id="telefono" label="Telefono">
                <Input id="telefono" name="telefono" type="tel" autoComplete="tel" className="text-navy-deep" />
              </Field>
              <Field id="oggetto" label="Oggetto" wide>
                <Input id="oggetto" name="oggetto" defaultValue={params.get("oggetto") ?? ""} className="text-navy-deep" />
              </Field>
              <Field id="messaggio" label="Messaggio *" wide>
                <Textarea id="messaggio" name="messaggio" required defaultValue={params.get("messaggio") ?? ""} className="text-navy-deep" />
              </Field>
              <label className="flex items-start gap-3 text-[14px] text-white/80 md:col-span-2">
                <input type="checkbox" name="privacy" value="accettata" required className="mt-1 size-4 shrink-0 accent-[#ffa100]" />
                <span>
                  Accetto le condizioni di utilizzo del sito e l’
                  <Link to="/privacy" className="underline underline-offset-2 hover:text-orange">
                    informativa sul trattamento dei dati personali
                  </Link>
                  .*
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                <Button type="submit" size="lg" disabled={state === "sending"}>
                  {state === "sending" ? "Invio in corso" : "Invia la richiesta"}
                  <Send className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5" />
                </Button>
                {state === "error" && (
                  <p role="alert" className="text-sm text-orange">
                    Invio non riuscito. Ci chiami al <a href={tel} className="underline">{business.phoneDisplay}</a> o scriva a{" "}
                    <a href={mailto} className="underline">{business.email}</a>.
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Field({ id, label, wide, children }: { id: string; label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <Label htmlFor={id} className="mb-2 block text-white/70">
        {label}
      </Label>
      {children}
    </div>
  )
}

/** Mappa OpenStreetMap caricata solo dopo il clic: prima nessuna richiesta a servizi esterni */
function MapOnClick() {
  const [on, setOn] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ice">
      {on ? (
        <iframe
          title="Mappa della Lombardia, zona operativa di GAV SRLS"
          src="https://www.openstreetmap.org/export/embed.html?bbox=8.49%2C44.68%2C11.43%2C46.64&layer=mapnik"
          className="h-72 w-full"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="relative grid h-72 place-items-center p-6 text-center">
          <div aria-hidden className="ribs absolute inset-0 text-navy/15" />
          <div className="relative">
            <MapPin className="mx-auto size-8 text-orange" />
            <p className="mt-3 font-display font-semibold text-navy">Operiamo in Lombardia</p>
            <Button variant="outline" size="sm" className="mt-4 text-navy" onClick={() => setOn(true)}>
              Mostra la mappa
            </Button>
            <p className="mt-3 text-[12px] text-graphite">
              La mappa viene caricata da OpenStreetMap solo dopo il clic. <Link to="/cookie" className="underline">Dettagli</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
