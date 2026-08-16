import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { L } from '@/i18n/label'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: {
    singular: L('Post', 'نوشته'),
    plural: L('Posts', 'نوشته‌ها'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    group: L('Content', 'محتوا'),
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
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
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              label: L('Hero Image', 'تصویر هیرو'),
              relationTo: 'media',
            },
            {
              name: 'aiAssistContent',
              type: 'ui',
              label: L('AI Content Assist', 'دستیار محتوای هوش مصنوعی'),
              admin: {
                components: {
                  Field: '@/components/AI/AIAssistContentField#AIAssistContentField',
                },
              },
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: L('Content', 'محتوا'),
        },
        {
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              label: L('Related Posts', 'نوشته‌های مرتبط'),
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              label: L('Categories', 'دسته‌بندی‌ها'),
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: L('Meta', 'متا'),
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
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      label: L('Authors', 'نویسندگان'),
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      label: L('Populated Authors', 'نویسندگان پرشده'),
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      labels: {
        singular: L('Author', 'نویسنده'),
        plural: L('Authors', 'نویسندگان'),
      },
      fields: [
        {
          name: 'id',
          type: 'text',
          label: L('ID', 'شناسه'),
        },
        {
          name: 'name',
          type: 'text',
          label: L('Name', 'نام'),
        },
      ],
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
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
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
