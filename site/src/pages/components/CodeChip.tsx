import { CodeChip, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function CodeChipPage() {
  return (
    <article className="page">
      <h1>CodeChip</h1>
      <p>
        A small inline pill for code-ish fragments — CLI commands, flags, env vars, file paths.
        Monospace, baseline-aligned, with a subtle box so it stands out mid-sentence. Three intents.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Short verbatim tokens inside running text (<code>--region</code>, <code>NODE_ENV=prod</code>,{' '}
        <code>~/.config</code>). For multi-line snippets use a <code>&lt;pre&gt;</code> code block;
        for non-code labels use <code>Badge</code> or <code>Tag</code>.
      </Banner>

      <h2>Inline</h2>
      <p>Drop it anywhere in a sentence — it aligns to the surrounding text baseline.</p>
      <Demo
        code={`<p>
  Run <CodeChip>nextcli deploy</CodeChip> to push the current branch.
  Override the region with <CodeChip>--region us-west-2</CodeChip>,
  or set <CodeChip intent="accent">NEXTCLI_PROFILE=prod</CodeChip> in your shell.
  Config lives at <CodeChip>~/.nextcli/config.toml</CodeChip>.
</p>`}
      >
        <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 620, margin: 0 }}>
          Run <CodeChip>nextcli deploy</CodeChip> to push the current branch. Override the region
          with <CodeChip>--region us-west-2</CodeChip>, or set{' '}
          <CodeChip intent="accent">NEXTCLI_PROFILE=prod</CodeChip> in your shell. Configuration
          lives at <CodeChip>~/.nextcli/config.toml</CodeChip>.
        </p>
      </Demo>

      <h2>Intents</h2>
      <p>
        <code>default</code> is neutral; <code>accent</code> highlights a value worth noticing;{' '}
        <code>err</code> flags something invalid or deprecated.
      </p>
      <Demo
        code={`<CodeChip>default</CodeChip>
<CodeChip intent="accent">accent</CodeChip>
<CodeChip intent="err">err</CodeChip>`}
      >
        <CodeChip>default</CodeChip>
        <CodeChip intent="accent">accent</CodeChip>
        <CodeChip intent="err">err</CodeChip>
      </Demo>

      <h2>CodeChip API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>intent</code></td><td><code>'default' | 'accent' | 'err'</code></td><td><code>'default'</code></td><td>Color role of the chip.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>The code fragment to display.</td></tr>
          <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>Extra classes. Otherwise accepts the standard <code>&lt;span&gt;</code> attributes.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
