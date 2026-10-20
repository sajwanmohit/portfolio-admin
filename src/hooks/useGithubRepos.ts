import { useEffect, useState } from "react";

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
}

export default function useGithubRepos(username: string) {
  const [repos, setRepos] = useState<GithubRepo[]>([]);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(res => res.json())
      .then((data: GithubRepo[]) => setRepos(data));
  }, [username]);

  return repos;
}