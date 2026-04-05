import GithubRepoSelector from "../../components/GithubRepoSelector";
import { createProject } from "../../api/projects";
import type { Project } from "../../types/project";

export default function ProjectImport() {
  const handleAdd = async (project: Project) => {
    await createProject(project);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Import Projects</h1>
      <GithubRepoSelector onSelect={handleAdd} />
    </div>
  );
}