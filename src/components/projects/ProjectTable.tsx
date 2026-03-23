import { useEffect, useState } from "react";
import type { Project } from "../../types/project";
import toast from "react-hot-toast";
import {
  deleteProjects,
  getProjects,
  updateProjects,
} from "../../api/projects";
import ConfirmModalButton from "../modals/ConfirmModalButton";

export default function ProjectTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const size = 5;
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchProjects();
  }, [page, debouncedSearch]);

  const startEdit = (projects: Project) => {
    setEditingId(projects.id);
    setEditData(projects);
  };
  const updateProject = async () => {
    try {
      const payload = removeEmptyFields(editData);
      await updateProjects(editingId!, payload);
      toast.success("Project updated");
      setEditingId(null);
      fetchProjects();
    } catch {
      toast.error("Update failed");
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await getProjects(page, size, debouncedSearch);
      setProjects(res.content);
      setTotal(res.totalElements);
    } catch (err) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await deleteProjects(id);
      toast.success("Deleted successfully");
      fetchProjects();
    } catch {
      toast.error("Delete failed");
    }
  };

  function removeEmptyFields(data: Partial<Project>): Partial<Project> {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    ) as Partial<Project>;
  }

  function useDebounce(value: string, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value]);

    return debounced;
  }

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      {/* 🔍 SEARCH BAR */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setPage(0); // reset page
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded w-full md:w-64"
        />
      </div>

      {/* table below */}

      {/* TABLE VIEW (md and above) */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Tech Stack</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {editingId === p.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editData.title || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                  ) : (
                    p.title
                  )}
                </td>

                <td className="p-3">
                  {editingId === p.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editData.description || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.description
                  )}
                </td>

                <td className="p-3">
                  {editingId === p.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editData.techStack || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, techStack: e.target.value })
                      }
                    />
                  ) : (
                    p.techStack
                  )}
                </td>

                <td className="p-3 space-x-2">
                  {editingId === p.id ? (
                    <>
                      <button
                        onClick={updateProject}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(p)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id!)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW (cards) */}
      <div className="md:hidden space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white shadow rounded-xl p-4 border">
            {editingId === p.id ? (
              <>
                <input
                  className="border rounded px-2 py-1 w-full mb-2"
                  value={editData.title || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder="Title"
                />
                <input
                  className="border rounded px-2 py-1 w-full mb-2"
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Description"
                />
                <input
                  className="border rounded px-2 py-1 w-full mb-2"
                  value={editData.techStack || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, techStack: e.target.value })
                  }
                  placeholder="Tech Stack"
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={updateProject}
                    className="flex-1 bg-green-500 text-white py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-xs text-gray-500 mt-1">{p.techStack}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(p)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(p.id!)}
                    className="flex-1 bg-red-500 text-white py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page + 1} of {Math.ceil(total / size)}
        </span>

        <button
          disabled={(page + 1) * size >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ConfirmModalButton
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await deleteProject(deleteId!);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
