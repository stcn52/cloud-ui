import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type BannerTone = 'neutral' | 'info' | 'ok' | 'warn' | 'err'

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: BannerTone
  icon?: ReactNode
  title?: ReactNode
  onDismiss?: () => void
  actions?: ReactNode
  children?: ReactNode
}

const toneClass: Record<BannerTone, string> = {
  neutral: '',
  info: 'info',
  ok: 'ok',
  warn: 'warn',
  err: 'err',
}

export function Banner({
  tone = 'neutral',
  icon,
  title,
  onDismiss,
  actions,
  className,
  children,
  ...rest
}: BannerProps) {
  return (
    <div className={cx('banner', toneClass[tone], className)} role="status" {...rest}>
      {icon}
      <div className="body">
        {title !== undefined && <div className="title">{title}</div>}
        {children}
      </div>
      {actions}
      {onDismiss && (
        <button type="button" className="dismiss" aria-label="Dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  )
}
