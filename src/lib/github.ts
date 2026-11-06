const BASE = 'https://api.github.com';
const HEADERS = { Accept: 'application/vnd.github.v3+json' };
const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 5 * 60 * 1000;

async function ghFetch<T>(url: string): Promise<T> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T;
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 403) throw new Error('rate_limited');
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  const data = await res.json();
  cache.set(url, { data, ts: Date.now() });
  return data as T;
}

export interface GHRepo {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  owner: { login: string; avatar_url: string };
  updated_at: string;
  license: { spdx_id: string } | null;
}

interface SearchResult { items: GHRepo[]; total_count: number }

export async function searchRepos(
  query: string,
  language?: string,
  perPage = 6,
): Promise<{ repos: GHRepo[]; total: number; apiUrl: string }> {
  const q = [query, language ? `language:${language}` : ''].filter(Boolean).join('+');
  const apiUrl = `${BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=${perPage}`;
  const data = await ghFetch<SearchResult>(apiUrl);
  return { repos: data.items, total: data.total_count, apiUrl };
}

export async function trendingRepos(
  language?: string,
  perPage = 9,
): Promise<{ repos: GHRepo[]; apiUrl: string }> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const q = [`created:>${since}`, language ? `language:${language}` : ''].filter(Boolean).join('+');
  const apiUrl = `${BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=${perPage}`;
  const data = await ghFetch<SearchResult>(apiUrl);
  return { repos: data.items, apiUrl };
}

export async function topicRepos(
  topic: string,
  perPage = 9,
): Promise<{ repos: GHRepo[]; apiUrl: string }> {
  const apiUrl = `${BASE}/search/repositories?q=topic:${encodeURIComponent(topic)}&sort=stars&per_page=${perPage}`;
  const data = await ghFetch<SearchResult>(apiUrl);
  return { repos: data.items, apiUrl };
}

export function fmtStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
