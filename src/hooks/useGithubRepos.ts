import { useEffect, useState } from "react";

export default function useGithubRepos(username: string) {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(res => res.json())
      .then(setRepos);
  }, []);

  return repos;
}