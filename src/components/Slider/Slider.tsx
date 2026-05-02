import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

const sliderStyles = tv({
  slots: {
    base: 'relative w-full select-none',
    track: 'relative h-1 rounded-full bg-bg-sunk',
    fill:  'absolute inset-y-0 left-0 rounded-full bg-accent',
    ticksWrap: 'absolute inset-0 pointer-events-none',
    tick:  'absolute top-1/2 -translate-y-1/2 w-px h-2 bg-line-strong',
    thumb: [
      'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
      'w-3.5 h-3.5 rounded-full bg-bg-elev border-2 border-accent',
      'shadow-sm cursor-grab active:cursor-grabbing',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    ],
    marks: 'flex justify-between mt-2 font-mono text-[10.5px] text-text-dim [font-variant-numeric:tabular-nums]',
  },
  variants: {
    disabled: {
      true: { base: 'opacity-50 pointer-events-none' },
      false: {},
    },
  },
  defaultVariants: { disabled: false },
})

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value. number = single thumb, [lo, hi] = range. */
  value: number | [number, number]
  /** Fired with the next value. Same shape as `value`. */
  onChange?: (value: number | [number, number]) => void
  /** Minimum (inclusive). default 0 */
  min?: number
  /** Maximum (inclusive). default 100 */
  max?: number
  /** Step size. default 1 */
  step?: number
  /** Render visible tick marks at every step from min to max. */
  ticks?: boolean | number[]
  /** Labels rendered below the track. */
  marks?: ReactNode[]
  disabled?: boolean
  ariaLabel?: string
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}
function snap(n: number, step: number, min: number) {
  return Math.round((n - min) / step) * step + min
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    ticks,
    marks,
    disabled,
    ariaLabel,
    className,
    ...rest
  },
  ref,
) {
  const trackRef = useRef<HTMLDivElement>(null)
  const isRange = Array.isArray(value)
  const [lo, hi] = isRange ? (value as [number, number]) : [min, value as number]
  const [dragging, setDragging] = useState<'lo' | 'hi' | 'single' | null>(null)
  const { base, track, fill, ticksWrap, tick, thumb, marks: marksCls } = sliderStyles({ disabled })

  const pct = (n: number) => ((n - min) / (max - min)) * 100

  const valueAt = useCallback(
    (clientX: number) => {
      const rect = trackRef.current!.getBoundingClientRect()
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
      return snap(min + ratio * (max - min), step, min)
    },
    [min, max, step],
  )

  const apply = useCallback(
    (next: number, which: 'lo' | 'hi' | 'single') => {
      const clamped = clamp(next, min, max)
      if (which === 'single') {
        onChange?.(clamped)
        return
      }
      if (which === 'lo')  onChange?.([Math.min(clamped, hi), hi])
      else                 onChange?.([lo, Math.max(clamped, lo)])
    },
    [hi, lo, min, max, onChange],
  )

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: globalThis.PointerEvent) => apply(valueAt(e.clientX), dragging)
    const onUp = () => setDragging(null)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, apply, valueAt])

  const onTrackPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    const v = valueAt(e.clientX)
    if (!isRange) {
      apply(v, 'single')
      setDragging('single')
    } else {
      const which: 'lo' | 'hi' = Math.abs(v - lo) <= Math.abs(v - hi) ? 'lo' : 'hi'
      apply(v, which)
      setDragging(which)
    }
  }

  const onThumbKey = (e: KeyboardEvent<HTMLDivElement>, which: 'lo' | 'hi' | 'single') => {
    const cur = which === 'lo' ? lo : which === 'hi' ? hi : (value as number)
    let next = cur
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')  next = cur - step
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   next = cur + step
    if (e.key === 'Home')   next = min
    if (e.key === 'End')    next = max
    if (next !== cur) {
      e.preventDefault()
      apply(next, which)
    }
  }

  const tickPositions = Array.isArray(ticks)
    ? ticks
    : ticks
    ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)
    : []

  return (
    <div ref={ref} className={base({ class: className })} {...rest}>
      <div ref={trackRef} className={track()} onPointerDown={onTrackPointerDown}>
        {tickPositions.length > 0 && (
          <div className={ticksWrap()}>
            {tickPositions.map((t) => (
              <span key={t} className={tick()} style={{ left: `${pct(t)}%` }} />
            ))}
          </div>
        )}
        <span className={fill()} style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        {isRange && (
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={`${ariaLabel ?? 'value'} lower bound`}
            aria-valuenow={lo}
            aria-valuemin={min}
            aria-valuemax={hi}
            className={thumb()}
            style={{ left: `${pct(lo)}%` }}
            onPointerDown={(e) => { e.stopPropagation(); setDragging('lo') }}
            onKeyDown={(e) => onThumbKey(e, 'lo')}
          />
        )}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel ?? 'value'}
          aria-valuenow={hi}
          aria-valuemin={isRange ? lo : min}
          aria-valuemax={max}
          className={thumb()}
          style={{ left: `${pct(hi)}%` }}
          onPointerDown={(e) => { e.stopPropagation(); setDragging(isRange ? 'hi' : 'single') }}
          onKeyDown={(e) => onThumbKey(e, isRange ? 'hi' : 'single')}
        />
      </div>
      {marks && marks.length > 0 && (
        <div className={marksCls()}>
          {marks.map((m, i) => <span key={i}>{m}</span>)}
        </div>
      )}
    </div>
  )
})
