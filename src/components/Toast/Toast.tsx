import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useLocale } from '../../context/ConfigProvider'

export const toastStyles = tv({
  slots: {
    base: [
      'flex items-center gap-2.5',
      'bg-[oklch(0.22_0.018_250)] text-white',
      'px-3 py-2.5 rounded-md shadow-lg',
      'text-sm max-w-[360px]',
    ],
    icon: 'w-3.5 h-3.5 shrink-0',
    body: 'flex-1',
    closeBtn: 'text-inherit opacity-70 px-1.5 py-0.5 text-[11px]',
  },
  variants: {
    tone: {
      neutral: {},
      ok:  { icon: 'text-ok' },
      err: { icon: 'text-err' },
    },
  },
  defaultVariants: { tone: 'neutral' },
})

type ToastVariants = VariantProps<typeof toastStyles>
export type ToastTone = NonNullable<ToastVariants['tone']>

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone
  icon?: ReactNode
  actions?: ReactNode
  onClose?: () => void
  children?: ReactNode
}

export function Toast({
  tone = 'neutral',
  icon,
  actions,
  onClose,
  className,
  children,
  ...rest
}: ToastProps) {
  const locale = useLocale()
  const { base, icon: iconCls, body, closeBtn } = toastStyles({ tone })
  return (
    <div className={base({ class: className })} role="status" {...rest}>
      {icon && <span className={iconCls()}>{icon}</span>}
      <span className={body()}>{children}</span>
      {actions}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={locale.toast.close}
          className={closeBtn()}
        >
          ×
        </button>
      )}
    </div>
  )
}

export const toastStackStyles = tv({
  base: 'fixed flex flex-col gap-2 z-[60]',
  variants: {
    position: {
      'top-left':     'top-4 left-4',
      'top-right':    'top-4 right-4',
      'bottom-left':  'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
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
