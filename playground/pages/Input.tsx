import { Affix, Button, Field, Input, InputGroup } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function InputPage() {
  return (
    <>
      <PageHeader
        kicker="02 · Primitives"
        title="Input"
        lede="Text input with three sizes, hover/focus/invalid/disabled states, and composable input groups with left/right affixes."
      />

      <div className="demo">
        <div className="demo-label">Sizes & states</div>
        <div
          className="demo-body"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'start' }}
        >
          <Field label="Default">
            <Input placeholder="linden-labs" />
          </Field>
          <Field label="Small">
            <Input size="sm" placeholder="Filter" />
          </Field>
          <Field label="Large">
            <Input size="lg" placeholder="Project name" />
          </Field>
          <Field label="Disabled">
            <Input defaultValue="locked" disabled />
          </Field>
          <Field label="Error" error="Must be lowercase kebab-case.">
            <Input invalid defaultValue="bad value" />
          </Field>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">With affix & icon</div>
        <div
          className="demo-body"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, alignItems: 'start' }}
        >
          <Field label="Endpoint">
            <InputGroup>
              <Affix>https://</Affix>
              <Input mono defaultValue="api.linden.dev" />
              <Affix side="right">.linden.sh</Affix>
            </InputGroup>
          </Field>
          <Field label="Price cap">
            <InputGroup>
              <Affix>$</Affix>
              <Input mono num defaultValue="25.00" />
              <Affix side="right">USD / mo</Affix>
            </InputGroup>
          </Field>
          <Field label="Search">
            <InputGroup>
              <Affix>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4" />
                </svg>
              </Affix>
              <Input placeholder="Find a service…" />
              <Affix side="right">
                <kbd>⌘K</kbd>
              </Affix>
            </InputGroup>
          </Field>
          <Field label="Secret" hint="Never shown again after you leave this page.">
            <InputGroup>
              <Input mono defaultValue="••••••••••8a71" />
              <Affix side="right">
                <Button size="xs" intent="ghost" style={{ height: 18 }}>
                  reveal
                </Button>
              </Affix>
            </InputGroup>
          </Field>
        </div>
      </div>
    </>
  )
}
