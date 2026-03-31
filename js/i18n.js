const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'bananahub-language';
const SUPPORTED_LANGUAGES = new Set(['en', 'zh-CN']);

const translations = {
  en: {
    common: {
      brandNote: 'for Nano Banana Skill',
      skipToCatalog: 'Skip to catalog',
      skipToContent: 'Skip to content',
      primaryNav: 'Primary',
      languageSwitcher: 'Language',
      nav: {
        home: 'Home',
        catalog: 'Catalog',
        about: 'About',
        github: 'GitHub',
        agentFriendly: 'Agent-Friendly',
      },
      filter: {
        all: 'All',
      },
      source: {
        curated: 'Curated',
        discovered: 'Discovered',
      },
      profile: {
        general: 'General',
        photo: 'Photo',
        sticker: 'Sticker',
        product: 'Product',
        diagram: 'Diagram',
        minimal: 'Minimal',
        illustration: 'Illustration',
        'text-heavy': 'Text-heavy',
        '3d': '3D',
        'concept-art': 'Concept Art',
      },
      difficulty: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      type: {
        prompt: 'Prompt',
        workflow: 'Workflow',
      },
      badge: {
        pinned: 'Pinned',
        featured: 'Featured',
        official: 'Official',
        community: 'Community',
      },
      preview: {
        loading: 'Loading preview',
        unavailable: 'Preview unavailable',
        open: 'Open preview',
        source: 'Preview Source',
        openOriginal: 'Open original',
      },
      template: {
        source: 'Template Source',
        noTags: 'No tags',
        noDescription: 'No description provided yet.',
      },
      action: {
        close: 'Close',
        copy: 'Copy',
        copied: 'Copied',
        copyInstall: 'Copy install',
        source: 'Source',
      },
      value: {
        unknown: 'Unknown',
        unavailable: 'Unavailable',
        na: 'n/a',
        loading: 'Loading',
      },
      aria: {
        openDetails: 'Open details for {title}',
        previewUnavailable: '{title} preview unavailable',
      },
      results: {
        templateCount: '{count} templates',
        singleTemplateCount: '{count} template',
        profileCount: '{count} profiles',
        singleProfileCount: '{count} profile',
        sortedByInstalls: 'sorted by installs',
        sortedByTrending: 'sorted by 24h trend',
        filteredBy: 'filtered by {details}',
        query: 'query "{value}"',
        source: 'source {value}',
        profile: 'profile {value}',
        difficulty: 'difficulty {value}',
        noMatch: 'No templates match the current search and filter combination.',
        shareableHint: 'The current gallery view is encoded in the URL, so you can share this exact filter state.',
        defaultHint: 'Click a card for the full brief, or use the install button directly. Catalog refreshed {date} UTC.',
        loadFailedSummary: 'The catalog could not be loaded.',
        loadFailedHint: 'Refresh the page or open catalog.json directly to inspect the generated catalog.',
      },
      card: {
        installs24h: '{count} installs / 24h',
        installs: 'installs',
        installCountAria: '{count} installs total',
      },
      empty: {
        loadFailedTitle: 'Failed to load templates.',
        loadFailedBody: 'Please refresh the page or open catalog.json directly.',
        noMatchTitle: 'No templates match the current view.',
        noMatchBody: 'Try removing a filter, switching sort mode, or resetting the search.',
      },
    },
    index: {
      meta: {
        title: 'BananaHub | Installable Templates for Nano Banana',
        description: "Browse installable prompt and workflow templates for Nano Banana's agent-native image workflow, compare generated looks, and install only the template that fits the current job.",
        ogTitle: 'BananaHub | Installable Templates for Nano Banana',
        ogDescription: "A visual gallery of installable prompt and workflow templates for Nano Banana's agent-native image workflow.",
      },
      hero: {
        eyebrow: 'Installable Templates',
        title: 'Plug reusable prompt and workflow templates into your Nano Banana workflow.',
        lead: 'Nano Banana handles constraint extraction and guided optimization in chat. BananaHub lets you browse validated outputs, find the right template, and install only what the current job needs.',
        metrics: {
          indexedTemplates: 'indexed templates',
          profilesCovered: 'profiles covered',
          lastRebuild: 'last rebuild',
        },
        actions: {
          browseTemplates: 'Browse templates',
          browseGitHub: 'Browse GitHub',
          about: 'About BananaHub',
        },
        note: 'This is a gallery of reusable modules, not a giant prompt dump. Open a card for the brief, source, preview, and install command.',
      },
      catalog: {
        kicker: 'Live Catalog',
        title: 'A searchable gallery of installable templates',
        status: {
          shown: 'shown',
          curated: 'curated',
          discovered: 'discovered',
        },
      },
      filters: {
        search: 'Search',
        searchPlaceholder: 'Search by template name, type, tag, profile, author, or intent in English or Chinese',
        source: 'Source',
        sourceAria: 'Filter by source layer',
        profile: 'Profile',
        difficulty: 'Difficulty',
        sort: 'Sort',
        sortAria: 'Sort templates',
        mostInstalled: 'Most installed',
        trending24h: 'Trending 24h',
        reset: 'Reset filters',
      },
      agent: {
        kicker: 'Agent-Friendly',
        title: 'Stable files for agents in the same workflow',
        lead: 'If you are integrating BananaHub into automation, read these files directly instead of scraping the visual gallery.',
        installPattern: 'Install pattern',
      },
      footer: {
        copy: "Installable template gallery for Nano Banana's agent-native image workflow, with stable files for machine-readable access when needed.",
        templateSystem: 'Template System',
        submitTemplate: 'Submit Template',
        meta: 'BananaHub keeps the base skill lean and distributes reusable templates across the Nano Banana ecosystem.',
      },
      modal: {
        kicker: 'Template Brief',
        author: 'Author',
        version: 'Version',
        aspect: 'Aspect',
        updated: 'Updated',
        installs: 'Installs',
        installs24h: '24h installs',
        installCommand: 'Install command',
        viewFullImage: 'View full image',
      },
      lightbox: {
        close: 'Close full image',
      },
      structuredData: {
        pageDescription: 'Installable prompt and workflow template hub for Nano Banana Skill.',
        catalogName: 'BananaHub Catalog',
        catalogDescription: 'Catalog of {count} installable prompt and workflow templates for Nano Banana Skill.',
      },
    },
    about: {
      meta: {
        title: 'About BananaHub | Installable Template Network for Nano Banana',
        description: 'Learn how BananaHub fits into the Nano Banana product: a searchable, installable template network for an agent-native image workflow.',
        ogTitle: 'About BananaHub | Installable Template Network for Nano Banana',
        ogDescription: 'What BananaHub is, why it exists, and how humans, authors, and agents should use this installable template network.',
      },
      hero: {
        eyebrow: 'About BananaHub',
        title: 'The installable template network behind Nano Banana.',
        lead: 'Nano Banana is the agent-native runtime for guided image generation in chat. BananaHub is the searchable, installable, machine-readable layer that lets reusable prompt and workflow structures travel without bloating the base skill.',
        actions: {
          openGallery: 'Open gallery',
          templateSystem: 'Template System',
          templateFormat: 'Template Format',
        },
        note: 'Humans should usually start in the gallery. Agents should prefer `llms.txt`, `catalog.json`, and `agent-catalog.md`.',
      },
      manifesto: {
        kicker: 'What BananaHub Is',
        title: 'Not a prompt dump. A distribution layer for reusable templates.',
        lead: 'BananaHub exists so Nano Banana can stay focused on the live workflow while reusable prompt and workflow structures remain searchable, installable, and portable across repositories.',
      },
      principles: {
        first: {
          title: 'Agent-native first',
          body: 'The skill owns the conversation, constraint extraction, clarification, and iteration. BananaHub should plug into that workflow, not replace it with a separate prompt-builder maze.',
        },
        second: {
          title: 'Progressive disclosure over overload',
          body: 'Users should see only enough structure to make the next good decision: gallery first, template details on demand, full source only when it is needed.',
        },
        third: {
          title: 'Searchable, installable, machine-readable',
          body: 'Templates should be discoverable by humans, installable by CLI, and readable by agents from stable files without scraping the website UI.',
        },
      },
      machineFiles: {
        kicker: 'Machine Files',
        title: 'Use these files directly for automation.',
        lead: 'They mirror the public catalog and are the preferred interface for agents, scripts, and workflow tooling.',
        installPattern: 'Install pattern',
      },
      contribute: {
        kicker: 'Contribution Loop',
        title: 'A decentralized template network, not a monolithic prompt library.',
        authors: {
          title: 'For template authors',
          body: 'Publish self-describing template folders in GitHub, follow the Nano Banana template format, and get indexed through the catalog source. Your modules stay portable in your repo; BananaHub stays lightweight.',
          link: 'Read the template spec',
        },
        agents: {
          title: 'For advanced users and agents',
          body: 'Use the catalog to detect a likely match, inspect the source template when needed, and install only the exact module that improves the current task.',
          link: 'Open the bananahub CLI',
        },
      },
      footer: {
        copy: "Installable template gallery for Nano Banana's agent-native image workflow, with stable files for machine-readable access when needed.",
        templateSystem: 'Template System',
        meta: 'BananaHub keeps the base skill lean and distributes reusable templates across the Nano Banana ecosystem.',
      },
    },
  },
  'zh-CN': {
    common: {
      brandNote: '适用于 Nano Banana Skill',
      skipToCatalog: '跳转到模板目录',
      skipToContent: '跳转到正文',
      primaryNav: '主导航',
      languageSwitcher: '语言切换',
      nav: {
        home: '首页',
        catalog: '目录',
        about: '关于',
        github: 'GitHub',
        agentFriendly: '适合 Agent',
      },
      filter: {
        all: '全部',
      },
      source: {
        curated: '精选',
        discovered: '发现',
      },
      profile: {
        general: '通用',
        photo: '写真',
        sticker: '贴纸',
        product: '产品',
        diagram: '图解',
        minimal: '极简',
        illustration: '插画',
        'text-heavy': '文字设计',
        '3d': '3D',
        'concept-art': '概念设计',
      },
      difficulty: {
        beginner: '新手',
        intermediate: '进阶',
        advanced: '高级',
      },
      type: {
        prompt: '提示模板',
        workflow: '工作流',
      },
      badge: {
        pinned: '置顶',
        featured: '推荐',
        official: '官方',
        community: '社区',
      },
      preview: {
        loading: '正在加载预览',
        unavailable: '暂无预览',
        open: '打开预览',
        source: '预览来源',
        openOriginal: '查看原图',
      },
      template: {
        source: '模板源码',
        noTags: '暂无标签',
        noDescription: '这个模板暂时还没有描述。',
      },
      action: {
        close: '关闭',
        copy: '复制',
        copied: '已复制',
        copyInstall: '复制安装命令',
        source: '源码',
      },
      value: {
        unknown: '未知',
        unavailable: '不可用',
        na: '未设置',
        loading: '加载中',
      },
      aria: {
        openDetails: '打开 {title} 的详情',
        previewUnavailable: '{title} 暂无预览',
      },
      results: {
        templateCount: '{count} 个模板',
        singleTemplateCount: '{count} 个模板',
        profileCount: '{count} 个分类',
        singleProfileCount: '{count} 个分类',
        sortedByInstalls: '按安装量排序',
        sortedByTrending: '按 24 小时趋势排序',
        filteredBy: '筛选条件：{details}',
        query: '搜索 “{value}”',
        source: '来源 {value}',
        profile: '分类 {value}',
        difficulty: '难度 {value}',
        noMatch: '当前搜索和筛选条件下没有匹配的模板。',
        shareableHint: '当前视图状态已经编码进 URL，可以直接分享这个筛选结果。',
        defaultHint: '点击卡片查看完整说明，或直接复制安装命令。目录最近一次刷新时间：{date} UTC。',
        loadFailedSummary: '目录加载失败。',
        loadFailedHint: '请刷新页面，或直接打开 catalog.json 查看生成结果。',
      },
      card: {
        installs24h: '{count} 次安装 / 24h',
        installs: '安装量',
        installCountAria: '累计安装 {count} 次',
      },
      empty: {
        loadFailedTitle: '模板加载失败。',
        loadFailedBody: '请刷新页面，或直接打开 catalog.json。',
        noMatchTitle: '当前视图没有匹配的模板。',
        noMatchBody: '试试去掉某个筛选条件，切换排序方式，或者重置搜索。',
      },
    },
    index: {
      meta: {
        title: 'BananaHub | 面向 Nano Banana 的可安装模板目录',
        description: '浏览适用于 Nano Banana agent-native 图像工作流的可安装 prompt 与 workflow 模板，对比实际输出效果，只安装当前任务真正需要的模块。',
        ogTitle: 'BananaHub | 面向 Nano Banana 的可安装模板目录',
        ogDescription: '一个面向 Nano Banana agent-native 图像工作流的 prompt 与 workflow 模板可视化目录。',
      },
      hero: {
        eyebrow: '可安装模板',
        title: '把可复用的 prompt 与 workflow 模板接入你的 Nano Banana 工作流。',
        lead: 'Nano Banana 负责在对话中做约束提取和引导式优化。BananaHub 负责展示已验证的输出、帮你找到合适模板，并只安装当前任务需要的那一个。',
        metrics: {
          indexedTemplates: '已索引模板',
          profilesCovered: '覆盖分类',
          lastRebuild: '最近重建',
        },
        actions: {
          browseTemplates: '浏览模板',
          browseGitHub: '查看 GitHub',
          about: '了解 BananaHub',
        },
        note: '这里是可复用模块的目录，不是一个无限膨胀的 prompt 大杂烩。打开卡片即可查看简介、源码、预览图和安装命令。',
      },
      catalog: {
        kicker: '实时目录',
        title: '一个可搜索的安装式模板画廊',
        status: {
          shown: '当前显示',
          curated: '精选',
          discovered: '发现',
        },
      },
      filters: {
        search: '搜索',
        searchPlaceholder: '按模板名、类型、标签、分类、作者或意图搜索，支持中英文',
        source: '来源',
        sourceAria: '按来源筛选',
        profile: '分类',
        difficulty: '难度',
        sort: '排序',
        sortAria: '模板排序',
        mostInstalled: '安装量最高',
        trending24h: '24 小时趋势',
        reset: '重置筛选',
      },
      agent: {
        kicker: '适合 Agent',
        title: '适合放进同一工作流里的稳定文件',
        lead: '如果你要把 BananaHub 接进自动化或 agent 流程，优先直接读取这些稳定文件，而不是去抓视觉页面。',
        installPattern: '安装格式',
      },
      footer: {
        copy: '一个面向 Nano Banana agent-native 图像工作流的可安装模板目录，并提供适合机器读取的稳定文件。',
        templateSystem: '模板系统',
        submitTemplate: '提交模板',
        meta: 'BananaHub 让基础 skill 保持轻量，同时把可复用模板分发到整个 Nano Banana 生态。',
      },
      modal: {
        kicker: '模板简介',
        author: '作者',
        version: '版本',
        aspect: '比例',
        updated: '更新日期',
        installs: '安装量',
        installs24h: '24 小时安装量',
        installCommand: '安装命令',
        viewFullImage: '查看大图',
      },
      lightbox: {
        close: '关闭大图',
      },
      structuredData: {
        pageDescription: '适用于 Nano Banana Skill 的可安装 prompt 与 workflow 模板目录。',
        catalogName: 'BananaHub 模板目录',
        catalogDescription: '一个包含 {count} 个可安装 prompt 与 workflow 模板的 Nano Banana Skill 目录。',
      },
    },
    about: {
      meta: {
        title: '关于 BananaHub | 面向 Nano Banana 的可安装模板网络',
        description: '了解 BananaHub 在 Nano Banana 产品中的位置：一个面向 agent-native 图像工作流的可搜索、可安装模板网络。',
        ogTitle: '关于 BananaHub | 面向 Nano Banana 的可安装模板网络',
        ogDescription: 'BananaHub 是什么、为什么存在，以及人类、作者和 agent 应该如何使用这套可安装模板网络。',
      },
      hero: {
        eyebrow: '关于 BananaHub',
        title: 'Nano Banana 背后的可安装模板网络。',
        lead: 'Nano Banana 是在对话里进行引导式图像生成的 agent-native runtime。BananaHub 则是它的可搜索、可安装、可机器读取分发层，让可复用的 prompt 和 workflow 结构能够独立传播，而不会把基础 skill 越做越重。',
        actions: {
          openGallery: '打开画廊',
          templateSystem: '模板系统',
          templateFormat: '模板格式',
        },
        note: '普通用户通常应该从画廊开始。Agent 则应该优先读取 `llms.txt`、`catalog.json` 和 `agent-catalog.md`。',
      },
      manifesto: {
        kicker: 'BananaHub 是什么',
        title: '不是 prompt 堆积场，而是可复用模板的分发层。',
        lead: 'BananaHub 的存在，是为了让 Nano Banana 专注实时工作流本身，而让可复用的 prompt 与 workflow 结构保持可搜索、可安装、可在不同仓库之间迁移。',
      },
      principles: {
        first: {
          title: '首先服务于 agent-native 工作流',
          body: '技能层负责对话、约束提取、澄清和迭代。BananaHub 应该接入这个流程，而不是用另一套 prompt 拼装迷宫去替代它。',
        },
        second: {
          title: '渐进披露优于信息过载',
          body: '用户只需要看到足够做出下一步好决策的结构：先看画廊，需要时再看模板详情，只有在必要时才深入源码。',
        },
        third: {
          title: '可搜索、可安装、可机器读取',
          body: '模板应该既能被人发现，也能被 CLI 安装，还能被 agent 从稳定文件中直接读取，而不需要解析网站界面。',
        },
      },
      machineFiles: {
        kicker: '机器文件',
        title: '自动化场景请直接使用这些文件。',
        lead: '它们镜像了公开目录，是 agent、脚本和工作流工具的优先接口。',
        installPattern: '安装格式',
      },
      contribute: {
        kicker: '贡献闭环',
        title: '一个去中心化的模板网络，而不是一个单体 prompt 库。',
        authors: {
          title: '面向模板作者',
          body: '在 GitHub 中发布自描述模板目录，遵循 Nano Banana 的模板格式，并通过 catalog source 进入索引。你的模块仍然保留在自己的仓库里，BananaHub 也能保持轻量。',
          link: '查看模板规范',
        },
        agents: {
          title: '面向高级用户和 Agent',
          body: '利用目录先找出可能匹配的模板，需要时再检查源码，并且只安装能改善当前任务的那个精确模块。',
          link: '打开 bananahub CLI',
        },
      },
      footer: {
        copy: '一个面向 Nano Banana agent-native 图像工作流的可安装模板目录，并提供适合机器读取的稳定文件。',
        templateSystem: '模板系统',
        meta: 'BananaHub 让基础 skill 保持轻量，同时把可复用模板分发到整个 Nano Banana 生态。',
      },
    },
  },
};

let currentLanguage = DEFAULT_LANGUAGE;
const listeners = new Set();

function resolveTranslation(language, key) {
  return key.split('.').reduce((acc, part) => (acc && Object.prototype.hasOwnProperty.call(acc, part) ? acc[part] : undefined), translations[language]);
}

function interpolate(template, replacements) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? '');
}

export function normalizeLanguage(value) {
  const input = String(value || '').trim().toLowerCase();
  if (!input) {
    return DEFAULT_LANGUAGE;
  }

  if (input === 'zh' || input === 'zh-cn' || input === 'zh-hans' || input.startsWith('zh-')) {
    return 'zh-CN';
  }

  return 'en';
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function getCurrentLocale() {
  return currentLanguage === 'zh-CN' ? 'zh-CN' : 'en-US';
}

export function t(key, replacements = {}, fallback = key) {
  const value = resolveTranslation(currentLanguage, key)
    ?? resolveTranslation(DEFAULT_LANGUAGE, key)
    ?? fallback;
  return interpolate(value, replacements);
}

export function translateEnum(group, value, fallback = value) {
  return t(`common.${group}.${value}`, {}, fallback);
}

function readLanguageFromStorage() {
  try {
    return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function readLanguageFromUrl() {
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang');
  return lang ? normalizeLanguage(lang) : '';
}

function getInitialLanguage() {
  const urlLanguage = readLanguageFromUrl();
  if (urlLanguage) {
    return urlLanguage;
  }

  try {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (storedLanguage) {
      return normalizeLanguage(storedLanguage);
    }
  } catch {
    // Ignore storage errors.
  }

  return normalizeLanguage(window.navigator.language || DEFAULT_LANGUAGE);
}

function syncDocumentLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.setAttribute('data-language', currentLanguage);
}

function syncLanguageButtons(root = document) {
  root.querySelectorAll('[data-lang-switch]').forEach((button) => {
    const isActive = normalizeLanguage(button.dataset.langSwitch) === currentLanguage;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateLanguageInUrl() {
  const url = new URL(window.location.href);
  if (currentLanguage === DEFAULT_LANGUAGE) {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', currentLanguage);
  }
  window.history.replaceState(null, '', url);
}

function notifyLanguageChange() {
  listeners.forEach((listener) => listener(currentLanguage));
}

export function applyPageTranslations(page, root = document) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });

  root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });

  root.querySelectorAll('[data-i18n-content]').forEach((element) => {
    element.setAttribute('content', t(element.dataset.i18nContent));
  });

  syncDocumentLanguage();
  syncLanguageButtons(root);

  if (page === 'index' && document.title !== t('index.meta.title')) {
    document.title = t('index.meta.title');
  }

  if (page === 'about' && document.title !== t('about.meta.title')) {
    document.title = t('about.meta.title');
  }
}

export function initI18n({ page } = {}) {
  currentLanguage = getInitialLanguage();
  syncDocumentLanguage();
  if (page) {
    applyPageTranslations(page);
  } else {
    syncLanguageButtons();
  }

  document.querySelectorAll('[data-lang-switch]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextLanguage = normalizeLanguage(button.dataset.langSwitch);
      if (nextLanguage === currentLanguage) {
        return;
      }

      currentLanguage = nextLanguage;
      try {
        window.localStorage.setItem(STORAGE_KEY, currentLanguage);
      } catch {
        // Ignore storage errors.
      }
      updateLanguageInUrl();
      if (page) {
        applyPageTranslations(page);
      } else {
        syncDocumentLanguage();
        syncLanguageButtons();
      }
      notifyLanguageChange();
    });
  });
}

export function syncLanguageFromLocation(page) {
  const urlLanguage = readLanguageFromUrl();
  const nextLanguage = urlLanguage || readLanguageFromStorage();
  const normalized = normalizeLanguage(nextLanguage);
  if (normalized === currentLanguage) {
    return false;
  }

  currentLanguage = normalized;
  if (page) {
    applyPageTranslations(page);
  } else {
    syncDocumentLanguage();
    syncLanguageButtons();
  }
  notifyLanguageChange();
  return true;
}

export function subscribeLanguageChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
