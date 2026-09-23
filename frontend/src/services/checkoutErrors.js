export function describeCheckoutError(error) {
  const message = error?.message || 'Se produjo un error inesperado.';
  const productMatch = message.match(/product(?:_id)?\s*[:#]?\s*(\d+)/i);

  const productId = productMatch ? Number(productMatch[1]) : null;

  if (productId) {
    const isStockError = message.toLowerCase().includes('stock');

    return {
      kind: 'business',
      title: isStockError
        ? 'No hay suficientes unidades disponibles'
        : 'No se pudo completar el pedido con este producto',
      message: isStockError
        ? 'Ajusta la cantidad o quita este artículo y vuelve a intentarlo.'
        : 'Este producto ya no está disponible para la compra.',
      productId,
    };
  }

  if (error?.status === 401) {
    return {
      kind: 'session',
      title: 'Tu sesión necesita atención',
      message,
    };
  }

  if (error?.status === 400) {
    return {
      kind: 'validation',
      title: 'Revisa los datos del pedido',
      message,
    };
  }

  if (error?.status === 404) {
    return {
      kind: 'business',
      title: 'Uno de los productos ya no está disponible',
      message,
    };
  }

  if (error?.status === 0) {
    return {
      kind: 'connection',
      title: 'No se pudo conectar con el servidor',
      message,
    };
  }

  if (error?.status >= 500) {
    return {
      kind: 'server',
      title: 'El servidor no pudo completar el pedido',
      message,
    };
  }

  return {
    kind: 'unexpected',
    title: 'No se pudo confirmar el pedido',
    message,
  };
}
