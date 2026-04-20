import { Children, Fragment, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const pipeStepStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-1.5',
      'px-2 py-0.5 rounded-xs border text-xs',
    ],
    dotc: 'w-1.5 h-1.5 rounded-full bg-current',
    spin: [
      'w-2 h-2 rounded-full border-[1.5px] border-current border-t-transparent',
      'animate-[spin_0.9s_linear_infinite]',
    ],
  },
  variants: {
    status: {
      pending: { base: 'text-text-muted bg-bg-sunk border-line' },
      running: { base: 'text-accent-ink bg-accent-weak border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)]' },
      ok:      { base: 'text-ok bg-[color-mix(in_oklch,var(--color-ok)_10%,transparent)] border-[color-mix(in_oklch,var(--color-ok)_25%,transparent)]' },
      err:     { base: 'text-err bg-[color-mix(in_oklch,var(--color-err)_10%,transparent)] border-[color-mix(in_oklch,var(--color-err)_25%,transparent)]' },
    },
  },
  defaultVariants: { status: 'pending' },
})

type PipeStepVariants = VariantProps<typeof pipeStepStyles>
export type PipeStatus = NonNullable<PipeStepVariants['status']>

export interface PipeStepProps extends HTMLAttributes<HTMLSpanElement> {
  status?: PipeStatus
  children?: ReactNode
}

export function PipeStep({ status = 'pending', className, children, ...rest }: PipeStepProps) {
  const { base, dotc, spin } = pipeStepStyles({ status })
  return (
    <span className={base({ class: className })} {...rest}>
      {status === 'running' ? <span className={spin()} /> : <span className={dotc()} />}
      {children}
    </span>
  )
}

const pipelineStyles = tv({
  base: 'inline-flex gap-1.5 items-center',
})

export interface PipelineProps extends HTMLAttributes<HTMLDivElement> {
  dashedPending?: boolean
  children?: ReactNode
}

function Connector({ dashed }: { dashed?: boolean }) {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true">
      <line
        x1="0"
        y1="4"
        x2="14"
        y2="4"
        stroke={dashed ? 'var(--color-line)' : 'var(--color-line-strong)'}
        strokeWidth="1"
        strokeDasharray={dashed ? '2 2' : undefined}
      />
    </svg>
  )
}

export function Pipeline({
  dashedPending = true,
  className,
  children,
  ...rest
}: PipelineProps) {
  const steps = Children.toArray(children).filter(Boolean) as ReactElement<PipeStepProps>[]
  let sawPending = false

  return (
    <div className={pipelineStyles({ class: className })} {...rest}>
      {steps.map((step, i) => {
        const status = step.props.status ?? 'pending'
        const isPendingStart = dashedPending && !sawPending && status === 'pending'
        if (status === 'pending') sawPending = true
        return (
          <Fragment key={i}>
            {i > 0 && <Connector dashed={isPendingStart || (sawPending && status === 'pending')} />}
            {step}
          </Fragment>
        )
      })}
    </div>
  )
}
