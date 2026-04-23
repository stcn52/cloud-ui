import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { tv } from 'tailwind-variants'
import { inputStyles, type InputSize } from '../Input/Input'
import { Popover } from '../Popover/Popover'
import { DatePicker, type DatePickerProps } from './DatePicker'

/**
 * Tiny internal date formatter.
 * Supports: yyyy, MM, dd. Any other runs of characters are passed through verbatim.
 * Pattern tokens match on exact length.
 */
export function formatDate(d: Date, format: string): string {
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const pad2 = (n: number) => n.toString().padStart(2, '0')
  return format
    .replace(/yyyy/g, String(year))
    .replace(/MM/g, pad2(month))
    .replace(/dd/g, pad2(day))
}

const triggerStyles = tv({
  base: [
    'inline-flex items-center w-full cursor-pointer select-none',
    'whitespace-nowrap',
  ],
  variants: {
    disabled: { true: 'cursor-not-allowed', false: '' },
  },
})

const clearBtnStyles = tv({
  base: [
    'ml-1.5 inline-flex items-center justify-center shrink-0',
    'w-4 h-4 rounded-xs text-text-dim',
    'hover:text-text hover:bg-bg-sunk',
    'border-0 bg-transparent cursor-pointer p-0',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
  ],
})

export interface DatePickerInputProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  /** Default: `yyyy-MM-dd`. Supports `yyyy`, `MM`, `dd`. */
  format?: string
  disabled?: boolean
  invalid?: boolean
  clearable?: boolean
  size?: InputSize
  className?: string
  id?: string
  name?: string
  'aria-label'?: string
  /** Optional extra props forwarded to the calendar. */
  calendarProps?: Omit<DatePickerProps, 'mode' | 'value' | 'defaultValue' | 'onChange'>
}

const ICON_CAL = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ICON_CLEAR = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
)

export function DatePickerInput({
  value: valueProp,
  defaultValue = null,
  onChange,
  placeholder = 'Select date',
  format = 'yyyy-MM-dd',
  disabled = false,
  invalid = false,
  clearable = false,
  size = 'md',
  className,
  id,
  name,
  calendarProps,
  ...ariaRest
}: DatePickerInputProps) {
  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = useState<Date | null>(defaultValue)
  const value = isControlled ? valueProp ?? null : uncontrolled

  const [open, setOpen] = useState(false)
  const lastFocusable = useRef<HTMLDivElement | null>(null)

  const commit = useCallback(
    (next: Date | null) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const handleSelect = (v: Date | unknown) => {
    if (v instanceof Date) {
      commit(v)
      setOpen(false)
    } else if (v === null) {
      commit(null)
    }
  }

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (disabled) return
    commit(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((o) => !o)
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      setOpen(false)
    }
  }

  const displayText = value ? formatDate(value, format) : ''

  // Build a trigger that mimics an Input visually. Popover will clone it and attach its own onClick+ref.
  const trigger = (
    <div
      ref={lastFocusable}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-disabled={disabled || undefined}
      aria-invalid={invalid || undefined}
      id={id}
      data-name={name}
      onKeyDown={handleKeyDown}
      className={`${inputStyles({ size, invalid, class: className })} ${triggerStyles({ disabled })}`}
      {...ariaRest}
    >
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: value ? undefined : 'var(--color-text-dim)',
        }}
      >
        {value ? displayText : placeholder}
      </span>
      {clearable && value && !disabled ? (
        <button
          type="button"
          className={clearBtnStyles()}
          aria-label="Clear date"
          onClick={handleClear}
          onMouseDown={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          {ICON_CLEAR}
        </button>
      ) : (
        <span
          aria-hidden="true"
          style={{
            marginLeft: 6,
            display: 'inline-flex',
            color: 'var(--color-text-dim)',
          }}
        >
          {ICON_CAL}
        </span>
      )}
    </div>
  )

  if (disabled) {
    // Render trigger without a popover when disabled.
    return trigger
  }

  return (
    <Popover
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      placement="bottom-start"
      surface={false}
      content={
        <DatePicker
          mode="single"
          value={value}
          onChange={handleSelect}
          {...calendarProps}
        />
      }
    />
  )
}
