const GITHUB_SKILL_REPO_API = 'https://api.github.com/repos/bananahub-ai/bananahub-skill';

let cachedStarsCount = null;
let pendingRequest = null;

function getTargets(root = document) {
  return [...root.querySelectorAll('[data-github-stars-count]')];
}

function formatCount(value) {
  if (typeof value !== 'number') {
    return '--';
  }

  const locale = document.documentElement.lang === 'zh-CN' ? 'zh-CN' : 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

function render(root = document) {
  const text = formatCount(cachedStarsCount);
  getTargets(root).forEach((element) => {
    element.textContent = text;
  });
}

async function fetchStarsCount() {
  if (typeof cachedStarsCount === 'number') {
    return cachedStarsCount;
  }

  if (!pendingRequest) {
    pendingRequest = fetch(GITHUB_SKILL_REPO_API, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`GitHub repo request failed with ${response.status}`);
        }

        const payload = await response.json();
        return typeof payload?.stargazers_count === 'number'
          ? payload.stargazers_count
          : null;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  cachedStarsCount = await pendingRequest;
  return cachedStarsCount;
}

export async function initGitHubStars(root = document) {
  render(root);

  try {
    await fetchStarsCount();
  } catch (error) {
    console.warn('Failed to load GitHub stars:', error);
  }

  render(root);
}
