import { useEffect } from 'react'

let locks = 0
let prevOverflow = ''

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    if (locks === 0) {
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    locks += 1
    return () => {
      locks -= 1
      if (locks === 0) document.body.style.overflow = prevOverflow
    }
  }, [active])
}
