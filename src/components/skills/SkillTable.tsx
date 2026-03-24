import { useEffect, useState } from "react";
import { getSkills, deleteSkill } from "../../api/skills";
import { apiToast } from "../../utils/apiToast";
import type { Skill } from "../../types/skill";

export default function SkillTable({ refresh }: { refresh: number }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const size = 10;

  const fetchSkills = async () => {
    const res = await getSkills(page, size, "");
    setSkills(res.content);
    setTotal(res.totalElements);
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

  const grouped = skills.reduce((acc, s) => {
    const key = s.categoryName || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-4">

      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} className="bg-white shadow rounded-xl p-4">

          <h3 className="font-semibold mb-3">{category}</h3>

          <div className="flex flex-wrap gap-2">
            {list.map(s => (
              <div
                key={s.id}
                className="flex items-center gap-2 border px-3 py-1 rounded-full"
              >
                <span>{s.name}</span>

                <button
                  onClick={() => handleDelete(s.id!)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>

        <span>Page {page + 1}</span>

        <button
          disabled={(page + 1) * size >= total}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}