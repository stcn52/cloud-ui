import type { NxDensity } from './types'

export interface UiState {
  sort: { key: string; dir: 'asc' | 'desc' } | null
  filters: Record<string, string>
  density: NxDensity
  pageSize: number
  hidden: string[]
  widths: Record<string, number>
  order: string[]
  pins: Record<string, 'left' | 'right' | null>
}

export function loadState(key: string | undefined): Partial<UiState> | null {
  if (!key || typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(`nxtable:${key}`)
    return raw ? (JSON.parse(raw) as Partial<UiState>) : null
  } catch {
    return null
  }
}

export function saveState(key: string | undefined, s: UiState) {
  if (!key || typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(`nxtable:${key}`, JSON.stringify(s))
  } catch {
    /* ignore (quota / private mode) */
  }
}
