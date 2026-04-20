import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { Portal } from '../_internal/Portal'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { cx } from '../../utils/cx'

export type DrawerSide = 'left' | 'right'

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose'> {
  open: boolean
  side?: DrawerSide
  onClose?: () => void
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  /** Show the semi-transparent backdrop. default true */
  backdrop?: boolean
  children?: ReactNode
}

export function Drawer({
  open,
  side = 'right',
  onClose,
  closeOnEscape = true,
  closeOnBackdrop = true,
  backdrop = true,
  className,
  children,
  ...rest
}: DrawerProps) {
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
      {backdrop && (
        <div
          className="overlay-backdrop"
          onClick={closeOnBackdrop ? onClose : undefined}
          aria-hidden="true"
        />
      )}
      <div
        ref={panelRef}
        className={cx('drawer', side, className)}
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

export interface DrawerHeadProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
export function DrawerHead({ className, children, ...rest }: DrawerHeadProps) {
  return (
    <div className={cx('drawer-head', className)} {...rest}>
      {children}
    </div>
  )
}

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
export function DrawerBody({ className, children, ...rest }: DrawerBodyProps) {
  return (
    <div className={cx('drawer-body', className)} {...rest}>
      {children}
    </div>
  )
}

export interface DrawerFootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
export function DrawerFoot({ className, children, ...rest }: DrawerFootProps) {
  return (
    <div className={cx('drawer-foot', className)} {...rest}>
      {children}
    </div>
  )
}
