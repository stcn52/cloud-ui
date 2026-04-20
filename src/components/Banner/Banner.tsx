import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useLocale } from '../../context/ConfigProvider'

export const bannerStyles = tv({
  slots: {
    base: [
      'flex gap-2.5 items-start',
      'px-3.5 py-2.5 rounded-md border text-sm',
    ],
    icon: 'w-4 h-4 shrink-0 mt-px',
    body: 'flex-1 text-text',
    title: 'font-semibold mb-0.5',
    dismiss: 'ml-auto text-inherit opacity-60 px-1.5 py-0.5 hover:opacity-100',
  },
  variants: {
    tone: {
      neutral: { base: 'bg-bg-elev border-line' },
      info:    { base: 'bg-accent-weak border-[color-mix(in_oklch,var(--color-accent)_28%,transparent)] text-accent-ink', body: 'text-inherit' },
      ok:      { base: 'bg-[color-mix(in_oklch,var(--color-ok)_10%,transparent)] border-[color-mix(in_oklch,var(--color-ok)_28%,transparent)] text-ok', body: 'text-inherit' },
      warn:    { base: 'bg-[color-mix(in_oklch,var(--color-warn)_12%,transparent)] border-[color-mix(in_oklch,var(--color-warn)_30%,transparent)] text-[oklch(0.45_0.14_75)]', body: 'text-inherit' },
      err:     { base: 'bg-[color-mix(in_oklch,var(--color-err)_10%,transparent)] border-[color-mix(in_oklch,var(--color-err)_28%,transparent)] text-err', body: 'text-inherit' },
    },
  },
  defaultVariants: { tone: 'neutral' },
})

type BannerVariants = VariantProps<typeof bannerStyles>
export type BannerTone = NonNullable<BannerVariants['tone']>

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: BannerTone
  icon?: ReactNode
  title?: ReactNode
  onDismiss?: () => void
  actions?: ReactNode
  children?: ReactNode
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
  const locale = useLocale()
  const { base, icon: iconCls, body, title: titleCls, dismiss } = bannerStyles({ tone })
  return (
    <div className={base({ class: className })} role="status" {...rest}>
      {icon && <span className={iconCls()}>{icon}</span>}
      <div className={body()}>
        {title !== undefined && <div className={titleCls()}>{title}</div>}
        {children}
      </div>
      {actions}
      {onDismiss && (
        <button
          type="button"
          className={dismiss()}
          aria-label={locale.banner.dismiss}
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  )
}
