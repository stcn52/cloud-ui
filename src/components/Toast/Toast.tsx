import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type ToastTone = 'neutral' | 'ok' | 'err'

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone
  icon?: ReactNode
  actions?: ReactNode
  onClose?: () => void
  children?: ReactNode
}

const toneClass: Record<ToastTone, string> = {
  neutral: '',
  ok: 'ok',
  err: 'err',
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
  return (
    <div className={cx('toast-item', toneClass[tone], className)} role="status" {...rest}>
      {icon}
      <span style={{ flex: 1 }}>{children}</span>
      {actions}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  )
}

export type ToastStackPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface ToastStackProps extends HTMLAttributes<HTMLDivElement> {
  position?: ToastStackPosition
  children?: ReactNode
}

const stackPos: Record<ToastStackPosition, React.CSSProperties> = {
  'top-left': { top: 16, left: 16, flexDirection: 'column' },
  'top-right': { top: 16, right: 16, flexDirection: 'column' },
  'bottom-left': { bottom: 16, left: 16, flexDirection: 'column' },
  'bottom-right': { bottom: 16, right: 16, flexDirection: 'column' },
}

export function ToastStack({
  position = 'bottom-right',
  className,
  style,
  children,
  ...rest
}: ToastStackProps) {
  return (
    <div
      className={cx('toast-stack', className)}
      style={{
        position: 'fixed',
        display: 'flex',
        gap: 8,
        zIndex: 60,
        ...stackPos[position],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
