import createApiClient from "./apiClient";

export const orderService = {
  getMyOrders(token) {
    const apiClient = createApiClient(token);
    return apiClient.get("/api/v1/orders/my-orders");
  },
  retryPayment(token, orderId) {
    const apiClient = createApiClient(token);
    return apiClient.post(`/api/v1/orders/${orderId}/retry-payment`, {
      paymentMethod: "Card",
    });
  },
  createOrder(token, orderDetails) {
    const apiClient = createApiClient(token);
    return apiClient.post("/api/v1/orders", orderDetails);
  },
};
