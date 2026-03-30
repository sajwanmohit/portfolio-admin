import api from "./axios";
import type { Skill, SkillCategory } from "../types/skill";

export const createSkill = async (data: Skill): Promise<Skill> => {
  const res = await api.post("/admin/skills", data);
  return res.data;
};

export const getSkills = async (
  page: number,
  size: number,
  search: string
) => {
  const res = await api.get("/admin/skills", {
    params: { page, size, search },
  });
  return res.data;
};

export const deleteSkill = async (id: number) => {
  await api.delete(`/admin/skills/${id}`);
};

export const getCategories = async (): Promise<SkillCategory[]> => {
  const res = await api.get("/admin/skill-categories");
  return res.data;
};

export const createCategory = async (
  data: { name: string }
): Promise<SkillCategory> => {
  const res = await api.post("/admin/skill-categories", data);
  return res.data;
};

export const deleteCategory = (id: number) =>
  api.delete(`/api/admin/skill-categories/${id}`);