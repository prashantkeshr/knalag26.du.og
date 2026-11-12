/**
 * Generates public/sitemap.xml from public/data/search-index.json.
 * Run before the Vite build so the generated file is included in dist/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://kernal.dhurta.org';
const NOW = new Date().toISOString().slice(0, 10);

const searchIndex = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public/data/search-index.json'), 'utf-8')
);

const urls = [
  { loc: `${BASE_URL}/`,              changefreq: 'weekly',  priority: '1.0', lastmod: NOW },
  { loc: `${BASE_URL}/roadmap`,       changefreq: 'monthly', priority: '0.8', lastmod: NOW },
  { loc: `${BASE_URL}/progress`,      changefreq: 'never',   priority: '0.4' },
  { loc: `${BASE_URL}/notes`,         changefreq: 'never',   priority: '0.4' },
  { loc: `${BASE_URL}/api-explorer`,  changefreq: 'monthly', priority: '0.6', lastmod: NOW },
];

for (const entry of searchIndex) {
  if (entry.type !== 'lesson' && entry.type !== 'course') continue;

  // Convert "#/learn/html/01-introduction" → "/learn/html/01-introduction"
  const urlPath = entry.url.startsWith('#') ? entry.url.slice(1) : entry.url;

  urls.push({
    loc: `${BASE_URL}${urlPath}`,
    changefreq: 'monthly',
    priority: entry.type === 'course' ? '0.9' : '0.8',
    lastmod: NOW,
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const out = path.join(ROOT, 'public/sitemap.xml');
fs.writeFileSync(out, xml, 'utf-8');
console.log(`✓ sitemap.xml — ${urls.length} URLs → ${out}`);
