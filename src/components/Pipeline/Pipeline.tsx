import { Children, Fragment, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type PipeStatus = 'pending' | 'running' | 'ok' | 'err'

export interface PipeStepProps extends HTMLAttributes<HTMLSpanElement> {
  status?: PipeStatus
  children?: ReactNode
}

const statusClass: Record<PipeStatus, string> = {
  pending: '',
  running: 'run',
  ok: 'ok',
  err: 'err',
}

export function PipeStep({ status = 'pending', className, children, ...rest }: PipeStepProps) {
  return (
    <span className={cx('pipe-step', statusClass[status], className)} {...rest}>
      {status === 'running' ? <span className="spin" /> : <span className="dotc" />}
      {children}
    </span>
  )
}

export interface PipelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Draw a dashed connector before the first step whose status is "pending". Defaults to true. */
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
        stroke={dashed ? 'var(--line)' : 'var(--line-strong)'}
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
    <div className={cx('pipe', className)} {...rest}>
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
