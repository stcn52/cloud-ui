import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const logLineStyles = tv({
  slots: {
    base: [
      'grid gap-2.5 px-2.5 py-[3px]',
      'grid-cols-[72px_70px_1fr]',
      'font-mono text-[11.5px]',
      'hover:bg-bg-sunk',
    ],
    ts: 'text-text-dim',
    lvl: 'font-semibold',
  },
  variants: {
    level: {
      info: { lvl: 'text-accent-ink' },
      warn: { lvl: 'text-warn' },
      err:  { lvl: 'text-err' },
      ok:   { lvl: 'text-ok' },
    },
  },
})

type LogLineVariants = VariantProps<typeof logLineStyles>
export type LogLevel = NonNullable<LogLineVariants['level']>

export interface LogLineProps extends HTMLAttributes<HTMLDivElement> {
  /** Severity. default `'info'` */
  level?: LogLevel
  timestamp?: ReactNode
  message?: ReactNode
  children?: ReactNode
}

export function LogLine({
  level = 'info',
  timestamp,
  message,
  className,
  children,
  ...rest
}: LogLineProps) {
  const { base, ts, lvl } = logLineStyles({ level })
  return (
    <div className={base({ class: className })} {...rest}>
      <span className={ts()}>{timestamp}</span>
      <span className={lvl()}>{level.toUpperCase()}</span>
      <span>{message ?? children}</span>
    </div>
  )
}
