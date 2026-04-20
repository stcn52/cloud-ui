import { useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface CopyFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text written to clipboard. Falls back to `children` if omitted. */
  value?: string
  /** Visible value (can be masked/truncated). Falls back to `value`. */
  children?: ReactNode
  /** How long the "copied" success state lasts. default 1400ms */
  feedbackDuration?: number
  /** Optional extra trailing buttons (e.g. reveal). */
  extras?: ReactNode
}

const CopyIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
)

const OkIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function CopyField({
  value,
  children,
  feedbackDuration = 1400,
  extras,
  className,
  style,
  ...rest
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const textToCopy = value ?? (typeof children === 'string' ? children : '')

  const handleCopy = async () => {
    if (!textToCopy) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy)
      } else {
        const ta = document.createElement('textarea')
        ta.value = textToCopy
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), feedbackDuration)
    } catch {
      // Ignore — caller can wrap with their own error-handling if needed
    }
  }

  return (
    <span
      className={cx('copy-field', className)}
      style={copied ? { borderColor: 'var(--ok)', color: 'var(--ok)', ...style } : style}
      {...rest}
    >
      <span className="val">{children ?? value}</span>
      {extras}
      {copied ? (
        <span
          className="row"
          style={{ gap: 4, color: 'var(--ok)', fontSize: 11 }}
          aria-live="polite"
        >
          {OkIcon}Copied
        </span>
      ) : (
        <button
          type="button"
          className="btn icon xs ghost"
          aria-label="Copy"
          onClick={handleCopy}
        >
          {CopyIcon}
        </button>
      )}
    </span>
  )
}
