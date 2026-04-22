import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Toast, ToastStack, Toaster, toast, type ToastStackPosition } from './index'

const meta = {
  title: '05 · Overlays/Toast',
  component: Toast,
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Tones: Story = {
  args: { children: 'Deployed api-gateway@v143' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      <Toast tone="neutral" title="Copied">ak_••••71 copied to clipboard</Toast>
      <Toast tone="ok"      title="Deployed">api-gateway@v143 · 2 regions · 34 s</Toast>
      <Toast tone="info"    title="New version">v1.8.0 is available — reload to update</Toast>
      <Toast tone="warn"    title="High latency">us-east-1 p95 &gt; 400 ms for 5 min</Toast>
      <Toast tone="err"     title="Build failed">test suite · 3 errors in auth-service</Toast>
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Toast
        tone="info"
        title="Update available"
        actions={<Button size="sm">Reload</Button>}
        onClose={() => {}}
      >
        v1.8.0 is ready to install
      </Toast>
      <Toast
        tone="err"
        title="Deploy rejected"
        actions={<Button size="sm" intent="danger">Retry</Button>}
        onClose={() => {}}
      >
        prod-web · guard check failed
      </Toast>
    </div>
  ),
}

interface Item { id: number; tone: 'neutral' | 'ok' | 'err'; msg: string }

export const ManualStack: Story = {
  render: () => {
    const [items, setItems] = useState<Item[]>([
      { id: 1, tone: 'ok', msg: 'Deployed api-gateway@v143' },
      { id: 2, tone: 'neutral', msg: 'API key ak_••••71 copied' },
      { id: 3, tone: 'err', msg: 'Build failed: test suite · 3 errors' },
    ])
    let nextId = items.reduce((m, i) => Math.max(m, i.id), 0) + 1
    const push = (tone: Item['tone'], msg: string) => {
      const id = nextId++
      setItems((arr) => [...arr, { id, tone, msg }])
      setTimeout(() => setItems((arr) => arr.filter((i) => i.id !== id)), 4000)
    }
    const remove = (id: number) => setItems((arr) => arr.filter((i) => i.id !== id))
    return (
      <>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => push('ok', 'Deployed')}>Success</Button>
          <Button onClick={() => push('neutral', 'Copied')}>Neutral</Button>
          <Button intent="danger" onClick={() => push('err', 'Build failed')}>Failure</Button>
        </div>
        <ToastStack>
          {items.map((i) => (
            <Toast key={i.id} tone={i.tone} onClose={() => remove(i.id)}>
              {i.msg}
            </Toast>
          ))}
        </ToastStack>
      </>
    )
  },
}

export const Imperative: Story = {
  render: () => {
    const [position, setPosition] = useState<ToastStackPosition>('bottom-right')
    useEffect(() => () => toast.dismiss(), [])
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button onClick={() => toast.success('Deployed api-gateway@v143', { title: 'Deploy succeeded' })}>
              success
            </Button>
            <Button onClick={() => toast.error('3 errors in auth-service', { title: 'Build failed' })}>
              error
            </Button>
            <Button onClick={() => toast.warn('us-east-1 p95 > 400 ms for 5 min', { title: 'High latency' })}>
              warn
            </Button>
            <Button onClick={() => toast.info('v1.8.0 is available', { title: 'Update ready' })}>
              info
            </Button>
            <Button onClick={() => toast('ak_••••71 copied')}>
              neutral
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              onClick={() =>
                toast.info('Sticky — click × to close', { title: 'Sticky', duration: Infinity })
              }
            >
              sticky
            </Button>
            <Button
              onClick={() =>
                toast.success('Re-using id "deploy" replaces the existing toast', {
                  id: 'deploy',
                  title: `Deploy #${Math.floor(Math.random() * 1000)}`,
                })
              }
            >
              same id (replace)
            </Button>
            <Button onClick={() => toast.dismiss()}>dismiss all</Button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>position:</span>
            {(
              [
                'top-left', 'top-center', 'top-right',
                'bottom-left', 'bottom-center', 'bottom-right',
              ] as ToastStackPosition[]
            ).map((p) => (
              <Button
                key={p}
                size="sm"
                intent={position === p ? 'primary' : 'ghost'}
                onClick={() => setPosition(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Hover any toast to pause its auto-dismiss. The thin bottom bar shows
            remaining time.
          </div>
        </div>
        <Toaster position={position} />
      </>
    )
  },
}
