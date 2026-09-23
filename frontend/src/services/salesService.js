import { apiRequest } from './api.js';

export async function getMySales(token) {
  const response = await apiRequest('/sales/me', { token });
  if (!Array.isArray(response?.sales)) {
    throw new Error('La respuesta de pedidos no tiene el formato esperado.');
  }
  return response.sales;
}
