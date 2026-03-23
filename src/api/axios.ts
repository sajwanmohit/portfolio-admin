import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });

  localStorage.setItem("admin_token", res.data.token);
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    console.error(
      "API Error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      console.warn("Unauthorized request");
    }

    return Promise.reject(error);
  }
);


export default api;