import api from "./axios";

const TOKEN_KEY = "admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => !!getToken();

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  localStorage.setItem("admin_token", res.data.token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
