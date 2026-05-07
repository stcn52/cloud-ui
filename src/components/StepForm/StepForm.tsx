import { useCallback, useState, type ReactNode } from 'react'
import { Button } from '../Button'
import { FormSteps, type FormStepsOrientation } from '../FormSteps'
import type { UseFormReturn } from '../Form'

export interface StepFormStep<Values extends Record<string, unknown> = Record<string, unknown>> {
  /** Label shown in the step indicator. */
  label: ReactNode
  /** Step content. Can be a node or a render function receiving the active index. */
  content: ReactNode | ((index: number) => ReactNode)
  /**
   * Field names this step owns. When you also pass a `form` to `StepForm`,
   * advancing this step runs `form.validateFields(fields)` automatically.
   */
  fields?: ReadonlyArray<keyof Values & string>
  /**
   * Custom guard, runs *after* `fields` validation. Return `false` (or a Promise of it) to block.
   * Use when this step's gate is more than just a field check (e.g. a server probe).
   */
  validate?: () => boolean | Promise<boolean>
  /** Optional override for the Next button label on this step. */
  nextLabel?: ReactNode
}

export interface StepFormProps<Values extends Record<string, unknown> = Record<string, unknown>> {
  steps: StepFormStep<Values>[]
  /**
   * Optional `useForm` instance. When passed, each step's `fields` drives partial validation,
   * and the final step calls `form.submit()` so the form's `onSubmit` fires with full values.
   */
  form?: UseFormReturn<Values>
  /** Controlled active index (0-based). */
  current?: number
  /** Uncontrolled initial step. */
  defaultCurrent?: number
  /** Fired when the active step changes (Next/Back). */
  onCurrentChange?: (index: number) => void
  /**
   * Fired after the last step's validation passes. When a `form` is provided,
   * this runs *in addition to* `form.submit()` — use it for navigation/UI side effects.
   */
  onFinish?: () => void | Promise<void>
  /** Fired when the user clicks "Cancel" on the first step. Hides the button if omitted. */
  onCancel?: () => void
  /** Indicator orientation. */
  orientation?: FormStepsOrientation
  /** Override the indicator entirely. */
  renderSteps?: (props: { current: number; labels: ReactNode[] }) => ReactNode
  /** Label customisation. */
  backLabel?: ReactNode
  nextLabel?: ReactNode
  finishLabel?: ReactNode
  cancelLabel?: ReactNode
  className?: string
}

/**
 * Multi-step form layout: indicator on top, active step body in the middle, Back / Next / Finish on the bottom.
 *
 * Two integration patterns:
 *  - **Pass a `form`** (one shared `useForm`) plus a `fields` list per step → StepForm runs partial
 *    validation per step and triggers `form.submit()` on Finish.
 *  - **Headless** — give each step its own `validate()` and own state (e.g. one `useForm` per step).
 */
export function StepForm<Values extends Record<string, unknown> = Record<string, unknown>>({
  steps,
  form,
  current,
  defaultCurrent = 0,
  onCurrentChange,
  onFinish,
  onCancel,
  orientation = 'horizontal',
  renderSteps,
  backLabel = 'Back',
  nextLabel = 'Next',
  finishLabel = 'Finish',
  cancelLabel = 'Cancel',
  className,
}: StepFormProps<Values>) {
  const isControlled = current !== undefined
  const [inner, setInner] = useState(defaultCurrent)
  const active = isControlled ? current! : inner
  const last = steps.length - 1
  const step = steps[active]
  const [busy, setBusy] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(last, next))
      if (!isControlled) setInner(clamped)
      onCurrentChange?.(clamped)
    },
    [isControlled, last, onCurrentChange],
  )

  const handleNext = useCallback(async () => {
    if (busy || !step) return
    try {
      setBusy(true)
      // 1. Form-driven partial validation.
      if (form && step.fields && step.fields.length > 0) {
        if (!form.validateFields(step.fields)) return
      }
      // 2. Custom guard (e.g. async server check).
      if (step.validate && !(await step.validate())) return

      if (active === last) {
        // Final step: trigger the form's full submit (runs validateAll + onSubmit).
        if (form) await form.submit()
        await onFinish?.()
      } else {
        goTo(active + 1)
      }
    } finally {
      setBusy(false)
    }
  }, [active, busy, form, goTo, last, onFinish, step])

  const handleBack = () => {
    if (active > 0) goTo(active - 1)
  }

  const labels = steps.map((s) => s.label)
  const indicator = renderSteps
    ? renderSteps({ current: active, labels })
    : (
      <FormSteps
        current={active}
        orientation={orientation}
        steps={steps.map((s) => ({ label: s.label }))}
      />
    )

  const body = typeof step?.content === 'function' ? step.content(active) : step?.content

  const isLast = active === last
  const showCancel = active === 0 && !!onCancel
  const submitting = busy || (form?.isSubmitting ?? false)

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      <div>{indicator}</div>
      <div>{body}</div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
          borderTop: '1px solid var(--color-line)',
          paddingTop: 16,
        }}
      >
        {showCancel && (
          <Button intent="ghost" onClick={onCancel} disabled={submitting}>
            {cancelLabel}
          </Button>
        )}
        {active > 0 && (
          <Button intent="default" onClick={handleBack} disabled={submitting}>
            {backLabel}
          </Button>
        )}
        <Button intent="primary" onClick={handleNext} loading={submitting}>
          {step?.nextLabel ?? (isLast ? finishLabel : nextLabel)}
        </Button>
      </div>
    </div>
  )
}
