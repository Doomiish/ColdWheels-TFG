import { apiRequest } from './api.js';

export async function login(credentials) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (!response?.access_token || !response?.user) {
    throw new Error('El servidor devolvió una respuesta de acceso inesperada.');
  }
  return response;
}

export async function register(userData) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (!response?.user)
    throw new Error('El servidor devolvió una respuesta inesperada.');
  return response.user;
}

export async function getCurrentUser(token) {
  const response = await apiRequest('/auth/me', { token });
  if (!response?.user)
    throw new Error('El servidor devolvió una respuesta inesperada.');
  return response.user;
}

export async function updateEmail(token, values) {
  const response = await apiRequest('/auth/change-email', {
    method: 'PATCH',
    token,
    body: JSON.stringify(values),
  });
  if (!response?.user)
    throw new Error('El servidor devolvió una respuesta inesperada.');
  return response.user;
}

export async function updatePassword(token, values) {
  const response = await apiRequest('/auth/change-password', {
    method: 'PATCH',
    token,
    body: JSON.stringify(values),
  });
  if (!response?.user)
    throw new Error('El servidor devolvió una respuesta inesperada.');
  return response.user;
}
