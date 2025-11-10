import createApiClient from "./apiClient";

const getCart = (token) => {
  const apiClient = createApiClient(token);
  return apiClient.get("/api/v1/cart");
};

const addToCart = (token, productId, quantity) => {
  const apiClient = createApiClient(token);
  return apiClient.post("/api/v1/cart/items", { productId, quantity });
};

const updateCartItem = (token, itemId, quantity) => {
  const apiClient = createApiClient(token);
  return apiClient.patch(`/api/v1/cart/items/${itemId}`, { quantity });
};

const removeFromCart = (token, itemId) => {
  const apiClient = createApiClient(token);
  return apiClient.delete(`/api/v1/cart/items/${itemId}`);
};

const clearCart = (token) => {
  const apiClient = createApiClient(token);
  return apiClient.delete("/api/v1/cart/items");
};

const applyCoupon = (token, codigo) => {
  const apiClient = createApiClient(token);
  return apiClient.post("/api/v1/cart/cupon", { codigo });
};

const removeCoupon = (token) => {
  const apiClient = createApiClient(token);
  return apiClient.post("/api/v1/cart/cupon", { codigo: "" });
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
