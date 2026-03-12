import api from "./axios";
import type { Project } from "../types/project";

export const getProjects = async () => {
  const res = await api.get<Project[]>("/projects");
  return res.data;
};

export const createProject = async (data: Project) => {
  const res = await api.post("/projects", data);
  return res.data;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};