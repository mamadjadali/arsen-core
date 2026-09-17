import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { ContactSection } from '../../blocks/ContactSection/config'
import { Content } from '../../blocks/Content/config'
import { CustomCode } from '../../blocks/CustomCode/config'
import { FeaturedServices } from '../../blocks/FeaturedServices/config'
import { Features } from '../../blocks/Features/config'
import { FormBlock } from '../../blocks/Form/config'
import { Logos } from '../../blocks/Logos/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Pricing } from '../../blocks/Pricing/config'
import { ProductCarousel } from '../../blocks/ProductCarousel/config'
import { SolaceCta } from '../../blocks/SolaceCta/config'
import { hero } from '@/heros/config'
import { L } from '@/i18n/label'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: L('Page', 'صفحه'),
    plural: L('Pages', 'صفحات'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: L('Content', 'محتوا'),
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: L('Title', 'عنوان'),
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: L('Hero', 'هیرو'),
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: L('Layout', 'چیدمان'),
              blocks: [
                CallToAction,
                Content,
                ContactSection,
                CustomCode,
                MediaBlock,
                Archive,
                FormBlock,
                Logos,
                Features,
                FeaturedServices,
                Pricing,
                ProductCarousel,
                SolaceCta,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: L('Content', 'محتوا'),
        },
        {
          label: L('SEO', 'سئو'),
          fields: [
            {
              name: 'aiAssistSeo',
              type: 'ui',
              label: L('AI SEO Assist', 'دستیار سئو هوش مصنوعی'),
              admin: {
                components: {
                  Field: '@/components/AI/AIAssistSeoField#AIAssistSeoField',
                },
              },
            },
            {
              name: 'meta',
              type: 'group',
              label: false,
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),
                MetaDescriptionField({}),
                PreviewField({
                  hasGenerateFn: true,
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: L('Published At', 'تاریخ انتشار'),
      admin: {
        position: 'sidebar',
      },
    },
    slugField({
      overrides: (field) => {
        const [checkbox, slug] = field.fields
        if (checkbox?.type === 'checkbox' && checkbox.admin) {
          checkbox.admin.description = L(
            'When enabled, the slug will auto-generate from the title field on save and autosave.',
            'در صورت فعال بودن، نامک هنگام ذخیره و ذخیرهٔ خودکار از عنوان ساخته می‌شود.',
          )
        }
        if (slug?.type === 'text') {
          slug.label = L('Slug', 'نامک')
        }
        return field
      },
    }),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
