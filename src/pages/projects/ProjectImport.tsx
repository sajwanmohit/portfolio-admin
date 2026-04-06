import { useEffect, useState } from "react";
import { createProject, getProjects } from "../../api/projects";
import { apiToast } from "../../utils/apiToast";
import type { Project } from "../../types/project";
import GithubRepoSelector from "../../components/GithubRepoSelector";

export default function ProjectImport({ onSuccess }: any) {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const res = await getProjects(0, 100);
    setProjects(res.content || res); // adjust based on API
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  const handleAdd = async (project: Project) => {
    const res = await apiToast(createProject(project), {
      loading: "Adding project...",
      success: "Project added",
      error: "Failed to add project",
    });

    if (res) {
      // ✅ update local state immediately
      setProjects((prev) => [...prev, project]);
      onSuccess(); // 🔥 triggers table refresh
    }
    return res;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Import Projects</h1>
      <GithubRepoSelector onSelect={handleAdd} existingProjects={projects} />
    </div>
  );
}
