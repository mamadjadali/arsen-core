import React, { Fragment } from 'react'

import type { Page, Product } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CategoriesCatalogBlock } from '@/blocks/CategoriesCatalog/Component'
import { ContactSectionBlock } from '@/blocks/ContactSection/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CustomCodeBlock } from '@/blocks/CustomCode/Component'
import { FeaturedServicesBlock } from '@/blocks/FeaturedServices/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { IconGridBlock } from '@/blocks/IconGrid/Component'
import { LogosBlock } from '@/blocks/Logos/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PricingBlock } from '@/blocks/Pricing/Component'
import { ProductCarouselBlock } from '@/blocks/ProductCarousel/Component'
import { SolaceCtaBlock } from '@/blocks/SolaceCta/Component'

const blockComponents = {
  archive: ArchiveBlock,
  categoriesCatalog: CategoriesCatalogBlock,
  contactSection: ContactSectionBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  customCode: CustomCodeBlock,
  featuredServices: FeaturedServicesBlock,
  features: FeaturesBlock,
  formBlock: FormBlock,
  iconGrid: IconGridBlock,
  logos: LogosBlock,
  mediaBlock: MediaBlock,
  pricing: PricingBlock,
  productCarousel: ProductCarouselBlock,
  solaceCta: SolaceCtaBlock,
}

/** Blocks that manage their own spacing (or must take zero space when empty). */
const noAutoMarginBlocks = new Set([
  'logos',
  'iconGrid',
  'features',
  'featuredServices',
  'contactSection',
  'pricing',
  'solaceCta',
  'customCode',
  'productCarousel',
  'categoriesCatalog',
])

type LayoutBlock = NonNullable<Page['layout']>[number] | NonNullable<Product['layout']>[number]

export const RenderBlocks: React.FC<{
  blocks: LayoutBlock[] | null | undefined
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              const skipMargin = noAutoMarginBlocks.has(blockType)
              return (
                <div className={skipMargin ? undefined : 'my-16'} key={index}>
                  {/* @ts-expect-error block props vary by blockType */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
