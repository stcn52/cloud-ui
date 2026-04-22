import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useLocale } from '../../context/ConfigProvider'

const DefaultIcons: Record<'ok' | 'err' | 'warn' | 'info', ReactNode> = {
  ok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 12.5 10 17.5 19 7.5" />
    </svg>
  ),
  err: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L22 20 L2 20 Z" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <circle cx="12" cy="17.2" r="0.6" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
    </svg>
  ),
}

export const toastStyles = tv({
  slots: {
    base: [
      'relative flex items-start gap-2.5',
      'bg-bg-elev text-text border border-line rounded-md shadow-md',
      'pl-3.5 pr-3 py-2.5 text-sm min-w-[260px] max-w-[400px]',
      'overflow-hidden',
    ],
    bar: 'absolute top-0 left-0 bottom-0 w-[3px]',
    icon: 'w-4 h-4 shrink-0 mt-[1px]',
    body: 'flex-1 min-w-0',
    title: 'font-semibold mb-0.5 leading-snug',
    description: 'text-text-muted leading-snug',
    actions: 'flex items-center gap-1 ml-1 shrink-0',
    closeBtn: [
      'ml-1 shrink-0 inline-grid place-items-center w-5 h-5 rounded-xs',
      'text-text-dim hover:text-text hover:bg-bg-sunk',
      'border-0 bg-transparent p-0 cursor-pointer',
    ],
  },
  variants: {
    tone: {
      neutral: { bar: 'bg-line-strong', icon: 'text-text-muted' },
      ok:      { bar: 'bg-ok',   icon: 'text-ok' },
      err:     { bar: 'bg-err',  icon: 'text-err' },
      warn:    { bar: 'bg-warn', icon: 'text-warn' },
      info:    { bar: 'bg-info', icon: 'text-info' },
    },
  },
  defaultVariants: { tone: 'neutral' },
})

type ToastVariants = VariantProps<typeof toastStyles>
export type ToastTone = NonNullable<ToastVariants['tone']>

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: ToastTone
  /**
   * Icon. `true` (default for non-neutral tones) uses the built-in glyph;
   * `false` hides it; a ReactNode overrides with a custom icon.
   */
  icon?: ReactNode | boolean
  /** Optional bold first line. */
  title?: ReactNode
  actions?: ReactNode
  onClose?: () => void
  /** Optional progress bar rendered along the bottom edge (used by Toaster). */
  progressBar?: ReactNode
  children?: ReactNode
}

export function Toast({
  tone = 'neutral',
  icon,
  title,
  actions,
  onClose,
  progressBar,
  className,
  children,
  ...rest
}: ToastProps) {
  const locale = useLocale()
  const s = toastStyles({ tone })

  let iconNode: ReactNode = null
  if (icon === false) iconNode = null
  else if (icon === true || icon === undefined) {
    iconNode = tone !== 'neutral' ? DefaultIcons[tone] : null
  } else {
    iconNode = icon
  }

  return (
    <div className={s.base({ class: className })} role="status" {...rest}>
      <span className={s.bar()} aria-hidden />
      {iconNode && <span className={s.icon()}>{iconNode}</span>}
      <div className={s.body()}>
        {title !== undefined && <div className={s.title()}>{title}</div>}
        {children !== undefined && <div className={s.description()}>{children}</div>}
      </div>
      {actions && <span className={s.actions()}>{actions}</span>}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={locale.toast.close}
          className={s.closeBtn()}
        >
          ×
        </button>
      )}
      {progressBar}
    </div>
  )
}

export const toastStackStyles = tv({
  base: 'fixed flex flex-col gap-2 z-[60] pointer-events-none [&>*]:pointer-events-auto',
  variants: {
    position: {
      'top-left':     'top-4 left-4',
      'top-center':   'top-4 left-1/2 -translate-x-1/2 items-center',
      'top-right':    'top-4 right-4',
      'bottom-left':  'bottom-4 left-4 flex-col-reverse',
      'bottom-center':'bottom-4 left-1/2 -translate-x-1/2 items-center flex-col-reverse',
      'bottom-right': 'bottom-4 right-4 flex-col-reverse',
    },
  },
  defaultVariants: { position: 'bottom-right' },
})

type ToastStackVariants = VariantProps<typeof toastStackStyles>
export type ToastStackPosition = NonNullable<ToastStackVariants['position']>

export interface ToastStackProps extends HTMLAttributes<HTMLDivElement> {
  position?: ToastStackPosition
  children?: ReactNode
}

export function ToastStack({
  position = 'bottom-right',
  className,
  children,
  ...rest
}: ToastStackProps) {
  return (
    <div className={toastStackStyles({ position, class: className })} {...rest}>
      {children}
    </div>
  )
}
