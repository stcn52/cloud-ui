export interface Locale {
  /** Locale identifier (e.g. "en", "zh-CN"). */
  code: string
  pagination: {
    prev: string
    next: string
  }
  commandPalette: {
    placeholder: string
    empty: string
    escape: string
  }
  copyField: {
    copy: string
    copied: string
  }
  dialog: {
    close: string
  }
  drawer: {
    close: string
  }
  banner: {
    dismiss: string
  }
  toast: {
    close: string
  }
  pill: {
    remove: string
  }
  tagInput: {
    /** Aria label template for the tag remove button. `{tag}` is replaced with the tag. */
    removeTag: string
  }
  datePicker: {
    prevMonth: string
    nextMonth: string
  }
  /**
   * Built-in form-validation fallbacks, consumed by `useForm` when a validator
   * is called without an explicit `msg`. Length/pattern entries support `{n}`
   * substitution where applicable.
   */
  form: {
    required: string
    /** `{n}` is replaced with the limit. */
    minLength: string
    /** `{n}` is replaced with the limit. */
    maxLength: string
    pattern: string
    email: {
      format: string
      /** Shown when the value contains full-width `＠` or `．`. */
      fullwidth: string
      whitespace: string
    }
  }
}

export const en: Locale = {
  code: 'en',
  pagination: {
    prev: '‹ Prev',
    next: 'Next ›',
  },
  commandPalette: {
    placeholder: 'Search…',
    empty: 'No results',
    escape: 'esc',
  },
  copyField: {
    copy: 'Copy',
    copied: 'Copied',
  },
  dialog: {
    close: 'Close',
  },
  drawer: {
    close: 'Close',
  },
  banner: {
    dismiss: 'Dismiss',
  },
  toast: {
    close: 'Close',
  },
  pill: {
    remove: 'Remove',
  },
  tagInput: {
    removeTag: 'Remove {tag}',
  },
  datePicker: {
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
  },
  form: {
    required:  'Required',
    minLength: 'Must be at least {n} characters',
    maxLength: 'Must be at most {n} characters',
    pattern:   'Invalid format',
    email: {
      format:     'Invalid email',
      fullwidth:  'Invalid email — looks like a full-width character (＠ or ．). Switch to half-width.',
      whitespace: 'Invalid email — contains spaces.',
    },
  },
}
