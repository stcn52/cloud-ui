import { Banner, Table } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function ConfigProviderPage() {
  return (
    <article className="page">
      <h1>ConfigProvider</h1>
      <p>
        Root-level provider for theme, density, and locale. Writes{' '}
        <code>data-theme</code> and <code>data-size</code> attributes that the CSS variable system
        reads to restyle every descendant.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Mount once near the top of your app to set defaults. Not needed for a single-theme,
        English-only app — the library ships with sensible defaults. Do not nest providers unless
        you specifically need a sub-tree with a different theme or locale.
      </Banner>

      <h2>App root</h2>
      <p>
        The most common setup: one provider at the app root, writing to <code>document.body</code>{' '}
        so the page background and scrollbar also pick up the theme.
      </p>
      <Demo
        code={`import { ConfigProvider } from '@stcn52/cloud-ui'

export function App() {
  return (
    <ConfigProvider theme="dark" size="normal" target="body">
      <Routes />
    </ConfigProvider>
  )
}`}
      >
        <Banner tone="info" title="Demo note">
          Live theme swaps require remounting a subtree, so this page shows code only. The site you
          are reading is itself wrapped in a <code>ConfigProvider</code>.
        </Banner>
      </Demo>

      <h2>Scoped subtree</h2>
      <p>
        Use the default <code>target="wrapper"</code> to theme only part of the tree — for example,
        a dark preview pane inside a light app.
      </p>
      <Demo
        code={`<ConfigProvider theme="dark">
  <PreviewPane />
</ConfigProvider>`}
      >
        <Banner tone="neutral" title="Scoped theming">
          The wrapper <code>&lt;div&gt;</code> carries <code>data-theme="dark"</code>, so only its
          descendants flip to the dark palette.
        </Banner>
      </Demo>

      <h2>Locale</h2>
      <p>
        Supply a <code>Locale</code> object to translate built-in strings (close labels, empty
        states, etc.). The library ships <code>en</code> and <code>zhCN</code>.
      </p>
      <Demo
        code={`import { ConfigProvider, zhCN } from '@stcn52/cloud-ui'

<ConfigProvider locale={zhCN}>
  <App />
</ConfigProvider>`}
      >
        <Banner tone="neutral" title="Locale">
          Components that render user-facing strings (Pill remove button, Toaster dismiss, Empty
          state default) read from <code>useLocale()</code>.
        </Banner>
      </Demo>

      <h2>Density</h2>
      <Demo
        code={`<ConfigProvider size="compact">
  <DataTable />
</ConfigProvider>`}
      >
        <Banner tone="neutral" title="Density">
          <code>compact</code> / <code>normal</code> / <code>comfortable</code> sets{' '}
          <code>data-size</code>, which scales control padding across the library.
        </Banner>
      </Demo>

      <h2>API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>theme</code></td><td><code>'light' | 'dark'</code></td><td><code>'light'</code></td><td>Sets <code>data-theme</code> on the wrapper or body.</td></tr>
          <tr><td><code>size</code></td><td><code>'compact' | 'normal' | 'comfortable'</code></td><td><code>'normal'</code></td><td>Global density knob, applied via <code>data-size</code>.</td></tr>
          <tr><td><code>locale</code></td><td><code>Locale</code></td><td><code>en</code></td><td>Locale object consumed by <code>useLocale()</code>. Import <code>zhCN</code> or supply your own.</td></tr>
          <tr><td><code>target</code></td><td><code>'wrapper' | 'body'</code></td><td><code>'wrapper'</code></td><td>Where to write the data attributes. <code>'body'</code> is recommended at the app root.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Your app or subtree.</td></tr>
        </tbody>
      </Table>

      <h2>Hooks</h2>
      <Table>
        <thead>
          <tr><th>Hook</th><th>Returns</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>useConfig()</code></td><td><code>{'{ theme, size, locale }'}</code></td><td>Full config value.</td></tr>
          <tr><td><code>useTheme()</code></td><td><code>'light' | 'dark'</code></td><td>Current theme.</td></tr>
          <tr><td><code>useSize()</code></td><td><code>'compact' | 'normal' | 'comfortable'</code></td><td>Current density.</td></tr>
          <tr><td><code>useLocale()</code></td><td><code>Locale</code></td><td>Current locale — used by library components for built-in strings.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
