import React from 'react'

import type { Footer, Media } from '@/payload-types'

import { resolveFirstMedia } from '@/utilities/resolveMedia'

import { FooterBrand } from '../FooterBrand'
import { FooterBottom } from '../FooterBottom'
import { FooterLinkColumns } from '../FooterLinkColumns'
import { FooterSocial } from '../FooterSocial'

type FooterNewsletterProps = {
  data: Footer
  logoLight?: Media | string | number | null
}

export function FooterNewsletter({ data, logoLight }: FooterNewsletterProps) {
  const linkGroups = data.linkGroups || []
  const socialLinks = data.socialLinks || []
  const resolvedLogo = resolveFirstMedia(data.logo, logoLight)
  const showBrand = Boolean(data.brandName?.trim() || resolvedLogo || data.tagline?.trim())

  return (
    <footer className="w-full bg-background px-6 pb-28 pt-20 text-foreground md:px-12 lg:px-28 lg:pb-44 lg:pt-24">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-24">
        <div className="flex min-h-[280px] flex-col justify-between gap-20">
          <div className="flex flex-col gap-8">
            {showBrand ? (
              <FooterBrand
                logo={data.logo}
                logoLight={logoLight}
                brandName={data.brandName}
                tagline={data.tagline}
                logoHeightMobile={data.logoHeightMobile}
                logoHeightDesktop={data.logoHeightDesktop}
                showTagline={Boolean(data.tagline?.trim())}
                titleClassName="text-xl"
              />
            ) : null}
            <div>
              <h2 className="text-3xl font-normal tracking-[-0.035em] text-foreground">
                {data.newsletterHeading || 'Newsletter'}
              </h2>
              <form className="mt-4 flex max-w-[390px] items-center gap-2" action="#" method="post">
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  placeholder={data.newsletterPlaceholder || 'Enter Your Email'}
                  className="h-12 min-w-0 flex-1 rounded-md border border-foreground/55 bg-card px-4 text-lg text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
                />
                <button
                  type="submit"
                  className="h-12 rounded-md bg-foreground px-4 text-lg font-normal text-background transition-colors hover:bg-foreground/85"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div>
            <FooterSocial socialLinks={socialLinks} className="text-muted-foreground" />
            {!data.legalLinks?.length && data.copyright ? (
              <p className="mt-4 text-lg font-normal tracking-[-0.03em] text-muted-foreground">
                {data.copyright}
              </p>
            ) : null}
          </div>
        </div>

        <FooterLinkColumns
          linkGroups={linkGroups}
          className="grid grid-cols-2 gap-14 lg:gap-20"
          titleClassName="text-3xl font-normal tracking-[-0.035em] text-foreground"
          listClassName="mt-5 space-y-3"
          linkClassName="text-2xl font-normal tracking-[-0.04em] text-muted-foreground transition-colors hover:text-foreground"
        />
      </div>

      {data.legalLinks?.length ? (
        <FooterBottom
          className="mt-16"
          copyright={data.copyright}
          legalLinks={data.legalLinks}
          showDivider
        />
      ) : null}
    </footer>
  )
}
