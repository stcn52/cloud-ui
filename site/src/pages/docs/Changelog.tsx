import { marked } from 'marked'
import { Banner, Pill } from '@stcn52/cloud-ui'
import changelogMarkdown from '../../../../CHANGELOG.md?raw'
import { LIB_VERSION_TAG } from '../../lib/version'

const html = marked.parse(changelogMarkdown as string, {
  async: false,
  gfm: true,
  breaks: false,
}) as string

export default function ChangelogPage() {
  return (
    <article className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>Changelog</h1>
        <Pill tone="info">{LIB_VERSION_TAG}</Pill>
      </div>

      <Banner tone="neutral" title="Versioning policy" style={{ margin: '16px 0 24px' }}>
        Breaking renames only happen at major bumps. Additive features ship in minors.
        Patches are bug fixes only. See below for the full history.
      </Banner>

      <div
        className="changelog"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
