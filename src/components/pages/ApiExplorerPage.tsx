import { useState, useEffect, useCallback } from 'react';
import { Search, Star, GitFork, ExternalLink, TrendingUp, Hash, RefreshCw, Copy, Check } from 'lucide-react';
import { searchRepos, trendingRepos, topicRepos, fmtStars } from '@/lib/github';
import { useSeo } from '@/lib/seo';
import type { GHRepo } from '@/lib/github';

const LANGUAGES = [
  { id: '', label: 'All' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'sql', label: 'SQL' },
  { id: 'c', label: 'C/C++' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
];

const TOPICS = ['web', 'api', 'machine-learning', 'devops', 'security', 'react', 'nodejs', 'database'];

type Tab = 'search' | 'trending' | 'topics';

function RepoCard({ repo }: { repo: GHRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2.5 p-4 rounded-kernal border border-k-border hover:border-k-accent/50 hover:bg-k-surface-2 bg-k-surface transition-kernal"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-k-text group-hover:text-k-accent transition-kernal truncate">
            {repo.full_name}
          </div>
          {repo.license && (
            <span className="text-xs text-k-muted/60 font-mono">{repo.license.spdx_id}</span>
          )}
        </div>
        <ExternalLink size={13} className="text-k-muted shrink-0 mt-0.5" />
      </div>

      {repo.description && (
        <p className="text-xs text-k-muted leading-relaxed line-clamp-2">{repo.description}</p>
      )}

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map(t => (
            <span key={t} className="text-[10px] font-mono bg-k-accent/10 text-k-accent rounded px-1.5 py-0.5">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-auto pt-1 border-t border-k-border/50">
        {repo.language && (
          <span className="text-xs text-k-muted font-mono flex-1 truncate">{repo.language}</span>
        )}
        <span className="flex items-center gap-1 text-xs text-k-muted">
          <Star size={11} className="text-k-warning" />
          {fmtStars(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1 text-xs text-k-muted">
          <GitFork size={11} />
          {fmtStars(repo.forks_count)}
        </span>
      </div>
    </a>
  );
}

function ApiUrlBadge({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="flex items-center gap-2 bg-k-bg border border-k-border rounded-lg px-3 py-2 mt-3 overflow-x-auto">
      <span className="text-xs text-k-muted shrink-0 font-semibold">GET</span>
      <code className="text-xs text-k-accent font-mono flex-1 whitespace-nowrap">{url}</code>
      <button onClick={copy} className="shrink-0 p-1 text-k-muted hover:text-k-accent transition-kernal">
        {copied ? <Check size={13} className="text-k-success" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

export default function ApiExplorerPage() {
  useSeo({
    title: 'API Explorer — Live GitHub Data',
    description: 'Explore GitHub public repositories with live API calls. Search any topic, browse trending repos, and see exactly how REST APIs work in action.',
    path: '/api-explorer',
    ogType: 'website',
    keywords: 'GitHub API, REST API, API explorer, public API, programming repos, open source, search repositories',
  });

  const [tab, setTab] = useState<Tab>('trending');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [topic, setTopic] = useState('web');
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRepos([]);
    try {
      if (tab === 'trending') {
        const r = await trendingRepos(language || undefined, 9);
        setRepos(r.repos);
        setApiUrl(r.apiUrl);
        setTotal(null);
      } else if (tab === 'topics') {
        const r = await topicRepos(topic, 9);
        setRepos(r.repos);
        setApiUrl(r.apiUrl);
        setTotal(null);
      } else {
        if (!query.trim()) { setLoading(false); return; }
        const r = await searchRepos(query.trim(), language || undefined, 9);
        setRepos(r.repos);
        setApiUrl(r.apiUrl);
        setTotal(r.total);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error';
      setError(msg === 'rate_limited'
        ? 'GitHub rate limit reached (60 req/hr unauthenticated). Wait a minute and retry.'
        : 'Could not reach GitHub API. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [tab, query, language, topic]);

  useEffect(() => {
    if (tab !== 'search') load();
  }, [tab, language, topic]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-k-text mb-2">API Explorer</h1>
        <p className="text-k-muted">
          Live GitHub repository data via the{' '}
          <code className="text-k-accent font-mono text-sm">api.github.com</code>
          {' '}public API — no key required. 60 requests/hour.
        </p>
      </header>

      {/* What is an API box */}
      <div className="mb-6 p-4 bg-k-accent/5 border border-k-accent/20 rounded-kernal">
        <h2 className="text-sm font-semibold text-k-accent mb-1">What is a REST API?</h2>
        <p className="text-xs text-k-muted leading-relaxed">
          A REST API lets you request data over HTTP. You send a GET request to a URL, and the server
          responds with JSON. GitHub exposes its entire platform this way — repos, users, issues, code.
          Every result below shows the exact URL being called so you can try it in your browser or code.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-k-surface border border-k-border rounded-kernal p-1 w-fit">
        {([
          { id: 'trending', icon: TrendingUp, label: 'Trending' },
          { id: 'topics',   icon: Hash,       label: 'Topics'   },
          { id: 'search',   icon: Search,     label: 'Search'   },
        ] as { id: Tab; icon: typeof Search; label: string }[]).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-kernal ${
              tab === id ? 'bg-k-accent text-k-bg' : 'text-k-muted hover:text-k-text'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        {tab === 'search' && (
          <div className="flex gap-2 flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search repos… e.g. react hooks, python ml, sql orm"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load()}
              className="flex-1 min-w-0 bg-k-bg border border-k-border rounded-lg px-3 py-2 text-sm text-k-text placeholder:text-k-muted outline-none focus:border-k-accent/60"
            />
            <button
              onClick={load}
              className="flex items-center gap-1.5 px-4 py-2 bg-k-accent text-k-bg rounded-lg text-sm font-semibold hover:bg-k-accent/90 transition-kernal shrink-0"
            >
              <Search size={14} />
              Search
            </button>
          </div>
        )}

        {tab === 'topics' && (
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(t => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-kernal ${
                  topic === t
                    ? 'bg-k-accent text-k-bg border-k-accent'
                    : 'border-k-border text-k-muted hover:text-k-text hover:border-k-accent/40'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        {tab !== 'search' && (
          <div className="flex items-center gap-2 ml-auto">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-k-bg border border-k-border rounded-lg px-3 py-2 text-sm text-k-text outline-none focus:border-k-accent/60 cursor-pointer"
            >
              {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            <button
              onClick={load}
              className="p-2 rounded-lg border border-k-border text-k-muted hover:text-k-accent hover:border-k-accent/40 transition-kernal"
              aria-label="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        )}
      </div>

      {/* API URL */}
      {apiUrl && <ApiUrlBadge url={apiUrl} />}

      {/* Total */}
      {total !== null && (
        <p className="text-xs text-k-muted mt-2">
          {total.toLocaleString()} repositories found — showing top 9
        </p>
      )}

      {/* Results */}
      <div className="mt-4">
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-36 bg-k-surface border border-k-border rounded-kernal animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 bg-k-danger/10 border border-k-danger/30 rounded-kernal text-sm text-k-danger">
            {error}
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {repos.map(repo => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        )}

        {!loading && !error && repos.length === 0 && tab === 'search' && query && (
          <p className="text-center text-k-muted py-10 text-sm">No results for "{query}"</p>
        )}
      </div>

      {/* How it works */}
      <section className="mt-10 p-5 bg-k-surface border border-k-border rounded-kernal">
        <h2 className="font-semibold text-k-text mb-3">How to use this API yourself</h2>
        <div className="space-y-2 text-sm text-k-muted">
          <p>Copy any API URL from above and paste it in your browser — you'll see raw JSON.</p>
          <p>In JavaScript:</p>
          <pre className="bg-k-bg border border-k-border rounded-lg px-4 py-3 text-xs font-mono text-k-text overflow-x-auto">{
`const res = await fetch('https://api.github.com/search/repositories?q=react&sort=stars');
const data = await res.json();
console.log(data.items[0].full_name); // e.g. "facebook/react"`
          }</pre>
          <p className="text-xs">
            Rate limit: <span className="text-k-accent font-mono">60 requests/hour</span> without a token.
            Add <span className="text-k-accent font-mono">Authorization: Bearer YOUR_TOKEN</span> header for 5000/hour.
          </p>
        </div>
      </section>
    </div>
  );
}
