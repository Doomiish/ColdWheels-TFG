const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(
  /\/$/,
  '',
);

export class ApiError extends Error {
  constructor(message, { status = 0, payload = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch (error) {
    throw new ApiError(
      'No se pudo conectar con el servidor. Comprueba que está disponible.',
      {
        payload: error,
      },
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    if (response.ok) {
      throw new ApiError('El servidor devolvió una respuesta inesperada.', {
        status: response.status,
      });
    }
  }

  if (!response.ok) {
    throw new ApiError(payload?.error || 'No se pudo completar la solicitud.', {
      status: response.status,
      payload,
    });
  }

  return payload;
}
