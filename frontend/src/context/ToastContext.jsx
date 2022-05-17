import { createContext, useCallback, useContext, useState } from "react";
import "./ToastContext.css";

const ToastContext = createContext(null);

// simple toast/notification system - call showToast("message") from
// anywhere in the app instead of using the ugly browser alert()
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    // only keep the 3 most recent toasts on screen at once, otherwise
    // doing a bunch of actions quickly stacks up a huge pile of them
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    // auto dismiss after a few seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
