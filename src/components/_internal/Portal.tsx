import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

export interface PortalProps {
  children: ReactNode
  /** Optional explicit target; defaults to document.body */
  container?: Element | null
}

/**
 * Render `children` into a DOM node outside the React tree.
 *
 * SSR-safe via a `typeof document` guard — on the server we render nothing,
 * on the client we mount synchronously on first render so refs inside the
 * portal are available immediately (important for layout-effect positioning
 * in `Popover`, `Dropdown`, `Tooltip`, etc.).
 */
export function Portal({ children, container }: PortalProps) {
  if (typeof document === 'undefined') return null
  const target = container ?? document.body
  if (!target) return null
  return createPortal(children, target)
}
