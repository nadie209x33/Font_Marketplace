import apiClient from "./apiClient";

export const orderService = {
  getMyOrders() {
    return apiClient.get("/api/v1/orders/my-orders");
  },
  retryPayment(orderId) {
    return apiClient.post(`/api/v1/orders/${orderId}/retry-payment`, {
      paymentMethod: "Card",
    });
  },
  createOrder(orderDetails) {
    return apiClient.post("/api/v1/orders", orderDetails);
  },
};
