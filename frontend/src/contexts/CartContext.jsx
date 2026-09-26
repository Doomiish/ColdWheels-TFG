import { useEffect, useState } from 'react';
import CartContext from './CartContextValue.js';

const CART_KEY = 'coldwheels.cart';
const MAX_ITEM_QUANTITY = 5;

function readCart() {
  try {
    const stored = sessionStorage.getItem(CART_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    if (!product.available || product.stock < 1) {
      return {
        ok: false,
        message: `${product.brand} ${product.model} no está disponible.`,
      };
    }
    const existing = items.find((item) => item.product_id === product.id);
    const nextQuantity = (existing?.quantity || 0) + quantity;
    if (nextQuantity > Math.min(product.stock, MAX_ITEM_QUANTITY)) {
      return {
        ok: false,
        message: `Puedes añadir un máximo de ${MAX_ITEM_QUANTITY} unidades de ${product.brand} ${product.model}.`,
      };
    }

    setItems((current) => {
      const currentItem = current.find(
        (item) => item.product_id === product.id,
      );
      if (currentItem) {
        return current.map((item) =>
          item.product_id === product.id
            ? { ...item, ...product, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { ...product, product_id: product.id, quantity }];
    });
    return {
      ok: true,
      message: `${product.brand} ${product.model} añadido al carrito.`,
    };
  }

  function removeItem(productId) {
    const removed = items.find((item) => item.product_id === productId);
    setItems((current) =>
      current.filter((item) => item.product_id !== productId),
    );
    return removed;
  }

  function updateQuantity(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, message: 'La cantidad debe ser al menos 1.' };
    }
    const item = items.find((entry) => entry.product_id === productId);
    if (!item)
      return { ok: false, message: 'El producto ya no está en el carrito.' };
    if (quantity > Math.min(item.stock, MAX_ITEM_QUANTITY)) {
      return {
        ok: false,
        message: `Puedes añadir un máximo de ${MAX_ITEM_QUANTITY} unidades de ${item.brand} ${item.model}.`,
      };
    }
    setItems((current) =>
      current.map((entry) =>
        entry.product_id === productId ? { ...entry, quantity } : entry,
      ),
    );
    return { ok: true };
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const estimatedTotal = items.reduce(
    (total, item) => total + Number(item.price_eur) * item.quantity,
    0,
  );

  const value = {
    items,
    itemCount,
    estimatedTotal,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
