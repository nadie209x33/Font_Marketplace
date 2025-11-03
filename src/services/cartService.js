import apiClient from "./apiClient";

const getCart = () => {
  return apiClient.get("/api/v1/cart");
};

const addToCart = (productId, quantity) => {
  return apiClient.post("/api/v1/cart/items", { productId, quantity });
};

const updateCartItem = (itemId, quantity) => {
  return apiClient.patch(`/api/v1/cart/items/${itemId}`, { quantity });
};

const removeFromCart = (itemId) => {
  return apiClient.delete(`/api/v1/cart/items/${itemId}`);
};

const clearCart = () => {
  return apiClient.delete("/api/v1/cart/items");
};

const applyCoupon = (codigo) => {
  return apiClient.post("/api/v1/cart/cupon", { codigo });
};

const removeCoupon = () => {
  return apiClient.delete("/api/v1/cart/cupon");
};

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
};
