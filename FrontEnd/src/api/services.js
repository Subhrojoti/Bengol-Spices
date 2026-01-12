import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const agentRegistration = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/agent/apply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
