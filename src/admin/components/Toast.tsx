import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';

type Toast = { id: number; message: string };
const ToastContext = createContext<(message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed bottom-5 right-5 z-[60] flex w-[min(92vw,24rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" className="flex items-start gap-3 rounded-[var(--radius-md)] bg-navy-900 px-4 py-3 text-sm text-white shadow-[var(--shadow-panel)]">
            <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-300" />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} aria-label="Dismiss" className="text-white/60 hover:text-white">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
