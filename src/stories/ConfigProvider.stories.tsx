import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../components/Button'
import { Pagination } from '../components/Pagination'
import { Pill } from '../components/Pill'
import { ConfigProvider, zhCN } from '../'

const meta: Meta = {
  title: '00 · Overview/ConfigProvider',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wrap your app in `<ConfigProvider>` to share `theme`, `size`, and `locale` with all cloud-ui components. The Storybook toolbar already does this — stories below show the raw API.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function Demo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-bg)' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button intent="primary">Deploy</Button>
        <Button>Cancel</Button>
        <Pill tone="ok" dot>Healthy</Pill>
      </div>
      <Pagination page={2} total={10} onChange={() => {}} />
    </div>
  )
}

export const ZhCNLocale: Story = {
  render: () => (
    <ConfigProvider locale={zhCN}>
      <Demo />
    </ConfigProvider>
  ),
}

export const Compact: Story = {
  render: () => (
    <ConfigProvider size="compact">
      <Demo />
    </ConfigProvider>
  ),
}

export const Comfortable: Story = {
  render: () => (
    <ConfigProvider size="comfortable">
      <Demo />
    </ConfigProvider>
  ),
}

export const DarkCompactChinese: Story = {
  render: () => (
    <ConfigProvider theme="dark" size="compact" locale={zhCN}>
      <Demo />
    </ConfigProvider>
  ),
}
