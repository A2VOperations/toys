"use client";

const CART_STORAGE_KEY = "cart_items";

export const readCartItems = () => {
  if (typeof window === "undefined") return [];
  
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getCartCount = () => {
  const items = readCartItems();
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
};

export const writeCartItems = (items) => {
  if (typeof window === "undefined") {
    return { ok: false, items: [] };
  }
  
  try {
    // Store ONLY id and quantity - minimal data
    const minimalItems = items.map(({ id, quantity }) => ({
      id,
      quantity: Math.max(1, Number(quantity) || 1)
    }));
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(minimalItems));
    
    // Notify components that cart has changed
    window.dispatchEvent(new Event("cartUpdated"));
    
    return { ok: true, items: minimalItems };
  } catch {
    return { ok: false, items: readCartItems() };
  }
};

/**
 * Centrally managed add-to-cart logic.
 * Handles stock validation, duplicate items, and dispatches the update event.
 */
export const addItemToCart = (product, quantity = 1) => {
  if (!product) return { ok: false, message: "Invalid product" };
  
  const productId = product._id || product.id;
  if (!productId) return { ok: false, message: "Invalid product ID" };

  const stock = Number(product.stock) || 0;
  if (stock <= 0) return { ok: false, message: "Out of stock" };

  const currentItems = readCartItems();
  const existingIndex = currentItems.findIndex((item) => item.id === productId);
  
  const finalQuantity = Number(quantity) || 1;
  let updatedItems = [...currentItems];

  if (existingIndex >= 0) {
    const currentQty = Number(updatedItems[existingIndex].quantity) || 0;
    updatedItems[existingIndex].quantity = Math.min(currentQty + finalQuantity, stock);
  } else {
    updatedItems.push({ id: productId, quantity: Math.min(finalQuantity, stock) });
  }

  return writeCartItems(updatedItems);
};