// js/app.js - UI controller for BananaHub

import { loadCatalog, getTemplates, filterTemplates, sortTemplates, searchTemplates } from './catalog.js';
import { fetchAllStats, getTemplateKey } from './api.js';

// ===== State =====
let allTemplates = [];
let statsMap = new Map();
let currentFilters = { profile: 'all', difficulty: 'all' };
let currentSort = 'all-time';
let currentSearch = '';
let searchTimer = null;

// ===== DOM refs =====
const grid = document.getElementById('card-grid');
const searchInput = document.getElementById('search-input');
const templateCount = document.getElementById('template-count');
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalImageLink = document.getElementById('modal-image-link');
const modalLinks = document.getElementById('modal-links');

// ===== Init =====
async function init() {
  readHash();

  try {
    await loadCatalog();
    allTemplates = getTemplates();
    templateCount.textContent = allTemplates.length;
  } catch (err) {
    console.error('Failed to load catalog:', err);
    grid.innerHTML = '<div class="card-empty"><p>Failed to load templates</p><p>Please try refreshing the page.</p></div>';
    return;
  }

  render();
  syncUIFromState();
  loadStats();
  bindEvents();
}

// ===== Hash Routing =====
function readHash() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  const params = new URLSearchParams(hash);
  if (params.has('profile')) currentFilters.profile = params.get('profile');
  if (params.has('difficulty')) currentFilters.difficulty = params.get('difficulty');
  if (params.has('sort')) currentSort = params.get('sort');
  if (params.has('q')) {
    currentSearch = params.get('q');
    searchInput.value = currentSearch;
  }
}

function writeHash() {
  const params = new URLSearchParams();
  if (currentFilters.profile !== 'all') params.set('profile', currentFilters.profile);
  if (currentFilters.difficulty !== 'all') params.set('difficulty', currentFilters.difficulty);
  if (currentSort !== 'all-time') params.set('sort', currentSort);
  if (currentSearch) params.set('q', currentSearch);
  window.location.hash = params.toString() || '';
}

function syncUIFromState() {
  document.querySelectorAll('[data-profile]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.profile === currentFilters.profile);
  });

  document.querySelectorAll('[data-difficulty]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.difficulty === currentFilters.difficulty);
  });

  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.sort === currentSort);
  });
}

// ===== Render =====
function render() {
  let templates = [...allTemplates];
  templates = searchTemplates(templates, currentSearch);
  templates = filterTemplates(templates, currentFilters);
  templates = sortTemplates(templates, currentSort, statsMap);

  if (templates.length === 0) {
    grid.innerHTML = '<div class="card-empty"><p>No templates found</p><p>Try adjusting your search or filters.</p></div>';
    return;
  }

  grid.innerHTML = templates.map((template) => renderCard(template)).join('');
  observeImages();
}

function renderCard(template) {
  const stats = statsMap.get(getTemplateKey(template));
  const installs = stats ? stats.installs : '--';
  const profileColors = {
    photo: 'photo',
    sticker: 'sticker',
    product: 'product',
    diagram: 'diagram',
    minimal: 'minimal'
  };
  const profileClass = profileColors[template.profile] || '';
  const tagsHtml = (template.tags || [])
    .slice(0, 4)
    .map((tag) => `<span class="tag">${escHtml(tag)}</span>`)
    .join('');
  const hasSampleImage = Boolean(template.sample_image);
  const placeholderLabel = hasSampleImage ? 'Loading preview' : 'Preview unavailable';

  return `
    <article class="template-card" data-id="${escAttr(template.id)}" data-repo="${escAttr(template.repo)}">
      <div class="card-image-wrap${hasSampleImage ? '' : ' is-error'}">
        <div class="card-image-placeholder" aria-hidden="true">
          <span class="card-image-placeholder-label">${escHtml(placeholderLabel)}</span>
        </div>
        ${hasSampleImage ? `<img data-src="${escAttr(template.sample_image)}" alt="${escAttr(template.title_en)}" loading="lazy">` : ''}
        <span class="card-aspect-badge">${escHtml(template.aspect)}</span>
        ${template.official ? '<span class="card-official-badge">Official</span>' : ''}
      </div>
      <div class="card-body">
        <div class="card-title">${escHtml(template.title_en)}</div>
        <div class="card-subtitle">${escHtml(template.title)}</div>
        <div class="card-badges">
          <span class="badge badge-profile ${profileClass}">${escHtml(template.profile)}</span>
          <span class="badge badge-difficulty">${escHtml(template.difficulty)}</span>
        </div>
        <div class="card-tags">${tagsHtml}</div>
      </div>
      <div class="card-footer">
        <span class="install-count" data-stat-key="${escAttr(getTemplateKey(template))}">&#x2193; ${installs}</span>
        <button class="copy-btn" data-cmd="${escAttr(template.install_cmd)}" title="Copy install command">
          $ ${escHtml(template.install_cmd)}
        </button>
      </div>
    </article>
  `;
}

// ===== Lazy Image Loading =====
let imageObserver = null;

function observeImages() {
  if (imageObserver) imageObserver.disconnect();

  const images = grid.querySelectorAll('img[data-src]');
  if (!('IntersectionObserver' in window)) {
    images.forEach((img) => loadImage(img));
    return;
  }

  imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        imageObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach((img) => imageObserver.observe(img));
}

function loadImage(img) {
  const src = img.dataset.src;
  if (!src) return;

  const wrap = img.closest('.card-image-wrap');
  img.src = src;
  img.onload = () => {
    img.classList.add('loaded');
    img.removeAttribute('data-src');
    if (wrap) {
      wrap.classList.add('is-loaded');
      wrap.classList.remove('is-error');
    }
  };
  img.onerror = () => {
    img.removeAttribute('data-src');
    if (!wrap) return;
    wrap.classList.remove('is-loaded');
    wrap.classList.add('is-error');
    const label = wrap.querySelector('.card-image-placeholder-label');
    if (label) label.textContent = 'Preview unavailable';
  };
}

// ===== Stats Loading =====
async function loadStats() {
  statsMap = await fetchAllStats(allTemplates);
  patchStats();
  render();
}

function patchStats() {
  document.querySelectorAll('[data-stat-key]').forEach((el) => {
    const stats = statsMap.get(el.dataset.statKey);
    if (stats) {
      el.innerHTML = `&#x2193; ${stats.installs}`;
    }
  });
}

// ===== Events =====
function bindEvents() {
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentSearch = searchInput.value;
      writeHash();
      render();
    }, 200);
  });

  document.querySelectorAll('[data-profile]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilters.profile = btn.dataset.profile;
      document.querySelectorAll('[data-profile]').forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
      writeHash();
      render();
    });
  });

  document.querySelectorAll('[data-difficulty]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilters.difficulty = btn.dataset.difficulty;
      document.querySelectorAll('[data-difficulty]').forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
      writeHash();
      render();
    });
  });

  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentSort = btn.dataset.sort;
      document.querySelectorAll('[data-sort]').forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
      writeHash();
      render();
    });
  });

  grid.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      e.stopPropagation();
      copyToClipboard(copyBtn.dataset.cmd, copyBtn);
      return;
    }

    const card = e.target.closest('.template-card');
    if (!card) return;

    const id = card.dataset.id;
    const repo = card.dataset.repo;
    const template = allTemplates.find((item) => item.id === id && item.repo === repo);
    if (template) openModal(template);
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.getElementById('modal-copy-btn').addEventListener('click', () => {
    const cmd = document.getElementById('modal-install-cmd').textContent;
    copyToClipboard(cmd, document.getElementById('modal-copy-btn'));
  });

  window.addEventListener('hashchange', () => {
    readHash();
    syncUIFromState();
    render();
  });
}

// ===== Modal =====
function openModal(template) {
  const imageLink = getOriginalImageLink(template);
  if (template.sample_image) {
    modalImage.src = template.sample_image;
    modalImage.alt = template.title_en;
    modalImageLink.classList.remove('is-disabled');
    if (imageLink) {
      modalImageLink.href = imageLink;
    } else {
      modalImageLink.removeAttribute('href');
    }
  } else {
    modalImage.removeAttribute('src');
    modalImage.alt = `${template.title_en} preview unavailable`;
    modalImageLink.removeAttribute('href');
    modalImageLink.classList.add('is-disabled');
  }

  document.getElementById('modal-title').textContent = template.title_en;
  document.getElementById('modal-subtitle').textContent = template.title;
  document.getElementById('modal-desc').textContent = template.description;
  document.getElementById('modal-author').textContent = template.author;
  document.getElementById('modal-version').textContent = template.version;
  document.getElementById('modal-aspect').textContent = template.aspect;
  document.getElementById('modal-updated').textContent = template.updated;
  document.getElementById('modal-install-cmd').textContent = template.install_cmd;

  document.getElementById('modal-badges').innerHTML = `
    <span class="badge badge-profile ${escAttr(template.profile)}">${escHtml(template.profile)}</span>
    <span class="badge badge-difficulty">${escHtml(template.difficulty)}</span>
  `;

  document.getElementById('modal-tags').innerHTML = (template.tags || [])
    .map((tag) => `<span class="tag">${escHtml(tag)}</span>`)
    .join('');

  const linksHtml = renderTemplateLinks(template);
  modalLinks.innerHTML = linksHtml;
  modalLinks.hidden = !linksHtml;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderTemplateLinks(template) {
  const links = [];
  const templateUrl = getTemplateUrl(template);
  const originalImageUrl = getOriginalImageLink(template);

  if (templateUrl) {
    links.push({ href: templateUrl, label: 'Template Source' });
  }
  if (originalImageUrl) {
    links.push({ href: originalImageUrl, label: 'Original Image' });
  }

  return links
    .map((link) => `<a class="modal-link" href="${escAttr(link.href)}" target="_blank" rel="noopener">${escHtml(link.label)}</a>`)
    .join('');
}

function getTemplateUrl(template) {
  if (template.template_url) return template.template_url;
  if (!template.repo) return '';

  const templatePath = template.template_path || `references/templates/${template.id}`;
  return `https://github.com/${template.repo}/tree/main/${templatePath}`;
}

function getOriginalImageLink(template) {
  if (template.sample_image_page_url) return template.sample_image_page_url;
  return template.sample_image || '';
}

// ===== Clipboard =====
async function copyToClipboard(text, btn) {
  const originalLabel = btn.textContent;

  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = originalLabel;
      btn.classList.remove('copied');
    }, 1500);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = originalLabel;
      btn.classList.remove('copied');
    }, 1500);
  }
}

// ===== Helpers =====
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== Boot =====
init();
