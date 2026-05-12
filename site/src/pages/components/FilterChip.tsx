import { Banner, FilterBar, FilterChip, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const errIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12" y2="16" />
  </svg>
)

export default function FilterChipPage() {
  return (
    <article className="page">
      <h1>FilterChip</h1>
      <p>
        The visual token for "one filter" in a list-page toolbar. A chip can be an{' '}
        <code>add</code> trigger (dashed), an idle key, an <code>active</code> key + value with a
        remove ×, a labelled <code>count</code>, or an <code>invalid</code> error state. Lay them
        out in a <code>FilterBar</code> — a wrapping <code>role="toolbar"</code> strip.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Displaying and editing the active filter set above a table or list. For a single segmented
        toggle use <code>Segmented</code>; for free-text token entry use <code>TagInput</code>.
        Pair with <code>SavedViews</code> for named filter presets.
      </Banner>

      <h2>Variants</h2>
      <p>
        <code>filterKey</code> renders in a dim colour, <code>value</code> in a strong one — together
        they read like <code>env: prod</code>. Pass <code>onRemove</code> to get the <code>×</code>{' '}
        button.
      </p>
      <Demo
        code={`<FilterBar>
  <FilterChip variant="add">+ Filter</FilterChip>
  <FilterChip>env</FilterChip>
  <FilterChip variant="active" filterKey="env:"    value="prod"            onRemove={() => {}} />
  <FilterChip variant="active" filterKey="status:" value="running"         onRemove={() => {}} />
  <FilterChip variant="active" filterKey="region:" value="us-east-1 +1"    onRemove={() => {}} />
  <FilterChip count={14}>Active</FilterChip>
  <FilterChip variant="active" count={2}>Failed</FilterChip>
</FilterBar>`}
      >
        <FilterBar>
          <FilterChip variant="add">+ Filter</FilterChip>
          <FilterChip>env</FilterChip>
          <FilterChip variant="active" filterKey="env:" value="prod" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="status:" value="running" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="region:" value="us-east-1 +1" onRemove={() => {}} />
          <FilterChip count={14}>Active</FilterChip>
          <FilterChip variant="active" count={2}>Failed</FilterChip>
        </FilterBar>
      </Demo>

      <h2>Operators</h2>
      <p>
        For numeric and date filters, fold the operator (<code>{'>='}</code>, <code>in</code>,{' '}
        <code>{'<'}</code>, <code>~</code>) into <code>filterKey</code> and put the literal on the
        right.
      </p>
      <Demo
        code={`<FilterBar>
  <FilterChip variant="active" filterKey="cpu >="   value="80 %"          onRemove={() => {}} />
  <FilterChip variant="active" filterKey="mem in"   value="[40, 90]"       onRemove={() => {}} />
  <FilterChip variant="active" filterKey="latency <" value="120 ms"        onRemove={() => {}} />
  <FilterChip variant="active" filterKey="tag has"  value="team:platform" onRemove={() => {}} />
  <FilterChip variant="active" filterKey="created >" value="last 7 d"      onRemove={() => {}} />
  <FilterChip variant="active" filterKey="name ~"   value="api-*"          onRemove={() => {}} />
</FilterBar>`}
      >
        <FilterBar>
          <FilterChip variant="active" filterKey="cpu >=" value="80 %" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="mem in" value="[40, 90]" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="latency <" value="120 ms" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="tag has" value="team:platform" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="created >" value="last 7 d" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="name ~" value="api-*" onRemove={() => {}} />
        </FilterBar>
      </Demo>

      <h2>States</h2>
      <p>
        <code>disabled</code> for a filter the user can't edit, <code>variant="invalid"</code> for
        bad syntax (prepend a warning icon via <code>children</code>), and the standard{' '}
        <code>active</code> chip.
      </p>
      <Demo
        code={`<FilterBar>
  <FilterChip disabled filterKey="env:" value="staging" onRemove={() => {}} />
  <FilterChip variant="active" filterKey="team:" value="platform" onRemove={() => {}} />
  <FilterChip variant="invalid" filterKey="cost" value="invalid syntax" onRemove={() => {}}>
    <ErrIcon />
  </FilterChip>
</FilterBar>`}
      >
        <FilterBar>
          <FilterChip disabled filterKey="env:" value="staging" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="team:" value="platform" onRemove={() => {}} />
          <FilterChip variant="invalid" filterKey="cost" value="invalid syntax" onRemove={() => {}}>
            {errIcon}
          </FilterChip>
        </FilterBar>
      </Demo>

      <h2>Toolbar layout</h2>
      <p>
        <code>FilterBar</code> is just a wrapping flex row — drop in chips, a spacer, and trailing
        actions.
      </p>
      <Demo
        code={`<FilterBar style={{ padding: 8, border: '1px solid var(--color-line)', borderRadius: 8 }}>
  <FilterChip variant="active" filterKey="env:"    value="prod"      onRemove={() => {}} />
  <FilterChip variant="active" filterKey="status:" value="running"   onRemove={() => {}} />
  <FilterChip variant="active" filterKey="region:" value="us-east-1" onRemove={() => {}} />
  <FilterChip variant="add">+ Filter</FilterChip>
  <span style={{ flex: 1 }} />
  <button>Clear all</button>
  <button>Save view</button>
</FilterBar>`}
      >
        <FilterBar style={{ padding: 8, border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-panel)' }}>
          <FilterChip variant="active" filterKey="env:" value="prod" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="status:" value="running" onRemove={() => {}} />
          <FilterChip variant="active" filterKey="region:" value="us-east-1" onRemove={() => {}} />
          <FilterChip variant="add">+ Filter</FilterChip>
          <span style={{ flex: 1 }} />
          <button className="text-xs px-2 py-0.5 rounded-xs text-text-dim cursor-pointer bg-transparent border-0 hover:text-text">Clear all</button>
          <button className="text-xs px-2 py-0.5 rounded-xs cursor-pointer border border-line bg-bg-elev text-text-muted hover:bg-bg-sunk">Save view</button>
        </FilterBar>
      </Demo>

      <h2>FilterChip API</h2>
      <p>Also accepts all native <code>&lt;button&gt;</code> attributes (e.g. <code>onClick</code>, <code>disabled</code>).</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>variant</code></td><td><code>'plain' | 'active' | 'add' | 'invalid'</code></td><td><code>'plain'</code></td><td>Visual role. <code>add</code> is dashed; <code>active</code> is accent-tinted; <code>invalid</code> is the error state.</td></tr>
          <tr><td><code>filterKey</code></td><td><code>ReactNode</code></td><td>—</td><td>The filter key (or key + operator), shown dimmed before the value.</td></tr>
          <tr><td><code>value</code></td><td><code>ReactNode</code></td><td>—</td><td>The filter value, shown in strong colour.</td></tr>
          <tr><td><code>count</code></td><td><code>ReactNode</code></td><td>—</td><td>Numeric badge rendered after the label.</td></tr>
          <tr><td><code>onRemove</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>When set, renders a <code>×</code> button; click fires this (and stops propagation).</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Free-form content rendered first — handy for a leading icon.</td></tr>
        </tbody>
      </Table>

      <h2>FilterBar API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Chips, spacers, action buttons. Wraps onto multiple lines.</td></tr>
          <tr><td colSpan={4}>Plus all native <code>&lt;div&gt;</code> attributes (<code>className</code>, <code>style</code>, …). Renders <code>role="toolbar"</code>.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
