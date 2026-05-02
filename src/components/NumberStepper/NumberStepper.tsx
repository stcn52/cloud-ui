import { forwardRef, type HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const stepperStyles = tv({
  slots: {
    base: [
      'inline-flex items-stretch',
      'border border-line rounded-sm bg-bg-elev overflow-hidden',
      'focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]',
    ],
    btn: [
      'inline-grid place-items-center w-7 px-0',
      'bg-transparent border-0 cursor-pointer text-text-muted',
      'hover:bg-bg-sunk hover:text-text',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted',
      'first:border-r border-r-line last:border-l last:border-l-line last:border-r-0',
    ],
    input: [
      'w-12 text-center bg-transparent border-0 outline-none',
      'font-mono [font-variant-numeric:tabular-nums] text-sm text-text',
      'disabled:text-text-muted',
    ],
  },
  variants: {
    size: {
      sm: { btn: 'w-6 text-xs', input: 'w-10 text-xs h-6' },
      md: { btn: 'w-7 text-sm', input: 'w-12 text-sm h-[30px]' },
      lg: { btn: 'w-8 text-md', input: 'w-14 text-md h-9' },
    },
  },
  defaultVariants: { size: 'md' },
})

type StepperVariants = VariantProps<typeof stepperStyles>
export type NumberStepperSize = NonNullable<StepperVariants['size']>

export interface NumberStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: NumberStepperSize
  disabled?: boolean
}

export const NumberStepper = forwardRef<HTMLDivElement, NumberStepperProps>(function NumberStepper(
  { value, onChange, min = 0, max = Infinity, step = 1, size = 'md', disabled, className, ...rest },
  ref,
) {
  const { base, btn, input } = stepperStyles({ size })
  const dec = () => onChange?.(Math.max(min, value - step))
  const inc = () => onChange?.(Math.min(max, value + step))
  return (
    <div ref={ref} className={base({ class: className })} {...rest}>
      <button
        type="button"
        className={btn()}
        disabled={disabled || value <= min}
        onClick={dec}
        aria-label="Decrement"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        className={input()}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const next = parseInt(e.target.value, 10)
          if (!Number.isNaN(next)) onChange?.(Math.max(min, Math.min(max, next)))
        }}
      />
      <button
        type="button"
        className={btn()}
        disabled={disabled || value >= max}
        onClick={inc}
        aria-label="Increment"
      >
        +
      </button>
    </div>
  )
})
