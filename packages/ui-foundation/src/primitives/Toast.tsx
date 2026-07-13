import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastEntry {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  durationMs?: number;
}

export interface ToastContextValue {
  toasts: ToastEntry[];
  push: (toast: Omit<ToastEntry, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;
const nextId = () => {
  counter += 1;
  return `toast-${counter}`;
};

export interface ToastProviderProps {
  children: ReactNode;
  defaultDurationMs?: number;
}

export const ToastProvider = ({
  children,
  defaultDurationMs = 5000
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback<ToastContextValue["push"]>(
    (toast) => {
      const id = toast.id ?? nextId();
      const duration = toast.durationMs ?? defaultDurationMs;
      const entry: ToastEntry = {
        id,
        title: toast.title,
        description: toast.description,
        tone: toast.tone ?? "info",
        durationMs: duration
      };
      setToasts((current) => [...current, entry]);
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [defaultDurationMs, dismiss]
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    },
    []
  );

  const value = useMemo(
    () => ({ toasts, push, dismiss }),
    [toasts, push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastRegionProps {
  toasts: ToastEntry[];
  onDismiss: (id: string) => void;
}

const ToastRegion = ({ toasts, onDismiss }: ToastRegionProps) => (
  <div
    className="nh-toast-region"
    role="region"
    aria-label="Notifications"
    aria-live="polite"
  >
    {toasts.map((toast) => (
      <div
        key={toast.id}
        role={toast.tone === "danger" ? "alert" : "status"}
        className={`nh-toast nh-toast--${toast.tone ?? "info"}`}
        data-tone={toast.tone ?? "info"}
      >
        <div className="nh-toast__body">
          <strong className="nh-toast__title">{toast.title}</strong>
          {toast.description ? (
            <p className="nh-toast__description">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="nh-toast__dismiss"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(toast.id)}
        >
          ×
        </button>
      </div>
    ))}
  </div>
);
