import { useEffect } from 'react';

const BASE_URL = 'https://kernal.dhurta.org';
const DEFAULT_TITLE = 'KERNAL — The core of every coder';
const DEFAULT_DESC = 'A free, offline-first developer learning platform. Learn HTML, CSS, JavaScript, Python, SQL, Git and more — entirely in your browser. No account required.';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: object;
}

export function useSeo({ title, description, path, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullUrl = `${BASE_URL}${path}`;
    const fullTitle = `${title} | KERNAL`;

    document.title = fullTitle;

    setMeta('description', description);

    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', fullUrl, 'property');
    setMeta('og:type', 'article', 'property');

    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:url', fullUrl);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    if (jsonLd) {
      let script = document.getElementById('ld-json-page') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'ld-json-page';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('description', DEFAULT_DESC);
      setMeta('og:title', DEFAULT_TITLE, 'property');
      setMeta('og:description', DEFAULT_DESC, 'property');
      setMeta('og:url', BASE_URL + '/', 'property');
      setMeta('og:type', 'website', 'property');
      setMeta('twitter:title', DEFAULT_TITLE);
      setMeta('twitter:description', DEFAULT_DESC);
      setMeta('twitter:url', BASE_URL + '/');
      const canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (canon) canon.href = BASE_URL + '/';
    };
  }, [title, description, path, jsonLd]);
}
