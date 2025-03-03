import * as React from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    ({ title, description, action }: Omit<Toast, "id">) => {
      setToasts((currentToasts) => [
        ...currentToasts,
        { id: Math.random().toString(), title, description, action },
      ]);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setToasts((currentToasts) => {
        const now = Date.now();
        return currentToasts.filter((toast) => {
          const createdAt = parseInt(toast.id.split("-")[1] || "0");
          return now - createdAt < 5000; // Remove toasts after 5 seconds
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between"
            role="alert"
          >
            <div>
              {toast.title && (
                <div className="font-semibold">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-sm text-gray-300">{toast.description}</div>
              )}
            </div>
            {toast.action}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  };
}