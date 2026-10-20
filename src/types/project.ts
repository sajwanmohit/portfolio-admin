export interface Project {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  techStack: string;
  stars?: number;

  isSelected?: boolean; // 🔴 KEY FIELD
}

export type ProjectInput = Omit<
  Project,
  "id" | "imageUrl" | "techStack"
> &
  Partial<Pick<Project, "imageUrl" | "techStack">>;
