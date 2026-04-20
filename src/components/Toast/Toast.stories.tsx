import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Toast, ToastStack } from './index'

const meta = {
  title: '05 · Overlays/Toast',
  component: Toast,
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

interface Item { id: number; tone: 'neutral' | 'ok' | 'err'; msg: string }

export const Stack: Story = {
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
