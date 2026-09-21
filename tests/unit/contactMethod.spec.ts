import { describe, expect, it } from 'vitest'

import { contactMethodDisplayValue, contactMethodHref } from '@/utilities/contactMethod'

describe('contactMethodHref', () => {
  it('builds tel links', () => {
    expect(contactMethodHref('phone', '+98 912 345 6789')).toBe('tel:+989123456789')
    expect(contactMethodHref('phone', 'tel:+98912')).toBe('tel:+98912')
  })

  it('builds WhatsApp and Telegram links', () => {
    expect(contactMethodHref('whatsapp', '+989123456789')).toBe('https://wa.me/989123456789')
    expect(contactMethodHref('telegram', '@ranjbar')).toBe('https://t.me/ranjbar')
    expect(contactMethodHref('telegram', 'https://t.me/ranjbar')).toBe('https://t.me/ranjbar')
  })

  it('builds Instagram, email, and url links', () => {
    expect(contactMethodHref('instagram', 'clinic')).toBe('https://instagram.com/clinic')
    expect(contactMethodHref('email', 'hi@example.com')).toBe('mailto:hi@example.com')
    expect(contactMethodHref('url', 'https://example.com')).toBe('https://example.com')
    expect(contactMethodHref('url', 'not-a-url')).toBe('')
  })
})

describe('contactMethodDisplayValue', () => {
  it('shortens Instagram and Telegram URLs to handles', () => {
    expect(
      contactMethodDisplayValue('instagram', 'https://www.instagram.com/mohammad_ghanaatjoo'),
    ).toBe('@mohammad_ghanaatjoo')
    expect(contactMethodDisplayValue('telegram', 'https://t.me/Kasra_gh0')).toBe('@Kasra_gh0')
    expect(contactMethodDisplayValue('instagram', 'clinic')).toBe('@clinic')
  })
})
