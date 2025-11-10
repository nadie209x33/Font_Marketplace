import axios from "axios";

const API_BASE_URL = "https://23.95.3.178:8443";

const createApiClient = (token) => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Client Error:", error.response || error.message);
      const customError = new Error(
        error.response?.data?.message || error.message,
      );
      customError.response = error.response;
      return Promise.reject(customError);
    },
  );

  return {
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
};

export default createApiClient;
