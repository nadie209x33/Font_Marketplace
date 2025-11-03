import { axiosInstance } from "./axiosConfig";

// The response from axios is already in the format { data, status, headers, ... }
// and it automatically throws for non-2xx status codes.
// So the new apiClient is much simpler.

const apiClient = {
  get(url, config = {}) {
    return axiosInstance.get(url, config);
  },

  post(url, data, config = {}) {
    return axiosInstance.post(url, data, config);
  },

  put(url, data, config = {}) {
    return axiosInstance.put(url, data, config);
  },

  patch(url, data, config = {}) {
    return axiosInstance.patch(url, data, config);
  },

  delete(url, config = {}) {
    return axiosInstance.delete(url, config);
  },
};

export default apiClient;
