'use client'

import React from 'react'
import Link from 'next/link'
import { motion, type Variants } from 'motion/react'

import type { SolaceCtaBlock as SolaceCtaBlockProps } from '@/payload-types'

const ctaContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
}

const ctaItemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(12px)',
    y: 18,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.24,
      duration: 1.25,
    },
  },
}

const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
    scale: 0.94,
    y: 10,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.28,
      duration: 1,
    },
  },
}

export const SolaceCtaBlock: React.FC<SolaceCtaBlockProps> = ({
  heading,
  appleUrl,
  googleUrl,
}) => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-40">
      <div
        className="absolute top-0 left-1/2 z-[-1] h-full w-[100vw] -translate-x-1/2"
        style={{
          background:
            'linear-gradient(180deg, var(--color-canvas) 0%, var(--brand-orange) 50%, var(--color-canvas) 100%)',
        }}
      />

      <motion.div
        className="z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 md:px-8"
        variants={ctaContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
      >
        <motion.h2
          className="mb-10 text-center text-4xl font-bold tracking-tight text-primary-foreground drop-shadow-sm md:text-6xl lg:text-[4.5rem]"
          variants={ctaItemVariants}
        >
          {heading}
        </motion.h2>

        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          <motion.div variants={buttonVariants} whileHover={{ y: -3 }}>
            <Link
              href={appleUrl || '/contact'}
              className="inline-block rounded-md bg-black px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-black/90"
            >
              رزرو نوبت
            </Link>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover={{ y: -3 }}>
            <Link
              href={googleUrl || '/contact'}
              className="inline-block rounded-md border border-primary-foreground px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              تماس
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
