import { useEffect, useState } from "react";
import { createProject, getProjects } from "../../api/projects";
import { apiToast } from "../../utils/apiToast";
import type { Project, ProjectInput } from "../../types/project";
import GithubRepoSelector from "../../components/GithubRepoSelector";
import toast from "react-hot-toast";

interface ProjectImportProps {
  onSuccess?: () => void;
}

export default function ProjectImport({ onSuccess }: ProjectImportProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const res = await getProjects(0, 100);
    return res.content || res;
  };

  useEffect(() => {
    let isActive = true;
    void fetchProjects()
      .then((loadedProjects) => {
        if (isActive) {
          setProjects(loadedProjects);
        }
      })
      .catch(() => {
        toast.error("Failed to load projects");
      });

    return () => {
      isActive = false;
    };
  }, []);
  const handleAdd = async (project: ProjectInput) => {
    const res = await apiToast(createProject(project), {
      loading: "Adding project...",
      success: "Project added",
      error: "Failed to add project",
    });

    if (res) {
      try {
        setProjects(await fetchProjects());
      } catch {
        toast.error("Project was added, but the project list could not be refreshed");
      }
      onSuccess?.();
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
