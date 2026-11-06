import { useEffect, useState } from 'react';
import { Star, GitFork, ExternalLink, Github, RefreshCw } from 'lucide-react';
import { searchRepos, fmtStars } from '@/lib/github';
import type { GHRepo } from '@/lib/github';

interface Props {
  tech: string;
  lessonTitle: string;
  skills: string[];
}

export default function GitHubRefs({ tech, lessonTitle, skills }: Props) {
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchRepos = () => {
    setLoading(true);
    setError(null);
    const query = skills[0] ?? lessonTitle.split(' ').slice(0, 3).join(' ');
    searchRepos(query, tech === 'javascript' ? 'javascript'
      : tech === 'python' ? 'python'
      : tech === 'typescript' ? 'typescript'
      : tech === 'react' ? 'javascript'
      : tech === 'nodejs' ? 'javascript'
      : tech === 'sql' ? 'sql'
      : tech === 'mongodb' ? 'javascript'
      : tech === 'redis' ? undefined
      : tech === 'ml' ? 'python'
      : tech === 'llms' ? 'python'
      : tech === 'cryptography' ? undefined
      : tech === 'embedded' ? 'c'
      : tech === 'docker' ? undefined
      : undefined, 4)
      .then(({ repos: r }) => { setRepos(r); setLoading(false); })
      .catch(err => {
        setError(err.message === 'rate_limited' ? 'GitHub rate limit reached — try again in a minute.' : 'Could not load examples.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (open && repos.length === 0 && !loading) fetchRepos();
  }, [open]);

  return (
    <section className="mt-8 border border-k-border rounded-kernal overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-k-surface hover:bg-k-surface-2 transition-kernal text-left"
      >
        <Github size={16} className="text-k-muted shrink-0" />
        <span className="text-sm font-semibold text-k-text flex-1">Real Code on GitHub</span>
        <span className="text-xs text-k-muted">{open ? 'hide' : 'show examples'}</span>
      </button>

      {open && (
        <div className="border-t border-k-border p-4">
          {loading && (
            <div className="grid sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-k-surface rounded-kernal animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 text-sm text-k-muted py-2">
              <span>{error}</span>
              <button onClick={fetchRepos} className="flex items-center gap-1 text-k-accent hover:text-k-text transition-kernal text-xs">
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}

          {!loading && !error && repos.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                {repos.map(repo => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-2 p-3 rounded-kernal border border-k-border hover:border-k-accent/50 hover:bg-k-surface-2 transition-kernal"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-k-text group-hover:text-k-accent transition-kernal truncate leading-tight">
                        {repo.full_name}
                      </span>
                      <ExternalLink size={12} className="text-k-muted shrink-0 mt-0.5" />
                    </div>
                    {repo.description && (
                      <p className="text-xs text-k-muted leading-relaxed line-clamp-2">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-auto">
                      {repo.language && (
                        <span className="text-xs text-k-muted font-mono">{repo.language}</span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-k-muted ml-auto">
                        <Star size={11} className="text-k-warning" />
                        {fmtStars(repo.stargazers_count)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-k-muted">
                        <GitFork size={11} />
                        {fmtStars(repo.forks_count)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-xs text-k-muted mt-3">
                Fetched live from{' '}
                <span className="font-mono text-k-accent">api.github.com</span> — click any card to view the source code.
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
