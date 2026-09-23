import { useState } from 'react';
import useAuth from '../contexts/useAuth.js';
import useToast from '../contexts/useToast.js';

function SettingsPage() {
  const { changeEmail, changePassword, user } = useAuth();
  const { notify } = useToast();
  const [emailForm, setEmailForm] = useState({
    current_password: '',
    new_email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
  });
  const [emailState, setEmailState] = useState({
    loading: false,
    error: '',
    success: '',
  });
  const [passwordState, setPasswordState] = useState({
    loading: false,
    error: '',
    success: '',
  });

  async function submitEmail(event) {
    event.preventDefault();
    setEmailState({ loading: true, error: '', success: '' });
    try {
      await changeEmail({
        ...emailForm,
        new_email: emailForm.new_email.trim(),
      });
      setEmailForm({ current_password: '', new_email: '' });
      setEmailState({ loading: false, error: '' });
      notify('Email actualizado correctamente.');
    } catch (error) {
      setEmailState({ loading: false, error: error.message, success: '' });
    }
  }

  async function submitPassword(event) {
    event.preventDefault();
    setPasswordState({ loading: true, error: '', success: '' });
    try {
      await changePassword(passwordForm);
      setPasswordForm({ current_password: '', new_password: '' });
      setPasswordState({ loading: false, error: '' });
      notify('Contraseña actualizada correctamente.');
    } catch (error) {
      setPasswordState({ loading: false, error: error.message, success: '' });
    }
  }

  return (
    <main className="container page-section">
      <p className="eyebrow text-secondary">COLDWHEELS / CUENTA</p>
      <h1 className="page-title mb-2">Ajustes</h1>
      <p className="text-secondary mb-4">Sesión de {user.email}</p>
      <div className="settings-grid">
        <section className="settings-card">
          <p className="eyebrow text-secondary">IDENTIFICACIÓN</p>
          <h2 className="h4">Cambiar email</h2>
          <p className="text-secondary">
            Confirma tu contraseña actual para guardar el nuevo email.
          </p>
          {emailState.error && (
            <div className="alert alert-danger" role="alert">
              {emailState.error}
            </div>
          )}
          <form onSubmit={submitEmail}>
            <div className="mb-3">
              <label
                className="form-label"
                htmlFor="settings-current-email-password"
              >
                Contraseña actual
              </label>
              <input
                className="form-control"
                id="settings-current-email-password"
                type="password"
                autoComplete="current-password"
                required
                value={emailForm.current_password}
                onChange={(event) =>
                  setEmailForm((form) => ({
                    ...form,
                    current_password: event.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="settings-new-email">
                Nuevo email
              </label>
              <input
                className="form-control"
                id="settings-new-email"
                type="email"
                autoComplete="email"
                required
                value={emailForm.new_email}
                onChange={(event) =>
                  setEmailForm((form) => ({
                    ...form,
                    new_email: event.target.value,
                  }))
                }
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={emailState.loading}
            >
              {emailState.loading ? 'Guardando…' : 'Actualizar email'}
            </button>
          </form>
        </section>
        <section className="settings-card">
          <p className="eyebrow text-secondary">SEGURIDAD</p>
          <h2 className="h4">Cambiar contraseña</h2>
          <p className="text-secondary">
            Elige una contraseña nueva de al menos 8 caracteres.
          </p>
          {passwordState.error && (
            <div className="alert alert-danger" role="alert">
              {passwordState.error}
            </div>
          )}
          <form onSubmit={submitPassword}>
            <div className="mb-3">
              <label className="form-label" htmlFor="settings-current-password">
                Contraseña actual
              </label>
              <input
                className="form-control"
                id="settings-current-password"
                type="password"
                autoComplete="current-password"
                required
                value={passwordForm.current_password}
                onChange={(event) =>
                  setPasswordForm((form) => ({
                    ...form,
                    current_password: event.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="settings-new-password">
                Nueva contraseña
              </label>
              <input
                className="form-control"
                id="settings-new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={passwordForm.new_password}
                onChange={(event) =>
                  setPasswordForm((form) => ({
                    ...form,
                    new_password: event.target.value,
                  }))
                }
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={passwordState.loading}
            >
              {passwordState.loading ? 'Guardando…' : 'Actualizar contraseña'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default SettingsPage;
