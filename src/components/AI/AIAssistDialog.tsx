'use client'

import { Button, toast } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

import { AI_PRESET_META, type AiPresetMeta } from '@/ai/presets'
import type { AiTarget, AiTransformResponse } from '@/ai/types'

import './aiAssist.scss'

type AIAssistDialogProps = {
  open: boolean
  onClose: () => void
  target: AiTarget
  /** Plain text sent to the API (may depend on selected preset) */
  getInputText: (presetId: string) => string
  title?: string
  /** Called with API result when user clicks Apply */
  onApply: (result: AiTransformResponse) => void
  modalTitle?: string
}

export const AIAssistDialog: React.FC<AIAssistDialogProps> = ({
  open,
  onClose,
  target,
  getInputText,
  title,
  onApply,
  modalTitle = 'AI assist',
}) => {
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

  const run = useCallback(async () => {
    if (!presetId) return
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
          text: getInputText(presetId),
          title,
        }),
      })

      const data = (await res.json()) as AiTransformResponse & { error?: string }
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }

      setPreview(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI request failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [getInputText, presetId, target, title])

  const apply = useCallback(() => {
    if (!preview) return
    onApply(preview)
    toast.success('Applied AI result')
    onClose()
  }, [onApply, onClose, preview])

  if (!open) return null

  return (
    <div className="ai-assist-overlay" role="dialog" aria-modal="true" aria-label={modalTitle}>
      <div className="ai-assist-dialog">
        <div className="ai-assist-dialog__header">
          <h3>{modalTitle}</h3>
          <Button buttonStyle="secondary" size="small" onClick={onClose} disabled={loading}>
            Close
          </Button>
        </div>

        <p className="ai-assist-dialog__hint">Choose a preset, preview the result, then apply.</p>

        {loadingPresets ? (
          <p className="ai-assist-dialog__hint">Loading options…</p>
        ) : presets.length === 0 ? (
          <p className="ai-assist-error">No AI options enabled for this field.</p>
        ) : (
          <div className="ai-assist-presets">
            {presets.map((preset) => (
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
            <label>Preview</label>
            <textarea readOnly value={preview.text} rows={12} />
          </div>
        ) : null}

        <div className="ai-assist-dialog__actions">
          <Button
            buttonStyle="primary"
            onClick={run}
            disabled={loading || loadingPresets || !presetId}
          >
            {loading ? 'Running…' : 'Run'}
          </Button>
          <Button buttonStyle="secondary" onClick={apply} disabled={loading || !preview}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
