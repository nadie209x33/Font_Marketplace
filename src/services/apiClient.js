import axios from "axios";

const API_BASE_URL = "https://23.95.3.178:8443";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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

// To handle errors in a centralized way, you can add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response if it's successful
  (error) => {
    // Log the error
    console.error("API Client Error:", error.response || error.message);

    // You can customize the error object here if needed
    const customError = new Error(
      error.response?.data?.message || error.message,
    );
    customError.response = error.response;

    // Reject the promise with the custom error
    return Promise.reject(customError);
  },
);

export default apiClient;
