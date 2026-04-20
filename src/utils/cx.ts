export type ClassValue = string | number | null | false | undefined | ClassValue[]

export function cx(...inputs: ClassValue[]): string {
  const out: string[] = []
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return
    if (typeof v === 'string' || typeof v === 'number') out.push(String(v))
    else if (Array.isArray(v)) v.forEach(walk)
  }
  inputs.forEach(walk)
  return out.join(' ')
}
