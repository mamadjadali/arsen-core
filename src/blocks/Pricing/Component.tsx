'use client'

import React, { useState } from 'react'

import type { PricingBlock as PricingBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const PricingBlock: React.FC<PricingBlockProps> = ({
  heading,
  yearlyDiscountLabel,
  plans,
}) => {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="journey" className="flex w-full flex-col bg-[var(--color-canvas)] pb-24">
      <div className="relative h-8 w-full overflow-hidden border-y border-black/10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] text-black opacity-10" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-20 md:px-8">
        <h2 className="mb-8 text-center text-4xl leading-none font-medium tracking-tight text-black md:text-[3.5rem]">
          {heading}
        </h2>

        <div className="mb-16 flex items-center rounded-md border border-black/20 p-1">
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={cn(
              'rounded-md px-6 py-2 text-sm font-medium transition-colors',
              !isYearly ? 'bg-black text-[var(--color-canvas)]' : 'bg-transparent text-black hover:bg-black/5',
            )}
          >
            حضوری
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={cn(
              'rounded-md px-6 py-2 text-sm font-medium transition-colors',
              isYearly ? 'bg-black text-[var(--color-canvas)]' : 'bg-transparent text-black hover:bg-black/5',
            )}
          >
            {yearlyDiscountLabel || 'پیگیری'}
          </button>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {(plans || []).map((plan, index) => (
            <div key={index} className="relative flex h-full w-full flex-col">
              {plan.hasShadow && (
                <div
                  className={cn(
                    'absolute top-4 -right-4 bottom-0 left-4 -z-10 h-full w-full md:top-6 md:-right-6 md:left-6',
                    plan.shadowStyle === 'dark'
                      ? 'bg-[repeating-linear-gradient(45deg,var(--color-ink)_0,var(--color-ink)_1px,transparent_1px,transparent_6px)] opacity-20'
                      : 'bg-[repeating-linear-gradient(45deg,var(--brand-orange)_0,var(--brand-orange)_1px,transparent_1px,transparent_6px)] opacity-30',
                  )}
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex h-full w-full flex-col rounded-md border bg-[var(--color-canvas-soft)] p-8',
                  plan.isPopular ? 'border-primary' : 'border-black/10',
                )}
              >
                {plan.isPopular && (
                  <div className="absolute top-4 left-4 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary-foreground">
                    پرطرفدار
                  </div>
                )}

                <h3 className="mb-4 text-3xl font-semibold tracking-tight text-black">
                  {plan.name}
                </h3>

                <p className="mb-6 min-h-[40px] text-sm leading-relaxed text-black/60">
                  {plan.description}
                </p>

                <div className="mb-8 flex items-baseline gap-1">
                  {(plan.priceMonthly === 0 && plan.priceYearly === 0) ||
                  (plan.priceMonthly == null && plan.priceYearly == null) ? (
                    <span className="text-2xl font-semibold tracking-tight text-black md:text-3xl">
                      پس از معاینه
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold tracking-tighter text-black">
                        {isYearly ? plan.priceYearly : plan.priceMonthly}
                      </span>
                      <span className="text-sm text-black/50">/جلسه</span>
                    </>
                  )}
                </div>

                <div className="mb-10 flex flex-1 flex-col gap-4">
                  {(plan.features || []).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-1 shrink-0',
                          feature.included
                            ? 'size-3.5 bg-black'
                            : 'size-3.5 border border-black/30 bg-transparent',
                        )}
                      />
                      <span className="text-[13px] leading-relaxed text-black/80">
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.buttonLink?.label || plan.buttonText ? (
                  <CMSLink
                    {...(plan.buttonLink || {})}
                    label={plan.buttonText || plan.buttonLink?.label}
                    appearance="inline"
                    className={cn(
                      'mt-auto w-max rounded-md px-8 py-2.5 text-sm font-medium transition-colors',
                      plan.buttonVariant === 'outline' &&
                        'border border-black/20 text-black hover:bg-black/5',
                      plan.buttonVariant === 'primary' &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                      plan.buttonVariant === 'dark' &&
                        'bg-black text-[var(--color-canvas)] hover:bg-black/90',
                    )}
                  />
                ) : (
                  <button
                    type="button"
                    className={cn(
                      'mt-auto w-max rounded-md px-8 py-2.5 text-sm font-medium transition-colors',
                      plan.buttonVariant === 'outline' &&
                        'border border-black/20 text-black hover:bg-black/5',
                      plan.buttonVariant === 'primary' &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                      plan.buttonVariant === 'dark' &&
                        'bg-black text-[var(--color-canvas)] hover:bg-black/90',
                    )}
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
