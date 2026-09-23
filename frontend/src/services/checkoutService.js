import { apiRequest } from './api.js';

export async function submitCheckout({ token, currency, items, guest }) {
  const payload = {
    currency,
    items: items.map(({ product_id, quantity }) => ({ product_id, quantity })),
    payment: { simulated_result: 'approved' },
  };
  const endpoint = guest ? '/checkout/guest' : '/checkout/authenticated';
  if (guest) payload.guest = guest;

  const response = await apiRequest(endpoint, {
    method: 'POST',
    token: guest ? undefined : token,
    body: JSON.stringify(payload),
  });
  if (!response?.sale || !Array.isArray(response.sale.items)) {
    throw new Error('El servidor confirmó una respuesta de pedido inesperada.');
  }
  return response.sale;
}
