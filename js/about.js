import { initI18n, syncLanguageFromLocation } from './i18n.js';

const PAGE = 'about';

initI18n({ page: PAGE });

window.addEventListener('popstate', () => {
  syncLanguageFromLocation(PAGE);
});
