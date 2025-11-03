import axios from "axios";
import { logout } from "../redux/authSlice";

const API_BASE_URL = "https://23.95.3.178:8443";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const setupInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
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
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        store.dispatch(logout());
      }
      const customError = new Error(
        error.response?.data?.message || error.message,
      );
      customError.response = error.response;
      return Promise.reject(customError);
    },
  );
};
