import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../api/skills";
import { apiToast } from "../../utils/apiToast";
import ConfirmModalButton from "../modals/ConfirmModalButton";

type Category = {
  id: number;
  name: string;
};

export default function CategoryTable({ refresh }: { refresh: number }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res);
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    const res = await apiToast(deleteCategory(id), {
      loading: "Deleting category...",
      success: "Category deleted",
      error: "Failed",
    });

    if (res) fetchCategories();
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 mt-6">
      <h3 className="font-semibold mb-3">Categories</h3>

      {categories.length === 0 && (
        <p className="text-gray-400">No categories</p>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2 border px-3 py-1 rounded-full"
          >
            <span>{c.name}</span>
            <button
              onClick={() => setDeleteId(c.id)}
              className="text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <ConfirmModalButton
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await handleDelete(deleteId!);
          setDeleteId(null);
        }}
      />
    </div>
  );
}