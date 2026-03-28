// js/catalog.js - Data layer for BananaHub

let catalog = null;

export async function loadCatalog() {
  if (catalog) return catalog;
  const res = await fetch('catalog.json');
  if (!res.ok) throw new Error(`Failed to load catalog: ${res.status}`);
  catalog = await res.json();
  return catalog;
}

export function getTemplates() {
  return catalog ? catalog.templates : [];
}

export function filterTemplates(templates, filters) {
  return templates.filter((template) => {
    if (filters.profile && filters.profile !== 'all' && template.profile !== filters.profile) {
      return false;
    }
    if (filters.difficulty && filters.difficulty !== 'all' && template.difficulty !== filters.difficulty) {
      return false;
    }
    return true;
  });
}

export function sortTemplates(templates, sortMode, statsMap) {
  const sorted = [...templates];

  if (!statsMap) return sorted;

  const getStats = (template) => statsMap.get(`${template.repo || 'unknown'}::${template.id}`);
  const getTrending = (template) => {
    const value = getStats(template)?.trending;
    return typeof value === 'number' ? value : 0;
  };
  const getInstalls = (template) => {
    const value = getStats(template)?.installs;
    return typeof value === 'number' ? value : 0;
  };

  if (sortMode === 'trending') {
    sorted.sort((a, b) => getTrending(b) - getTrending(a));
    return sorted;
  }

  sorted.sort((a, b) => getInstalls(b) - getInstalls(a));
  return sorted;
}

export function searchTemplates(templates, query) {
  if (!query || !query.trim()) return templates;

  const terms = query.trim().toLowerCase().split(/\s+/);

  return templates.filter((template) => {
    const searchable = [
      template.id,
      template.title,
      template.title_en,
      template.description,
      template.author,
      template.profile,
      template.difficulty,
      ...(template.tags || [])
    ].join(' ').toLowerCase();

    return terms.every((term) => searchable.includes(term));
  });
}
