import { CheckCircle2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type ToastDetail = { message: string; tone?: 'success' | 'info' }

let emitToast: ((detail: ToastDetail) => void) | null = null

export function showToast(message: string, tone: ToastDetail['tone'] = 'success') {
  emitToast?.({ message, tone })
}

export default function Toast() {
  const [toast, setToast] = useState<ToastDetail | null>(null)

  useEffect(() => {
    emitToast = setToast
    return () => { emitToast = null }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (!toast) return null

  return (
    <div className={`app-toast app-toast-${toast.tone || 'success'}`} role="status" aria-live="polite">
      <CheckCircle2 size={18} />
      <span>{toast.message}</span>
      <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" title="Dismiss">
        <X size={15} />
      </button>
    </div>
  )
}
