import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SegmentedOption<V extends string = string> {
  value: V
  label: ReactNode
  disabled?: boolean
}

export interface SegmentedProps<V extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption<V>[]
  value: V
  onChange?: (value: V) => void
}

export function Segmented<V extends string = string>({
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedProps<V>) {
  return (
    <div className={cx('seg', className)} role="tablist" {...rest}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={opt.value === value}
          disabled={opt.disabled}
          className={cx(opt.value === value && 'on')}
          onClick={() => onChange?.(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
