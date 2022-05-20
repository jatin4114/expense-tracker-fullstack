import { createContext, useCallback, useContext, useState } from "react";
import "./ToastContext.css";

const ToastContext = createContext(null);

// simple toast/notification system - call showToast("message") from
// anywhere in the app instead of using the ugly browser alert().
// optionally pass an action ({ label, onClick }) to show a button
// on the toast itself, eg for "undo" after a delete
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", action = null) => {
    const id = Date.now() + Math.random();
    // only keep the 3 most recent toasts on screen at once, otherwise
    // doing a bunch of actions quickly stacks up a huge pile of them
    setToasts((prev) => [...prev.slice(-2), { id, message, type, action }]);
    // auto dismiss after a few seconds (a bit longer if it has an
    // action, so theres actually time to click it)
    setTimeout(
      () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
      action ? 6000 : 4000
    );
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
            {t.action && (
              <button className="toast-action" onClick={t.action.onClick}>
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
