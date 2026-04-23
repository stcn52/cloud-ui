import { Button, Pill, Kbd, Card, CopyField, Banner, Kpi, Toast } from '@stcn52/cloud-ui'
import { useNavigate, Link } from 'react-router-dom'
import { LIB_VERSION_TAG } from '../lib/version'

const features = [
  {
    title: 'Tailwind v4 native',
    body: 'All tokens live in @theme; every component class is a utility via tailwind-variants. Zero runtime styling.',
  },
  {
    title: 'Density-aware',
    body: '[data-size="compact" | "normal" | "comfortable"] rescales spacing, type, and control sizes across all 37 components.',
  },
  {
    title: 'Dark by design',
    body: 'A single [data-theme="dark"] flip swaps the oklch palette. No per-component overrides, no double stylesheets.',
  },
  {
    title: 'Locale built-in',
    body: 'Bundled en + zh-CN. Components read their default strings from the active locale.',
  },
]

export function Home() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          padding: '80px 24px 56px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          <Pill tone="info">{LIB_VERSION_TAG}</Pill>
          <Pill tone="neutral">37 components</Pill>
          <Pill tone="ok">MIT</Pill>
        </div>

        <h1
          style={{
            fontSize: 56,
            lineHeight: 1.05,
            margin: '0 0 20px',
            letterSpacing: '-0.025em',
            fontWeight: 700,
          }}
        >
          A calm, dense React UI kit.
        </h1>
        <p
          style={{
            fontSize: 18,
            maxWidth: 620,
            margin: '0 auto 28px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.55,
          }}
        >
          37 components. Three density modes. Light and dark themes. Locale-aware. Shipped with a
          single CSS file and zero styling config.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          <Button intent="primary" size="lg" onClick={() => navigate('/docs/installation')}>
            Get Started
          </Button>
          <Button intent="outline" size="lg" onClick={() => navigate('/components')}>
            Browse components
          </Button>
        </div>

        <div style={{ display: 'inline-block' }}>
          <CopyField value="pnpm add @stcn52/cloud-ui">pnpm add @stcn52/cloud-ui</CopyField>
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--color-text-dim)' }}>
          Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search the docs.
        </div>
      </section>

      {/* Stats strip */}
      <section
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          padding: '0 24px 56px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        <Kpi label="Components" value="37" />
        <Kpi label="CSS (gzip)" value="9 kB" />
        <Kpi label="JS (gzip)" value="36 kB" />
        <Kpi label="Peer deps" value="React 18" />
      </section>

      {/* What's new */}
      <section style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px 32px' }}>
        <Banner tone="info" title="New in 0.3.0">
          Imperative <code>toast()</code> API with hover-pause, progress bar, 5 tones, and
          `Toaster` component.{' '}
          <Link to="/components/toast" style={{ color: 'var(--color-accent)' }}>Read more →</Link>
        </Banner>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          padding: '24px 24px 40px',
        }}
      >
        <h2 style={{ margin: '0 0 8px' }}>Why @stcn52/cloud-ui</h2>
        <p style={{ marginBottom: 20 }}>Designed for consoles, dashboards, and data apps that need calm UI on dense screens.</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 12,
          }}
        >
          {features.map((f) => (
            <Card key={f.title} style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 13 }}>{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Showcase: three real toasts rendered inline */}
      <section
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          padding: '24px 24px 64px',
        }}
      >
        <h2>A taste of what's inside</h2>
        <p>Every component below is real — rendered at build time with its default props.</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 12,
            marginTop: 16,
          }}
        >
          <Toast tone="ok"   title="Deployed">api-gateway@v143 · 2 regions</Toast>
          <Toast tone="warn" title="High latency">us-east-1 p95 &gt; 400 ms</Toast>
          <Toast tone="err"  title="Build failed">3 errors in auth-service</Toast>
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button intent="outline" onClick={() => navigate('/components')}>
            See all 37 components →
          </Button>
        </div>
      </section>
    </div>
  )
}
