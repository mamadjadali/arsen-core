'use client'

import {
  ArrowLeft,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/utilities/ui'
import {
  contactMethodDisplayValue,
  contactMethodHref,
  isExternalContactHref,
  type ContactMethodLike,
  type ContactMethodType,
} from '@/utilities/contactMethod'

const ICONS: Record<ContactMethodType, LucideIcon> = {
  phone: Phone,
  whatsapp: MessageCircle,
  telegram: Send,
  instagram: Instagram,
  email: Mail,
  url: Link2,
}

type InquiryContactDialogProps = {
  label: string
  methods: ContactMethodLike[]
  /** Copper gradient CTA (no-price) vs solid black (priced). */
  variant?: 'inquiry' | 'solid'
  className?: string
}

export function InquiryContactDialog({
  label,
  methods,
  variant = 'inquiry',
  className,
}: InquiryContactDialogProps) {
  const rows = methods
    .filter((m) => m?.enabled !== false && m.label?.trim() && m.value?.trim() && m.type)
    .map((m) => ({
      ...m,
      href: contactMethodHref(m.type, m.value),
      display: contactMethodDisplayValue(m.type, m.value),
    }))
    .filter((m) => Boolean(m.href))

  const triggerClass =
    variant === 'inquiry'
      ? 'inquiry-cta inline-flex w-full min-h-[60px] items-center justify-center gap-8 rounded-lg border px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
      : 'inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-md border border-black bg-black px-6 text-sm font-medium text-[var(--color-canvas)] transition-colors hover:bg-black/90'

  if (!rows.length) {
    return (
      <Link href="/contact" className={cn(triggerClass, className)}>
        {label}
        {variant === 'inquiry' ? <ArrowLeft className="size-4 shrink-0" aria-hidden /> : null}
      </Link>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={cn(triggerClass, className)}>
          {label}
          {variant === 'inquiry' ? <ArrowLeft className="size-4 shrink-0" aria-hidden /> : null}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(85dvh,36rem)] gap-3 overflow-y-auto p-4 sm:gap-4 sm:p-6">
        <DialogHeader className="pe-8">
          <DialogTitle className="text-base sm:text-lg">{label}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            یکی از راه‌های زیر را انتخاب کنید
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col divide-y divide-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] border-t border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)]">
          {rows.map((row) => {
            const Icon = ICONS[row.type]
            const external = isExternalContactHref(row.href)
            return (
              <li key={row.id || `${row.type}-${row.value}`}>
                <a
                  href={row.href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex min-h-12 items-center gap-3 py-3 transition-opacity hover:opacity-80 active:opacity-70"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center text-[var(--color-ink)] sm:size-9">
                    <Icon className="size-4 sm:size-[1.125rem]" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium leading-tight text-[var(--color-ink)]">
                      {row.label}
                    </span>
                    <span
                      className="truncate text-xs leading-tight text-[var(--color-body,var(--color-ink))] opacity-75"
                      dir="ltr"
                    >
                      {row.display}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
