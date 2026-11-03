import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Native <dialog> modal: focus trapping, Esc to close and backdrop handled by the browser. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className="m-auto w-[min(92vw,34rem)] rounded-[var(--radius-lg)] p-0 text-ink shadow-[var(--shadow-panel)] backdrop:bg-navy-950/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-rule px-6 py-4">
        <h2 id="modal-title" className="text-h3">
          {title}
        </h2>
        <button onClick={onClose} className="rounded p-1 text-muted hover:bg-mist hover:text-navy-900" aria-label="Close">
          <X className="size-5" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}
