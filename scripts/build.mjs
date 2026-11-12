import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { parseCodelab } from './parse.mjs';

const root = resolve(import.meta.dirname, '..');
const source = readFileSync(join(root, 'signals-resources-signal-forms.md'), 'utf8');
const { meta, title, steps } = parseCodelab(source);

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PASTE = /(?:Replace the contents of|Create) `([^`]+)` with the code below/;
const minutes = (d) => {
  const [h, m, s] = d.split(':').map(Number);
  return Math.round(h * 60 + m + s / 60);
};

function renderStep(markdown) {
  const md = markdown.replaceAll('{{repo}}', meta.repo ?? '');
  let pendingFile = null;
  const marked = new Marked({
    gfm: true,
    walkTokens(token) {
      if (token.type === 'paragraph') pendingFile = token.raw.match(PASTE)?.[1] ?? null;
      if (token.type === 'code') {
        token.file = pendingFile;
        pendingFile = null;
      }
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

const rendered = steps.map((step, i) => ({
  n: i + 1,
  title: step.title,
  minutes: minutes(step.duration),
  html: renderStep(step.markdown),
}));
const total = rendered.reduce((sum, s) => sum + s.minutes, 0);

const sections = rendered
  .map(
    (s) => `<section class="step" id="s${s.n}" data-step="${s.n}" data-minutes="${s.minutes}" hidden>
  <h2><span class="num">${s.n}.</span> ${escapeHtml(s.title)}</h2>
  ${s.html}
</section>`,
  )
  .join('\n');

const nav = rendered
  .map(
    (s) =>
      `<li><a href="#${s.n}" data-step="${s.n}"><span class="dot">${s.n}</span><span class="label">${escapeHtml(s.title)}</span></a></li>`,
  )
  .join('\n');

const css = readFileSync(join(import.meta.dirname, 'codelab.css'), 'utf8');
const js = readFileSync(join(import.meta.dirname, 'codelab.js'), 'utf8');

const updated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const shortTitle = 'Signals, Resources, Signal Forms';
const content = `<title>${shortTitle}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${escapeHtml(meta.summary ?? '')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
${css}
</style>
<header class="topbar">
  <button type="button" class="menu" aria-label="Show steps" aria-expanded="false" aria-controls="steps">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  </button>
  <div class="heading">
    <p class="eyebrow">DevFest Lagos 2026 · Codelab</p>
    <h1>${escapeHtml(title)}</h1>
  </div>
  <p class="remaining"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span id="remaining">${total} mins remaining</span></p>
  <div class="progress" aria-hidden="true"><span id="bar"></span></div>
</header>
<div class="layout">
  <nav class="steps" id="steps" aria-label="Codelab steps">
    <ol>
${nav}
    </ol>
    <p class="meta">${escapeHtml(meta.authors ?? '')} · ${total} min</p>
  </nav>
  <main>
    <header class="about" id="about">
      <h2 class="about-title">${escapeHtml(title)}</h2>
      <div class="card about-card">
        <h3>About this codelab</h3>
        <p class="about-row"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 6h16M4 10h16M4 14h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Last updated ${updated}</span></p>
        <p class="about-row"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="9.5" r="3.5" fill="var(--surface)"/><path d="M5.5 18.5c1.5-2.6 3.8-3.9 6.5-3.9s5 1.3 6.5 3.9" fill="var(--surface)"/></svg><span>Written by <a href="https://www.linkedin.com/in/babatundelmd" target="_blank" rel="noopener">${escapeHtml(meta.authors ?? '')}</a></span></p>
      </div>
    </header>
    <article class="card">
${sections}
    </article>
    <div class="pager">
      <button type="button" class="btn" id="back">Back</button>
      <button type="button" class="btn primary" id="next">Next</button>
    </div>
  </main>
</div>
<script>
${js}
</script>
`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${content.split('<header class="topbar">')[0]}</head>
<body>
<header class="topbar">${content.split('<header class="topbar">')[1]}</body>
</html>
`;

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/index.html'), page);
writeFileSync(join(root, 'dist/artifact.html'), content);
console.log(`Built ${rendered.length} steps, ${total} minutes, into dist/index.html`);
