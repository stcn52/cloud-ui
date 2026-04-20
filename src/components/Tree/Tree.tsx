import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const treeStyles = tv({
  slots: {
    root: 'text-sm',
    node: [
      'flex items-center gap-1.5 px-2 py-1 rounded-xs',
      'cursor-default text-text select-none',
      'hover:bg-bg-sunk',
    ],
    caret: [
      'w-3 h-3 inline-flex items-center justify-center',
      'text-text-dim transition-transform duration-[.12s]',
    ],
    icon: 'w-3.5 h-3.5 text-text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full',
    meta: 'ml-auto font-mono text-[10.5px] text-text-dim',
    children: 'ml-3.5 border-l border-dashed border-line pl-1',
  },
  variants: {
    selected: {
      true:  { node: 'bg-accent-weak text-accent-ink hover:bg-accent-weak' },
      false: {},
    },
    open: {
      true:  { caret: 'rotate-90' },
      false: {},
    },
    leaf: {
      true:  { caret: 'opacity-0' },
      false: {},
    },
  },
})

export interface TreeNode {
  id: string
  label: ReactNode
  icon?: ReactNode
  meta?: ReactNode
  children?: TreeNode[]
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  data: TreeNode[]
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (ids: string[]) => void
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (id: string, node: TreeNode) => void
}

const CaretSvg = (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="8 5 19 12 8 19" />
  </svg>
)

function NodeRow({
  node,
  expandedSet,
  selectedId,
  toggle,
  select,
}: {
  node: TreeNode
  expandedSet: Set<string>
  selectedId: string | null
  toggle: (id: string) => void
  select: (node: TreeNode) => void
}) {
  const hasChildren = !!node.children?.length
  const open = hasChildren && expandedSet.has(node.id)
  const isSelected = node.id === selectedId

  const s = treeStyles({ selected: isSelected, open, leaf: !hasChildren })

  return (
    <>
      <div
        className={s.node()}
        role="treeitem"
        aria-expanded={hasChildren ? open : undefined}
        aria-selected={isSelected}
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          select(node)
          if (hasChildren) toggle(node.id)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            select(node)
            if (hasChildren) toggle(node.id)
          } else if (e.key === 'ArrowRight' && hasChildren && !open) {
            e.preventDefault()
            toggle(node.id)
          } else if (e.key === 'ArrowLeft' && hasChildren && open) {
            e.preventDefault()
            toggle(node.id)
          }
        }}
      >
        <span className={s.caret()}>{hasChildren && CaretSvg}</span>
        {node.icon && <span className={s.icon()}>{node.icon}</span>}
        <span>{node.label}</span>
        {node.meta !== undefined && <span className={s.meta()}>{node.meta}</span>}
      </div>
      {hasChildren && open && (
        <div className={s.children()} role="group">
          {node.children!.map((child) => (
            <NodeRow
              key={child.id}
              node={child}
              expandedSet={expandedSet}
              selectedId={selectedId}
              toggle={toggle}
              select={select}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function Tree({
  data,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelect,
  className,
  ...rest
}: TreeProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>(defaultExpanded)
  const [uncontrolledSelected, setUncontrolledSelected] = useState<string | null>(defaultSelected)

  const expandedIds = expandedProp ?? uncontrolledExpanded
  const selectedId = selectedProp !== undefined ? selectedProp : uncontrolledSelected
  const expandedSet = new Set(expandedIds)

  const toggle = (id: string) => {
    const next = expandedSet.has(id)
      ? expandedIds.filter((x) => x !== id)
      : [...expandedIds, id]
    if (expandedProp === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  const select = (node: TreeNode) => {
    if (selectedProp === undefined) setUncontrolledSelected(node.id)
    onSelect?.(node.id, node)
  }

  const { root } = treeStyles()
  return (
    <div className={root({ class: className })} role="tree" {...rest}>
      {data.map((n) => (
        <NodeRow
          key={n.id}
          node={n}
          expandedSet={expandedSet}
          selectedId={selectedId}
          toggle={toggle}
          select={select}
        />
      ))}
    </div>
  )
}
