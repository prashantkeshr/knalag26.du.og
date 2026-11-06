/**
 * Post-build pre-renderer for GitHub Pages.
 *
 * Runs after `vite build`. For every lesson in search-index.json it:
 *   1. Reads the lesson JSON from public/content/
 *   2. Copies dist/index.html with the correct <title>, <meta description>,
 *      og tags, canonical, and a lesson-specific JSON-LD block already set
 *      (so Wave-1 Googlebot sees correct meta without JS execution)
 *   3. Embeds lesson text in <noscript> so the content is indexed by crawlers
 *      that don't execute JavaScript
 *   4. Writes to dist/learn/{tech}/{lessonId}/index.html
 *
 * Also creates dist/{route}/index.html for roadmap/progress/settings so
 * direct URL loads don't require the 404-redirect round-trip.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = 'https://kernal.dhurta.org';

const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

const searchIndex = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public/data/search-index.json'), 'utf-8')
);

const technologies = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public/data/technologies.json'), 'utf-8')
);

let count = 0;

// ── Lesson pages ──────────────────────────────────────────────────────────────
for (const entry of searchIndex) {
  if (entry.type !== 'lesson') continue;

  const slashIdx = entry.id.indexOf('/');
  const tech = entry.id.slice(0, slashIdx);
  const lessonId = entry.id.slice(slashIdx + 1);

  const lessonFile = path.join(ROOT, `public/content/${tech}/lessons/${lessonId}.json`);
  if (!fs.existsSync(lessonFile)) continue;

  let lesson;
  try {
    lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf-8'));
  } catch (e) {
    console.warn(`  ⚠ skipped (invalid JSON): ${lessonFile.replace(ROOT, '.')}`);
    continue;
  }
  const canonicalUrl = `${BASE_URL}/learn/${tech}/${lessonId}`;
  const fullTitle = `${lesson.title} | KERNAL`;

  const html = buildLessonPage(indexHtml, lesson, fullTitle, canonicalUrl, tech);

  const outDir = path.join(DIST, 'learn', tech, lessonId);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  count++;
}

// ── Course overview pages ──────────────────────────────────────────────────────
for (const tech of technologies) {
  if (!tech.enabled) continue;

  const canonicalUrl = `${BASE_URL}/learn/${tech.id}`;
  const fullTitle = `Learn ${tech.name} — Free Online Course | KERNAL`;
  const description = `${tech.description} — free, interactive, offline-first lessons on KERNAL.`;

  let html = replaceMetas(indexHtml, fullTitle, description, canonicalUrl);

  const courseJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${tech.name} — Free Online Course`,
    description,
    url: canonicalUrl,
    provider: { '@type': 'Organization', name: 'KERNAL by Dhurta.Org', url: 'https://kernal.dhurta.org' },
    isAccessibleForFree: true,
    inLanguage: 'en',
    educationalLevel: 'Beginner',
    courseMode: 'online',
  });

  html = html.replace('</head>', `  <script type="application/ld+json">${courseJsonLd}</script>\n</head>`);

  const outDir = path.join(DIST, 'learn', tech.id);
  fs.mkdirSync(outDir, { recursive: true });
  // Only write if a lesson subdir hasn't already created an index.html here
  const outFile = path.join(outDir, 'index.html');
  fs.writeFileSync(outFile, html, 'utf-8');
  count++;
}

// ── Static SPA route pages (avoid 404-redirect round-trip) ───────────────────
for (const route of ['roadmap', 'progress', 'settings']) {
  const outDir = path.join(DIST, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(path.join(DIST, 'index.html'), path.join(outDir, 'index.html'));
  count++;
}

console.log(`✓ Pre-rendered ${count} pages → dist/`);

// ── Helpers ────────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escAttr(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function replaceMetas(html, title, description, url, keywords) {
  let out = html
    .replace(/(<title>)[^<]*(<\/title>)/, `$1${esc(title)}$2`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${escAttr(description)}"`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*"/, `$1${escAttr(title)}"`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${escAttr(description)}"`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*"/, `$1${escAttr(url)}"`)
    .replace(/(<meta\s+property="og:type"\s+content=")[^"]*"/, `$1article"`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*"/, `$1${escAttr(title)}"`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*"/, `$1${escAttr(description)}"`)
    .replace(/(<meta\s+name="twitter:url"\s+content=")[^"]*"/, `$1${escAttr(url)}"`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*"/, `$1${escAttr(url)}"`);
  if (keywords) {
    out = out.replace(/(<meta\s+name="keywords"\s+content=")[^"]*"/, `$1${escAttr(keywords)}"`);
  }
  return out;
}

function renderBlocks(blocks) {
  let out = '';
  for (const b of (blocks ?? [])) {
    const safeText = s => String(s ?? '').replace(/<script/gi, '&lt;script');
    switch (b.type) {
      case 'heading':
        out += `<h${b.level ?? 2}>${esc(b.text)}</h${b.level ?? 2}>\n`;
        break;
      case 'paragraph':
        out += `<p>${safeText(b.text)}</p>\n`;
        break;
      case 'code':
        out += `<pre><code>${esc(b.code)}</code></pre>\n`;
        break;
      case 'list':
        out += b.ordered
          ? `<ol>${(b.items ?? []).map(i => `<li>${safeText(i)}</li>`).join('')}</ol>\n`
          : `<ul>${(b.items ?? []).map(i => `<li>${safeText(i)}</li>`).join('')}</ul>\n`;
        break;
      case 'tip':
        out += `<p><strong>Tip:</strong> ${safeText(b.text)}</p>\n`;
        break;
      case 'warning':
        out += `<p><strong>Warning:</strong> ${safeText(b.text)}</p>\n`;
        break;
      case 'info':
        out += `<p>${safeText(b.text)}</p>\n`;
        break;
      case 'definition':
        out += `<dl><dt>${esc(b.term)}</dt><dd>${esc(b.definition ?? b.meaning)}</dd></dl>\n`;
        break;
      case 'misconception':
        out += `<p><strong>Common misconception:</strong> ${esc(b.claim)} — <strong>Reality:</strong> ${esc(b.reality)}</p>\n`;
        break;
      case 'comparison':
        out += `<h4>${esc(b.title)}</h4>\n`;
        out += `<ul><li><strong>${esc(b.a.name)}</strong>: ${esc(b.a.description)}</li>`;
        out += `<li><strong>${esc(b.b.name)}</strong>: ${esc(b.b.description)}</li></ul>\n`;
        break;
    }
  }
  return out;
}

function buildLessonPage(indexHtml, lesson, fullTitle, canonicalUrl, tech) {
  const keywords = [
    tech,
    `learn ${tech}`,
    `${tech} tutorial`,
    `${tech} course`,
    lesson.title.toLowerCase(),
    ...(lesson.skillsTaught ?? []),
    'coding tutorial',
    'programming',
    'KERNAL',
    'free coding',
  ].join(', ');

  let html = replaceMetas(indexHtml, fullTitle, lesson.subtitle, canonicalUrl, keywords);

  // Lesson + BreadcrumbList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        name: lesson.title,
        description: lesson.subtitle,
        url: canonicalUrl,
        educationalLevel: lesson.difficulty === 'beginner' ? 'Beginner'
          : lesson.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
        learningResourceType: 'Lesson',
        isAccessibleForFree: true,
        inLanguage: 'en',
        timeRequired: `PT${lesson.estimatedMinutes ?? 10}M`,
        provider: { '@type': 'Organization', name: 'KERNAL by Dhurta.Org', url: 'https://kernal.dhurta.org' },
        teaches: lesson.skillsTaught ?? [],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kernal.dhurta.org/' },
          { '@type': 'ListItem', position: 2, name: tech.toUpperCase(), item: `https://kernal.dhurta.org/learn/${tech}` },
          { '@type': 'ListItem', position: 3, name: lesson.title, item: canonicalUrl },
        ],
      },
    ],
  };

  let extraJsonLd = '';
  if ((lesson.faq ?? []).length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: lesson.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    extraJsonLd = `\n  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
  }

  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>${extraJsonLd}\n</head>`
  );

  // Static content in <noscript> — indexed by Wave-1 Googlebot (no-JS pass)
  const faqHtml = (lesson.faq ?? []).length > 0
    ? `<section itemscope itemtype="https://schema.org/FAQPage">\n<h2>Frequently Asked Questions</h2>\n` +
      lesson.faq.map(f =>
        `<div itemprop="mainEntity" itemscope itemtype="https://schema.org/Question">` +
        `<h3 itemprop="name">${esc(f.q)}</h3>` +
        `<div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">` +
        `<p itemprop="text">${esc(f.a)}</p></div></div>`
      ).join('\n') + '\n</section>'
    : '';

  const skillsHtml = (lesson.skillsTaught ?? []).length > 0
    ? `<p><strong>Skills taught:</strong> ${lesson.skillsTaught.map(s => esc(s)).join(', ')}</p>`
    : '';

  const noscript = `<noscript>
<article itemscope itemtype="https://schema.org/LearningResource">
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/learn/${tech}">${esc(tech.toUpperCase())}</a></li>
      <li>${esc(lesson.title)}</li>
    </ol>
  </nav>
  <h1 itemprop="name">${esc(lesson.title)}</h1>
  <p itemprop="description">${esc(lesson.subtitle)}</p>
  ${skillsHtml}
  ${renderBlocks(lesson.content)}
  ${faqHtml}
</article>
</noscript>`;

  html = html.replace('<div id="root"></div>', `${noscript}\n  <div id="root"></div>`);
  return html;
}
