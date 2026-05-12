import { useState } from 'react'
import { ColorPicker, ColorSwatch, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function PaletteDemo() {
  const [color, setColor] = useState('oklch(0.62 0.16 250)')
  return <ColorPicker value={color} onChange={setColor} />
}

function HexDemo() {
  const [color, setColor] = useState('#3D7BF5')
  return <ColorPicker value={color} onChange={setColor} hex check />
}

function RoundDemo() {
  const [color, setColor] = useState('oklch(0.62 0.16 145)')
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
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
}

function TagPickerDemo() {
  const [color, setColor] = useState('oklch(0.62 0.18 30)')
  return (
    <div style={{ display: 'inline-flex', gap: 6, padding: '8px 10px', border: '1px solid var(--color-line)', borderRadius: 8, background: 'var(--color-bg-elev)' }}>
      <ColorPicker
        value={color}
        onChange={setColor}
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
}

export default function ColorPickerPage() {
  return (
    <article className="page">
      <h1>ColorPicker</h1>
      <p>
        A row of color swatches with an optional hex input — the standard "pick a tag / label / theme
        color" control. Ships <code>ColorPicker</code> (the group) and <code>ColorSwatch</code> (one
        tile) so you can compose either.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Choosing one color from a small curated palette — tag colors, category accents, label colors.
        It is not a full HSV color editor; for that, drop a native <code>&lt;input type="color"&gt;</code>{' '}
        into the <code>trailing</code> slot.
      </Banner>

      <h2>Palette</h2>
      <p>
        Controlled via <code>value</code> + <code>onChange</code>. The selected swatch gets an accent
        ring when its color string exactly matches <code>value</code>. With no <code>colors</code> prop
        it uses the 8-tone brand palette.
      </p>
      <Demo
        code={`const [color, setColor] = useState('oklch(0.62 0.16 250)')

<ColorPicker value={color} onChange={setColor} />`}
      >
        <PaletteDemo />
      </Demo>

      <h2>With hex input</h2>
      <p>
        Set <code>hex</code> to append a hex field; typing a 3- or 6-digit hex and pressing Enter (or
        blurring) calls <code>onChange</code> with <code>#RRGGBB</code>. <code>check</code> draws a
        white tick on the selected swatch (defaults on when <code>hex</code> is shown).
      </p>
      <Demo
        code={`const [color, setColor] = useState('#3D7BF5')

<ColorPicker value={color} onChange={setColor} hex check />`}
      >
        <HexDemo />
      </Demo>

      <h2>Round swatches</h2>
      <p>
        Pass <code>round</code> for circular tiles — a common look for tag color pickers.
      </p>
      <Demo
        code={`<ColorPicker
  value={color}
  onChange={setColor}
  round
  colors={[
    'oklch(0.78 0.10 20)',
    'oklch(0.74 0.13 60)',
    'oklch(0.62 0.16 145)',
    'oklch(0.55 0.18 250)',
    'oklch(0.55 0.18 290)',
  ]}
/>`}
      >
        <RoundDemo />
      </Demo>

      <h2>Trailing slot</h2>
      <p>
        Use <code>trailing</code> for an "add custom color" affordance after the swatches, and{' '}
        <code>swatchSize</code> to enlarge tiles.
      </p>
      <Demo
        code={`<ColorPicker
  value={color}
  onChange={setColor}
  swatchSize="lg"
  check
  colors={[...]}
  trailing={<button aria-label="Add custom color">+</button>}
/>`}
      >
        <TagPickerDemo />
      </Demo>

      <h2>ColorSwatch on its own</h2>
      <p>
        Each tile is a <code>&lt;button&gt;</code>. Use it directly for inline color dots, legends, or
        custom layouts.
      </p>
      <Demo
        code={`<ColorSwatch color="oklch(0.62 0.16 250)" />
<ColorSwatch color="oklch(0.62 0.16 250)" selected />
<ColorSwatch color="oklch(0.62 0.16 250)" selected check />
<ColorSwatch color="oklch(0.62 0.18 30)" shape="round" />
<ColorSwatch color="oklch(0.62 0.16 145)" size="lg" selected check />
<ColorSwatch color="oklch(0.62 0.16 145)" size="sm" />`}
      >
        <ColorSwatch color="oklch(0.62 0.16 250)" />
        <ColorSwatch color="oklch(0.62 0.16 250)" selected />
        <ColorSwatch color="oklch(0.62 0.16 250)" selected check />
        <ColorSwatch color="oklch(0.62 0.18 30)" shape="round" />
        <ColorSwatch color="oklch(0.62 0.16 145)" size="lg" selected check />
        <ColorSwatch color="oklch(0.62 0.16 145)" size="sm" />
      </Demo>

      <h2>ColorPicker API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Selected color. Matches one of <code>colors</code> for the ring to appear. Required.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(color: string) =&gt; void</code></td><td>—</td><td>Fires on swatch click or hex commit.</td></tr>
          <tr><td><code>colors</code></td><td><code>readonly string[]</code></td><td>brand palette</td><td>Any CSS color strings.</td></tr>
          <tr><td><code>round</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render swatches as circles.</td></tr>
          <tr><td><code>swatchSize</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>—</td><td>Tile size. Omit to follow <code>ConfigProvider</code> density.</td></tr>
          <tr><td><code>hex</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Append a hex text input.</td></tr>
          <tr><td><code>check</code></td><td><code>boolean</code></td><td><code>true</code> when <code>hex</code></td><td>White check icon on the selected swatch.</td></tr>
          <tr><td><code>trailing</code></td><td><code>ReactNode</code></td><td>—</td><td>Slot after the swatches — e.g. an "add custom" button.</td></tr>
        </tbody>
      </Table>

      <h2>ColorSwatch API</h2>
      <p>Renders a <code>&lt;button type="button"&gt;</code>; all native button props pass through.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>color</code></td><td><code>string</code></td><td>—</td><td>Any CSS color — applied as <code>background</code>. Required.</td></tr>
          <tr><td><code>selected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Accent ring + scale; sets <code>aria-pressed</code>.</td></tr>
          <tr><td><code>check</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a white check (only when also <code>selected</code>).</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Tile size.</td></tr>
          <tr><td><code>shape</code></td><td><code>'square' | 'round'</code></td><td><code>'square'</code></td><td>Corner style.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Non-interactive, dimmed.</td></tr>
          <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>color</code></td><td>Accessible name; defaults to the color string.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
