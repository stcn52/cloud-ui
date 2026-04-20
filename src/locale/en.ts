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
}
