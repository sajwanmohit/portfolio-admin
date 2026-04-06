import { useState } from "react";
import useGithubRepos from "../hooks/useGithubRepos";

export default function GithubRepoSelector({
  onSelect,
  existingProjects,
}: any) {
  const repos = useGithubRepos("sajwanmohit");
  const [addingUrls] = useState<Set<string>>(new Set());

  const isAlreadyAdded = (repoUrl: string) => {
    return existingProjects?.some((p: any) => p.githubUrl === repoUrl);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Import from GitHub</h2>

      <div className="grid gap-3">
        {repos.map((repo) => {
          const isAdding = addingUrls.has(repo.html_url);
          const isAdded = isAlreadyAdded(repo.html_url);
          return (
            <div
              key={repo.id}
              className="border p-3 rounded flex justify-between"
            >
              <div>
                <p className="font-medium">{repo.name}</p>
                <p className="text-sm text-gray-500">{repo.description}</p>
              </div>

              <button
                disabled={isAdded || isAdding}
                onClick={async () => {
                  await onSelect({
                    title: repo.name,
                    description: repo.description,
                    githubUrl: repo.html_url,
                    stars: repo.stargazers_count,
                    isSelected: true,
                  });
                }}
                className={`px-3 py-1 rounded text-white ${
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
