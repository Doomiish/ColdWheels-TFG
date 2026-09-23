function ToastViewport({ toasts, dismiss }) {
  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div
          className={`toast show toast-${toast.type}`}
          role={toast.type === 'danger' ? 'alert' : 'status'}
          key={toast.id}
        >
          <div className="toast-header">
            <span className="toast-mark me-2" aria-hidden="true">
              {toast.type === 'danger' ? '!' : '✓'}
            </span>
            <strong className="me-auto">ColdWheels</strong>
            <button
              className="btn-close"
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => dismiss(toast.id)}
            />
          </div>
          <div className="toast-body">{toast.message}</div>
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
