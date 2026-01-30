import axios from "axios";

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

    // Handle FormData correctly
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // browser sets boundary
    } else {
      // Ensure JSON for normal requests (login, etc.)
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
