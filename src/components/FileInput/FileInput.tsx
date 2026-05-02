import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

const fileInputStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-2',
      'h-[30px] pr-3 rounded-sm',
      'border border-line bg-bg-elev cursor-pointer',
      'hover:bg-bg-sunk',
      'has-[input:disabled]:opacity-50 has-[input:disabled]:cursor-not-allowed',
    ],
    pick: [
      'inline-grid place-items-center px-3 h-full rounded-l-sm',
      'bg-bg-sunk text-text font-medium text-sm',
      'border-r border-line',
    ],
    name: 'text-sm text-text truncate max-w-[260px]',
    empty: 'text-text-dim',
    hide: 'sr-only',
  },
})

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'size'> {
  /** Visible label inside the button affix. default `Choose file`. */
  pickLabel?: ReactNode
  /** Filename(s) shown to the right of the button. Falls back to the FileList from the input. */
  fileName?: ReactNode
  /** Placeholder shown when no file selected. default `No file chosen`. */
  emptyLabel?: ReactNode
  /** Selected files (controlled). When passed, overrides the native FileList. */
  files?: FileList | null
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { pickLabel = 'Choose file', fileName, emptyLabel = 'No file chosen', files, className, onChange, ...rest },
  ref,
) {
  const { base, pick, name, empty, hide } = fileInputStyles()
  const native = files ?? (rest as { value?: FileList }).value
  const list = native instanceof FileList ? native : null
  const display: ReactNode =
    fileName !== undefined
      ? fileName
      : list && list.length > 0
      ? list.length === 1
        ? list[0].name
        : `${list.length} files`
      : null

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
  }

  return (
    <label className={base({ class: className })}>
      <span className={pick()}>{pickLabel}</span>
      <span className={display ? name() : `${name()} ${empty()}`}>
        {display ?? emptyLabel}
      </span>
      <input ref={ref} type="file" className={hide()} onChange={handleChange} {...rest} />
    </label>
  )
})
