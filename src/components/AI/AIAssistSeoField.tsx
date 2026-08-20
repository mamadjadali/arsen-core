'use client'

import { Button, useField, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React, { useCallback, useEffect, useState } from 'react'

import { getSeoSourceText } from '@/ai/documentText'
import type { AiTarget, AiTransformResponse } from '@/ai/types'

import { AIAssistDialog } from './AIAssistDialog'
import './aiAssist.scss'

export const AIAssistSeoField: UIFieldClientComponent = () => {
  const [enabled, setEnabled] = useState(false)
  const [openTarget, setOpenTarget] = useState<AiTarget | null>(null)

  const { value: metaTitle, setValue: setMetaTitle } = useField<string>({ path: 'meta.title' })
  const { value: metaDescription, setValue: setMetaDescription } = useField<string>({
    path: 'meta.description',
  })
  const sourceFields = useFormFields(([fields]) => ({
    content: fields.content,
    hero: fields.hero,
    layout: fields.layout,
  }))
  const title = useFormFields(([fields]) => {
    const raw = fields.title?.value
    return typeof raw === 'string' ? raw : ''
  })

  useEffect(() => {
    let cancelled = false
    fetch('/api/ai/status', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { enabled: false }))
      .then((data: { enabled?: boolean }) => {
        if (!cancelled) setEnabled(Boolean(data.enabled))
      })
      .catch(() => {
        if (!cancelled) setEnabled(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const getInputText = useCallback(
    (presetId: string) => {
      const contentText = getSeoSourceText(sourceFields)

      if (openTarget === 'seoTitle') {
        if (presetId === 'seoTitleFromContent') {
          return contentText || title || ''
        }
        return metaTitle || title || contentText || ''
      }

      if (openTarget === 'seoDescription') {
        if (presetId === 'seoDescFromContent') {
          return contentText || ''
        }
        if (presetId === 'seoDescShorter') {
          return metaDescription || contentText || ''
        }
        return metaDescription || contentText || ''
      }

      return ''
    },
    [sourceFields, metaDescription, metaTitle, openTarget, title],
  )

  const onApply = useCallback(
    (result: AiTransformResponse) => {
      if (openTarget === 'seoTitle') {
        setMetaTitle(result.text.trim())
      } else if (openTarget === 'seoDescription') {
        setMetaDescription(result.text.trim())
      }
    },
    [openTarget, setMetaDescription, setMetaTitle],
  )

  if (!enabled) {
    return (
      <div className="ai-assist-seo">
        <p className="ai-assist-seo__label">
          دستیار هوش مصنوعی خاموش است. از Globals ← تنظیمات ← هوش مصنوعی آن را فعال کنید (کلید API و
          مدل لازم است).
        </p>
      </div>
    )
  }

  return (
    <div className="ai-assist-seo">
      <p className="ai-assist-seo__label">دستیار هوش مصنوعی برای فیلدهای متای سئو</p>
      <div className="ai-assist-seo__row">
        <Button
          buttonStyle="secondary"
          size="small"
          type="button"
          onClick={() => setOpenTarget('seoTitle')}
        >
          هوش مصنوعی — عنوان
        </Button>
        <Button
          buttonStyle="secondary"
          size="small"
          type="button"
          onClick={() => setOpenTarget('seoDescription')}
        >
          هوش مصنوعی — توضیحات
        </Button>
      </div>

      {openTarget ? (
        <AIAssistDialog
          open
          onClose={() => setOpenTarget(null)}
          target={openTarget}
          getInputText={getInputText}
          title={title}
          onApply={onApply}
        />
      ) : null}
    </div>
  )
}
