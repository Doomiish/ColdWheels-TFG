import { useCallback, useEffect, useRef, useState } from 'react';
import ToastContext from './ToastContextValue.js';
import ToastViewport from '../components/ToastViewport.jsx';

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'success') => {
      const id = ++nextId.current;
      setToasts((current) => [...current, { id, message, type }]);
      timers.current.set(
        id,
        window.setTimeout(() => dismiss(id), 4200),
      );
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export default ToastProvider;
