import createApiClient from "./apiClient";

export const addressService = {
  getAddresses(token) {
    const apiClient = createApiClient(token);
    return apiClient.get("/api/v1/addresses");
  },
  getAddressById(token, addressId) {
    const apiClient = createApiClient(token);
    return apiClient.get(`/api/v1/addresses/${addressId}`);
  },
  createAddress(token, addressData) {
    const apiClient = createApiClient(token);
    return apiClient.post("/api/v1/addresses", addressData);
  },
  updateAddress(token, addressId, addressData) {
    const apiClient = createApiClient(token);
    return apiClient.put(`/api/v1/addresses/${addressId}`, addressData);
  },
  deleteAddress(token, addressId) {
    const apiClient = createApiClient(token);
    return apiClient.delete(`/api/v1/addresses/${addressId}`);
  },
};
