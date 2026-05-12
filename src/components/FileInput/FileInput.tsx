import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useResolvedSize } from '../../context/ConfigProvider'

const fileInputStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-2 pr-3 rounded-sm',
      'border border-line bg-bg-elev cursor-pointer',
      'hover:bg-bg-sunk',
      'has-[input:disabled]:opacity-50 has-[input:disabled]:cursor-not-allowed',
    ],
    pick: [
      'inline-grid place-items-center h-full rounded-l-sm',
      'bg-bg-sunk text-text font-medium',
      'border-r border-line',
    ],
    name: 'text-text truncate max-w-[260px]',
    empty: 'text-text-dim',
    hide: 'sr-only',
  },
  variants: {
    size: {
      sm: { base: 'h-[26px]', pick: 'px-2 text-xs', name: 'text-xs' },
      md: { base: 'h-[30px]', pick: 'px-3 text-sm', name: 'text-sm' },
      lg: { base: 'h-[36px]', pick: 'px-3 text-base', name: 'text-base' },
    },
  },
  defaultVariants: { size: 'md' },
})

type FileInputVariants = VariantProps<typeof fileInputStyles>
export type FileInputSize = NonNullable<FileInputVariants['size']>

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'size'> {
  /** Visible label inside the button affix. default `Choose file`. */
  pickLabel?: ReactNode
  /** Filename(s) shown to the right of the button. Falls back to the FileList from the input. */
  fileName?: ReactNode
  /** Placeholder shown when no file selected. default `No file chosen`. */
  emptyLabel?: ReactNode
  /** Selected files (controlled). When passed, overrides the native FileList. */
  files?: FileList | null
  /** Control size. No explicit value ⇒ follows the global `ConfigProvider` density. */
  size?: FileInputSize
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { pickLabel = 'Choose file', fileName, emptyLabel = 'No file chosen', files, size: sizeProp, className, onChange, ...rest },
  ref,
) {
  const size = useResolvedSize(sizeProp, { compact: 'sm', normal: 'md', comfortable: 'lg' })
  const { base, pick, name, empty, hide } = fileInputStyles({ size })
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
