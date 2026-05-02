import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileInput } from './index'

const meta = {
  title: '02 · Primitives/File input',
  component: FileInput,
  tags: ['autodocs'],
} satisfies Meta<typeof FileInput>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => <FileInput />,
}

export const Selected: Story = {
  render: () => <FileInput fileName="release-v142.tar.gz · 38.4 MB" />,
}

export const Multiple: Story = {
  render: () => {
    const [files, setFiles] = useState<FileList | null>(null)
    return (
      <FileInput
        multiple
        files={files}
        pickLabel="Add files"
        onChange={(e) => setFiles(e.currentTarget.files)}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => <FileInput disabled fileName="locked-file.zip" />,
}
