import api from "./axios";
import type { Project } from "../types/project";

export const getProjects = async (page=0,size=5, search = "") => {
  const res = await api.get("/public/projects", {
    params: { page, size, search },
  });
  return res.data;
};

export const createProject = async (data: Project) => {
  return api.post("/admin/projects", data);
};

export const updateProjects = async (id: number, data: Partial<Project>) => {
  return api.patch(`/admin/projects/${id}`, data);
};

export const deleteProjects = async (id: number) => {
  return api.delete(`/admin/projects/${id}`);
};