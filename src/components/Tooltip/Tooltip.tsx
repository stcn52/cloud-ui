import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'
import { Portal } from '../_internal/Portal'

const tooltipStyles = tv({
  slots: {
    base: 'relative inline-flex',
    tip: [
      'bg-[oklch(0.18_0.015_250)] text-white',
      'text-[11px] leading-[1.3] px-2 py-[5px] rounded-xs whitespace-nowrap',
      'pointer-events-none shadow-md',
      'transition-opacity duration-[.12s]',
      'z-[60]',
    ],
  },
})

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  tip: ReactNode
  /** Force show (useful for testing/demo). */
  open?: boolean
  /** Preferred side. default `'top'`. Flips automatically on viewport overflow. */
  placement?: TooltipPlacement
  /** Distance between trigger and tooltip. default 6 */
  offset?: number
  children?: ReactNode
}

interface Positioned {
  style: CSSProperties
  arrowStyle: CSSProperties
  effective: TooltipPlacement
}

function computePosition(
  triggerRect: DOMRect,
  tipRect: DOMRect,
  preferred: TooltipPlacement,
  offset: number,
): Positioned {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 8

  // Check if preferred fits; otherwise flip to opposite.
  const fits = (side: TooltipPlacement): boolean => {
    if (side === 'top') return triggerRect.top - tipRect.height - offset >= margin
    if (side === 'bottom') return triggerRect.bottom + tipRect.height + offset <= vh - margin
    if (side === 'left') return triggerRect.left - tipRect.width - offset >= margin
    return triggerRect.right + tipRect.width + offset <= vw - margin
  }
  const opposite: Record<TooltipPlacement, TooltipPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }

  let effective = preferred
  if (!fits(preferred) && fits(opposite[preferred])) {
    effective = opposite[preferred]
  }

  let top = 0
  let left = 0
  if (effective === 'top') {
    top = triggerRect.top - tipRect.height - offset
    left = triggerRect.left + triggerRect.width / 2 - tipRect.width / 2
  } else if (effective === 'bottom') {
    top = triggerRect.bottom + offset
    left = triggerRect.left + triggerRect.width / 2 - tipRect.width / 2
  } else if (effective === 'left') {
    top = triggerRect.top + triggerRect.height / 2 - tipRect.height / 2
    left = triggerRect.left - tipRect.width - offset
  } else {
    top = triggerRect.top + triggerRect.height / 2 - tipRect.height / 2
    left = triggerRect.right + offset
  }

  // Clamp to viewport.
  const clampedLeft = Math.max(margin, Math.min(left, vw - tipRect.width - margin))
  const clampedTop = Math.max(margin, Math.min(top, vh - tipRect.height - margin))

  // Arrow: 4px half-size, positioned on the side opposite to the tooltip.
  const arrowSize = 4
  const arrowColor = 'oklch(0.18 0.015 250)'
  const arrowStyle: CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    border: `${arrowSize}px solid transparent`,
  }

  if (effective === 'top') {
    arrowStyle.top = '100%'
    // Align arrow with trigger center, relative to clamped tooltip left.
    const triggerCenterX = triggerRect.left + triggerRect.width / 2
    arrowStyle.left = Math.max(
      arrowSize,
      Math.min(triggerCenterX - clampedLeft - arrowSize, tipRect.width - arrowSize * 3),
    )
    arrowStyle.borderTopColor = arrowColor
  } else if (effective === 'bottom') {
    arrowStyle.bottom = '100%'
    const triggerCenterX = triggerRect.left + triggerRect.width / 2
    arrowStyle.left = Math.max(
      arrowSize,
      Math.min(triggerCenterX - clampedLeft - arrowSize, tipRect.width - arrowSize * 3),
    )
    arrowStyle.borderBottomColor = arrowColor
  } else if (effective === 'left') {
    arrowStyle.left = '100%'
    const triggerCenterY = triggerRect.top + triggerRect.height / 2
    arrowStyle.top = Math.max(
      arrowSize,
      Math.min(triggerCenterY - clampedTop - arrowSize, tipRect.height - arrowSize * 3),
    )
    arrowStyle.borderLeftColor = arrowColor
  } else {
    arrowStyle.right = '100%'
    const triggerCenterY = triggerRect.top + triggerRect.height / 2
    arrowStyle.top = Math.max(
      arrowSize,
      Math.min(triggerCenterY - clampedTop - arrowSize, tipRect.height - arrowSize * 3),
    )
    arrowStyle.borderRightColor = arrowColor
  }

  return {
    style: { position: 'fixed', top: clampedTop, left: clampedLeft },
    arrowStyle,
    effective,
  }
}

export function Tooltip({
  tip,
  open,
  placement = 'top',
  offset = 6,
  className,
  children,
  ...rest
}: TooltipProps) {
  const { base, tip: tipCls } = tooltipStyles()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  const visible = open || hovered || focused

  const [positioned, setPositioned] = useState<Positioned>({
    style: { position: 'fixed', top: -9999, left: -9999, visibility: 'hidden' },
    arrowStyle: {},
    effective: placement,
  })

  const updatePosition = useCallback(() => {
    const trg = triggerRef.current
    const tp = tipRef.current
    if (!trg || !tp) return
    setPositioned(
      computePosition(trg.getBoundingClientRect(), tp.getBoundingClientRect(), placement, offset),
    )
  }, [placement, offset])

  useLayoutEffect(() => {
    if (!visible) return
    updatePosition()
  }, [visible, updatePosition])

  return (
    <div
      className={base({ class: className })}
      ref={triggerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      {...rest}
    >
      {children}
      {visible && (
        <Portal>
          <div
            ref={tipRef}
            role="tooltip"
            data-open="true"
            data-placement={positioned.effective}
            className={tipCls()}
            style={{ ...positioned.style, opacity: 1 }}
          >
            {tip}
            <span style={positioned.arrowStyle} />
          </div>
        </Portal>
      )}
    </div>
  )
}
