import type { ReactNode } from 'react'
import { useState } from 'react'
import { Tabs, Tab, Card } from '@stcn52/cloud-ui'

interface DemoProps {
  code: string
  children: ReactNode
  lang?: string
}

export function Demo({ code, children }: DemoProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  return (
    <Card style={{ padding: 0, overflow: 'hidden', margin: '16px 0' }}>
      <Tabs value={tab} onChange={(v) => setTab(v as 'preview' | 'code')} style={{ paddingLeft: 12 }}>
        <Tab id="preview">Preview</Tab>
        <Tab id="code">Code</Tab>
      </Tabs>
      {tab === 'preview' ? (
        <div
          style={{
            padding: 32,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            minHeight: 80,
          }}
        >
          {children}
        </div>
      ) : (
        <pre style={{ margin: 0, borderRadius: 0, border: 0, borderTop: '1px solid var(--color-line)' }}>
          <code>{code}</code>
        </pre>
      )}
    </Card>
  )
}
