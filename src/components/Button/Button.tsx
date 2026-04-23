import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-1.5 font-medium',
      'border border-line bg-bg-elev text-text shadow-xs',
      'transition-colors duration-[.12s]',
      'hover:bg-bg-sunk',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-xs),var(--shadow-focus)]',
      'disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
    ],
    loadingSpinner: [
      'absolute inset-0 m-auto w-3 h-3 rounded-full',
      'border-[1.5px] border-current border-t-transparent',
      'animate-[spin_0.8s_linear_infinite]',
    ],
  },
  variants: {
    intent: {
      default: {},
      primary: { base: 'bg-accent text-white border-accent hover:bg-accent hover:brightness-[1.06]' },
      danger:  { base: 'bg-err text-white border-err hover:bg-err hover:brightness-[1.06]' },
      ghost:   { base: 'bg-transparent border-transparent shadow-none text-text-muted hover:bg-bg-sunk hover:text-text' },
      subtle:  { base: 'bg-accent-weak text-accent-ink border-transparent hover:bg-accent-weak hover:brightness-[0.98]' },
      outline: { base: 'bg-transparent' },
    },
    size: {
      xs: { base: 'h-5 px-1.5 rounded-xs text-[10.5px]' },
      sm: { base: 'h-6 px-2 rounded-sm text-xs' },
      md: { base: 'h-7 px-3 rounded-sm text-sm' },
      lg: { base: 'h-9 px-4 rounded-md text-md' },
    },
    iconOnly: {
      true:  { base: 'justify-center px-0' },
      false: {},
    },
    loading: {
      true:  { base: 'relative pointer-events-none text-transparent' },
      false: {},
    },
  },
  compoundVariants: [
    { iconOnly: true, size: 'xs', class: { base: 'w-5' } },
    { iconOnly: true, size: 'sm', class: { base: 'w-6' } },
    { iconOnly: true, size: 'md', class: { base: 'w-7' } },
    { iconOnly: true, size: 'lg', class: { base: 'w-9' } },
    { intent: 'primary', loading: true, class: { loadingSpinner: 'text-white' } },
    { intent: 'danger',  loading: true, class: { loadingSpinner: 'text-white' } },
    { intent: 'default', loading: true, class: { loadingSpinner: 'text-accent' } },
    { intent: 'ghost',   loading: true, class: { loadingSpinner: 'text-accent' } },
    { intent: 'subtle',  loading: true, class: { loadingSpinner: 'text-accent' } },
    { intent: 'outline', loading: true, class: { loadingSpinner: 'text-accent' } },
  ],
  defaultVariants: {
    intent: 'default',
    size: 'md',
    iconOnly: false,
    loading: false,
  },
})

type ButtonVariants = VariantProps<typeof buttonStyles>
export type ButtonIntent = NonNullable<ButtonVariants['intent']>
export type ButtonSize = NonNullable<ButtonVariants['size']>

type ButtonOwnProps = {
  intent?: ButtonIntent
  size?: ButtonSize
  loading?: boolean
  iconOnly?: boolean
  children?: ReactNode
  className?: string
}

export type ButtonProps<C extends ElementType = 'button'> = ButtonOwnProps & {
  as?: C
} & Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps | 'as'>

// Preserve original default export as button-element props for backwards compat:
// `ButtonProps` (without generic) still resolves to the button variant.
export type ButtonPropsBase = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>

type PolymorphicButton = <C extends ElementType = 'button'>(
  props: ButtonProps<C> & { ref?: Ref<Element> },
) => ReactElement | null

function ButtonInner<C extends ElementType = 'button'>(
  {
    as,
    intent = 'default',
    size = 'md',
    loading = false,
    iconOnly = false,
    className,
    disabled,
    children,
    ...rest
  }: ButtonProps<C>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? 'button') as ElementType
  const { base, loadingSpinner } = buttonStyles({ intent, size, iconOnly, loading })

  // Only add type="button" default and `disabled` when rendering a native <button>.
  const extra: Record<string, unknown> = {}
  if (Component === 'button') {
    const restTyped = rest as { type?: ButtonHTMLAttributes<HTMLButtonElement>['type'] }
    extra.type = restTyped.type ?? 'button'
    extra.disabled = disabled || loading
  } else if (disabled) {
    // For non-button elements, convey disabled state semantically.
    extra['aria-disabled'] = true
  }

  return (
    <Component
      ref={ref}
      className={base({ class: className })}
      {...extra}
      {...rest}
    >
      {children}
      {loading && <span aria-hidden="true" className={loadingSpinner()} />}
    </Component>
  )
}

export const Button = forwardRef(ButtonInner) as PolymorphicButton & {
  displayName?: string
}
;(Button as { displayName?: string }).displayName = 'Button'
