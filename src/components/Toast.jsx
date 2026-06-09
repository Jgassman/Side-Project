import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { FlameIcon, CloseIcon } from './icons.jsx'

const ToastContext = createContext(null)

let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const scheduleDismiss = useCallback(
    (id, ms) => {
      const existing = timers.current.get(id)
      if (existing) clearTimeout(existing)
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), ms),
      )
    },
    [dismiss],
  )

  // Create a toast. If `loading` is true it stays until updated. Returns the id.
  const addToast = useCallback(
    ({ loading = false, message = '', duration = 6000 }) => {
      const id = ++nextId
      setToasts((prev) => [...prev, { id, loading, message }])
      if (!loading) scheduleDismiss(id, duration)
      return id
    },
    [scheduleDismiss],
  )

  // Replace a loading toast's content and start its auto-dismiss timer.
  const updateToast = useCallback(
    (id, { message, duration = 6000 }) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, loading: false, message } : t)),
      )
      scheduleDismiss(id, duration)
    },
    [scheduleDismiss],
  )

  return (
    <ToastContext.Provider value={{ addToast, updateToast, dismiss }}>
      {children}
      <div className="toast-container" role="region" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="toast-icon" aria-hidden="true">
              <FlameIcon size={18} />
            </span>
            <p className="toast-message">
              {t.loading ? <span className="toast-dots" aria-label="Loading" /> : t.message}
            </p>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
