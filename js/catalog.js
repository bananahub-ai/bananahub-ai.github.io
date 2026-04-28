// js/catalog.js - Data layer for BananaHub

let catalog = null;
let supportMetadata = null;

const EMPTY_SUPPORT_METADATA = Object.freeze({
  providers: {},
  models: {}
});

export async function loadCatalog() {
  if (catalog) return catalog;
  const res = await fetch('catalog.json');
  if (!res.ok) throw new Error(`Failed to load catalog: ${res.status}`);
  catalog = await res.json();
  return catalog;
}

export async function loadSupportMetadata() {
  if (supportMetadata) return supportMetadata;

  try {
    const res = await fetch('support-metadata.json');
    if (!res.ok) throw new Error(`Failed to load support metadata: ${res.status}`);
    supportMetadata = await res.json();
  } catch (error) {
    console.warn('Failed to load support metadata:', error);
    supportMetadata = EMPTY_SUPPORT_METADATA;
  }

  return supportMetadata;
}

export function getTemplates() {
  return catalog ? catalog.templates : [];
}

export function getTemplateProviderIds(template) {
  return uniqueItems((template.providers || []).map((provider) => (
    typeof provider === 'string' ? provider : provider?.id
  )));
}

export function getTemplateModelIds(template) {
  const directModels = (template.models || []).map((model) => (
    typeof model === 'string' ? model : model?.id || model?.name
  ));
  const providerModels = (template.providers || []).flatMap((provider) => (
    typeof provider === 'string'
      ? []
      : (provider?.models || []).map((model) => model?.id || model?.name)
  ));

  return uniqueItems([
    ...directModels,
    ...providerModels,
    template.recommended_model
  ]);
}

export function filterTemplates(templates, filters) {
  return templates.filter((template) => {
    if (filters.source && filters.source !== 'all' && template.catalog_source !== filters.source) {
      return false;
    }
    if (filters.profile && filters.profile !== 'all' && template.profile !== filters.profile) {
      return false;
    }
    if (filters.difficulty && filters.difficulty !== 'all' && template.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.provider && filters.provider !== 'all' && !getTemplateProviderIds(template).includes(filters.provider)) {
      return false;
    }
    return true;
  });
}

export function sortTemplates(templates, sortMode, statsMap) {
  const sorted = [...templates];

  const getStats = (template) => statsMap.get(`${template.repo || 'unknown'}::${template.id}`);
  const getTrending = (template) => {
    const stats = getStats(template) || {};
    const value = template.distribution === 'bundled' ? stats.usage24h : stats.trending;
    return typeof value === 'number' ? value : 0;
  };
  const getInstalls = (template) => {
    const value = getStats(template)?.installs;
    return typeof value === 'number' ? value : 0;
  };
  const getPinnedRank = (template) => (
    Number.isFinite(template.pinned_rank) ? template.pinned_rank : Number.POSITIVE_INFINITY
  );
  const getFeatured = (template) => Number(Boolean(template.featured));
  const getDistributionRank = (template) => (template.distribution === 'bundled' ? 0 : 1);
  const getSourceRank = (template) => (template.catalog_source === 'curated' ? 0 : 1);
  const getOfficial = (template) => Number(Boolean(template.official));
  const getModelPriority = (template) => Number.isFinite(template.model_priority) ? template.model_priority : 99;
  const getTitle = (template) => template.title_en || template.title || template.id;

  sorted.sort((a, b) => {
    const pinnedDiff = getPinnedRank(a) - getPinnedRank(b);
    if (pinnedDiff !== 0) {
      return pinnedDiff;
    }

    const featuredDiff = getFeatured(b) - getFeatured(a);
    if (featuredDiff !== 0) {
      return featuredDiff;
    }

    if (sortMode === 'trending') {
      const trendingDiff = getTrending(b) - getTrending(a);
      if (trendingDiff !== 0) {
        return trendingDiff;
      }
    } else {
      const modelDiff = getModelPriority(a) - getModelPriority(b);
      if (modelDiff !== 0) {
        return modelDiff;
      }
      const distributionDiff = getDistributionRank(a) - getDistributionRank(b);
      if (distributionDiff !== 0) {
        return distributionDiff;
      }
    }

    const sourceDiff = getSourceRank(a) - getSourceRank(b);
    if (sourceDiff !== 0) {
      return sourceDiff;
    }

    const officialDiff = getOfficial(b) - getOfficial(a);
    if (officialDiff !== 0) {
      return officialDiff;
    }

    if (a.distribution !== 'bundled' && b.distribution !== 'bundled') {
      const installsDiff = getInstalls(b) - getInstalls(a);
      if (installsDiff !== 0) {
        return installsDiff;
      }
    }

    return getTitle(a).localeCompare(getTitle(b), 'en');
  });

  return sorted;
}

export function searchTemplates(templates, query) {
  if (!query || !query.trim()) return templates;

  const terms = query.trim().toLowerCase().split(/\s+/);

  return templates.filter((template) => {
    const searchable = [
      template.id,
      template.type,
      template.title,
      template.title_en,
      template.description,
      template.author,
      template.license,
      template.profile,
      template.catalog_source,
      template.distribution,
      template.primary_action,
      template.difficulty,
      ...getTemplateProviderIds(template),
      ...getTemplateModelIds(template),
      ...(template.tags || [])
    ].join(' ').toLowerCase();

    return terms.every((term) => searchable.includes(term));
  });
}

function uniqueItems(items) {
  return [...new Set(items.map((item) => String(item || '').trim()).filter(Boolean))];
}
