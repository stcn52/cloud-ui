import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const kpiStyles = tv({
  slots: {
    base: [
      'bg-bg-elev border border-line rounded-md shadow-sm',
      'px-4 py-3.5',
    ],
    label: 'text-xs text-text-muted uppercase tracking-[0.05em] font-medium',
    value: [
      'text-[26px] font-semibold tracking-[-0.02em] mt-1.5',
      '[font-variant-numeric:tabular-nums] font-mono',
      'flex items-baseline gap-1',
    ],
    unit: [
      'text-sm font-normal tracking-normal',
      'text-text-muted',
    ],
    foot: 'flex items-center gap-2 mt-2.5 text-xs text-text-muted',
  },
})

export interface KpiProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  value?: string | number | ReactNode
  /** Small, dim unit rendered alongside `value` (e.g., "kB", "ms", "%"). */
  unit?: ReactNode
  foot?: ReactNode
  children?: ReactNode
}

export function Kpi({ label, value, unit, foot, className, children, ...rest }: KpiProps) {
  const { base, label: labelCls, value: valueCls, unit: unitCls, foot: footCls } = kpiStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      {label !== undefined && <div className={labelCls()}>{label}</div>}
      {value !== undefined && (
        <div className={valueCls()}>
          <span>{value as ReactNode}</span>
          {unit !== undefined && <span className={unitCls()}>{unit}</span>}
        </div>
      )}
      {foot !== undefined && <div className={footCls()}>{foot}</div>}
      {children}
    </div>
  )
}

export const deltaStyles = tv({
  base: 'font-mono text-[10.5px] px-1 py-px rounded-[3px]',
  variants: {
    direction: {
      up:   'text-ok bg-[color-mix(in_oklch,var(--color-ok)_12%,transparent)]',
      down: 'text-err bg-[color-mix(in_oklch,var(--color-err)_12%,transparent)]',
    },
  },
  defaultVariants: { direction: 'up' },
})

type DeltaVariants = VariantProps<typeof deltaStyles>
export type DeltaDirection = NonNullable<DeltaVariants['direction']>

export interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
  direction?: DeltaDirection
  children?: ReactNode
}

export function Delta({ direction = 'up', className, children, ...rest }: DeltaProps) {
  return (
    <span className={deltaStyles({ direction, class: className })} {...rest}>
      {children}
    </span>
  )
}
