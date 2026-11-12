import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { parseCodelab, parseTranslation } from './parse.mjs';

const root = resolve(import.meta.dirname, '..');
const NAME = 'signals-resources-signal-forms';

export const LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    file: `${NAME}.md`,
    locale: 'en-US',
    ui: {
      eyebrow: 'DevFest Lagos 2026 · Codelab',
      remaining: '{n} mins remaining',
      remainingOne: '1 min remaining',
      back: 'Back',
      next: 'Next',
      copy: 'Copy',
      copied: 'Copied',
      copyFallback: 'Press ⌘C / Ctrl+C',
      about: 'About this codelab',
      updated: 'Last updated',
      writtenBy: 'Written by',
      steps: 'Codelab steps',
      showSteps: 'Show steps',
      toLight: 'Switch to light mode',
      toDark: 'Switch to dark mode',
      language: 'Language',
    },
  },
  {
    code: 'pcm',
    label: 'Pidgin',
    file: `${NAME}.pcm.md`,
    locale: 'en-NG',
    ui: {
      eyebrow: 'DevFest Lagos 2026 · Codelab',
      remaining: '{n} mins remain',
      remainingOne: '1 min remain',
      back: 'Go back',
      next: 'Next',
      copy: 'Copy',
      copied: 'E don copy',
      copyFallback: 'Press ⌘C / Ctrl+C',
      about: 'About dis codelab',
      updated: 'Last update',
      writtenBy: 'Person wey write am:',
      steps: 'Codelab steps',
      showSteps: 'Show the steps',
      toLight: 'Change am to light mode',
      toDark: 'Change am to dark mode',
      language: 'Language',
    },
  },
  {
    code: 'yo',
    label: 'Yorùbá',
    file: `${NAME}.yo.md`,
    locale: 'yo-NG',
    ui: {
      eyebrow: 'DevFest Lagos 2026 · Codelab',
      remaining: 'Ìṣẹ́jú {n} ló kù',
      remainingOne: 'Ìṣẹ́jú 1 ló kù',
      back: 'Padà',
      next: 'Tẹ̀síwájú',
      copy: 'Ṣàdàkọ',
      copied: 'A ti ṣàdàkọ',
      copyFallback: 'Tẹ ⌘C / Ctrl+C',
      about: 'Nípa codelab yìí',
      updated: 'Àtúnṣe tó kẹ́yìn',
      writtenBy: 'Olùkọ̀wé:',
      steps: 'Àwọn ìgbésẹ̀ codelab',
      showSteps: 'Fi àwọn ìgbésẹ̀ hàn',
      toLight: 'Yí padà sí ojú ìmọ́lẹ̀',
      toDark: 'Yí padà sí ojú òkùnkùn',
      language: 'Èdè',
    },
  },
];

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const minutes = (d) => {
  const [h, m, s] = d.split(':').map(Number);
  return Math.round(h * 60 + m + s / 60);
};

function renderStep(markdown, blocks, meta) {
  const md = markdown.replaceAll('{{repo}}', meta.repo ?? '');
  let index = 0;
  const marked = new Marked({
    gfm: true,
    walkTokens(token) {
      if (token.type === 'code') token.file = blocks[index++]?.file ?? null;
    },
    renderer: {
      code({ text, lang, file }) {
        const language = lang && hljs.getLanguage(lang) ? lang : null;
        const body = language ? hljs.highlight(text, { language }).value : escapeHtml(text);
        const head = file
          ? `<div class="code-head"><span class="file">${escapeHtml(file)}</span><button type="button" class="copy">Copy</button></div>`
          : `<div class="code-head plain"><span class="lang">${escapeHtml(lang || 'text')}</span><button type="button" class="copy">Copy</button></div>`;
        return `<figure class="code${file ? ' paste' : ''}">${head}<pre><code>${body}</code></pre></figure>`;
      },
      link({ href, text }) {
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${text}</a>`;
      },
      table(token) {
        const cell = (c) => this.parser.parseInline(c.tokens);
        const head = token.header.map((c) => `<th>${cell(c)}</th>`).join('');
        const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join('')}</tr>`).join('');
        return `<div class="table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    },
  });
  return marked.parse(md);
}

export function loadLanguages() {
  const english = parseCodelab(readFileSync(join(root, LANGUAGES[0].file), 'utf8'));
  return LANGUAGES.filter((l) => l.code === 'en' || existsSync(join(root, l.file))).map((lang) => ({
    ...lang,
    doc:
      lang.code === 'en'
        ? english
        : parseTranslation(readFileSync(join(root, lang.file), 'utf8'), english, lang.file),
  }));
}

function build() {
  const languages = loadLanguages();
  const english = languages[0].doc;
  const meta = english.meta;
  const total = english.steps.reduce((sum, s) => sum + minutes(s.duration), 0);
  const now = new Date();

  const packs = languages.map((lang) => {
    const { doc, ui } = lang;
    const updated = now.toLocaleDateString(lang.locale, { month: 'short', day: 'numeric', year: 'numeric' });
    const sections = doc.steps
      .map(
        (s, i) => `<section class="step" data-step="${i + 1}" data-minutes="${minutes(s.duration)}" hidden>
  <h2><span class="num">${i + 1}.</span> ${escapeHtml(s.title)}</h2>
  ${renderStep(s.markdown, s.blocks, meta)}
</section>`,
      )
      .join('\n');
    const nav = doc.steps
      .map(
        (s, i) =>
          `<li><a href="#${i + 1}" data-step="${i + 1}"><span class="dot">${i + 1}</span><span class="label">${escapeHtml(s.title)}</span></a></li>`,
      )
      .join('\n');
    return {
      nav: `<div class="pack" data-lang="${lang.code}" lang="${lang.code}" hidden>
      <ol>
${nav}
      </ol>
      <p class="meta">${escapeHtml(meta.authors ?? '')} · ${total} min</p>
    </div>`,
      main: `<div class="pack" data-lang="${lang.code}" lang="${lang.code}" hidden>
      <header class="about">
        <h2 class="about-title">${escapeHtml(doc.title)}</h2>
        <div class="card about-card">
          <h3>${escapeHtml(ui.about)}</h3>
          <p class="about-row"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 6h16M4 10h16M4 14h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>${escapeHtml(ui.updated)} ${escapeHtml(updated)}</span></p>
          <p class="about-row"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="9.5" r="3.5" fill="var(--surface)"/><path d="M5.5 18.5c1.5-2.6 3.8-3.9 6.5-3.9s5 1.3 6.5 3.9" fill="var(--surface)"/></svg><span>${escapeHtml(ui.writtenBy)} <a href="https://www.linkedin.com/in/babatundelmd" target="_blank" rel="noopener">${escapeHtml(meta.authors ?? '')}</a></span></p>
        </div>
      </header>
      <article class="card">
${sections}
      </article>
    </div>`,
    };
  });

  const i18n = Object.fromEntries(languages.map((l) => [l.code, l.ui]));
  const options = languages
    .map((l) => `<li><button type="button" role="menuitemradio" data-lang="${l.code}" lang="${l.code}">${escapeHtml(l.label)}</button></li>`)
    .join('\n');

  const css = readFileSync(join(import.meta.dirname, 'codelab.css'), 'utf8');
  const js = readFileSync(join(import.meta.dirname, 'codelab.js'), 'utf8');

  const head = `<title>Signals, Resources, Signal Forms</title>
<script>try { const t = localStorage.getItem('codelab-theme'); if (t) document.documentElement.dataset.theme = t; } catch {}</script>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${escapeHtml(meta.summary ?? '')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans:wght@400;500;600;700&display=swap">
<style>
${css}
</style>`;

  const body = `<header class="topbar">
  <button type="button" class="menu" aria-label="Show steps" aria-expanded="false" aria-controls="steps">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  </button>
  <div class="heading">
    <p class="eyebrow" data-ui="eyebrow">DevFest Lagos 2026 · Codelab</p>
    <h1>${escapeHtml(english.title)}</h1>
  </div>
  <p class="remaining"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span id="remaining">${total} mins remaining</span></p>
  <div class="lang">
    <button type="button" class="lang-button" id="lang-button" aria-haspopup="menu" aria-expanded="false" aria-controls="lang-menu">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
      <span id="lang-current">English</span>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>
    </button>
    <ul class="lang-menu" id="lang-menu" role="menu" hidden>
${options}
    </ul>
  </div>
  <button type="button" class="theme" id="theme" aria-label="Switch to light mode" title="Switch theme">
    <svg class="sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <svg class="moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
  </button>
  <div class="progress" aria-hidden="true"><span id="bar"></span></div>
</header>
<div class="layout">
  <nav class="steps" id="steps" aria-label="Codelab steps">
    ${packs.map((p) => p.nav).join('\n    ')}
  </nav>
  <main>
    ${packs.map((p) => p.main).join('\n    ')}
    <div class="pager">
      <button type="button" class="btn" id="back">Back</button>
      <button type="button" class="btn primary" id="next">Next</button>
    </div>
  </main>
</div>
<script>window.CODELAB_I18N = ${JSON.stringify(i18n)};</script>
<script>
${js}
</script>
`;

  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${body}</body>
</html>
`;

  mkdirSync(join(root, 'dist'), { recursive: true });
  writeFileSync(join(root, 'dist/index.html'), page);
  writeFileSync(join(root, 'dist/artifact.html'), `${head}\n${body}`);
  console.log(
    `Built ${english.steps.length} steps, ${total} minutes, in ${languages.map((l) => l.label).join(', ')}, into dist/index.html`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) build();
