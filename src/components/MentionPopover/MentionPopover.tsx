import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { tv } from 'tailwind-variants'

export interface MentionItem {
  /** Inserted text (without the trigger char), e.g. `"alex"` → `"@alex"`. */
  value: string
  /** Display label in the menu. Defaults to `value`. */
  label?: ReactNode
  /** Secondary text on the right (a role, a name). */
  description?: ReactNode
  /** Leading element (avatar / icon). */
  icon?: ReactNode
}

const taStyles = tv({
  base: [
    'w-full resize-y bg-bg-elev border border-line rounded-sm text-text font-[inherit]',
    'px-2.5 py-2 text-sm leading-[1.5]',
    'focus:outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]',
    'placeholder:text-text-dim',
  ],
  variants: { invalid: { true: 'border-err focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]', false: '' } },
  defaultVariants: { invalid: false },
})

const menuStyles = tv({
  base: 'absolute z-[52] mt-1 min-w-[200px] max-w-[280px] bg-bg-elev border border-line rounded-md shadow-md overflow-hidden',
})
const itemStyles = tv({
  base: 'flex items-center gap-2 px-2.5 py-1.5 text-sm cursor-pointer text-text',
  variants: { active: { true: 'bg-bg-sunk', false: 'hover:bg-bg-sunk' } },
  defaultVariants: { active: false },
})

export interface MentionPopoverHandle {
  focus: () => void
  textarea: HTMLTextAreaElement | null
}

export interface MentionPopoverProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** People/things that can be @-mentioned. */
  items: MentionItem[]
  /** Controlled text value. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Fired when a mention is inserted. */
  onMention?: (item: MentionItem) => void
  /** Trigger character. Default `'@'`. */
  trigger?: string
  /** Max menu items shown. Default 8. */
  maxItems?: number
  /** Custom filter — receives the query (text after the trigger) and an item; default is case-insensitive substring on value+label. */
  filter?: (query: string, item: MentionItem) => boolean
  invalid?: boolean
  className?: string
}

interface MentionState {
  /** Index in the text where the trigger char sits. */
  at: number
  query: string
}

export const MentionPopover = forwardRef<MentionPopoverHandle, MentionPopoverProps>(function MentionPopover(
  {
    items,
    value,
    defaultValue = '',
    onValueChange,
    onMention,
    trigger = '@',
    maxItems = 8,
    filter,
    invalid = false,
    className,
    onKeyDown,
    placeholder = 'Write something… use @ to mention',
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState(defaultValue)
  const text = isControlled ? value! : inner
  const taRef = useRef<HTMLTextAreaElement>(null)
  const [mention, setMention] = useState<MentionState | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useImperativeHandle(ref, () => ({ focus: () => taRef.current?.focus(), textarea: taRef.current }), [])

  const matches = useMemo(() => {
    if (!mention) return []
    const q = mention.query.toLowerCase()
    const fn = filter ?? ((query: string, it: MentionItem) => {
      const hay = `${it.value} ${typeof it.label === 'string' ? it.label : ''}`.toLowerCase()
      return hay.includes(query.toLowerCase())
    })
    return items.filter((it) => fn(q, it)).slice(0, maxItems)
  }, [items, mention, filter, maxItems])

  const setText = (next: string) => {
    if (!isControlled) setInner(next)
    onValueChange?.(next)
  }

  // Detect the active mention by walking back from the caret.
  const detect = (val: string, caret: number) => {
    let i = caret - 1
    while (i >= 0) {
      const ch = val[i]
      if (ch === trigger) {
        // valid only if preceded by start/space/newline
        const prev = i === 0 ? ' ' : val[i - 1]
        if (/\s/.test(prev) || i === 0) {
          const query = val.slice(i + 1, caret)
          if (/\s/.test(query)) return null // space after @ ends the mention
          return { at: i, query }
        }
        return null
      }
      if (/\s/.test(ch)) return null
      i--
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)
    const caret = e.target.selectionStart ?? val.length
    const m = detect(val, caret)
    setMention(m)
    setActiveIdx(0)
  }

  const insert = (it: MentionItem) => {
    const ta = taRef.current
    if (!ta || !mention) return
    const caret = ta.selectionStart ?? text.length
    const before = text.slice(0, mention.at)
    const after = text.slice(caret)
    const inserted = `${trigger}${it.value} `
    const next = before + inserted + after
    setText(next)
    setMention(null)
    onMention?.(it)
    // restore caret after the inserted mention
    requestAnimationFrame(() => {
      const pos = before.length + inserted.length
      ta.focus()
      ta.setSelectionRange(pos, pos)
    })
  }

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    if (!mention || matches.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(matches.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); insert(matches[activeIdx]) }
    else if (e.key === 'Escape') { e.preventDefault(); setMention(null) }
  }

  const showMenu = mention !== null && matches.length > 0

  return (
    <div className={className} style={{ position: 'relative' }}>
      <textarea
        ref={taRef}
        value={text}
        placeholder={placeholder}
        className={taStyles({ invalid })}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setMention(null), 120)}
        {...rest}
      />
      {showMenu && (
        <div className={menuStyles()} style={{ top: '100%', left: 0 }} role="listbox">
          {matches.map((it, i) => (
            <div
              key={it.value}
              role="option"
              aria-selected={i === activeIdx}
              className={itemStyles({ active: i === activeIdx })}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseDown={(e) => { e.preventDefault(); insert(it) }}
            >
              {it.icon !== undefined && <span className="shrink-0 inline-flex">{it.icon}</span>}
              <span className="truncate">{it.label ?? `${trigger}${it.value}`}</span>
              {it.description !== undefined && <span className="ml-auto shrink-0 text-[11px] text-text-dim">{it.description}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
