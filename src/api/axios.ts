import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


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