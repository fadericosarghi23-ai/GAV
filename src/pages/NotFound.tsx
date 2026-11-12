import { Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useMeta } from "@/hooks/useMeta"

export default function NotFound() {
  useMeta("Pagina non trovata | GAV SRLS")
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden bg-ice px-4 pt-28 text-center">
      <div aria-hidden className="ribs absolute inset-0 text-navy/20" />
      <div className="relative">
        <svg viewBox="0 0 200 80" className="mx-auto w-48 text-navy" aria-hidden>
          <motion.path
            d="M10 75 L100 8 L190 75"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <p className="steel-text font-display text-[clamp(6rem,22vw,14rem)] font-bold leading-none tracking-[-0.05em]">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-navy md:text-3xl">Questa pagina non esiste</h1>
        <p className="mt-3 text-graphite">Forse l’indirizzo è cambiato con il nuovo sito.</p>
        <Button asChild variant="navy" className="mt-8">
          <Link to="/">
            <ArrowLeft /> Torna alla home
          </Link>
        </Button>
      </div>
    </section>
  )
}
