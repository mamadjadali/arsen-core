'use client'

import { Button, toast } from '@payloadcms/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { localizePreset } from '@/ai/presetI18n'
import { AI_PRESET_META, type AiPresetMeta } from '@/ai/presets'
import type { AiTarget, AiTransformResponse } from '@/ai/types'
import { adminUi, tLabel } from '@/i18n/adminUi'

import './aiAssist.scss'

function readAdminLang(): string {
  if (typeof document === 'undefined') return 'fa'
  const match = document.cookie.match(/(?:^|; )payload-lng=([^;]*)/)
  const cookie = match ? decodeURIComponent(match[1]) : ''
  const code = (cookie || document.documentElement.lang || 'fa').toLowerCase()
  if (code.startsWith('en')) return 'en'
  return 'fa'
}

type AIAssistDialogProps = {
  open: boolean
  onClose: () => void
  target: AiTarget
  /** Plain text sent to the API (may depend on selected preset) */
  getInputText: (presetId: string) => string
  title?: string
  /** Called with API result when user clicks Apply */
  onApply: (result: AiTransformResponse) => void
}

export const AIAssistDialog: React.FC<AIAssistDialogProps> = ({
  open,
  onClose,
  target,
  getInputText,
  title,
  onApply,
}) => {
  const lang = readAdminLang()
  const modalTitle = tLabel(
    lang,
    target === 'seoTitle'
      ? adminUi.aiSeoTitleModal
      : target === 'seoDescription'
        ? adminUi.aiSeoDescModal
        : adminUi.aiContentTitle,
  )

  const [presets, setPresets] = useState<AiPresetMeta[]>(() =>
    AI_PRESET_META.filter((p) => p.targets.includes(target)),
  )
  const [presetId, setPresetId] = useState(presets[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [loadingPresets, setLoadingPresets] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<AiTransformResponse | null>(null)

  useEffect(() => {
    if (!open) return

    const body = document.body
    const wrap = document.querySelector('.template-default__wrap') as HTMLElement | null
    const prevBodyOverflow = body.style.overflow
    const prevWrapOverflow = wrap?.style.overflow ?? ''
    body.style.overflow = 'hidden'
    if (wrap) wrap.style.overflow = 'hidden'

    return () => {
      body.style.overflow = prevBodyOverflow
      if (wrap) wrap.style.overflow = prevWrapOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setLoadingPresets(true)
    setPreview(null)
    setError(null)
    setLoading(false)

    fetch(`/api/ai/presets?target=${encodeURIComponent(target)}`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { presets?: AiPresetMeta[] } | null) => {
        if (cancelled) return
        const next =
          Array.isArray(data?.presets) && data.presets.length > 0
            ? data.presets
            : AI_PRESET_META.filter((p) => p.targets.includes(target))
        setPresets(next)
        setPresetId((current) =>
          next.some((p) => p.id === current) ? current : next[0]?.id || '',
        )
      })
      .catch(() => {
        if (cancelled) return
        const fallback = AI_PRESET_META.filter((p) => p.targets.includes(target))
        setPresets(fallback)
        setPresetId(fallback[0]?.id || '')
      })
      .finally(() => {
        if (!cancelled) setLoadingPresets(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, target])

  const localizedPresets = useMemo(
    () =>
      presets.map((preset) => ({
        ...preset,
        ...localizePreset(preset.id, preset, lang),
      })),
    [lang, presets],
  )

  const run = useCallback(async () => {
    if (!presetId) return
    const text = getInputText(presetId).trim()
    if (!text && !title?.trim()) {
      const message = tLabel(lang, adminUi.aiNeedText)
      setError(message)
      toast.error(message)
      return
    }

    setLoading(true)
    setError(null)
    setPreview(null)

    try {
      const res = await fetch('/api/ai/transform', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetId,
          target,
          text,
          title,
        }),
      })

      const data = (await res.json()) as AiTransformResponse & { error?: string }
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }

      setPreview(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : tLabel(lang, adminUi.aiFailed)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [getInputText, lang, presetId, target, title])

  const apply = useCallback(() => {
    if (!preview) return
    onApply(preview)
    toast.success(tLabel(lang, adminUi.aiApplied))
    onClose()
  }, [lang, onApply, onClose, preview])

  const stopOverlayScroll = useCallback((event: React.WheelEvent | React.TouchEvent) => {
    event.preventDefault()
  }, [])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="ai-assist-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={modalTitle}
      onClick={onClose}
      onWheel={stopOverlayScroll}
      onTouchMove={stopOverlayScroll}
    >
      <div
        className="ai-assist-dialog"
        onClick={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <div className="ai-assist-dialog__header">
          <h3>{modalTitle}</h3>
          <Button buttonStyle="secondary" size="small" onClick={onClose} disabled={loading}>
            {tLabel(lang, adminUi.close)}
          </Button>
        </div>

        <p className="ai-assist-dialog__hint">{tLabel(lang, adminUi.aiHint)}</p>

        {loadingPresets ? (
          <p className="ai-assist-dialog__hint">{tLabel(lang, adminUi.aiLoadingPresets)}</p>
        ) : localizedPresets.length === 0 ? (
          <p className="ai-assist-error">{tLabel(lang, adminUi.aiNoPresets)}</p>
        ) : (
          <div className="ai-assist-presets">
            {localizedPresets.map((preset) => (
              <label key={preset.id} className="ai-assist-preset">
                <input
                  type="radio"
                  name={`ai-preset-${target}`}
                  value={preset.id}
                  checked={presetId === preset.id}
                  onChange={() => setPresetId(preset.id)}
                  disabled={loading}
                />
                <span>
                  <strong>{preset.label}</strong>
                  <small>{preset.description}</small>
                </span>
              </label>
            ))}
          </div>
        )}

        {error ? <p className="ai-assist-error">{error}</p> : null}

        {preview ? (
          <div className="ai-assist-preview">
            <label>{tLabel(lang, adminUi.preview)}</label>
            <textarea readOnly value={preview.text} rows={12} />
          </div>
        ) : null}

        <div className="ai-assist-dialog__actions">
          <Button
            buttonStyle="primary"
            onClick={run}
            disabled={loading || loadingPresets || !presetId}
          >
            {loading ? tLabel(lang, adminUi.aiRunning) : tLabel(lang, adminUi.generate)}
          </Button>
          <Button buttonStyle="secondary" onClick={apply} disabled={loading || !preview}>
            {tLabel(lang, adminUi.apply)}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
