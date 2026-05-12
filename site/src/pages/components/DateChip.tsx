import { DateChip, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function DateChipPage() {
  return (
    <article className="page">
      <h1>DateChip</h1>
      <p>
        A button-styled date trigger — a calendar icon, a label, and a chevron. Used in filter bars
        where you want to own the popover yourself; pairs naturally with a <code>DatePicker</code>{' '}
        inside a <code>Popover</code>.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        A compact "open the date picker" affordance in a toolbar or filter row — including both ends of
        a range. For a labelled form field with an inline calendar use <code>DatePickerInput</code>; for
        the calendar surface itself use <code>DatePicker</code>.
      </Banner>

      <h2>Default</h2>
      <p>
        Renders a <code>&lt;button type="button"&gt;</code>; all native button props (<code>onClick</code>,{' '}
        <code>disabled</code>, <code>aria-*</code>, …) pass through, and a <code>ref</code> is forwarded.
      </p>
      <Demo
        code={`<DateChip onClick={openPicker}>May 2, 2026</DateChip>`}
      >
        <DateChip>May 2, 2026</DateChip>
      </Demo>

      <h2>Selected</h2>
      <p>
        Set <code>selected</code> to highlight the active chip with the accent color — e.g. the end of a
        range the user is currently editing.
      </p>
      <Demo
        code={`<DateChip selected>May 14</DateChip>`}
      >
        <DateChip selected>May 14</DateChip>
      </Demo>

      <h2>Range</h2>
      <p>
        Two chips and a separator make a date range; mark the active end with <code>selected</code>.
      </p>
      <Demo
        code={`<DateChip>May 1</DateChip>
<span>→</span>
<DateChip selected>May 14</DateChip>`}
      >
        <DateChip>May 1</DateChip>
        <span style={{ color: 'var(--color-text-dim)' }}>→</span>
        <DateChip selected>May 14</DateChip>
      </Demo>

      <h2>Hiding the icon / caret</h2>
      <p>
        <code>noIcon</code> drops the leading calendar glyph and <code>noCaret</code> drops the trailing
        chevron — useful when the chip shows a time or a plain stamp.
      </p>
      <Demo
        code={`<DateChip noIcon>2026-05-02</DateChip>
<DateChip noCaret>May 2</DateChip>
<DateChip noIcon noCaret>14:32</DateChip>`}
      >
        <DateChip noIcon>2026-05-02</DateChip>
        <DateChip noCaret>May 2</DateChip>
        <DateChip noIcon noCaret>14:32</DateChip>
      </Demo>

      <h2>Sizes</h2>
      <p>
        Two sizes. With no explicit <code>size</code> the chip follows the global <code>ConfigProvider</code>{' '}
        density (<code>compact → sm</code>; everything else → <code>md</code>).
      </p>
      <Demo
        code={`<DateChip size="sm">May 2</DateChip>
<DateChip size="md">May 2</DateChip>`}
      >
        <DateChip size="sm">May 2</DateChip>
        <DateChip size="md">May 2</DateChip>
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<DateChip disabled>May 2, 2026</DateChip>`}
      >
        <DateChip disabled>May 2, 2026</DateChip>
      </Demo>

      <h2>DateChip API</h2>
      <p>Plus all native <code>&lt;button&gt;</code> attributes (<code>onClick</code>, <code>disabled</code>, <code>aria-*</code>, …) and a forwarded <code>ref</code>.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>The label — typically a formatted date string.</td></tr>
          <tr><td><code>selected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Accent treatment for the active chip / range end.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td>—</td><td>Control height. Omit to follow <code>ConfigProvider</code> density.</td></tr>
          <tr><td><code>noIcon</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide the leading calendar icon.</td></tr>
          <tr><td><code>noCaret</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide the trailing chevron.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
