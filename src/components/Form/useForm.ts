import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocale } from '../../context/ConfigProvider'
import type { Locale } from '../../locale/en'

/**
 * A sentinel a validator can return *instead* of a final string when it doesn't
 * have its own message — `useForm` resolves it through the active `Locale`'s
 * `form` block. Built-in validators emit this when called without a `msg` arg,
 * which is how locale toggles propagate without per-call boilerplate.
 */
export interface LocalizedFallback {
  readonly __i18n: true
  /** Path inside `Locale['form']`, e.g. `'required'`, `'email.fullwidth'`. */
  key: string
  /** `{name}` placeholders in the resolved string get replaced by `String(vars[name])`. */
  vars?: Record<string, string | number>
}

export type ValidatorResult = string | null | undefined | LocalizedFallback

export type Validator<V, Values> = (
  value: V,
  values: Values,
) => ValidatorResult

export type FieldRules<Values> = {
  [K in keyof Values]?: Validator<Values[K], Values> | Validator<Values[K], Values>[]
}

export interface UseFormOptions<Values extends Record<string, unknown>> {
  /** Initial values for every field. Required so we know the field set up-front. */
  initialValues: Values
  /** Field-level validators. Keyed by field name. */
  rules?: FieldRules<Values>
  /** Optional cross-field validator. Returns `{ field: message }` for any failing fields. */
  validate?: (values: Values) => Partial<Record<keyof Values, string>> | undefined
  /** Called when `submit()` runs and validation passes. */
  onSubmit?: (values: Values) => void | Promise<void>
}

export type FormErrors<Values> = Partial<Record<keyof Values, string>>
export type FormTouched<Values> = Partial<Record<keyof Values, boolean>>

/** Props you can spread onto an input/control to wire it into the form. */
export interface FieldBindings<V> {
  name: string
  value: V
  onChange: (next: V) => void
  onBlur: () => void
  invalid: boolean
  error: string | undefined
}

export interface UseFormReturn<Values extends Record<string, unknown>> {
  values: Values
  errors: FormErrors<Values>
  touched: FormTouched<Values>
  isValid: boolean
  isSubmitting: boolean
  /** Bind a field by name. Spread the result onto a control that takes `value`/`onChange`. */
  field: <K extends keyof Values & string>(name: K) => FieldBindings<Values[K]>
  setValue: <K extends keyof Values>(name: K, value: Values[K]) => void
  setError: <K extends keyof Values>(name: K, error: string | undefined) => void
  setTouched: <K extends keyof Values>(name: K, touched?: boolean) => void
  /** Validate every field. Returns `true` when the form is valid. Marks all fields touched. */
  validateAll: () => boolean
  /** Validate just the named fields (and any cross-field rules touching them). Marks them touched. */
  validateFields: (names: ReadonlyArray<keyof Values>) => boolean
  /** Reset to `initialValues` (or pass new values to reset to those). */
  reset: (next?: Values) => void
  /** Run validation, then `onSubmit` if valid. Use as `<form onSubmit={submit}>`. */
  submit: (e?: { preventDefault?: () => void }) => Promise<void>
}

/** Look up `'a.b.c'` style paths inside the `Locale['form']` tree. */
const lookup = (obj: unknown, path: string): string | undefined => {
  let cur: unknown = obj
  for (const seg of path.split('.')) {
    if (cur && typeof cur === 'object' && seg in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[seg]
    } else {
      return undefined
    }
  }
  return typeof cur === 'string' ? cur : undefined
}

const interpolate = (s: string, vars?: Record<string, string | number>): string => {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

const isFallback = (x: unknown): x is LocalizedFallback =>
  !!x && typeof x === 'object' && (x as { __i18n?: unknown }).__i18n === true

const resolveResult = (
  result: ValidatorResult,
  formMessages: Locale['form'] | undefined,
): string | undefined => {
  if (!result) return undefined
  if (typeof result === 'string') return result
  if (isFallback(result)) {
    const tmpl = formMessages ? lookup(formMessages, result.key) : undefined
    return tmpl ? interpolate(tmpl, result.vars) : `[missing: form.${result.key}]`
  }
  return undefined
}

const runRule = <V, Values>(
  rule: Validator<V, Values> | Validator<V, Values>[] | undefined,
  value: V,
  values: Values,
  formMessages: Locale['form'] | undefined,
): string | undefined => {
  if (!rule) return undefined
  const arr = Array.isArray(rule) ? rule : [rule]
  for (const r of arr) {
    const out = resolveResult(r(value, values), formMessages)
    if (out) return out
  }
  return undefined
}

export function useForm<Values extends Record<string, unknown>>(
  options: UseFormOptions<Values>,
): UseFormReturn<Values> {
  const { initialValues, rules, validate, onSubmit } = options
  // Refs hold the latest snapshot so validators always see fresh values
  // even when several setValue calls happen in the same tick. We also pin
  // `rules`, `validate`, and `onSubmit` to refs so the memoized callbacks
  // returned below always read the latest definitions — important when the
  // caller's closures change (e.g. swapping i18n message factories).
  const initialRef = useRef(initialValues)
  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<FormErrors<Values>>({})
  const [touched, setTouchedState] = useState<FormTouched<Values>>({})
  const [isSubmitting, setSubmitting] = useState(false)

  const valuesRef = useRef(values)
  valuesRef.current = values

  const rulesRef = useRef(rules)
  rulesRef.current = rules
  const validateRef = useRef(validate)
  validateRef.current = validate
  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit

  // Pull the form-message block from the active Locale so built-in validators
  // (which return `LocalizedFallback` sentinels) get translated. We store it in
  // a ref so the memoized validate* callbacks below see toolbar locale changes
  // without needing to be re-created.
  const locale = useLocale()
  const formMessagesRef = useRef<Locale['form'] | undefined>(locale.form)
  formMessagesRef.current = locale.form

  const validateField = useCallback(
    (name: keyof Values, value: unknown, snapshot: Values): string | undefined => {
      const fieldErr = runRule(
        rulesRef.current?.[name] as Validator<unknown, Values> | Validator<unknown, Values>[] | undefined,
        value,
        snapshot,
        formMessagesRef.current,
      )
      if (fieldErr) return fieldErr
      const cross = validateRef.current?.(snapshot)
      return cross?.[name]
    },
    [],
  )

  const setValue = useCallback(
    <K extends keyof Values>(name: K, value: Values[K]) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value }
        valuesRef.current = next
        // Re-validate the field if it has been touched, so errors clear as the user types.
        setErrors((errs) => {
          if (!touched[name]) return errs
          const msg = validateField(name, value, next)
          if (msg === errs[name]) return errs
          const out = { ...errs }
          if (msg) out[name] = msg
          else delete out[name]
          return out
        })
        return next
      })
    },
    [touched, validateField],
  )

  const setError = useCallback(<K extends keyof Values>(name: K, error: string | undefined) => {
    setErrors((errs) => {
      if (error === errs[name]) return errs
      const out = { ...errs }
      if (error) out[name] = error
      else delete out[name]
      return out
    })
  }, [])

  const setTouched = useCallback(
    <K extends keyof Values>(name: K, value: boolean = true) => {
      setTouchedState((t) => (t[name] === value ? t : { ...t, [name]: value }))
      if (value) {
        const v = valuesRef.current[name]
        const msg = validateField(name, v, valuesRef.current)
        setError(name, msg)
      }
    },
    [setError, validateField],
  )

  const validateSubset = useCallback(
    (keys: ReadonlyArray<keyof Values>): boolean => {
      const snapshot = valuesRef.current
      const keySet = new Set(keys)
      let ok = true
      const fieldErrs: FormErrors<Values> = {}
      for (const k of keys) {
        const msg = runRule(
          rulesRef.current?.[k] as Validator<Values[typeof k], Values> | Validator<Values[typeof k], Values>[] | undefined,
          snapshot[k],
          snapshot,
          formMessagesRef.current,
        )
        if (msg) {
          fieldErrs[k] = msg
          ok = false
        }
      }
      const cross = validateRef.current?.(snapshot)
      if (cross) {
        for (const k of Object.keys(cross) as (keyof Values)[]) {
          if (!keySet.has(k)) continue
          const msg = cross[k]
          if (msg) {
            fieldErrs[k] = msg
            ok = false
          }
        }
      }
      // Merge into existing errors: clear stale ones for the validated subset, set new ones.
      setErrors((prev) => {
        const out: FormErrors<Values> = { ...prev }
        for (const k of keys) delete out[k]
        for (const k of Object.keys(fieldErrs) as (keyof Values)[]) out[k] = fieldErrs[k]
        return out
      })
      setTouchedState((t) => {
        const out: FormTouched<Values> = { ...t }
        for (const k of keys) out[k] = true
        return out
      })
      return ok
    },
    [],
  )

  const validateAll = useCallback(
    (): boolean => validateSubset(Object.keys(valuesRef.current) as (keyof Values)[]),
    [validateSubset],
  )

  const validateFields = useCallback(
    (names: ReadonlyArray<keyof Values>): boolean => validateSubset(names),
    [validateSubset],
  )

  const reset = useCallback((next?: Values) => {
    const v = next ?? initialRef.current
    if (next) initialRef.current = next
    setValues(v)
    valuesRef.current = v
    setErrors({})
    setTouchedState({})
    setSubmitting(false)
  }, [])

  const submit = useCallback(
    async (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.()
      if (!validateAll()) return
      const cb = onSubmitRef.current
      if (!cb) return
      try {
        setSubmitting(true)
        await cb(valuesRef.current)
      } finally {
        setSubmitting(false)
      }
    },
    [validateAll],
  )

  const field = useCallback(
    <K extends keyof Values & string>(name: K): FieldBindings<Values[K]> => ({
      name,
      value: values[name],
      onChange: (next: Values[K]) => setValue(name, next),
      onBlur: () => setTouched(name, true),
      invalid: !!errors[name] && !!touched[name],
      error: touched[name] ? errors[name] : undefined,
    }),
    [values, errors, touched, setValue, setTouched],
  )

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    field,
    setValue,
    setError,
    setTouched,
    validateAll,
    validateFields,
    reset,
    submit,
  }
}

/* -------------------------------------------------------------------------- */
/* Built-in validators                                                         */
/*                                                                             */
/* Each `msg` parameter accepts:                                                */
/*   - a plain string                          → used verbatim                  */
/*   - a `(ctx) => string` callback            → your i18n hook                 */
/*   - omitted                                 → falls through to the active    */
/*                                               `Locale['form']` block via a   */
/*                                               `LocalizedFallback` sentinel.  */
/* The third path is what makes the toolbar locale toggle "just work" without   */
/* the caller wiring a translator.                                              */
/* -------------------------------------------------------------------------- */

/** A message that can either be a literal string or computed from context. */
export type MsgArg<Ctx> = string | ((ctx: Ctx) => string)

const fallback = (key: string, vars?: Record<string, string | number>): LocalizedFallback => ({
  __i18n: true,
  key,
  vars,
})

const resolve = <Ctx>(
  msg: MsgArg<Ctx> | undefined,
  fb: LocalizedFallback,
  ctx: Ctx,
): string | LocalizedFallback =>
  typeof msg === 'function' ? msg(ctx) : msg ?? fb

export interface RequiredCtx { value: unknown }
export const required = (msg?: MsgArg<RequiredCtx>): Validator<unknown, unknown> => (v) => {
  const empty =
    v === undefined ||
    v === null ||
    (typeof v === 'string' && v.trim() === '') ||
    (Array.isArray(v) && v.length === 0)
  return empty ? resolve(msg, fallback('required'), { value: v }) : null
}

export interface LengthCtx { value: string | unknown[]; length: number; limit: number }
export const minLength = (n: number, msg?: MsgArg<LengthCtx>): Validator<string | unknown[], unknown> => (v) => {
  if (v == null) return null
  const len = (v as { length: number }).length
  return len < n ? resolve(msg, fallback('minLength', { n }), { value: v, length: len, limit: n }) : null
}

export const maxLength = (n: number, msg?: MsgArg<LengthCtx>): Validator<string | unknown[], unknown> => (v) => {
  if (v == null) return null
  const len = (v as { length: number }).length
  return len > n ? resolve(msg, fallback('maxLength', { n }), { value: v, length: len, limit: n }) : null
}

export interface PatternCtx { value: string; pattern: RegExp }
export const pattern = (re: RegExp, msg?: MsgArg<PatternCtx>): Validator<string, unknown> => (v) => {
  if (!v) return null
  return re.test(v) ? null : resolve(msg, fallback('pattern'), { value: v, pattern: re })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Catches the common IME slip-ups: full-width @ / period and stray whitespace.
const FULLWIDTH_AT  = /＠/
const FULLWIDTH_DOT = /．/
const HAS_SPACE     = /\s/

/** Why an email value was rejected. `'fullwidth'` flags IME artefacts (＠/．), `'whitespace'` flags stray spaces. */
export type EmailReason = 'format' | 'fullwidth' | 'whitespace'
export interface EmailCtx { value: string; reason: EmailReason }

export const email = (msg?: MsgArg<EmailCtx>): Validator<string, unknown> => (v) => {
  if (!v) return null
  const reason: EmailReason | null =
    HAS_SPACE.test(v) ? 'whitespace'
    : FULLWIDTH_AT.test(v) || FULLWIDTH_DOT.test(v) ? 'fullwidth'
    : EMAIL_RE.test(v) ? null
    : 'format'
  if (reason === null) return null
  return resolve(msg, fallback(`email.${reason}`), { value: v, reason })
}
