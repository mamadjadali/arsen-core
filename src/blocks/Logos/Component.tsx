'use client'

import React from 'react'
import { motion, type Variants } from 'motion/react'

import type { LogosBlock as LogosBlockProps } from '@/payload-types'

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
    y: 14,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.22,
      duration: 1.1,
    },
  },
}

const dividerVariants: Variants = {
  hidden: {
    opacity: 0,
    scaleX: 0.96,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/** Fallback only when CMS items are empty — keep aligned with B2B seed brands. */
const DEFAULT_ITEMS = ['Samsung', 'Xiaomi', 'Apple', 'Realme', 'Honor', 'Huawei']

export const LogosBlock: React.FC<LogosBlockProps> = ({ heading, items }) => {
  const labels = (items || [])
    .map((item) => (typeof item?.label === 'string' ? item.label.trim() : ''))
    .filter(Boolean)

  const displayLabels = labels.length > 0 ? labels : DEFAULT_ITEMS

  return (
    <motion.section
      className="relative z-20 flex w-full flex-col items-center bg-[var(--color-canvas)] pt-24 pb-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.h2
        className="mb-10 text-center text-sm font-medium text-black/50 md:text-base"
        variants={fadeUpVariants}
      >
        {heading}
      </motion.h2>

      <div className="flex w-full flex-col">
        <motion.div
          className="relative h-8 w-full origin-center overflow-hidden border-t border-black/10"
          variants={dividerVariants}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] text-black opacity-10" />
        </motion.div>

        <div className="grid w-full grid-cols-2 divide-x divide-y divide-black/20 border-y border-black/10 bg-[var(--color-canvas-soft)]/50 backdrop-blur-sm md:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          {displayLabels.map((label, index) => (
            <motion.div
              key={`${label}-${index}`}
              className="flex h-24 items-center justify-center p-4 opacity-60 transition-opacity hover:opacity-100"
              variants={fadeUpVariants}
            >
              <span className="text-center text-sm font-semibold tracking-tight text-black/40 md:text-base">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative h-8 w-full origin-center overflow-hidden border-b border-black/10"
          variants={dividerVariants}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] text-black opacity-10" />
        </motion.div>
      </div>
    </motion.section>
  )
}
