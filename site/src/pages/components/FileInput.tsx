import { useState } from 'react'
import { FileInput, Table, Banner } from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

function MultipleFileInputDemo() {
  const [files, setFiles] = useState<FileList | null>(null)
  return (
    <FileInput
      multiple
      files={files}
      pickLabel="Add files"
      onChange={(e) => setFiles(e.currentTarget.files)}
    />
  )
}

export default function FileInputPage() {
  return (
    <article className="page">
      <h1>FileInput</h1>
      <p>
        A styled wrapper around <code>&lt;input type="file"&gt;</code> — a button affix plus the
        selected filename. The native input is visually hidden but fully functional, so it works inside
        forms and with the File API exactly as expected.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Letting the user pick a file from disk to attach or upload. For drag-and-drop dropzones or
        upload progress / previews, build on top of this with your own surface — <code>FileInput</code>{' '}
        is just the picker control.
      </Banner>

      <h2>Basic</h2>
      <p>
        Forwards every native <code>&lt;input&gt;</code> prop (<code>accept</code>, <code>multiple</code>,{' '}
        <code>name</code>, <code>onChange</code>, …) and a <code>ref</code> to the underlying element.
        With no file picked it shows <code>emptyLabel</code>.
      </p>
      <Demo
        code={`<FileInput accept="image/*" />`}
      >
        <FileInput accept="image/*" />
      </Demo>

      <h2>With a filename</h2>
      <p>
        Pass <code>fileName</code> to display a label of your choosing — handy when re-rendering an
        already-uploaded file. Override the button text with <code>pickLabel</code>.
      </p>
      <Demo
        code={`<FileInput pickLabel="Replace" fileName="release-v142.tar.gz · 38.4 MB" />`}
      >
        <FileInput pickLabel="Replace" fileName="release-v142.tar.gz · 38.4 MB" />
      </Demo>

      <h2>Multiple files</h2>
      <p>
        With <code>multiple</code> the control shows the chosen file's name, or{' '}
        <code>{'`{n} files`'}</code> when several are selected. Pass <code>files</code> (a{' '}
        <code>FileList</code>) to keep it controlled.
      </p>
      <Demo
        code={`const [files, setFiles] = useState<FileList | null>(null)

<FileInput
  multiple
  files={files}
  pickLabel="Add files"
  onChange={(e) => setFiles(e.currentTarget.files)}
/>`}
      >
        <MultipleFileInputDemo />
      </Demo>

      <h2>Sizes</h2>
      <p>
        Three sizes. With no explicit <code>size</code> it follows the global <code>ConfigProvider</code>{' '}
        density.
      </p>
      <Demo
        code={`<FileInput size="sm" />
<FileInput size="md" />
<FileInput size="lg" />`}
      >
        <FileInput size="sm" />
        <FileInput size="md" />
        <FileInput size="lg" />
      </Demo>

      <h2>Disabled</h2>
      <Demo
        code={`<FileInput disabled fileName="locked-file.zip" />`}
      >
        <FileInput disabled fileName="locked-file.zip" />
      </Demo>

      <h2>FileInput API</h2>
      <p>Plus all native <code>&lt;input type="file"&gt;</code> attributes (<code>accept</code>, <code>multiple</code>, <code>required</code>, <code>name</code>, <code>disabled</code>, <code>onChange</code>, …) and a forwarded <code>ref</code>.</p>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>pickLabel</code></td><td><code>ReactNode</code></td><td><code>'Choose file'</code></td><td>Text inside the button affix.</td></tr>
          <tr><td><code>fileName</code></td><td><code>ReactNode</code></td><td>—</td><td>Filename shown beside the button. When omitted, falls back to the input's own <code>FileList</code>.</td></tr>
          <tr><td><code>emptyLabel</code></td><td><code>ReactNode</code></td><td><code>'No file chosen'</code></td><td>Placeholder shown when nothing is selected.</td></tr>
          <tr><td><code>files</code></td><td><code>FileList | null</code></td><td>—</td><td>Controlled selection — overrides the native <code>FileList</code> for display.</td></tr>
          <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>—</td><td>Control height and text size. Omit to follow <code>ConfigProvider</code> density.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
