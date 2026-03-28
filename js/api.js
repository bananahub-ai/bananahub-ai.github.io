// js/api.js - BananaHub API client

const API_BASE = 'https://bananahub-api.zhan9kun.workers.dev/api';
const TIMEOUT_MS = 5000;
const MAX_CONCURRENCY = 10;

function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export function getTemplateKey(template) {
  return `${template.repo || 'unknown'}::${template.id}`;
}

function buildStatsUrl(template) {
  const url = new URL(`${API_BASE}/stats`);
  url.searchParams.set('repo', template.repo);
  url.searchParams.set('template_id', template.id);
  return url.toString();
}

export async function fetchStats(template) {
  if (!template.repo || !template.id) {
    return { installs: '--', trending: 0 };
  }

  try {
    const res = await fetchWithTimeout(buildStatsUrl(template));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      installs: typeof data.installs === 'number' ? data.installs : '--',
      trending: 0
    };
  } catch {
    return { installs: '--', trending: 0 };
  }
}

export async function fetchTrending() {
  try {
    const url = new URL(`${API_BASE}/trending`);
    url.searchParams.set('period', '24h');
    url.searchParams.set('limit', '100');

    const res = await fetchWithTimeout(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const templates = Array.isArray(data.templates) ? data.templates : [];
    const trendingMap = new Map();

    templates.forEach((item) => {
      const key = getTemplateKey({ repo: item.repo, id: item.template_id });
      trendingMap.set(key, typeof item.installs === 'number' ? item.installs : 0);
    });

    return trendingMap;
  } catch {
    return new Map();
  }
}

export async function fetchAllStats(templates) {
  const results = new Map();
  const queue = [...templates];
  const trendingPromise = fetchTrending();

  async function worker() {
    while (queue.length > 0) {
      const template = queue.shift();
      if (!template) break;
      const stats = await fetchStats(template);
      results.set(getTemplateKey(template), stats);
    }
  }

  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENCY, templates.length) },
    () => worker()
  );

  await Promise.all(workers);

  const trendingMap = await trendingPromise;
  results.forEach((stats, key) => {
    if (trendingMap.has(key)) {
      stats.trending = trendingMap.get(key);
    }
  });

  return results;
}
