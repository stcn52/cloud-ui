import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorPicker, ColorSwatch } from './index'

const meta = {
  title: '02 · Primitives/Color picker',
  component: ColorPicker,
  tags: ['autodocs'],
  args: { value: 'oklch(0.62 0.16 250)' },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const SwatchGroup: Story = {
  render: () => {
    const [c, setC] = useState('oklch(0.62 0.16 250)')
    return <ColorPicker value={c} onChange={setC} />
  },
}

export const WithHex: Story = {
  render: () => {
    const [c, setC] = useState('#3D7BF5')
    return <ColorPicker value={c} onChange={setC} hex check />
  },
}

export const Round: Story = {
  parameters: {
    docs: { description: { story: 'Round swatches with overlap — used for tag colors / category palettes.' } },
  },
  render: () => {
    const [c, setC] = useState('oklch(0.62 0.16 145)')
    return (
      <ColorPicker
        value={c}
        onChange={setC}
        round
        colors={[
          'oklch(0.78 0.10 20)',
          'oklch(0.74 0.13 60)',
          'oklch(0.62 0.16 145)',
          'oklch(0.55 0.18 250)',
          'oklch(0.55 0.18 290)',
        ]}
      />
    )
  },
}

export const TagPicker: Story = {
  parameters: {
    docs: { description: { story: 'Large swatches with a check mark, plus a trailing "+" for "add custom" — the standard tag color editor.' } },
  },
  render: () => {
    const [c, setC] = useState('oklch(0.62 0.18 30)')
    return (
      <div style={{ display: 'inline-flex', gap: 6, padding: '8px 10px', border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-bg-elev)' }}>
        <ColorPicker
          value={c}
          onChange={setC}
          swatchSize="lg"
          check
          colors={[
            'oklch(0.62 0.18 30)',
            'oklch(0.65 0.16 60)',
            'oklch(0.62 0.16 145)',
            'oklch(0.55 0.18 250)',
            'oklch(0.55 0.18 290)',
            'oklch(0.62 0.16 320)',
          ]}
          trailing={
            <button
              type="button"
              className="inline-grid place-items-center w-7 h-7 rounded-xs border border-dashed border-line-strong text-text-dim text-base cursor-pointer hover:text-text"
              aria-label="Add custom color"
            >
              +
            </button>
          }
        />
      </div>
    )
  },
}

export const SingleSwatch: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ColorSwatch color="oklch(0.62 0.16 250)" />
      <ColorSwatch color="oklch(0.62 0.16 250)" selected />
      <ColorSwatch color="oklch(0.62 0.16 250)" selected check />
      <ColorSwatch color="oklch(0.62 0.18 30)" shape="round" />
      <ColorSwatch color="oklch(0.62 0.16 145)" size="lg" selected check />
      <ColorSwatch color="oklch(0.62 0.16 145)" size="sm" />
    </div>
  ),
}
