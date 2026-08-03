import { useEffect, useState } from 'react';
import { FiGithub } from 'react-icons/fi';

export default function GithubStats() {
  const [repos, setRepos] = useState(0);

  useEffect(() => {
    fetch('https://api.github.com/users/KanwarAfaq')
      .then(res => res.json())
      .then(data => setRepos(data.public_repos));
  }, []);

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
      <FiGithub /> 
      <span>{repos} Public Repositories</span>
    </div>
  );
}