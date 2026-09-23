import { apiRequest } from './api.js';

export async function getProducts(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await apiRequest(`/products${query}`);
  if (!Array.isArray(response?.products)) {
    throw new Error('La respuesta del catálogo no tiene el formato esperado.');
  }
  return response.products;
}

export async function getProduct(productId) {
  const response = await apiRequest(
    `/products/${encodeURIComponent(productId)}`,
  );
  if (!response?.product) {
    throw new Error('La respuesta del producto no tiene el formato esperado.');
  }
  return response.product;
}
