import { Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/**
 * FormSteps — a numbered indicator for multi-step forms.
 * - `done` steps fill green and show a check
 * - the `active` step takes the accent
 * - connectors between steps reflect the leading state
 *
 * Pure presentation; the parent owns the active index.
 */
const stepStyles = tv({
  slots: {
    base: 'inline-flex items-center',
    item: 'inline-flex items-center gap-2 text-sm whitespace-nowrap',
    num: [
      'inline-grid place-items-center w-[18px] h-[18px] rounded-full shrink-0',
      'font-mono text-[11px] [font-variant-numeric:tabular-nums]',
      'bg-bg-sunk text-text-muted border border-line',
    ],
    label: 'text-text-muted',
    conn:  'block flex-shrink h-px w-8 bg-line mx-2',
  },
  variants: {
    state: {
      pending: {},
      active:  {
        num:   'bg-accent-weak text-accent-ink border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)] font-semibold',
        label: 'text-text font-medium',
      },
      done: {
        num:   'bg-ok text-white border-ok',
        label: 'text-text',
      },
    },
    connDone: {
      true:  { conn: 'bg-ok' },
      false: {},
    },
    orientation: {
      horizontal: {},
      vertical:   { base: 'flex-col items-start gap-1', conn: 'w-px h-3.5 mx-0 ml-[8px] my-1' },
    },
  },
  defaultVariants: { state: 'pending', connDone: false, orientation: 'horizontal' },
})

type StepVariants = VariantProps<typeof stepStyles>
export type FormStepState = NonNullable<StepVariants['state']>
export type FormStepsOrientation = NonNullable<StepVariants['orientation']>

export interface FormStep {
  /** Visible label. */
  label: ReactNode
  /** State. default derives from index vs `current`. */
  state?: FormStepState
}

export interface FormStepsProps extends HTMLAttributes<HTMLDivElement> {
  steps: readonly FormStep[]
  /** 0-based index of the active step. Used to auto-derive state when individual steps don't set their own. */
  current?: number
  orientation?: FormStepsOrientation
}

export function FormSteps({
  steps,
  current = 0,
  orientation = 'horizontal',
  className,
  ...rest
}: FormStepsProps) {
  const { base } = stepStyles({ orientation })

  return (
    <div className={base({ class: className })} role="list" {...rest}>
      {steps.map((step, i) => {
        const state: FormStepState = step.state ?? (i < current ? 'done' : i === current ? 'active' : 'pending')
        const { item, num, label } = stepStyles({ state, orientation })
        const next = steps[i + 1]
        const nextDone = state === 'done' && (next?.state ?? (i + 1 < current ? 'done' : i + 1 === current ? 'active' : 'pending')) !== 'pending'
        const { conn } = stepStyles({ orientation, connDone: nextDone })
        return (
          <Fragment key={i}>
            <div role="listitem" aria-current={state === 'active' ? 'step' : undefined} className={item()}>
              <span className={num()} aria-hidden>
                {state === 'done' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : i + 1}
              </span>
              <span className={label()}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <span aria-hidden className={conn()} />}
          </Fragment>
        )
      })}
    </div>
  )
}
