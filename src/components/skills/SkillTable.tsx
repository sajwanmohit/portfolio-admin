import { useEffect, useState } from "react";
import { getSkills, deleteSkill } from "../../api/skills";
import { apiToast } from "../../utils/apiToast";
import type { Skill } from "../../types/skill";
import ConfirmModalButton from "../modals/ConfirmModalButton";

export default function SkillTable({ refresh }: { refresh: number }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const size = 10;

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await getSkills(page, size, "");
      setSkills(res?.content ?? []);
      setTotal(res?.totalElements ?? 0);
    } catch (err) {
      console.error("Failed to fetch skills", err);
      setSkills([]); // prevent crash
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [page, refresh]);

  const handleDelete = async (id: number) => {
    const res = await apiToast(deleteSkill(id), {
      loading: "Deleting...",
      success: "Deleted",
      error: "Failed",
    });

    if (res !== null) fetchSkills();
  };

  const grouped = (skills ?? []).reduce(
    (acc, s) => {
      const key = s.categoryName || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const formatLevel = (level?: string) => {
    if (!level) return "";
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-gray-200 text-gray-700";
      case "INTERMEDIATE":
        return "bg-yellow-200 text-yellow-800";
      case "ADVANCED":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔹 Loading State */}
      {loading && (
        <div className="text-center py-6 text-gray-500">Loading skills...</div>
      )}

      {/* 🔹 Empty State */}
      {!loading && skills.length === 0 && (
        <div className="text-center py-6 text-gray-400">No skills found</div>
      )}

      {/* 🔹 Data */}
      {!loading &&
        Object.entries(grouped).map(([category, list]) => (
          <div key={category} className="bg-white shadow rounded-xl p-4">
            <h3 className="font-semibold mb-3">{category}</h3>

            <div className="flex flex-wrap gap-2">
              {list.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 border px-3 py-1 rounded-full"
                >
                  <span>{s.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getLevelColor(s.level)}`}
                  >
                    {formatLevel(s.level)}
                  </span>
                  <button
                    onClick={() => setDeleteId(s.id!)}
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

<ConfirmModalButton
  isOpen={deleteId !== null}
  onClose={() => setDeleteId(null)}
  onConfirm={async () => {
    await handleDelete(deleteId!);
    setDeleteId(null);
  }}
/>
      {/* Pagination */}
      {!loading && skills.length > 0 && (
        <div className="flex justify-between mt-4">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <span>Page {page + 1}</span>

          <button
            disabled={(page + 1) * size >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
