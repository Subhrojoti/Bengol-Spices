import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

/* 🔹 GET TOKEN BASED ON CURRENT ROUTE */
const getTokenByPath = () => {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return localStorage.getItem("adminToken");
  }

  if (path.startsWith("/employee")) {
    return localStorage.getItem("employeeToken");
  }

  if (path.startsWith("/delivery")) {
    return localStorage.getItem("deliveryToken");
  }

  // default → agent/app
  return localStorage.getItem("agentToken");
};

/* REQUEST INTERCEPTOR */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenByPath();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData correctly
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
