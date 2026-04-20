import type { TableHTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

// Table styles rely heavily on descendant selectors to keep JSX clean
// (users write plain <thead>/<tbody>/<tr>/<th>/<td> markup).
export const tableStyles = tv({
  base: [
    'w-full border-collapse',
    // Cell base
    '[&_th]:text-left [&_th]:px-3.5 [&_th]:h-[34px] [&_th]:border-b [&_th]:border-line',
    '[&_th]:text-xs [&_th]:font-medium [&_th]:text-text-dim [&_th]:uppercase [&_th]:tracking-[0.05em] [&_th]:bg-panel [&_th]:whitespace-nowrap',
    '[&_td]:text-left [&_td]:px-3.5 [&_td]:h-[34px] [&_td]:border-b [&_td]:border-line',
    '[&_td]:text-sm [&_td]:whitespace-nowrap',
    // Last row no border
    '[&_tr:last-child_td]:border-b-0',
    // Row hover
    '[&_tbody_tr:hover_td]:bg-bg-sunk',
    // Monospace cells
    '[&_td.mono]:font-mono [&_td.mono]:text-xs [&_td.mono]:text-text-dim',
  ],
})

export type TableProps = TableHTMLAttributes<HTMLTableElement>

export function Table({ className, children, ...rest }: TableProps) {
  return (
    <table className={tableStyles({ class: className })} {...rest}>
      {children}
    </table>
  )
}
