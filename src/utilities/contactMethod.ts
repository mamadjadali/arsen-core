export type ContactMethodType =
  | 'phone'
  | 'whatsapp'
  | 'telegram'
  | 'instagram'
  | 'email'
  | 'url'

export type ContactMethodLike = {
  id?: string | null
  label: string
  type: ContactMethodType
  value: string
  enabled?: boolean | null
  sort?: number | null
}

const digitsOnly = (value: string): string => value.replace(/\D/g, '')

/** Build a clickable href for a contact method channel. */
export const contactMethodHref = (type: ContactMethodType, raw: string): string => {
  const value = raw.trim()
  if (!value) return ''

  switch (type) {
    case 'phone': {
      if (value.toLowerCase().startsWith('tel:')) return value
      return `tel:${value.replace(/[^\d+]/g, '')}`
    }
    case 'whatsapp': {
      const digits = digitsOnly(value.startsWith('+') ? value : value)
      return digits ? `https://wa.me/${digits}` : ''
    }
    case 'telegram': {
      if (/^https?:\/\//i.test(value)) return value
      const handle = value.replace(/^@/, '')
      return handle ? `https://t.me/${handle}` : ''
    }
    case 'instagram': {
      if (/^https?:\/\//i.test(value)) return value
      const handle = value.replace(/^@/, '').replace(/^instagram\.com\//i, '')
      return handle ? `https://instagram.com/${handle}` : ''
    }
    case 'email': {
      if (value.toLowerCase().startsWith('mailto:')) return value
      return `mailto:${value}`
    }
    case 'url': {
      if (/^https?:\/\//i.test(value)) return value
      if (value.startsWith('/')) return value
      return ''
    }
    default:
      return ''
  }
}

export const isExternalContactHref = (href: string): boolean =>
  /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

/** Short label for UI (handles / phones — not full URLs). */
export const contactMethodDisplayValue = (type: ContactMethodType, raw: string): string => {
  const value = raw.trim()
  if (!value) return ''

  switch (type) {
    case 'instagram': {
      if (/^https?:\/\//i.test(value)) {
        try {
          const path = new URL(value).pathname.replace(/\/+$/, '')
          const handle = path.split('/').filter(Boolean).pop()
          return handle ? `@${handle}` : value
        } catch {
          return value
        }
      }
      return value.startsWith('@') ? value : `@${value.replace(/^@/, '')}`
    }
    case 'telegram': {
      if (/^https?:\/\//i.test(value)) {
        try {
          const path = new URL(value).pathname.replace(/\/+$/, '')
          const handle = path.split('/').filter(Boolean).pop()
          return handle ? `@${handle}` : value
        } catch {
          return value
        }
      }
      return value.startsWith('@') ? value : `@${value.replace(/^@/, '')}`
    }
    case 'url': {
      try {
        if (/^https?:\/\//i.test(value)) {
          const u = new URL(value)
          return u.host + (u.pathname === '/' ? '' : u.pathname.replace(/\/+$/, ''))
        }
      } catch {
        /* fall through */
      }
      return value
    }
    case 'email':
      return value.replace(/^mailto:/i, '')
    case 'phone':
    case 'whatsapp':
      return value.replace(/^tel:/i, '')
    default:
      return value
  }
}
