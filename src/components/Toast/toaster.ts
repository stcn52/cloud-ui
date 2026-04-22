import type { ReactNode } from 'react'
import type { ToastTone } from './Toast'

export interface ToastItem {
  id: string
  tone: ToastTone
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode | boolean
  actions?: ReactNode
  /** ms before auto-dismiss. `Infinity` = sticky. Defaults to 4000. */
  duration: number
  /** Called after the toast leaves the stack. */
  onDismiss?: (id: string) => void
}

export interface ToastOptions {
  title?: ReactNode
  icon?: ReactNode | boolean
  actions?: ReactNode
  duration?: number
  id?: string
  onDismiss?: (id: string) => void
}

type Listener = () => void

class ToastStore {
  private items: ToastItem[] = []
  private listeners = new Set<Listener>()
  private idCounter = 0

  subscribe = (fn: Listener) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  getSnapshot = (): ToastItem[] => this.items

  private emit = () => {
    this.listeners.forEach((fn) => fn())
  }

  add = (tone: ToastTone, description: ReactNode, opts: ToastOptions = {}): string => {
    const id = opts.id ?? `t${++this.idCounter}`
    const existingIdx = this.items.findIndex((i) => i.id === id)
    const item: ToastItem = {
      id,
      tone,
      title: opts.title,
      description,
      icon: opts.icon,
      actions: opts.actions,
      duration: opts.duration ?? 4000,
      onDismiss: opts.onDismiss,
    }
    if (existingIdx >= 0) {
      const next = this.items.slice()
      next[existingIdx] = item
      this.items = next
    } else {
      this.items = [...this.items, item]
    }
    this.emit()
    return id
  }

  dismiss = (id?: string) => {
    if (id === undefined) {
      this.items = []
    } else {
      this.items = this.items.filter((i) => i.id !== id)
    }
    this.emit()
  }
}

const store = new ToastStore()

export const toastSubscribe = store.subscribe
export const toastGetSnapshot = store.getSnapshot

export interface ToastAPI {
  (message: ReactNode, opts?: ToastOptions): string
  success: (message: ReactNode, opts?: ToastOptions) => string
  error: (message: ReactNode, opts?: ToastOptions) => string
  warn: (message: ReactNode, opts?: ToastOptions) => string
  info: (message: ReactNode, opts?: ToastOptions) => string
  message: (message: ReactNode, opts?: ToastOptions) => string
  dismiss: (id?: string) => void
}

const base = (message: ReactNode, opts?: ToastOptions) => store.add('neutral', message, opts)

export const toast: ToastAPI = Object.assign(base, {
  success: (message: ReactNode, opts?: ToastOptions) => store.add('ok', message, opts),
  error:   (message: ReactNode, opts?: ToastOptions) => store.add('err', message, opts),
  warn:    (message: ReactNode, opts?: ToastOptions) => store.add('warn', message, opts),
  info:    (message: ReactNode, opts?: ToastOptions) => store.add('info', message, opts),
  message: (message: ReactNode, opts?: ToastOptions) => store.add('neutral', message, opts),
  dismiss: store.dismiss,
})
