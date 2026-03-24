import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createSkill, getCategories, createCategory } from "../../api/skills";
import { apiToast } from "../../utils/apiToast";
import type { Skill, SkillCategory } from "../../types/skill";

export default function SkillForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm<Skill>();
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: Skill) => {
    const res = await apiToast(createSkill(data), {
      loading: "Creating skill...",
      success: "Skill created",
      error: "Failed to create skill",
    });

    if (res) {
      reset();
      onSuccess();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const res = await apiToast(createCategory({ name: newCategory }), {
      loading: "Adding category...",
      success: "Category added",
      error: "Failed",
    });

    if (res) {
      setNewCategory("");
      fetchCategories();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mb-6">

      <input
        placeholder="Skill name"
        {...register("name", { required: true })}
        className="border p-2"
      />

      <input
        placeholder="Level (optional)"
        {...register("level")}
        className="border p-2"
      />

      <select
        {...register("categoryId", { required: true })}
        className="border p-2"
      >
        <option value="">Select category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Inline category creation */}
      <div className="flex gap-2">
        <input
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-gray-800 text-white px-3"
        >
          Add
        </button>
      </div>

      <button className="bg-blue-500 text-white p-2">
        Save Skill
      </button>
    </form>
  );
}