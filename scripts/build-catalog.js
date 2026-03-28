#!/usr/bin/env node

// scripts/build-catalog.js
// Fetches template.md files from GitHub repos defined in catalog-source.json,
// parses YAML frontmatter, and builds catalog.json.
// No npm dependencies - uses Node.js built-in fetch (Node 18+).

const fs = require('fs');
const path = require('path');

const GITHUB_API = 'https://api.github.com';
const GITHUB_RAW = 'https://raw.githubusercontent.com';
const GITHUB_WEB = 'https://github.com';

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of yaml.split('\n')) {
    if (!line.trim()) continue;

    if (/^\s+-\s/.test(line) && currentKey) {
      const value = line.replace(/^\s+-\s*/, '').trim();
      if (!result[currentKey]) result[currentKey] = [];

      if (value.includes(': ')) {
        const obj = {};
        const [k, ...rest] = value.split(': ');
        obj[k.trim()] = parseValue(rest.join(': ').trim());
        if (!currentArray) currentArray = obj;
        else Object.assign(currentArray, obj);
      } else {
        if (currentArray) {
          result[currentKey].push(currentArray);
          currentArray = null;
        }
        result[currentKey].push(parseValue(value));
      }
      continue;
    }

    if (currentArray && currentKey) {
      if (!result[currentKey]) result[currentKey] = [];
      result[currentKey].push(currentArray);
      currentArray = null;
    }

    if (/^\s{4,}\w/.test(line) && currentArray) {
      const [k, ...rest] = line.trim().split(': ');
      currentArray[k.trim()] = parseValue(rest.join(': ').trim());
      continue;
    }

    const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (kvMatch) {
      if (currentArray && currentKey) {
        if (!result[currentKey]) result[currentKey] = [];
        result[currentKey].push(currentArray);
        currentArray = null;
      }

      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();

      if (val === '' || val === '|' || val === '>') {
        continue;
      }

      if (val.startsWith('[') && val.endsWith(']')) {
        result[currentKey] = val.slice(1, -1).split(',').map((s) => parseValue(s.trim()));
        continue;
      }

      result[currentKey] = parseValue(val);
    }
  }

  if (currentArray && currentKey) {
    if (!result[currentKey]) result[currentKey] = [];
    result[currentKey].push(currentArray);
  }

  return result;
}

function parseValue(val) {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null') return null;
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
    return val.slice(1, -1);
  }
  if (/^\d+$/.test(val)) return parseInt(val, 10);
  if (/^\d+\.\d+$/.test(val)) return parseFloat(val);
  return val;
}

function extractDescription(content) {
  const body = content.replace(/^---[\s\S]*?---/, '').trim();
  const descMatch = body.match(/##\s*描述\s*\n\n([\s\S]*?)(?=\n##|\n$|$)/);
  if (descMatch) return descMatch[1].trim();
  const lines = body.split('\n').filter((line) => line.trim() && !line.startsWith('#'));
  return lines[0] || '';
}

async function fetchWithRetry(url, headers, retries = 3) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') {
        const reset = parseInt(res.headers.get('x-ratelimit-reset') || '0', 10);
        const waitMs = Math.max((reset * 1000) - Date.now(), 1000);
        console.warn(`Rate limited. Waiting ${Math.ceil(waitMs / 1000)}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function fetchTemplateIds(repo, templatePath, headers) {
  const url = `${GITHUB_API}/repos/${repo}/contents/${templatePath}`;
  console.log(`  Fetching directory listing: ${url}`);
  const res = await fetchWithRetry(url, headers);
  if (!res.ok) {
    console.error(`  Failed to list templates: ${res.status} ${res.statusText}`);
    return [];
  }
  const items = await res.json();
  return items.filter((item) => item.type === 'dir').map((item) => item.name);
}

async function fetchTemplateContent(repo, templatePath, templateId, headers) {
  const url = `${GITHUB_RAW}/${repo}/main/${templatePath}/${templateId}/template.md`;
  console.log(`  Fetching: ${templateId}/template.md`);
  const res = await fetchWithRetry(url, headers);
  if (!res.ok) {
    console.error(`  Failed to fetch ${templateId}: ${res.status}`);
    return null;
  }
  return res.text();
}

function buildTemplatePath(templatePath, templateId) {
  return `${templatePath}/${templateId}`;
}

function buildSampleImageUrl(repo, templatePath, templateId, sampleFile) {
  return `${GITHUB_RAW}/${repo}/main/${templatePath}/${templateId}/${sampleFile}`;
}

function buildTemplateUrl(repo, templatePath, templateId) {
  return `${GITHUB_WEB}/${repo}/tree/main/${templatePath}/${templateId}`;
}

function buildSampleImagePageUrl(repo, templatePath, templateId, sampleFile) {
  return `${GITHUB_WEB}/${repo}/blob/main/${templatePath}/${templateId}/${sampleFile}`;
}

async function main() {
  const sourceFile = path.resolve(__dirname, '..', 'catalog-source.json');
  const outFile = path.resolve(__dirname, '..', 'catalog.json');

  console.log('BananaHub Catalog Builder');
  console.log('========================\n');

  const source = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'BananaHub-Catalog-Builder/1.0'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    console.log('Using GITHUB_TOKEN for authentication.\n');
  } else {
    console.log('No GITHUB_TOKEN found. Using unauthenticated requests (60/hr limit).\n');
  }

  const allTemplates = [];

  for (const repoConfig of source.repos) {
    console.log(`Processing repo: ${repoConfig.repo}`);
    const templateIds = await fetchTemplateIds(repoConfig.repo, repoConfig.path, headers);
    console.log(`  Found ${templateIds.length} templates: ${templateIds.join(', ')}\n`);

    for (const templateId of templateIds) {
      const content = await fetchTemplateContent(repoConfig.repo, repoConfig.path, templateId, headers);
      if (!content) continue;

      const fm = parseFrontmatter(content);
      if (!fm) {
        console.error(`  No frontmatter in ${templateId}`);
        continue;
      }

      const description = extractDescription(content);
      let sampleImage = '';
      let sampleImagePageUrl = '';

      if (fm.samples && fm.samples.length > 0) {
        const firstSample = fm.samples[0];
        const sampleFile = firstSample.file || firstSample;
        sampleImage = buildSampleImageUrl(repoConfig.repo, repoConfig.path, templateId, sampleFile);
        sampleImagePageUrl = buildSampleImagePageUrl(repoConfig.repo, repoConfig.path, templateId, sampleFile);
      }

      const template = {
        id: fm.id || templateId,
        title: fm.title || '',
        title_en: fm.title_en || fm.title || templateId,
        author: fm.author || 'unknown',
        version: fm.version || '1.0.0',
        profile: fm.profile || 'general',
        tags: fm.tags || [],
        aspect: fm.aspect || '1:1',
        difficulty: fm.difficulty || 'beginner',
        description,
        sample_image: sampleImage,
        sample_image_page_url: sampleImagePageUrl,
        repo: repoConfig.repo,
        repo_url: `${GITHUB_WEB}/${repoConfig.repo}`,
        template_path: buildTemplatePath(repoConfig.path, templateId),
        template_url: buildTemplateUrl(repoConfig.repo, repoConfig.path, templateId),
        official: repoConfig.official || false,
        install_cmd: `bananahub add ${repoConfig.repo}/${templateId}`,
        created: fm.created || new Date().toISOString().split('T')[0],
        updated: fm.updated || new Date().toISOString().split('T')[0]
      };

      allTemplates.push(template);
      console.log(`  + ${template.id} (${template.profile}, ${template.difficulty})`);
    }
    console.log('');
  }

  const catalog = {
    version: source.version,
    generated: new Date().toISOString(),
    templates: allTemplates
  };

  fs.writeFileSync(outFile, JSON.stringify(catalog, null, 2) + '\n');
  console.log(`Catalog written: ${outFile}`);
  console.log(`Total templates: ${allTemplates.length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
