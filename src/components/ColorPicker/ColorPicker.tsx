import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/* ────────────────────────────────────────────────────────────────────────── */
/* ColorSwatch — a single color tile                                          */
/* ────────────────────────────────────────────────────────────────────────── */

const swatchStyles = tv({
  base: [
    'inline-grid place-items-center align-middle shrink-0',
    'cursor-pointer border border-[color-mix(in_oklch,black_8%,transparent)]',
    'transition-transform duration-[.12s]',
    'hover:scale-110',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
  ],
  variants: {
    size: {
      sm: 'w-3.5 h-3.5',
      md: 'w-5 h-5',
      lg: 'w-7 h-7',
    },
    shape: {
      square: 'rounded-xs',
      round:  'rounded-full',
    },
    selected: {
      true:  'ring-2 ring-accent ring-offset-[1.5px] ring-offset-bg-elev scale-110',
      false: '',
    },
  },
  defaultVariants: { size: 'md', shape: 'square', selected: false },
})

type SwatchVariants = VariantProps<typeof swatchStyles>
export type ColorSwatchSize = NonNullable<SwatchVariants['size']>
export type ColorSwatchShape = NonNullable<SwatchVariants['shape']>

export interface ColorSwatchProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Any CSS color string. Set as `background`. */
  color: string
  /** Marks this swatch as the selected one (accent ring). */
  selected?: boolean
  /** Show a white check icon inside (used when selected on dark colors). */
  check?: boolean
  size?: ColorSwatchSize
  shape?: ColorSwatchShape
  disabled?: boolean
  ariaLabel?: string
}

export function ColorSwatch({
  color,
  selected,
  check,
  size,
  shape,
  disabled,
  ariaLabel,
  className,
  style,
  ...rest
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? color}
      aria-pressed={selected}
      disabled={disabled}
      className={swatchStyles({ size, shape, selected, class: className })}
      style={{ background: color, ...style }}
      {...rest}
    >
      {check && selected && (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* ColorPicker — a row of swatches + optional hex input                       */
/* ────────────────────────────────────────────────────────────────────────── */

const pickerStyles = tv({
  slots: {
    base: 'inline-flex items-center gap-1.5',
    list: 'inline-flex items-center gap-1.5 flex-wrap',
    hexBox: [
      'inline-flex items-center h-7 pl-1 pr-2 rounded-sm',
      'border border-line bg-bg-elev',
      'focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]',
    ],
    hexSwatch: 'inline-block w-4 h-4 rounded-xs mr-1.5 border border-[color-mix(in_oklch,black_8%,transparent)]',
    hexHash:   'font-mono text-xs text-text-dim mr-0.5',
    hexInput:  [
      'bg-transparent border-0 outline-none',
      'font-mono text-xs uppercase [font-variant-numeric:tabular-nums]',
      'w-[68px] text-text',
    ],
  },
})

const DEFAULT_PALETTE = [
  'oklch(0.62 0.16 250)',
  'oklch(0.62 0.18 30)',
  'oklch(0.65 0.16 60)',
  'oklch(0.62 0.16 145)',
  'oklch(0.62 0.16 195)',
  'oklch(0.55 0.18 290)',
  'oklch(0.62 0.16 320)',
  'oklch(0.45 0.02 250)',
] as const

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently selected color. Should match one of `colors` for the ring to appear. */
  value: string
  /** Fired with the next color on swatch click or hex commit. */
  onChange?: (color: string) => void
  /** Color list. defaults to the 8-tone NextCli brand palette. */
  colors?: readonly string[]
  /** Render swatches as circles. Useful for tag colors. */
  round?: boolean
  /** Swatch size. default `md`. */
  swatchSize?: ColorSwatchSize
  /** Show a hex input alongside the palette. */
  hex?: boolean
  /** White check on the selected swatch. default true when hex is shown. */
  check?: boolean
  /** Trailing slot — useful for `+ Add` buttons. */
  trailing?: ReactNode
}

export function ColorPicker({
  value,
  onChange,
  colors = DEFAULT_PALETTE,
  round,
  swatchSize = 'md',
  hex,
  check,
  trailing,
  className,
  ...rest
}: ColorPickerProps) {
  const { base, list, hexBox, hexSwatch, hexHash, hexInput } = pickerStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      <div className={list()}>
        {colors.map((c) => (
          <ColorSwatch
            key={c}
            color={c}
            size={swatchSize}
            shape={round ? 'round' : 'square'}
            selected={c === value}
            check={check ?? false}
            onClick={() => onChange?.(c)}
          />
        ))}
        {trailing}
      </div>
      {hex && (
        <div className={hexBox()}>
          <span className={hexSwatch()} style={{ background: value }} />
          <span className={hexHash()}>#</span>
          <HexInput value={hexFromColor(value)} onCommit={(hexStr) => onChange?.(`#${hexStr}`)} className={hexInput()} />
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Internal: hex text input that commits on blur / Enter                      */
/* ────────────────────────────────────────────────────────────────────────── */

interface HexInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  onCommit: (hex: string) => void
}
const HexInput = forwardRef<HTMLInputElement, HexInputProps>(function HexInput(
  { value, onCommit, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      defaultValue={value as string}
      maxLength={6}
      spellCheck={false}
      onBlur={(e) => {
        const v = e.currentTarget.value.replace(/^#/, '').toUpperCase()
        if (/^[0-9A-F]{3}([0-9A-F]{3})?$/.test(v)) onCommit(v)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur()
      }}
      {...rest}
    />
  )
})

function hexFromColor(c: string): string {
  // If the input is already a 3/6-digit hex, normalize it. Otherwise we can't
  // round-trip from oklch() to hex without rendering — return empty so the
  // user just types a fresh hex.
  const m = /^#?([0-9a-f]{3}([0-9a-f]{3})?)$/i.exec(c.trim())
  return m ? m[1].toUpperCase() : ''
}
