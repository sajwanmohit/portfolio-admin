import { useState } from "react";
import ProjectTable from "../../components/projects/ProjectTable";
import ProjectImport from "./ProjectImport";

export default function ProjectList() {
  const [reloadKey, setReloadKey] = useState(0);

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      {/* Table */}
      <ProjectTable reloadKey={reloadKey} />
    </div>
  );
}