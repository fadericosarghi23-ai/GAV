import type { ReactNode } from "react"

import { PageHero } from "@/components/sections/PageHero"

export function LegalPage({
  title,
  updated,
  crumb,
  children,
}: {
  title: string
  updated: string
  crumb: { to: string; label: string }
  children: ReactNode
}) {
  return (
    <>
      <PageHero eyebrow={`Aggiornata il ${updated}`} title={title} crumbs={[crumb]} />
      <article className="mx-auto max-w-3xl px-4 py-16 text-graphite sm:px-6 md:py-24 [&_a]:font-semibold [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-orange [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:text-navy [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:text-navy [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </article>
    </>
  )
}
