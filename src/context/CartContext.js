import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, name, price, sizeLiters, quantity }]

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.product === product._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          sizeLiters: product.sizeLiters,
          quantity: qty,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setItems((prev) => prev.map((it) => (it.product === productId ? { ...it, quantity: Math.max(1, qty) } : it)));
  };

  const removeItem = (productId) => setItems((prev) => prev.filter((it) => it.product !== productId));
  const clear = () => setItems([]);

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const value = useMemo(() => ({ items, addItem, updateQty, removeItem, clear, total }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
