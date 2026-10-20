import { useState } from "react";
import useGithubRepos from "../hooks/useGithubRepos";
import type { Project, ProjectInput } from "../types/project";

interface GithubRepoSelectorProps {
  onSelect: (project: ProjectInput) => Promise<unknown>;
  existingProjects: Project[];
}

export default function GithubRepoSelector({
  onSelect,
  existingProjects,
}: GithubRepoSelectorProps) {
  const repos = useGithubRepos("sajwanmohit");
  const [liveUrls, setLiveUrls] = useState<Record<number, string>>({});
  const [addingRepoIds, setAddingRepoIds] = useState<Set<number>>(new Set());

  const isAlreadyAdded = (repoUrl: string) => {
    return existingProjects.some((project) => project.githubUrl === repoUrl);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Import from GitHub</h2>

      <div className="grid gap-3">
        {repos.map((repo) => {
          const isAdding = addingRepoIds.has(repo.id);
          const isAdded = isAlreadyAdded(repo.html_url);
          return (
            <div
              key={repo.id}
              className="flex flex-col gap-3 rounded border p-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{repo.name}</p>
                <p className="break-words text-sm text-gray-500">
                  {repo.description || "No description"}
                </p>
                <input
                  type="url"
                  aria-label={`Live website URL for ${repo.name}`}
                  placeholder="Live website URL (optional)"
                  value={liveUrls[repo.id] ?? repo.homepage ?? ""}
                  onChange={(event) =>
                    setLiveUrls((previous) => ({
                      ...previous,
                      [repo.id]: event.target.value,
                    }))
                  }
                  disabled={isAdding || isAdded}
                  className="mt-2 w-full rounded border p-2 text-sm"
                />
              </div>

              <button
                disabled={isAdded || isAdding}
                onClick={async () => {
                  setAddingRepoIds((previous) => new Set(previous).add(repo.id));
                  try {
                    await onSelect({
                      title: repo.name,
                      description: repo.description ?? "",
                      githubUrl: repo.html_url,
                      liveUrl: liveUrls[repo.id] ?? repo.homepage ?? "",
                      stars: repo.stargazers_count,
                      isSelected: true,
                    });
                  } finally {
                    setAddingRepoIds((previous) => {
                      const next = new Set(previous);
                      next.delete(repo.id);
                      return next;
                    });
                  }
                }}
                className={`shrink-0 self-start rounded px-3 py-1 text-white ${
                  isAdded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500"
                }`}
              >
                {isAdding
                  ? "Adding..."
                  : isAdded
                    ? "Added"
                    : "Add"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
