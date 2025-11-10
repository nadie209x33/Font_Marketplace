import createApiClient from "./apiClient";

export const userService = {
  changePassword(token, passwords) {
    const apiClient = createApiClient(token);
    return apiClient.post("/api/v1/auth/change-password", passwords);
  },
};
