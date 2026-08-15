import React from 'react'

import type { Footer, Media } from '@/payload-types'

import { FooterBrand } from '../FooterBrand'
import { FooterBottom } from '../FooterBottom'
import { FooterLinkColumns } from '../FooterLinkColumns'
import { FooterSocial } from '../FooterSocial'

type FooterColumnsProps = {
  data: Footer
  logoLight?: Media | string | number | null
}

export function FooterColumns({ data, logoLight }: FooterColumnsProps) {
  const linkGroups = data.linkGroups || []
  const socialLinks = data.socialLinks || []

  return (
    <footer className="w-full border-t border-border bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="flex shrink-0 flex-col gap-6 lg:w-56">
            <FooterBrand
              logo={data.logo}
              logoLight={logoLight}
              brandName={data.brandName}
              tagline={data.tagline}
              titleClassName="text-lg"
            />
            <FooterSocial socialLinks={socialLinks} />
          </div>

          <FooterLinkColumns
            linkGroups={linkGroups}
            className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10"
            titleClassName="text-sm font-semibold text-foreground"
            listClassName="mt-4 space-y-3"
            linkClassName="text-sm text-muted-foreground transition-colors hover:text-foreground"
          />
        </div>

        <FooterBottom
          className="mt-14"
          copyright={data.copyright}
          legalLinks={data.legalLinks}
        />
      </div>
    </footer>
  )
}
