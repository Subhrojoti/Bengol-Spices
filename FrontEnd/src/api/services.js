import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_BASE_URL = "http://localhost:8000";

export const agentRegistration = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/agent/apply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const adminLogin = async (email, password) => {
  const response = await axiosInstance.post("/auth/admin/login", {
    email,
    password,
  });

  return response.data;
};

export const agentLogin = async (agentId, password) => {
  const response = await axiosInstance.post("/auth/agent/login", {
    agentId,
    password,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("role");
};

export const agentList = async () => {
  const response = await axiosInstance.get("/admin/agents");
  return response.data;
};

export const approveAgent = (agentId) => {
  return axiosInstance.post(`/admin/agents/${agentId}/approve`);
};

export const rejectAgent = (agentId) => {
  return axiosInstance.post(`/admin/agents/${agentId}/reject`);
};

export const getAgentProfile = async () => {
  const response = await axiosInstance.get("/agent/profile");
  return response.data;
};

export const changePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const response = await axiosInstance.post("/auth/change-password", {
    oldPassword,
    newPassword,
    confirmPassword,
  });

  return response.data;
};

export const setPassword = async ({ token, password }) => {
  const response = await axiosInstance.post("/agent/auth/set-password", {
    token,
    password,
  });

  return response.data;
};

export const createStore = async ({
  storeName,
  ownerName,
  phone,
  address,
  latitude,
  longitude,
  storeType,
}) => {
  const response = await axiosInstance.post("/agent/store/register", {
    storeName,
    ownerName,
    phone,
    address,
    latitude,
    longitude,
    storeType,
  });

  return response.data;
};

export const myStores = async () => {
  const response = await axiosInstance.get("/agent/store/my-stores");
  return response.data;
};

export const fetchProducts = async () => {
  const response = await axiosInstance.get("/products/public/allProduct");
  return response.data;
};

export const createOrder = async (payload) => {
  const response = await axiosInstance.post("/agent/orders", payload);
  return response.data;
};
