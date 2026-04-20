import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../utils/cx'

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string[]
  defaultValue?: string[]
  onChange?: (next: string[]) => void
  placeholder?: string
  /** Keys that commit the current input. default `['Enter', ',']`. */
  commitKeys?: string[]
  /** Optional validator; returns an error message to mark the tag invalid. */
  validate?: (tag: string) => string | null
  /** Render tag label (allow custom styles per-tag, e.g. invalid tags). */
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

  return (
    <div
      className={cx('tag-input', className)}
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
          <span
            key={`${t}-${i}`}
            className="tag"
            style={
              err
                ? {
                    background: 'color-mix(in oklch, var(--err) 18%, transparent)',
                    color: 'var(--err)',
                  }
                : undefined
            }
          >
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
      />
    </div>
  )
}
