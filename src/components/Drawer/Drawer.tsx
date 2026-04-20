import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Portal } from '../_internal/Portal'
import { backdropClass } from '../Dialog/Dialog'
import { useBodyScrollLock } from '../../utils/useBodyScrollLock'
import { useFocusTrap } from '../../utils/useFocusTrap'

const drawerStyles = tv({
  base: [
    'fixed top-0 bottom-0 w-[380px] max-w-full',
    'bg-bg-elev shadow-lg z-[51]',
    'flex flex-col',
  ],
  variants: {
    side: {
      left:  'left-0 border-r border-line',
      right: 'right-0 border-l border-line',
    },
  },
  defaultVariants: { side: 'right' },
})

type DrawerVariants = VariantProps<typeof drawerStyles>
export type DrawerSide = NonNullable<DrawerVariants['side']>

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose'> {
  open: boolean
  side?: DrawerSide
  onClose?: () => void
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
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
        <div className={backdropClass} onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true" />
      )}
      <div
        ref={panelRef}
        className={drawerStyles({ side, class: className })}
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

const drawerHeadStyles = tv({
  base: 'px-4 py-3 border-b border-line flex items-center gap-2.5',
})

export interface DrawerHeadProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
export function DrawerHead({ className, children, ...rest }: DrawerHeadProps) {
  return (
    <div className={drawerHeadStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}

const drawerBodyStyles = tv({
  base: 'p-4 flex-1 overflow-auto text-sm text-text-muted',
})

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
export function DrawerBody({ className, children, ...rest }: DrawerBodyProps) {
  return (
    <div className={drawerBodyStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}

const drawerFootStyles = tv({
  base: 'px-3 py-2.5 border-t border-line flex gap-2 justify-end',
})

export interface DrawerFootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
export function DrawerFoot({ className, children, ...rest }: DrawerFootProps) {
  return (
    <div className={drawerFootStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}
