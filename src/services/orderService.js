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
  getAdminOrders() {
    return apiClient.get("/api/v1/admin/orders");
  },
  updateOrderStatus(orderId, newStatus) {
    return apiClient.patch(`/api/v1/orders/${orderId}/delivery-status`, {
      newStatus: newStatus,
    });
  },
  updatePaymentStatus(paymentId, newStatus) {
    return apiClient.patch(`/api/v1/orders/payment/${paymentId}`, {
      newStatus: newStatus,
    });
  },
};
