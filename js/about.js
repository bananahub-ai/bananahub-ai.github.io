import { initGitHubStars } from './github-stars.js';
import { initI18n, syncLanguageFromLocation } from './i18n.js';

const PAGE = 'about';

initI18n({ page: PAGE });
initGitHubStars();

window.addEventListener('popstate', () => {
  syncLanguageFromLocation(PAGE);
});
