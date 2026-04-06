import { useState } from "react";
import ProjectTable from "../../components/projects/ProjectTable";

export default function ProjectList() {
  const [reloadKey] = useState(0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      {/* Table */}
      <ProjectTable reloadKey={reloadKey} />
    </div>
  );
}