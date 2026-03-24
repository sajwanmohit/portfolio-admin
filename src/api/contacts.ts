import api from "./axios";
import type { Contact } from "../types/contact";

export const getContacts = async (page = 0, size = 5, search = "") => {
  const res = await api.get("/admin/contacts", {
    params: { page, size, search },
  });
  return res.data;
};

export const deleteContact = async (id: number) => {
  return api.delete(`/admin/contacts/${id}`);
};