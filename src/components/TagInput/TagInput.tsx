import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useLocale, useResolvedSize } from '../../context/ConfigProvider'

const tagInputStyles = tv({
  slots: {
    base: [
      'flex flex-wrap gap-1 items-center',
      'p-1 border border-line rounded-sm bg-bg-elev',
      'focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]',
    ],
    input: [
      'border-0 outline-0 bg-transparent',
      'flex-1 min-w-[80px] text-text',
      'py-0.5 font-[inherit]',
    ],
  },
  variants: {
    size: {
      sm: { base: 'min-h-[28px]', input: 'text-xs px-1' },
      md: { base: 'min-h-[32px]', input: 'text-sm px-1.5' },
      lg: { base: 'min-h-[38px]', input: 'text-base px-2' },
    },
  },
  defaultVariants: { size: 'md' },
})

type TagInputVariants = VariantProps<typeof tagInputStyles>
export type TagInputSize = NonNullable<TagInputVariants['size']>

const tagStyles = tv({
  base: [
    'inline-flex items-center gap-1 pl-2 pr-1',
    'rounded-xs font-mono',
    'bg-accent-weak text-accent-ink',
    '[&>button]:border-0 [&>button]:bg-transparent [&>button]:text-inherit',
    '[&>button]:cursor-pointer [&>button]:opacity-60 [&>button]:px-0.5',
    '[&>button:hover]:opacity-100',
  ],
  variants: {
    size: {
      sm: 'text-[10px] py-px',
      md: 'text-xs py-0.5',
      lg: 'text-sm py-0.5',
    },
    invalid: {
      true:  'bg-[color-mix(in_oklch,var(--color-err)_18%,transparent)] text-err',
      false: '',
    },
  },
  defaultVariants: { size: 'md', invalid: false },
})

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string[]
  defaultValue?: string[]
  onChange?: (next: string[]) => void
  placeholder?: string
  commitKeys?: string[]
  validate?: (tag: string) => string | null
  renderTag?: (tag: string, error: string | null) => ReactNode
  /** Control size. No explicit value ⇒ follows the global `ConfigProvider` density. */
  size?: TagInputSize
}

export function TagInput({
  value: valueProp,
  defaultValue = [],
  onChange,
  placeholder,
  commitKeys = ['Enter', ','],
  validate,
  renderTag,
  size: sizeProp,
  className,
  ...rest
}: TagInputProps) {
  const size = useResolvedSize(sizeProp, { compact: 'sm', normal: 'md', comfortable: 'lg' })
  const locale = useLocale()
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

  const { base, input: inputCls } = tagInputStyles({ size })

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
          <span key={`${t}-${i}`} className={tagStyles({ size, invalid: !!err })}>
            {t}
            <button
              type="button"
              aria-label={locale.tagInput.removeTag.replace('{tag}', t)}
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
