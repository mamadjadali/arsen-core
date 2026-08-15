'use client'

import { Button, useField, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React, { useCallback, useEffect, useState } from 'react'

import { lexicalToPlainText } from '@/ai/lexicalText'
import type { AiTransformResponse } from '@/ai/types'

import { AIAssistDialog } from './AIAssistDialog'
import './aiAssist.scss'

export const AIAssistContentField: UIFieldClientComponent = () => {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const { value, setValue } = useField({ path: 'content' })
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

  const getInputText = useCallback((_presetId: string) => lexicalToPlainText(value), [value])

  const onApply = useCallback(
    (result: AiTransformResponse) => {
      if (result.lexical) {
        setValue(result.lexical)
      }
    },
    [setValue],
  )

  if (!enabled) return null

  return (
    <div className="ai-assist-bar">
      <Button buttonStyle="secondary" size="small" onClick={() => setOpen(true)} type="button">
        AI
      </Button>
      <AIAssistDialog
        open={open}
        onClose={() => setOpen(false)}
        target="content"
        getInputText={getInputText}
        title={title}
        onApply={onApply}
        modalTitle="AI assist — content"
      />
    </div>
  )
}
