import { Link } from "react-router"
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/layout/Navbar"
import { business, mailto, p, pageBlocks, tel } from "@/lib/content"
import { NAV, SERVICES } from "@/lib/site"

export function Footer() {
  const about = p(pageBlocks("home"), "GAV SRLS è un")
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ice">
      <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="h-20" />
            <p className="mt-6 font-display text-lg font-semibold text-navy">{business.tagline}</p>
            <h2 className="eyebrow mt-8 text-graphite">Su di Noi</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-graphite">{about}</p>
          </div>
          <div className="lg:col-span-2 lg:col-start-6">
            <h2 className="eyebrow text-graphite">Link Utili</h2>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.to}>
                  <FooterLink to={n.to}>{n.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className="eyebrow text-graphite">Servizi</h2>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <FooterLink to={`/servizi/${s.slug}`}>{s.short}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h2 className="eyebrow text-graphite">Dettagli Contatti</h2>
            <ul className="mt-5 space-y-4 text-[15px]">
              <li>
                <a href={tel} className="flex items-start gap-3 text-navy hover:text-orange">
                  <Phone className="mt-0.5 size-4 shrink-0" /> {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailto} className="flex items-start gap-3 break-all text-navy hover:text-orange">
                  <Mail className="mt-0.5 size-4 shrink-0" /> {business.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-navy">
                <MapPin className="mt-0.5 size-4 shrink-0" /> {business.area}
              </li>
              <li className="flex items-start gap-3 text-navy">
                <Clock className="mt-0.5 size-4 shrink-0" />
                <span>
                  {business.hours.map((h) => (
                    <span key={h.label} className="block">
                      {h.label} {h.open} alle {h.close}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>


        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-[13px] text-graphite md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name} · P.IVA {business.vat} · Tutti i diritti riservati.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className="hover:text-navy">Privacy Policy</Link>
            <Link to="/cookie" className="hover:text-navy">Cookie Policy</Link>
            <span>Sito realizzato da Altalogik</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1 font-display text-[15px] font-semibold text-navy">
      <span className="bg-[linear-gradient(var(--gav-orange),var(--gav-orange))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
        {children}
      </span>
      <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  )
}
