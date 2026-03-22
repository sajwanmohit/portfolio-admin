import api from "./axios";
import type { Project } from "../types/project";

export const getProjects = async () => {
  const res = await api.get("/public/projects");
  return res.data.content;
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