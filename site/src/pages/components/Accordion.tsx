import { useState } from 'react'
import { Accordion, AccordionItem, Badge, Banner, Pill, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function ControlledAccordionDemo() {
  const [open, setOpen] = useState<string | undefined>('a')
  return (
    <div style={{ width: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="text-sm text-text-muted">
        open: <code>{open ?? '(none)'}</code> ·{' '}
        <button className="text-accent-ink underline" onClick={() => setOpen('b')}>open B</button> ·{' '}
        <button className="text-accent-ink underline" onClick={() => setOpen(undefined)}>close all</button>
      </div>
      <Accordion value={open} onValueChange={(v) => setOpen(v as string | undefined)}>
        <AccordionItem value="a" title="Section A">Content A</AccordionItem>
        <AccordionItem value="b" title="Section B">Content B</AccordionItem>
        <AccordionItem value="c" title="Section C" disabled>Disabled — can't open</AccordionItem>
      </Accordion>
    </div>
  )
}

export default function AccordionPage() {
  return (
    <article className="page">
      <h1>Accordion</h1>
      <p>
        Vertically stacked, collapsible sections. <code>type="single"</code> (default) keeps one
        item open at a time; <code>type="multiple"</code> allows several. Each <code>AccordionItem</code>{' '}
        takes a <code>title</code> and an optional right-aligned <code>extra</code> slot for a count
        or status pill. Works controlled (<code>value</code> + <code>onValueChange</code>) or
        uncontrolled (<code>defaultValue</code>).
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Grouping settings or details into expandable sections to keep a long form scannable. For
        switching between mutually-exclusive panels use <code>Tabs</code>; for a single
        show/hide toggle a plain disclosure is lighter.
      </Banner>

      <h2>Single (default)</h2>
      <p>
        Opening an item closes the previously-open one. With <code>collapsible</code> (the default)
        you can also click the open item to collapse everything.
      </p>
      <Demo
        code={`<Accordion defaultValue="basic">
  <AccordionItem value="basic" title="基本信息" extra="5 项">
    配置工作空间名称、描述、地区、配额方案等基础属性。
  </AccordionItem>
  <AccordionItem value="members" title="成员与权限" extra="28 人">
    管理工作空间成员、角色与访问范围。
  </AccordionItem>
  <AccordionItem value="security" title="安全与验收" extra={<Pill tone="warn" size="xs">待配置</Pill>}>
    配置 SSO、审计日志保留期与合规验收项。
  </AccordionItem>
</Accordion>`}
      >
        <div style={{ width: 460 }}>
          <Accordion defaultValue="basic">
            <AccordionItem value="basic" title="基本信息" extra="5 项">
              配置工作空间名称、描述、地区、配额方案等基础属性。
            </AccordionItem>
            <AccordionItem value="members" title="成员与权限" extra="28 人">
              管理工作空间成员、角色与访问范围。
            </AccordionItem>
            <AccordionItem value="security" title="安全与验收" extra={<Pill tone="warn" size="xs">待配置</Pill>}>
              配置 SSO、审计日志保留期与合规验收项。
            </AccordionItem>
          </Accordion>
        </div>
      </Demo>

      <h2>Multiple</h2>
      <p><code>type="multiple"</code> lets several items stay open at once; pass an array for <code>defaultValue</code> / <code>value</code>.</p>
      <Demo
        code={`<Accordion type="multiple" defaultValue={['general', 'notifications']}>
  <AccordionItem value="general" title="General" extra={<Badge count={2} tone="neutral" />}>
    Workspace name, default region, billing contact.
  </AccordionItem>
  <AccordionItem value="notifications" title="Notifications">
    Email digests, Slack integration, on-call escalation rules.
  </AccordionItem>
  <AccordionItem value="advanced" title="Advanced" extra={<Pill tone="err" size="xs">danger zone</Pill>}>
    Transfer ownership, delete workspace.
  </AccordionItem>
</Accordion>`}
      >
        <div style={{ width: 460 }}>
          <Accordion type="multiple" defaultValue={['general', 'notifications']}>
            <AccordionItem value="general" title="General" extra={<Badge count={2} tone="neutral" />}>
              Workspace name, default region, billing contact.
            </AccordionItem>
            <AccordionItem value="notifications" title="Notifications">
              Email digests, Slack integration, on-call escalation rules.
            </AccordionItem>
            <AccordionItem value="advanced" title="Advanced" extra={<Pill tone="err" size="xs">danger zone</Pill>}>
              Transfer ownership, delete workspace.
            </AccordionItem>
          </Accordion>
        </div>
      </Demo>

      <h2>Controlled</h2>
      <p>
        Drive it from your own state with <code>value</code> + <code>onValueChange</code>. In{' '}
        <code>single</code> mode the callback gives a <code>string | undefined</code>; in{' '}
        <code>multiple</code> mode a <code>string[]</code>. Disabled items can't be toggled.
      </p>
      <Demo
        code={`const [open, setOpen] = useState<string | undefined>('a')

<Accordion value={open} onValueChange={(v) => setOpen(v as string | undefined)}>
  <AccordionItem value="a" title="Section A">Content A</AccordionItem>
  <AccordionItem value="b" title="Section B">Content B</AccordionItem>
  <AccordionItem value="c" title="Section C" disabled>Disabled — can't open</AccordionItem>
</Accordion>`}
      >
        <ControlledAccordionDemo />
      </Demo>

      <h2>Accordion API</h2>
      <p>Also accepts native <code>&lt;div&gt;</code> attributes (e.g. <code>className</code>, <code>style</code>).</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>type</code></td><td><code>'single' | 'multiple'</code></td><td><code>'single'</code></td><td><code>single</code> closes the previously-open item; <code>multiple</code> allows several open.</td></tr>
          <tr><td><code>value</code></td><td><code>string | string[]</code></td><td>—</td><td>Controlled open value(s) — a string for <code>single</code>, an array for <code>multiple</code>.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>string | string[]</code></td><td>—</td><td>Uncontrolled initial open value(s).</td></tr>
          <tr><td><code>onValueChange</code></td><td><code>(value: string | string[] | undefined) =&gt; void</code></td><td>—</td><td>Fires with the new open value(s) — <code>string | undefined</code> for <code>single</code>, <code>string[]</code> for <code>multiple</code>.</td></tr>
          <tr><td><code>collapsible</code></td><td><code>boolean</code></td><td><code>true</code></td><td><code>single</code> mode only — allow clicking the open item to close it.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td><code>AccordionItem</code> elements.</td></tr>
        </tbody>
      </Table>

      <h2>AccordionItem API</h2>
      <p>Also accepts native <code>&lt;div&gt;</code> attributes. Must be rendered inside an <code>Accordion</code>.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Identifier matched against the parent's open value(s). Required.</td></tr>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Header label. Required.</td></tr>
          <tr><td><code>extra</code></td><td><code>ReactNode</code></td><td>—</td><td>Right-aligned header content — a count, a <code>Pill</code>, a <code>Badge</code>.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Prevent opening/closing.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Panel content, shown when the item is open.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
