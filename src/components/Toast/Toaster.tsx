import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Portal } from '../_internal/Portal'
import { Toast, ToastStack, type ToastStackPosition } from './Toast'
import { toast, toastSubscribe, toastGetSnapshot, type ToastItem } from './toaster'

export interface ToasterProps {
  position?: ToastStackPosition
  /** Default auto-dismiss (ms) when a toast omits `duration`. default 4000 */
  duration?: number
  /** Show a bottom progress bar that depletes as the toast ages. default true */
  progress?: boolean
}

const sideAnim: Record<ToastStackPosition, string> = {
  'top-left':     'animate-[toastInLeft_220ms_ease-out]',
  'top-center':   'animate-[toastInTop_220ms_ease-out]',
  'top-right':    'animate-[toastInRight_220ms_ease-out]',
  'bottom-left':  'animate-[toastInLeft_220ms_ease-out]',
  'bottom-center':'animate-[toastInBottom_220ms_ease-out]',
  'bottom-right': 'animate-[toastInRight_220ms_ease-out]',
}

/**
 * Mount once near the app root to enable the imperative `toast()` API.
 * Multiple Toasters are allowed but will each render every toast.
 */
export function Toaster({ position = 'bottom-right', progress = true }: ToasterProps) {
  const items = useSyncExternalStore(toastSubscribe, toastGetSnapshot, toastGetSnapshot)

  return (
    <Portal>
      <ToastStack position={position}>
        {items.map((item) => (
          <ToasterItem
            key={item.id}
            item={item}
            anim={sideAnim[position]}
            progress={progress}
          />
        ))}
      </ToastStack>
    </Portal>
  )
}

interface ToasterItemProps {
  item: ToastItem
  anim: string
  progress: boolean
}

function ToasterItem({ item, anim, progress }: ToasterItemProps) {
  const [leaving, setLeaving] = useState(false)
  const [paused, setPaused] = useState(false)
  const remainingRef = useRef(item.duration)
  const startedAt = useRef<number>(Date.now())
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const dismiss = () => {
    if (leaving) return
    setLeaving(true)
    clearTimer()
    window.setTimeout(() => {
      toast.dismiss(item.id)
      item.onDismiss?.(item.id)
    }, 180)
  }

  useEffect(() => {
    if (!isFinite(item.duration)) return
    startedAt.current = Date.now()
    remainingRef.current = item.duration
    clearTimer()
    timerRef.current = window.setTimeout(dismiss, item.duration)
    return clearTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.duration])

  const onMouseEnter = () => {
    if (!isFinite(item.duration) || paused || leaving) return
    const elapsed = Date.now() - startedAt.current
    remainingRef.current = Math.max(0, remainingRef.current - elapsed)
    clearTimer()
    setPaused(true)
  }

  const onMouseLeave = () => {
    if (!isFinite(item.duration) || !paused || leaving) return
    startedAt.current = Date.now()
    clearTimer()
    timerRef.current = window.setTimeout(dismiss, remainingRef.current)
    setPaused(false)
  }

  const leaveClass = 'animate-[toastOut_180ms_ease-in_forwards]'

  return (
    <div
      className={leaving ? leaveClass : anim}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Toast
        tone={item.tone}
        icon={item.icon}
        title={item.title}
        actions={item.actions}
        onClose={dismiss}
        progressBar={
          progress && isFinite(item.duration) ? (
            <ToastProgress
              duration={item.duration}
              paused={paused}
              tone={item.tone}
            />
          ) : null
        }
      >
        {item.description}
      </Toast>
    </div>
  )
}

function ToastProgress({
  duration,
  paused,
  tone,
}: {
  duration: number
  paused: boolean
  tone: ToastItem['tone']
}) {
  const barColor =
    tone === 'ok' ? 'bg-ok'
    : tone === 'err' ? 'bg-err'
    : tone === 'warn' ? 'bg-warn'
    : tone === 'info' ? 'bg-info'
    : 'bg-line-strong'

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bg-sunk/60 overflow-hidden">
      <div
        className={`h-full ${barColor} origin-left`}
        style={{
          animation: `toastProgress ${duration}ms linear forwards`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      />
    </div>
  )
}
