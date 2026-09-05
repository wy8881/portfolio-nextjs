'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface CollectionDialogProps {
  collected: number
  total: number
  /**
   * The wall itself, passed as children rather than imported here so it stays a
   * server component — it renders 88 SVG figures and has no interactivity, and
   * pulling it into this client component would ship all of that as JS for nothing.
   */
  children: ReactNode
}

const CollectionDialog = ({ collected, total, children }: CollectionDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    // `showModal()` is imperative — there is no prop that opens a modal dialog — and
    // it throws if the dialog is already open, so both directions are guarded against
    // the DOM's own idea of the current state rather than against React's alone.
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    // Escape closes a native dialog without going through `setOpen`, so state has to
    // follow the DOM here. Without this the trigger silently stops working: React
    // still believes the dialog is open, so clicking it is a no-op.
    const sync = () => setOpen(false)
    dialog.addEventListener('close', sync)
    return () => dialog.removeEventListener('close', sync)
  }, [])

  useEffect(() => {
    if (!open) return
    // `showModal()` makes the page behind inert, but inert does not stop it scrolling
    // — the wheel still moves the body under the mask. Same lock as MobileMenu uses.
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm cursor-pointer transition-opacity hover:opacity-80"
        style={{ background: 'var(--color-artifact)', color: 'var(--color-primary)' }}
      >
        Collection
        <span className="tabular-nums opacity-70">
          {collected}/{total}
        </span>
      </button>

      <dialog
        ref={ref}
        className="collection-dialog"
        aria-label="Constellation collection"
        // The dialog fills the viewport and paints the mask itself, so a click whose
        // target is the dialog — rather than the panel nested inside it — is by
        // definition a click outside the panel, and dismisses it.
        onClick={(event) => {
          if (event.target === ref.current) setOpen(false)
        }}
      >
        <div className="collection-dialog__panel">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close collection"
              className="cursor-pointer p-1 -m-1 transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-secondary)' }}
            >
              <svg
                viewBox="0 0 16 16"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  )
}

export default CollectionDialog
