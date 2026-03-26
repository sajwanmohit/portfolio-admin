import api from "./axios";

export const getProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const saveProfile = async (data: any) => {
  const res = await api.post("/admin/profile", data);
  return res.data;
};
