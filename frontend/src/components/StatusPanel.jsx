function StatusPanel({ type = 'info', title, children, action }) {
  return (
    <div
      className={`status-panel status-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {type === 'loading' && (
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      )}
      <div>
        {title && <h2 className="h5 mb-2">{title}</h2>}
        {children && <p className="mb-0">{children}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

export default StatusPanel;
