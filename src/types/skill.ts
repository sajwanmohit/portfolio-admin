export type Skill = {
  id?: number;
  name: string;
  level?: string;
  categoryId: number;
  categoryName?: string;
};

export type SkillCategory = {
  id: number;
  name: string;
};