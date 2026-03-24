type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type Skill = {
  id?: number;
  name: string;
  level?: SkillLevel;
  categoryId: number;
  categoryName?: string;
};

export type SkillCategory = {
  id: number;
  name: string;
};