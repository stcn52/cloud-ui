import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'
import { Radio, type RadioProps } from './Radio'
import { RadioRow } from './RadioRow'

const radioGroupStyles = tv({
  base: 'flex',
  variants: {
    orientation: {
      vertical: 'flex-col gap-2',
      horizontal: 'flex-row flex-wrap gap-4',
    },
  },
  defaultVariants: { orientation: 'vertical' },
})

export interface RadioGroupOption {
  value: string
  label?: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  options?: RadioGroupOption[]
  orientation?: 'vertical' | 'horizontal'
  invalid?: boolean
  disabled?: boolean
  children?: ReactNode
}

type RadioChildProps = RadioProps & { label?: ReactNode }

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  options,
  orientation = 'vertical',
  invalid = false,
  disabled = false,
  children,
  className,
  ...rest
}: RadioGroupProps) {
  const handleChange = (next: string) => {
    onChange?.(next)
  }

  const renderFromOptions = () =>
    options?.map((opt) => {
      const checked = value !== undefined ? value === opt.value : undefined
      return (
        <RadioRow key={opt.value} label={opt.label ?? opt.value}>
          <Radio
            name={name}
            value={opt.value}
            checked={checked}
            defaultChecked={value === undefined ? defaultValue === opt.value : undefined}
            disabled={disabled || opt.disabled}
            invalid={invalid}
            onChange={(e) => handleChange(e.currentTarget.value)}
          />
        </RadioRow>
      )
    })

  const renderFromChildren = () =>
    Children.map(children, (child) => {
      if (!isValidElement(child)) return child
      const el = child as ReactElement<RadioChildProps>
      // If child is a Radio, wrap in a RadioRow for consistent layout when label is provided
      if (el.type === Radio) {
        const childValue = el.props.value as string | undefined
        const checked =
          value !== undefined && childValue !== undefined ? value === childValue : el.props.checked
        const label = el.props.label
        const radio = cloneElement(el, {
          name: el.props.name ?? name,
          checked,
          disabled: disabled || el.props.disabled,
          invalid: invalid || el.props.invalid,
          onChange: (e) => {
            el.props.onChange?.(e)
            if (childValue !== undefined) handleChange(childValue)
            else if (e.currentTarget.value) handleChange(e.currentTarget.value)
          },
        } as Partial<RadioChildProps>)
        if (label !== undefined) {
          return <RadioRow label={label}>{radio}</RadioRow>
        }
        return radio
      }
      return child
    })

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled || undefined}
      aria-invalid={invalid || undefined}
      className={radioGroupStyles({ orientation, class: className })}
      {...rest}
    >
      {options ? renderFromOptions() : renderFromChildren()}
    </div>
  )
}
