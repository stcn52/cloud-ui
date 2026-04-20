import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

const tagInputStyles = tv({
  slots: {
    base: [
      'flex flex-wrap gap-1 items-center',
      'min-h-[32px] p-1 border border-line rounded-sm bg-bg-elev',
      'focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]',
    ],
    input: [
      'border-0 outline-0 bg-transparent',
      'flex-1 min-w-[80px] text-sm text-text',
      'px-1.5 py-0.5 font-[inherit]',
    ],
  },
})

const tagStyles = tv({
  base: [
    'inline-flex items-center gap-1 px-2 py-0.5 pl-2 pr-1',
    'rounded-xs text-xs font-mono',
    'bg-accent-weak text-accent-ink',
    '[&>button]:border-0 [&>button]:bg-transparent [&>button]:text-inherit',
    '[&>button]:cursor-pointer [&>button]:opacity-60 [&>button]:px-0.5',
    '[&>button:hover]:opacity-100',
  ],
  variants: {
    invalid: {
      true:  'bg-[color-mix(in_oklch,var(--color-err)_18%,transparent)] text-err',
      false: '',
    },
  },
  defaultVariants: { invalid: false },
})

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string[]
  defaultValue?: string[]
  onChange?: (next: string[]) => void
  placeholder?: string
  commitKeys?: string[]
  validate?: (tag: string) => string | null
  renderTag?: (tag: string, error: string | null) => ReactNode
}

export function TagInput({
  value: valueProp,
  defaultValue = [],
  onChange,
  placeholder,
  commitKeys = ['Enter', ','],
  validate,
  renderTag,
  className,
  ...rest
}: TagInputProps) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState('')
  const tags = valueProp ?? uncontrolled
  const inputRef = useRef<HTMLInputElement>(null)

  const setTags = useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setUncontrolled(next)
      onChange?.(next)
    },
    [valueProp, onChange],
  )

  const commit = () => {
    const t = draft.trim()
    if (!t) return
    if (tags.includes(t)) {
      setDraft('')
      return
    }
    setTags([...tags, t])
    setDraft('')
  }

  const remove = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx))
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (commitKeys.includes(e.key)) {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      e.preventDefault()
      remove(tags.length - 1)
    }
  }

  const { base, input: inputCls } = tagInputStyles()

  return (
    <div
      className={base({ class: className })}
      onClick={() => inputRef.current?.focus()}
      {...rest}
    >
      {tags.map((t, i) => {
        const err = validate ? validate(t) : null
        if (renderTag) {
          return (
            <span key={`${t}-${i}`}>
              {renderTag(t, err)}
            </span>
          )
        }
        return (
          <span key={`${t}-${i}`} className={tagStyles({ invalid: !!err })}>
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={(e) => {
                e.stopPropagation()
                remove(i)
              }}
            >
              ×
            </button>
          </span>
        )
      })}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={placeholder}
        className={inputCls()}
      />
    </div>
  )
}
