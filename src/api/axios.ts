import axios from "axios";

export const API_BASE_URL =
  "https://app-bgm-hospital-b4hbefbzd4ffbhhj.canadacentral-01.azurewebsites.net";

  // export const API_BASE_URL =
  // "https://localhost:7046";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;