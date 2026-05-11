import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue }

const rootStyles = tv({
  base: 'font-mono text-xs leading-[1.6] text-text bg-bg-sunk rounded-sm border border-line p-3 overflow-auto',
})

// Colour tokens reuse the design-system status/accent palette so dark mode flips automatically.
const tokenColor = {
  key:    'text-accent-ink',
  string: 'text-ok',
  number: 'text-info',
  bool:   'text-warn',
  null:   'text-text-dim',
  punct:  'text-text-dim',
} as const

export interface JsonViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The value to render. Strings are parsed; anything else is shown as-is. */
  data: unknown
  /** Auto-expand nodes up to this depth. `Infinity` expands everything. Default 1. */
  defaultExpandDepth?: number
  /** Show a "Copy" button that copies the (re-stringified) JSON. Default true. */
  copyable?: boolean
  /** Indentation width in `ch`. Default 2. */
  indent?: number
}

function tryParse(data: unknown): { value: JsonValue; error: string | null } {
  if (typeof data === 'string') {
    try {
      return { value: JSON.parse(data) as JsonValue, error: null }
    } catch {
      return { value: data, error: 'Not valid JSON — showing as string' }
    }
  }
  return { value: data as JsonValue, error: null }
}

function Punct({ children }: { children: ReactNode }) {
  return <span className={tokenColor.punct}>{children}</span>
}

function Leaf({ value }: { value: Exclude<JsonValue, JsonValue[] | object> }) {
  if (value === null) return <span className={tokenColor.null}>null</span>
  switch (typeof value) {
    case 'string': return <span className={tokenColor.string}>"{value}"</span>
    case 'number': return <span className={tokenColor.number}>{value}</span>
    case 'boolean': return <span className={tokenColor.bool}>{String(value)}</span>
    default: return <span>{String(value)}</span>
  }
}

const isContainer = (v: JsonValue): v is JsonValue[] | { [k: string]: JsonValue } =>
  v !== null && typeof v === 'object'

function Node({
  k,
  value,
  depth,
  defaultExpandDepth,
  isLast,
  indent,
}: {
  k?: string
  value: JsonValue
  depth: number
  defaultExpandDepth: number
  isLast: boolean
  indent: number
}) {
  const [open, setOpen] = useState(depth < defaultExpandDepth)
  const pad = { paddingLeft: `${depth * indent}ch` }
  const keyLabel = k !== undefined ? <><span className={tokenColor.key}>"{k}"</span><Punct>: </Punct></> : null

  if (!isContainer(value)) {
    return (
      <div style={pad}>
        {keyLabel}
        <Leaf value={value} />
        {!isLast && <Punct>,</Punct>}
      </div>
    )
  }

  const entries: [string | number, JsonValue][] = Array.isArray(value)
    ? value.map((v, i) => [i, v])
    : Object.entries(value)
  const openBracket = Array.isArray(value) ? '[' : '{'
  const closeBracket = Array.isArray(value) ? ']' : '}'
  const count = entries.length

  return (
    <div>
      <div style={pad}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1 hover:bg-bg-elev rounded-xs -ml-3.5 pl-3.5 pr-1"
          aria-expanded={open}
        >
          <svg
            width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
            className="text-text-dim transition-transform duration-100"
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}
            aria-hidden
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
          {keyLabel}
          <Punct>{openBracket}</Punct>
          {!open && (
            <>
              <span className="text-text-dim">{count} {Array.isArray(value) ? 'items' : 'keys'}</span>
              <Punct>{closeBracket}</Punct>
              {!isLast && <Punct>,</Punct>}
            </>
          )}
        </button>
      </div>
      {open && (
        <>
          {entries.map(([ek, ev], i) => (
            <Node
              key={String(ek)}
              k={Array.isArray(value) ? undefined : String(ek)}
              value={ev}
              depth={depth + 1}
              defaultExpandDepth={defaultExpandDepth}
              isLast={i === count - 1}
              indent={indent}
            />
          ))}
          <div style={pad}>
            <Punct>{closeBracket}</Punct>
            {!isLast && <Punct>,</Punct>}
          </div>
        </>
      )}
    </div>
  )
}

export function JsonViewer({
  data,
  defaultExpandDepth = 1,
  copyable = true,
  indent = 2,
  className,
  ...rest
}: JsonViewerProps) {
  const { value, error } = tryParse(data)
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    const text = error ? String(value) : JSON.stringify(value, null, 2)
    void navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={rootStyles({ class: className })} {...rest}>
      <div style={{ position: 'relative' }}>
        {copyable && (
          <button
            type="button"
            onClick={onCopy}
            className="absolute top-0 right-0 text-[10px] px-1.5 py-0.5 rounded-xs border border-line bg-bg-elev text-text-muted hover:text-text"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
        {error && <div className="text-warn text-[10px] mb-1.5">{error}</div>}
        {isContainer(value) ? (
          <Node value={value} depth={0} defaultExpandDepth={defaultExpandDepth} isLast indent={indent} />
        ) : (
          <Leaf value={value} />
        )}
      </div>
    </div>
  )
}
