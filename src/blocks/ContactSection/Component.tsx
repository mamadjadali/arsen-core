'use client'

import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import React from 'react'

import type { ContactSectionBlock as ContactSectionBlockProps, Form } from '@/payload-types'

import { FormBlock } from '@/blocks/Form/Component'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

const methodIcons = {
  mail: Mail,
  chat: MessageSquare,
  phone: Phone,
  map: MapPin,
} as const

type Method = NonNullable<ContactSectionBlockProps['methods']>[number]

function hasResolvableLink(link: Method['link']): boolean {
  if (!link) return false
  if (link.type === 'custom' && link.url) return true
  if (link.type === 'reference' && link.reference) return true
  return false
}

function MethodCard({ method }: { method: Method }) {
  const Icon = methodIcons[method.icon] || Mail
  const clickable = hasResolvableLink(method.link)

  const valueNode = clickable ? (
    <CMSLink
      {...method.link}
      label={method.value}
      appearance="inline"
      className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
    />
  ) : (
    <p className="text-sm font-semibold text-foreground">{method.value}</p>
  )

  return (
    <div className="flex items-start gap-4 rounded-md bg-muted p-4 md:p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background text-foreground">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-semibold text-foreground">{method.title}</p>
        {method.subtitle ? (
          <p className="text-sm text-muted-foreground">{method.subtitle}</p>
        ) : null}
        <div className="pt-1">{valueNode}</div>
      </div>
    </div>
  )
}

export const ContactSectionBlock: React.FC<
  ContactSectionBlockProps & { className?: string; disableInnerContainer?: boolean }
> = ({ heading, description, methods, formHeading, formDescription, form, className }) => {
  const formDoc = typeof form === 'object' && form !== null ? (form as Form) : null
  const methodList = methods || []

  return (
    <section className={cn('bg-background py-16 md:py-24', className)}>
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          {heading && (
            <RichText
              data={heading}
              enableGutter={false}
              enableProse
              className="mb-4 max-w-none text-3xl font-bold tracking-tight text-foreground md:text-5xl prose-headings:mb-0 prose-headings:text-center prose-headings:text-3xl prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground md:prose-headings:text-5xl"
            />
          )}
          {description && (
            <RichText
              data={description}
              enableGutter={false}
              enableProse
              className="mx-auto max-w-xl text-base text-muted-foreground prose-p:text-center prose-p:text-muted-foreground prose-a:text-primary"
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-3 md:gap-4">
            {methodList.map((method, i) => (
              <MethodCard key={method.id || i} method={method} />
            ))}
          </div>

          <div className="rounded-md border border-border bg-card p-6 md:p-8">
            {formHeading ? (
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{formHeading}</h3>
            ) : null}
            {formDescription ? (
              <p className="mt-2 text-sm text-muted-foreground">{formDescription}</p>
            ) : null}

            {formDoc ? (
              <div className={cn((formHeading || formDescription) && 'mt-6')}>
                <FormBlock
                  // @ts-expect-error Form plugin type vs Payload Form doc
                  form={formDoc}
                  enableIntro={false}
                  embedded
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
