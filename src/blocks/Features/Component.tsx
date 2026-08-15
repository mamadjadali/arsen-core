'use client'

import React from 'react'
import { motion } from 'motion/react'

import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'

import { LoopingWaveform } from '@/components/marketing/looping-waveform'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/marketing/social-icons'
import { cn } from '@/utilities/ui'

const socials = [
  { id: 'X', Icon: XIcon },
  { id: 'LinkedIn', Icon: LinkedInIcon },
  { id: 'Facebook', Icon: FacebookIcon },
  { id: 'Threads', Icon: ThreadsIcon },
  { id: 'Instagram', Icon: InstagramIcon },
  { id: 'TikTok', Icon: TikTokIcon },
  { id: 'YouTube', Icon: YouTubeIcon },
]

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ heading, cards }) => {
  const headingLines = (heading || '').split('\n').filter(Boolean)

  return (
    <section
      id="services"
      className="w-full bg-[var(--color-canvas)] px-4 py-20 md:px-8 md:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <h2 className="max-w-2xl text-center text-3xl leading-[0.95] tracking-[-0.04em] text-black/40 md:text-5xl lg:text-4xl">
          {headingLines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </h2>

        <div className="mt-14 grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {(cards || []).map((card, index) => (
            <article
              key={index}
              className={cn(
                'flex min-h-[430px] flex-col rounded-md border bg-[var(--color-canvas-soft)] p-8 md:p-9',
                card.highlight ? 'border-primary' : 'border-black/12',
              )}
            >
              <h3 className="max-w-[15rem] text-3xl font-semibold leading-[1.05] tracking-[-0.055em] text-black md:text-2xl lg:text-[2.55rem]">
                {card.title}
              </h3>
              <p
                className={cn(
                  'mt-5 text-sm leading-6 text-black/50 md:text-xs md:leading-5 lg:text-[13px] lg:leading-6',
                  card.variant === 'generator' && 'mb-2',
                )}
              >
                {card.description}
              </p>

              {card.variant === 'waveform' && (
                <div className="mt-auto border-l border-black/5 pl-5">
                  <LoopingWaveform
                    className="max-w-[260px] text-primary/40"
                    height={96}
                    bars={54}
                    barWidth={4}
                    barGap={3}
                  />
                </div>
              )}

              {card.variant === 'generator' && (
                <div className="mt-auto">
                  <button
                    type="button"
                    className="ml-auto block w-fit max-w-full rounded-tl-full rounded-tr-full rounded-bl-full bg-primary px-5 py-2.5 text-left text-[11px] leading-[1.4] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/85 md:px-4 md:py-2 md:text-[10px] lg:px-5 lg:py-2.5 lg:text-[11px]"
                  >
                    {card.promptText || 'Make a house song about quitting your job'}
                  </button>
                  <div className="mt-8 ml-2 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-2.5 rounded-full bg-black/20"
                        animate={{
                          opacity: [0.4, 1, 0.4],
                          y: [0, -3, 0],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 ml-2 text-[8px] font-medium text-black/40">
                    {card.statusText || 'Generating a house song about quitting the job'}
                  </p>
                </div>
              )}

              {card.variant === 'social' && (
                <div className="mt-auto mb-10 w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                  <motion.div
                    className="flex w-max items-center gap-6 pr-6 text-primary/40"
                    animate={{ x: [0, '-50%'] }}
                    transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
                  >
                    {[1, 2].map((key) => (
                      <React.Fragment key={key}>
                        {socials.map((social) => {
                          const Icon = social.Icon
                          return (
                            <Icon
                              key={`${key}-${social.id}`}
                              className="shrink-0 cursor-pointer transition-colors hover:text-primary"
                            />
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </motion.div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
