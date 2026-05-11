import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { tv } from 'tailwind-variants'

const shellStyles = tv({
  base: [
    'flex flex-col rounded-lg border bg-bg-elev',
    'transition-colors duration-[.12s]',
    'focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]',
  ],
  variants: {
    invalid: {
      true:  'border-err focus-within:border-err focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
      false: 'border-line',
    },
    disabled: {
      true:  'opacity-60 pointer-events-none',
      false: '',
    },
  },
  defaultVariants: { invalid: false, disabled: false },
})

const textareaStyles = tv({
  base: [
    'w-full resize-none bg-transparent border-0 outline-none',
    'px-3.5 pt-3 pb-1.5 text-sm text-text font-[inherit] leading-[1.5]',
    'placeholder:text-text-dim',
  ],
})

const toolbarStyles = tv({
  base: 'flex items-center gap-2 px-2.5 pb-2 pt-1',
})

export interface PromptInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onSubmit' | 'value' | 'defaultValue' | 'rows'> {
  /** Controlled value. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  /** Fired with the new text on every keystroke. */
  onValueChange?: (value: string) => void
  /**
   * Fired when the user submits — Enter by default, or Cmd/Ctrl+Enter when `submitOn` is `'cmd-enter'`.
   * Receives the current text. Not called when the value is empty/whitespace-only.
   */
  onSubmit?: (value: string) => void
  /** Which keystroke submits. `'enter'` (default) — plain Enter submits, Shift+Enter inserts a newline.
   *  `'cmd-enter'` — ⌘/Ctrl+Enter submits, plain Enter inserts a newline. */
  submitOn?: 'enter' | 'cmd-enter'
  /** Min visible rows before auto-grow. Default 1. */
  minRows?: number
  /** Max rows before the textarea scrolls instead of growing. Default 8. */
  maxRows?: number
  /** Leading toolbar slot — icon buttons, attachment chips. */
  leading?: ReactNode
  /** Trailing toolbar slot — status text, the send/stop button. Pushed to the right. */
  trailing?: ReactNode
  invalid?: boolean
  disabled?: boolean
  className?: string
}

export interface PromptInputHandle {
  focus: () => void
  /** Clear the text (uncontrolled mode only — controlled callers own the value). */
  clear: () => void
  /** The underlying textarea element. */
  textarea: HTMLTextAreaElement | null
}

const LINE_HEIGHT_PX = 21 // matches text-sm leading-[1.5] (14 * 1.5)
const VPAD_PX = 18 // pt-3 (12) + pb-1.5 (6)

export const PromptInput = forwardRef<PromptInputHandle, PromptInputProps>(function PromptInput(
  {
    value,
    defaultValue = '',
    onValueChange,
    onSubmit,
    submitOn = 'enter',
    minRows = 1,
    maxRows = 8,
    leading,
    trailing,
    invalid = false,
    disabled = false,
    className,
    placeholder = 'Type a message…',
    onKeyDown,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState(defaultValue)
  const text = isControlled ? value : inner
  const taRef = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    const min = minRows * LINE_HEIGHT_PX + VPAD_PX
    const max = maxRows * LINE_HEIGHT_PX + VPAD_PX
    const next = Math.max(min, Math.min(max, el.scrollHeight))
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
  }, [minRows, maxRows])

  useEffect(resize, [text, resize])

  useImperativeHandle(ref, () => ({
    focus: () => taRef.current?.focus(),
    clear: () => {
      if (!isControlled) setInner('')
      onValueChange?.('')
    },
    textarea: taRef.current,
  }), [isControlled, onValueChange])

  const setText = (next: string) => {
    if (!isControlled) setInner(next)
    onValueChange?.(next)
  }

  const doSubmit = () => {
    const v = text
    if (!v.trim()) return
    onSubmit?.(v)
  }

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    const cmd = e.metaKey || e.ctrlKey
    if (e.key === 'Enter') {
      if (submitOn === 'enter' && !e.shiftKey && !cmd) {
        e.preventDefault()
        doSubmit()
      } else if (submitOn === 'cmd-enter' && cmd) {
        e.preventDefault()
        doSubmit()
      }
    }
  }

  return (
    <div className={shellStyles({ invalid, disabled, class: className })}>
      <textarea
        ref={taRef}
        rows={minRows}
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        className={textareaStyles()}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      {(leading !== undefined || trailing !== undefined) && (
        <div className={toolbarStyles()}>
          {leading}
          {trailing !== undefined && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
        </div>
      )}
    </div>
  )
})
