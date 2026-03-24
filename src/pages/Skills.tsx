import { useState } from "react";
import SkillForm from "../components/skills/SkillForm";
import SkillTable from "../components/skills/SkillTable";

export default function Skills() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>

      <SkillForm onSuccess={() => setRefresh(r => r + 1)} />

      <SkillTable refresh={refresh} />
    </div>
  );
}