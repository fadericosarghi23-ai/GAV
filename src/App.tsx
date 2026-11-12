import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router"

import { Layout } from "@/components/layout/Layout"
import { SmoothScroll } from "@/components/motion/SmoothScroll"
import Home from "@/pages/Home"

const ChiSiamo = lazy(() => import("@/pages/ChiSiamo"))
const Servizi = lazy(() => import("@/pages/Servizi"))
const Muratura = lazy(() => import("@/pages/Muratura"))
const Coperture = lazy(() => import("@/pages/Coperture"))
const ChiaviInMano = lazy(() => import("@/pages/ChiaviInMano"))
const Galleria = lazy(() => import("@/pages/Galleria"))
const Contatti = lazy(() => import("@/pages/Contatti"))
const Privacy = lazy(() => import("@/pages/Privacy"))
const Cookie = lazy(() => import("@/pages/Cookie"))
const NotFound = lazy(() => import("@/pages/NotFound"))

const page = (el: React.ReactNode) => <Suspense fallback={<div className="min-h-screen" />}>{el}</Suspense>

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="chi-siamo" element={page(<ChiSiamo />)} />
            <Route path="servizi" element={page(<Servizi />)} />
            <Route path="servizi/muratura" element={page(<Muratura />)} />
            <Route path="servizi/coperture" element={page(<Coperture />)} />
            <Route path="servizi/chiavi-in-mano" element={page(<ChiaviInMano />)} />
            <Route path="galleria" element={page(<Galleria />)} />
            <Route path="contatti" element={page(<Contatti />)} />
            <Route path="privacy" element={page(<Privacy />)} />
            <Route path="cookie" element={page(<Cookie />)} />
            <Route path="*" element={page(<NotFound />)} />
          </Route>
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  )
}
