import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Footer, Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { logoIntrinsicSize, logoSizeClassName, logoSizeStyle } from '@/utilities/logoSize'
import { resolveFirstMedia, resolveMediaUrl } from '@/utilities/resolveMedia'

type FooterContactProps = {
  data: Footer
  logoLight?: Media | string | number | null
}

function toTelHref(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ''
  if (trimmed.toLowerCase().startsWith('tel:')) return trimmed
  return `tel:${trimmed.replace(/[^\d+]/g, '')}`
}

export function FooterContact({ data, logoLight }: FooterContactProps) {
  const logo = resolveFirstMedia(data.logo, logoLight)
  const logoUrl = resolveMediaUrl(logo)
  const phones = (data.phones || []).filter((p) => p?.number?.trim())
  const addresses = (data.addresses || []).filter((a) => a?.text?.trim())
  const navItems = data.navItems || []
  const copyright = data.copyright?.trim()

  return (
    <footer className="footer-contact" dir="rtl">
      <div className="footer-contact-inner">
        {logoUrl ? (
          <Link href="/" className="footer-contact-brand" aria-label="صفحه اصلی">
            <Image
              src={logoUrl}
              alt={logo?.alt || data.brandName || 'Logo'}
              {...logoIntrinsicSize(data.logoHeightDesktop ?? 84)}
              className={logoSizeClassName}
              style={logoSizeStyle(data.logoHeightMobile ?? 74, data.logoHeightDesktop ?? 84)}
              unoptimized={logoUrl.startsWith('/suno-logo')}
            />
          </Link>
        ) : data.brandName?.trim() ? (
          <Link href="/" className="footer-contact-brand footer-contact-brand-text">
            {data.brandName}
          </Link>
        ) : (
          <span className="footer-contact-brand" aria-hidden />
        )}

        {(phones.length > 0 || addresses.length > 0) && (
          <div className="footer-contact-info" aria-label="اطلاعات تماس">
            {phones.length > 0 ? (
              <div className="footer-contact-phones">
                {phones.map((phone, index) => {
                  const href = toTelHref(phone.number)
                  return (
                    <a key={phone.id || `${phone.number}-${index}`} href={href || undefined}>
                      {phone.label?.trim() ? <span>{phone.label}</span> : null}
                      <strong dir="ltr">{phone.number}</strong>
                    </a>
                  )
                })}
              </div>
            ) : null}

            {addresses.length > 0 ? (
              <address className="footer-contact-addresses">
                {addresses.map((address, index) => {
                  const mapUrl = address.mapUrl?.trim()
                  const body = (
                    <>
                      {address.label?.trim() ? <span>{address.label}</span> : null}
                      {address.text}
                    </>
                  )
                  return mapUrl ? (
                    <a
                      key={address.id || `${address.text}-${index}`}
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {body}
                    </a>
                  ) : (
                    <div key={address.id || `${address.text}-${index}`}>{body}</div>
                  )
                })}
              </address>
            ) : null}
          </div>
        )}

        {navItems.length > 0 ? (
          <nav className="footer-contact-nav" aria-label="فهرست پایین صفحه">
            {navItems.map(({ link }, i) => (
              <CMSLink key={i} {...link} appearance="inline" />
            ))}
          </nav>
        ) : null}

        {copyright ? <p className="footer-contact-copyright">{copyright}</p> : null}
      </div>
    </footer>
  )
}
