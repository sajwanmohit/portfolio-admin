import useGithubRepos from "../hooks/useGithubRepos";

export default function GithubRepoSelector({ onSelect }: any) {
  const repos = useGithubRepos("sajwanmohit");

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Import from GitHub</h2>

      <div className="grid gap-3">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="border p-3 rounded flex justify-between"
          >
            <div>
              <p className="font-medium">{repo.name}</p>
              <p className="text-sm text-gray-500">
                {repo.description}
              </p>
            </div>

            <button
              onClick={() =>
                onSelect({
                  title: repo.name,
                  description: repo.description,
                  githubUrl: repo.html_url,
                  stars: repo.stargazers_count,
                  isSelected: true,
                })
              }
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}