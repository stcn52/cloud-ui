import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

export type NotificationTone = 'info' | 'ok' | 'warn' | 'err' | 'neutral'

export interface NotificationItem {
  id: string
  /** Headline. */
  title: ReactNode
  /** Optional body line(s). */
  body?: ReactNode
  /** Relative-time string already formatted by the caller, e.g. "2h ago". */
  time?: ReactNode
  /** Drives the leading dot colour. Default `'neutral'`. */
  tone?: NotificationTone
  /** Leading element (avatar/icon) — overrides the tone dot when present. */
  icon?: ReactNode
  read?: boolean
  /** Per-item actions rendered on the right (e.g. an "Undo" or "View" button). */
  actions?: ReactNode
  /** Bucket heading; consecutive items with the same group collect under it. */
  group?: string
}

const rootStyles = tv({
  base: 'flex flex-col w-[var(--notif-w,340px)] max-h-[var(--notif-h,440px)] bg-bg-elev border border-line rounded-md shadow-md overflow-hidden',
})

const dotColor: Record<NotificationTone, string> = {
  info: 'bg-info', ok: 'bg-ok', warn: 'bg-warn', err: 'bg-err', neutral: 'bg-text-dim',
}

export interface NotificationCenterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  items: NotificationItem[]
  /** Header title. Default "Notifications". */
  title?: ReactNode
  /** "Mark all read" handler — the link is hidden when omitted. */
  onMarkAllRead?: () => void
  /** Click on a notification row. */
  onItemClick?: (item: NotificationItem) => void
  /** Footer slot — e.g. a "View all" link. */
  footer?: ReactNode
  /** Shown when `items` is empty. Default a simple "You're all caught up". */
  emptyState?: ReactNode
}

export function NotificationCenter({
  items,
  title = 'Notifications',
  onMarkAllRead,
  onItemClick,
  footer,
  emptyState,
  className,
  ...rest
}: NotificationCenterProps) {
  const unread = items.filter((i) => !i.read).length

  return (
    <div className={rootStyles({ class: className })} role="region" aria-label={typeof title === 'string' ? title : 'Notifications'} {...rest}>
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-line">
        <span className="text-sm font-semibold text-text">{title}</span>
        {unread > 0 && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-accent-weak text-accent-ink">{unread}</span>
        )}
        {onMarkAllRead && unread > 0 && (
          <button type="button" onClick={onMarkAllRead} className="ml-auto text-xs text-accent-ink hover:underline">
            Mark all read
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {items.length === 0 ? (
          <div className="px-3.5 py-10 text-center text-sm text-text-dim">
            {emptyState ?? "You're all caught up."}
          </div>
        ) : (
          items.map((item, i) => {
            const prevGroup = i > 0 ? items[i - 1].group : undefined
            const showHeading = item.group !== undefined && item.group !== prevGroup
            return (
              <div key={item.id}>
                {showHeading && (
                  <div className="px-3.5 pt-3 pb-1 text-[10.5px] uppercase tracking-[0.05em] font-medium text-text-dim">
                    {item.group}
                  </div>
                )}
                <div
                  role={onItemClick ? 'button' : undefined}
                  tabIndex={onItemClick ? 0 : undefined}
                  onClick={() => onItemClick?.(item)}
                  onKeyDown={(e) => {
                    if (onItemClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onItemClick(item) }
                  }}
                  className={[
                    'flex items-start gap-2.5 px-3.5 py-2.5 border-b border-line last:border-b-0',
                    onItemClick ? 'cursor-pointer hover:bg-bg-sunk' : '',
                    !item.read ? 'bg-[color-mix(in_oklch,var(--color-accent)_6%,transparent)]' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <span className="mt-1 shrink-0">
                    {item.icon ?? <span className={`block w-2 h-2 rounded-full ${dotColor[item.tone ?? 'neutral']}`} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm ${item.read ? 'text-text-muted' : 'text-text font-medium'} truncate`}>{item.title}</span>
                      {item.time && <span className="ml-auto shrink-0 text-[11px] text-text-dim">{item.time}</span>}
                    </div>
                    {item.body && <div className="text-xs text-text-muted mt-0.5 line-clamp-2">{item.body}</div>}
                    {item.actions && <div className="mt-1.5 flex items-center gap-2">{item.actions}</div>}
                  </div>
                  {!item.read && <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-accent" aria-label="unread" />}
                </div>
              </div>
            )
          })
        )}
      </div>

      {footer && <div className="border-t border-line px-3.5 py-2 text-center">{footer}</div>}
    </div>
  )
}
