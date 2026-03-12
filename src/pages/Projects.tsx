import ProjectForm from "../components/projects/ProjectForm";
import ProjectTable from "../components/projects/ProjectTable";

export default function Projects() {

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Projects
      </h1>

      <ProjectForm />

      <ProjectTable />

    </div>
  );
}