import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { L } from '@/i18n/label'

import { Page, Post, Product } from '@/payload-types'
import { formatDocumentTitle } from '@/utilities/siteName'
import { getServerSideURL } from '@/utilities/getURL'

type SeoDoc = Post | Page | Product

const generateTitle: GenerateTitle<SeoDoc> = async ({ doc, req }) => {
  const settings = await req.payload.findGlobal({ slug: 'settings' })
  const siteName = settings?.siteName?.trim() || undefined
  return formatDocumentTitle(doc?.title, siteName) || doc?.title || ''
}

const generateURL: GenerateURL<SeoDoc> = ({ collectionSlug, doc }) => {
  const url = getServerSideURL()
  if (!doc?.slug) return url

  if (collectionSlug === 'posts') return `${url}/posts/${doc.slug}`
  if (collectionSlug === 'products') return `${url}/products/${doc.slug}`

  return `${url}/${doc.slug}`
}

const s3PublicUrl = (process.env.S3_PUBLIC_URL || '').replace(/\/$/, '')

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'products'],
    overrides: {
      labels: {
        singular: L('Redirect', 'تغییر مسیر'),
        plural: L('Redirects', 'تغییر مسیرها'),
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: L(
                  'You will need to rebuild the website when changing this field.',
                  'پس از تغییر این فیلد باید وب‌سایت را دوباره بسازید (rebuild).',
                ),
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories', 'product-categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      labels: {
        singular: L('Form', 'فرم'),
        plural: L('Forms', 'فرم‌ها'),
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      labels: {
        singular: L('Form Submission', 'ارسال فرم'),
        plural: L('Form Submissions', 'ارسال‌های فرم'),
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      labels: {
        singular: L('Search Result', 'نتیجه جستجو'),
        plural: L('Search Results', 'نتایج جستجو'),
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  s3Storage({
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) => {
          const path = [prefix, filename].filter(Boolean).join('/')
          return `${s3PublicUrl}/${path}`
        },
      },
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      region: process.env.S3_REGION || 'us-east-1',
    },
  }),
]
