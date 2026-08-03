import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';

export default function RepoStats({ repoUrl }) {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    // Extract username/repo from URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      fetch(`https://api.github.com/repos/${match[1]}/${match[2]}`)
        .then(res => res.json())
        .then(data => setStars(data.stargazers_count))
        .catch(() => setStars(0));
    }
  }, [repoUrl]);

  if (stars === null) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
      <FiStar size={12} /> {stars}
    </span>
  );
}