import { useEffect, useState } from "react";
import type { Project } from "../../types/project";
import { deleteProjects, getProjects, updateProjects } from "../../api/projects";

export default function ProjectTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const startEdit = (projects: Project) => {
    setEditingId(projects.id);
    setEditData(projects);
  };
  const updateProject = async () => {
    const payload = removeEmptyFields(editData);
    await updateProjects(editingId!, payload);
    setEditingId(null);

    fetchProjects();
  };
  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await deleteProjects(id);
      fetchProjects();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  function removeEmptyFields(data: Partial<Project>): Partial<Project> {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    ) as Partial<Project>;
  }

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Description</th>
          <th className="p-2 border">Tech Stack</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {projects.map((p) => (
          <tr key={p.id}>
            <td className="p-2 border">
              {editingId === p.id ? (
                <input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              ) : (
                p.title
              )}
            </td>
            <td className="p-2 border">
              {editingId === p.id ? (
                <input
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
              ) : (
                p.description
              )}
            </td>{" "}
            <td className="p-2 border">
              {editingId === p.id ? (
                <input
                  value={editData.techStack}
                  onChange={(e) =>
                    setEditData({ ...editData, techStack: e.target.value })
                  }
                />
              ) : (
                p.techStack
              )}
            </td>
            <td className="p-2 border">
              {editingId === p.id ? (
                <>
                  <button onClick={updateProject}>Save</button>

                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(p)}>Edit</button>

                  <button onClick={() => deleteProject(p.id!)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
