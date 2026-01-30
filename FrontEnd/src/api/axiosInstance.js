import axios from "axios";

/* RESET GLOBAL AXIOS DEFAULTS */
axios.defaults.headers.post = {};
axios.defaults.headers.common = {};
axios.defaults.transformRequest = [(data) => data];

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

/* REQUEST INTERCEPTOR */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CRITICAL: NEVER force Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
