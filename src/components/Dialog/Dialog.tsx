import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { Portal } from '../_internal/Portal'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { cx } from '../../utils/cx'

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose'> {
  open: boolean
  onClose?: () => void
  /** Close on ESC. default true */
  closeOnEscape?: boolean
  /** Close on backdrop click. default true */
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
      <div
        className="overlay-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={cx('dialog', className)}
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
  return (
    <div className={cx('dialog-head', danger && 'danger', className)} {...rest}>
      {icon && <div className="ico">{icon}</div>}
      <div>
        {title !== undefined && <div className="title">{title}</div>}
        {description !== undefined && <div className="desc">{description}</div>}
        {children}
      </div>
    </div>
  )
}

export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function DialogBody({ className, children, ...rest }: DialogBodyProps) {
  return (
    <div className={cx('dialog-body', className)} {...rest}>
      {children}
    </div>
  )
}

export interface DialogFootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function DialogFoot({ className, children, ...rest }: DialogFootProps) {
  return (
    <div className={cx('dialog-foot', className)} {...rest}>
      {children}
    </div>
  )
}
