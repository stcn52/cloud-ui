import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const inputStyles = tv({
  base: [
    'w-full border border-line rounded-sm bg-bg-elev text-text',
    'font-[inherit] transition-colors duration-[.12s]',
    'hover:border-line-strong',
    'focus:outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]',
    'disabled:bg-bg-sunk disabled:text-text-muted disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'h-6 px-2 text-xs',
      md: 'h-[30px] px-2.5 text-sm',
      lg: 'h-9 px-2.5 text-md',
    },
    invalid: {
      true: 'border-err hover:border-err focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-err)_25%,transparent)]',
      false: '',
    },
    mono: { true: 'font-mono', false: '' },
    num:  { true: '[font-variant-numeric:tabular-nums]', false: '' },
  },
  defaultVariants: { size: 'md', invalid: false, mono: false, num: false },
})

type InputVariants = VariantProps<typeof inputStyles>
export type InputSize = NonNullable<InputVariants['size']>

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  invalid?: boolean
  mono?: boolean
  num?: boolean
  /**
   * Show a small × button on the right while the input has a value; clicking it
   * clears the field (fires `onChange` with an empty value for controlled inputs,
   * and a native `input` event for uncontrolled ones), then refocuses.
   * Fired callback: `onClear`.
   */
  clearable?: boolean
  onClear?: () => void
}

const clearSize: Record<InputSize, { pad: string; icon: number; right: number }> = {
  sm: { pad: 'pr-6',  icon: 10, right: 6 },
  md: { pad: 'pr-7',  icon: 11, right: 8 },
  lg: { pad: 'pr-8',  icon: 12, right: 10 },
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', invalid, mono, num, className, clearable, onClear, value, defaultValue, onChange, disabled, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, [])

  // Track value so we know when to show the × — works for both controlled and uncontrolled.
  const isControlled = value !== undefined
  const [innerVal, setInnerVal] = useState<string>(defaultValue != null ? String(defaultValue) : '')
  const currentVal = isControlled ? String(value ?? '') : innerVal
  const hasValue = currentVal.length > 0

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInnerVal(e.target.value)
    onChange?.(e)
  }, [isControlled, onChange])

  const clear = useCallback(() => {
    const el = innerRef.current
    if (el) {
      // Fire a native input event so React (controlled) and listeners see the change.
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
      setter?.call(el, '')
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.focus()
    }
    if (!isControlled) setInnerVal('')
    onClear?.()
  }, [isControlled, onClear])

  const inputEl = (
    <input
      ref={innerRef}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={inputStyles({ size, invalid, mono, num, class: [className, clearable ? clearSize[size].pad : ''].filter(Boolean).join(' ') })}
      {...rest}
    />
  )

  if (!clearable) return inputEl

  // Wrapper is block + full-width so the contained `w-full` input keeps its layout;
  // size the *parent* of <Input> if you need a narrower box.
  return (
    <span className="relative block w-full">
      {inputEl}
      {hasValue && !disabled && (
        <button
          type="button"
          aria-label="Clear"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={clear}
          className="absolute top-1/2 -translate-y-1/2 text-text-dim hover:text-text grid place-items-center"
          style={{ right: clearSize[size].right }}
        >
          <svg width={clearSize[size].icon} height={clearSize[size].icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </span>
  )
})
