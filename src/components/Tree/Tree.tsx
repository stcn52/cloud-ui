import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface TreeNode {
  id: string
  label: ReactNode
  icon?: ReactNode
  meta?: ReactNode
  children?: TreeNode[]
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  data: TreeNode[]
  /** Controlled expanded node ids. Uncontrolled if omitted. */
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (ids: string[]) => void
  /** Controlled selected node id. Uncontrolled if omitted. */
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (id: string, node: TreeNode) => void
}

const Caret = (
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

  return (
    <>
      <div
        className={cx('node', open && 'open', isSelected && 'selected')}
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
        <span className={cx('caret', !hasChildren && 'leaf')}>{hasChildren && Caret}</span>
        {node.icon && <span className="ico">{node.icon}</span>}
        <span>{node.label}</span>
        {node.meta !== undefined && <span className="meta">{node.meta}</span>}
      </div>
      {hasChildren && open && (
        <div className="children" role="group">
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

  return (
    <div className={cx('tree', className)} role="tree" {...rest}>
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
