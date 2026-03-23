import { useForm } from "react-hook-form";
import type { Project } from "../../types/project";
import { createProject } from "../../api/projects";

export default function ProjectForm() {
  const { register, handleSubmit, reset } = useForm<Project>();

  const onSubmit = async (data: Project) => {
    try {
      await createProject(data);
      reset();
    } catch (error) {
      console.error("Failed to save project", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 mb-6"
    >
      <input
        placeholder="Title"
        {...register("title", { required: true })}
        className="border p-2"
      />

      <input
        placeholder="Description"
        {...register("description")}
        className="border p-2"
      />

      <input
        placeholder="GitHub URL"
        {...register("githubUrl")}
        className="border p-2"
      />

      <input
        placeholder="Live URL"
        {...register("liveUrl")}
        className="border p-2"
      />

      <input
        placeholder="Image URL"
        {...register("imageUrl")}
        className="border p-2"
      />

      <input
        placeholder="Tech Stack"
        {...register("techStack")}
        className="border p-2"
      />

      <button className="border p-2 bg-blue-500 text-white">
        Save Project
      </button>
    </form>
  );
}
