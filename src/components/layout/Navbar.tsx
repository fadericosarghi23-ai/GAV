import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ChevronDown, Menu, Phone, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLenis } from "@/components/motion/SmoothScroll"
import { business, img, tel } from "@/lib/content"
import { NAV, SERVICES } from "@/lib/site"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/brand/logo-gav.svg"
      alt="GAV s.r.l.s."
      width={1565}
      height={1005}
      className={cn("h-14 w-auto rounded-[4px] shadow-[0_6px_20px_-10px_rgba(4,17,33,.6)]", className)}
    />
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const lenis = useLenis()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const last = useRef(0)
  const onPhoto = pathname === "/" && !scrolled && !open

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24)
    setHidden(y > 400 && y > last.current && !open && !drop)
    last.current = y
  })

  useEffect(() => {
    setOpen(false)
    setDrop(false)
  }, [pathname])

  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.style.overflow = open ? "hidden" : ""
  }, [open, lenis])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled ? "bg-white/85 shadow-[0_1px_0_var(--gav-line)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-24 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10" aria-label="Principale">
          <Link to="/" className="shrink-0" aria-label="GAV s.r.l.s., torna alla home">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              "children" in item ? (
                <li
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => setDrop(true)}
                  onMouseLeave={() => setDrop(false)}
                >
                  <div className="flex items-center">
                    <NavItem to={item.to} label={item.label} light={onPhoto} />
                    <button
                      type="button"
                      aria-label="Apri il menu dei servizi"
                      aria-expanded={drop}
                      onClick={() => setDrop((d) => !d)}
                      className={cn("-ml-2 grid size-8 place-items-center rounded transition-colors", onPhoto ? "text-white" : "text-navy")}
                    >
                      <ChevronDown className={cn("size-4 transition-transform duration-300", drop && "rotate-180")} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {drop && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, clipPath: "inset(0 0 100% 0)" }}
                        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                        exit={{ opacity: 0, y: 6, clipPath: "inset(0 0 100% 0)" }}
                        transition={{ duration: 0.4, ease }}
                        className="absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-3"
                      >
                        <div className="grid grid-cols-3 gap-2 rounded-lg border border-line bg-white p-2 shadow-[0_30px_60px_-30px_rgba(1,37,62,.45)]">
                          {SERVICES.map((s) => (
                            <Link
                              key={s.slug}
                              to={`/servizi/${s.slug}`}
                              className="group relative overflow-hidden rounded-md bg-navy-deep text-white"
                            >
                              <img
                                src={img(s.image).thumb}
                                alt=""
                                loading="lazy"
                                className="h-36 w-full object-cover opacity-60 transition duration-700 group-hover:scale-110 group-hover:opacity-40"
                              />
                              <div className="absolute inset-0 flex flex-col justify-between p-4">
                                <span className="eyebrow text-[11px] text-orange">{s.number}</span>
                                <span className="font-display text-lg font-semibold leading-tight">{s.short}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.to}>
                  <NavItem to={item.to} label={item.label} light={onPhoto} />
                </li>
              ),
            )}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={tel} className={cn("group flex items-center gap-2 font-display text-sm font-semibold transition-colors", onPhoto ? "text-white" : "text-navy")}>
              <span className="grid size-9 place-items-center rounded-full border border-current/25 transition group-hover:bg-orange group-hover:border-orange">
                <Phone className="size-4" />
              </span>
              {business.phoneDisplay}
            </a>
            <Button asChild size="sm">
              <Link to="/contatti#preventivo">Richiedi un Preventivo</Link>
            </Button>
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-md bg-navy text-white lg:hidden"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

function NavItem({ to, label, light = false }: { to: string; label: string; light?: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "group relative px-4 py-2 font-display text-[14px] font-semibold transition-colors",
          light ? "text-white" : "text-navy",
          isActive && !light && "text-navy",
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            className={cn(
              "absolute inset-x-4 bottom-0.5 h-[2px] origin-left bg-orange transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
              isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            )}
          />
        </>
      )}
    </NavLink>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [svc, setSvc] = useState(false)
  return (
    <motion.div
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
      animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      exit={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
      transition={{ duration: 0.6, ease }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-navy-deep px-6 pb-8 pt-28 text-white lg:hidden"
      data-lenis-prevent
    >
      <div className="ribs pointer-events-none absolute inset-0 text-steel/60" aria-hidden />
      <ul className="relative space-y-1">
        {NAV.map((item, i) => (
          <motion.li
            key={item.to}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.06 }}
            className="border-b border-white/10"
          >
            <div className="flex items-center justify-between">
              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  cn("block py-4 font-display text-[2rem] font-semibold leading-none", isActive && "text-orange")
                }
              >
                {item.label}
              </NavLink>
              {"children" in item && (
                <button
                  type="button"
                  aria-label="Mostra i servizi"
                  aria-expanded={svc}
                  onClick={() => setSvc((s) => !s)}
                  className="grid size-11 place-items-center rounded-full border border-white/20"
                >
                  <ChevronDown className={cn("size-5 transition-transform", svc && "rotate-180")} />
                </button>
              )}
            </div>
            {"children" in item && (
              <AnimatePresence initial={false}>
                {svc && (
                  <motion.ul
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="overflow-hidden"
                  >
                    {item.children.map((c, j) => (
                      <li key={c.to}>
                        <NavLink
                          to={c.to}
                          onClick={onClose}
                          className="flex items-center gap-3 py-3 pl-1 font-display text-lg text-white/80"
                        >
                          <span className="eyebrow text-[11px] text-orange">0{j + 1}</span>
                          {c.label}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
          </motion.li>
        ))}
      </ul>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mt-auto space-y-3 pt-10"
      >
        <Button asChild className="w-full">
          <Link to="/contatti#preventivo" onClick={onClose}>
            Richiedi un Preventivo
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full text-white">
          <a href={tel}>
            <Phone /> {business.phoneDisplay}
          </a>
        </Button>
      </motion.div>
    </motion.div>
  )
}
