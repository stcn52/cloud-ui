import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Portal } from '../_internal/Portal'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'
import { useFocusTrap } from '../../utils/useFocusTrap'

// Shared with Drawer/CommandPalette — exported so those can reuse.
export const backdropClass = 'fixed inset-0 bg-[rgba(15,23,42,0.35)] backdrop-blur-[1px] z-50'

const dialogStyles = tv({
  base: [
    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    'w-[420px] max-w-[calc(100vw-32px)]',
    'bg-bg-elev border border-line rounded-lg shadow-lg',
    'z-[51] overflow-hidden',
  ],
})

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose'> {
  open: boolean
  onClose?: () => void
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  children?: ReactNode
}

export function Dialog({
  open,
  onClose,
  closeOnEscape = true,
  closeOnBackdrop = true,
  className,
  children,
  ...rest
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useBodyScrollLock(open)
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open || !closeOnEscape) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeOnEscape, onClose])

  if (!open) return null

  return (
    <Portal>
      <div className={backdropClass} onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true" />
      <div
        ref={panelRef}
        className={dialogStyles({ class: className })}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        {...rest}
      >
        {children}
      </div>
    </Portal>
  )
}

const dialogHeadStyles = tv({
  slots: {
    base: 'px-4 py-3.5 border-b border-line flex gap-2.5 items-start',
    icon: 'w-8 h-8 rounded-md grid place-items-center shrink-0 bg-accent-weak text-accent-ink',
    title: 'font-semibold text-sm',
    desc: 'text-sm text-text-muted mt-0.5 leading-[1.5]',
  },
  variants: {
    danger: {
      true: { icon: 'bg-[color-mix(in_oklch,var(--color-err)_12%,transparent)] text-err' },
      false: {},
    },
  },
  defaultVariants: { danger: false },
})

export interface DialogHeadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  danger?: boolean
  children?: ReactNode
}

export function DialogHead({
  icon,
  title,
  description,
  danger,
  className,
  children,
  ...rest
}: DialogHeadProps) {
  const { base, icon: iconCls, title: titleCls, desc } = dialogHeadStyles({ danger })
  return (
    <div className={base({ class: className })} {...rest}>
      {icon && <div className={iconCls()}>{icon}</div>}
      <div>
        {title !== undefined && <div className={titleCls()}>{title}</div>}
        {description !== undefined && <div className={desc()}>{description}</div>}
        {children}
      </div>
    </div>
  )
}

const dialogBodyStyles = tv({
  base: 'px-4 py-3.5 text-sm text-text-muted',
})

export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function DialogBody({ className, children, ...rest }: DialogBodyProps) {
  return (
    <div className={dialogBodyStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}

const dialogFootStyles = tv({
  base: 'px-3 py-2.5 border-t border-line bg-bg-sunk flex gap-2 justify-end',
})

export interface DialogFootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function DialogFoot({ className, children, ...rest }: DialogFootProps) {
  return (
    <div className={dialogFootStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}
