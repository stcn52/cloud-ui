import {
  useCallback,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { tv } from 'tailwind-variants'

const otpStyles = tv({
  slots: {
    base: 'inline-flex items-center gap-1.5',
    cell: [
      'w-8 h-9 text-center font-mono text-md',
      'border border-line rounded-sm bg-bg-elev',
      '[font-variant-numeric:tabular-nums]',
      'focus:outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]',
      'disabled:opacity-50',
    ],
    cellFilled: 'border-accent text-accent-ink bg-accent-weak',
    cellInvalid: 'border-err text-err',
    sep: 'text-text-dim mx-0.5',
  },
})

export interface OtpInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value as a string. Length should equal `length`. Pad shorter values with empty positions. */
  value: string
  /** Fired with the new value as a string of length `length`. */
  onChange?: (value: string) => void
  /** Number of cells. default 6 */
  length?: number
  /** Insert a separator between halves (e.g., `4 — 2 — 0`). default true when length is even. */
  separator?: boolean | string
  /** Marks all cells with the error border + color. */
  invalid?: boolean
  disabled?: boolean
  autoFocus?: boolean
  inputMode?: 'numeric' | 'text'
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  separator,
  invalid,
  disabled,
  autoFocus,
  inputMode = 'numeric',
  className,
  ...rest
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const { base, cell, cellFilled, cellInvalid, sep } = otpStyles()
  const sepChar = typeof separator === 'string' ? separator : '—'
  const showSep = separator !== false && (separator === true || (separator === undefined && length % 2 === 0))
  const splitAt = showSep ? Math.floor(length / 2) : -1

  const setAt = useCallback(
    (i: number, ch: string) => {
      const padded = value.padEnd(length, ' ')
      const next = padded.slice(0, i) + (ch || ' ') + padded.slice(i + 1)
      onChange?.(next.replace(/ +$/, ''))
    },
    [value, length, onChange],
  )

  const onCellChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.slice(-1)
    if (inputMode === 'numeric' && ch && !/[0-9]/.test(ch)) return
    setAt(i, ch)
    if (ch && i < length - 1) refs.current[i + 1]?.focus()
  }

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      e.preventDefault()
      refs.current[i - 1]?.focus()
      setAt(i - 1, '')
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\s/g, '').slice(0, length)
    if (!text) return
    e.preventDefault()
    onChange?.(text)
    refs.current[Math.min(text.length, length - 1)]?.focus()
  }

  return (
    <div className={base({ class: className })} {...rest}>
      {Array.from({ length }, (_, i) => {
        const ch = value[i] ?? ''
        const filled = !!ch && ch !== ' '
        const cellClass = invalid
          ? `${cell()} ${cellInvalid()}`
          : filled
          ? `${cell()} ${cellFilled()}`
          : cell()
        const item = (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            type="text"
            inputMode={inputMode}
            maxLength={1}
            className={cellClass}
            value={ch === ' ' ? '' : ch}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            onChange={onCellChange(i)}
            onKeyDown={onKeyDown(i)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${i + 1}`}
          />
        )
        if (showSep && i === splitAt) {
          return [
            <span key={`sep-${i}`} className={sep()}>{sepChar}</span>,
            item,
          ]
        }
        return item
      })}
    </div>
  )
}
