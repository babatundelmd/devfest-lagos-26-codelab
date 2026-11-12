(() => {
  const I18N = window.CODELAB_I18N;
  const LANGS = Object.keys(I18N);
  const root = document.documentElement;
  const back = document.getElementById('back');
  const next = document.getElementById('next');
  const remaining = document.getElementById('remaining');
  const bar = document.getElementById('bar');
  const rail = document.getElementById('steps');
  const menu = document.querySelector('.menu');
  const langButton = document.getElementById('lang-button');
  const langMenu = document.getElementById('lang-menu');
  const langCurrent = document.getElementById('lang-current');
  const themeButton = document.getElementById('theme');

  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const load = (key) => { try { return localStorage.getItem(key); } catch { return null; } };

  let lang = (() => {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = load('codelab-lang');
    return LANGS.includes(saved) ? saved : LANGS[0];
  })();
  let step = 1;

  const packs = (selector) => document.querySelectorAll(`${selector} > .pack`);
  const active = (selector) => document.querySelector(`${selector} > .pack[data-lang="${lang}"]`);
  const steps = () => [...active('main').querySelectorAll('.step')];
  const total = () => steps().length;
  const ui = () => I18N[lang];

  const fromHash = () => {
    const n = Number(location.hash.slice(1));
    return Number.isInteger(n) && n >= 1 && n <= total() ? n : 0;
  };

  function render(scroll) {
    packs('main').forEach((p) => (p.hidden = p.dataset.lang !== lang));
    packs('#steps').forEach((p) => (p.hidden = p.dataset.lang !== lang));
    const list = steps();
    list.forEach((s, i) => (s.hidden = i + 1 !== step));
    active('#steps').querySelectorAll('a').forEach((a, i) => {
      a.classList.toggle('done', i + 1 < step);
      if (i + 1 === step) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    active('main').querySelector('.about').hidden = step !== 1;

    const t = ui();
    const left = list.slice(step - 1).reduce((sum, s) => sum + Number(s.dataset.minutes), 0);
    remaining.textContent = left === 1 ? t.remainingOne : t.remaining.replace('{n}', left);
    bar.style.width = `${((step - 1) / (list.length - 1)) * 100}%`;
    back.textContent = t.back;
    next.textContent = t.next;
    back.hidden = step === 1;
    next.hidden = step === list.length;
    document.querySelector('[data-ui="eyebrow"]').textContent = t.eyebrow;
    menu.setAttribute('aria-label', t.showSteps);
    rail.setAttribute('aria-label', t.steps);
    langButton.setAttribute('aria-label', t.language);
    document.querySelectorAll('.copy:not(.copied)').forEach((b) => (b.textContent = t.copy));
    langCurrent.textContent = langMenu.querySelector(`[data-lang="${lang}"]`).textContent;
    langMenu.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.lang === lang)));
    root.lang = lang;
    paintTheme();

    save('codelab-step', String(step));
    closeRail();
    if (scroll) window.scrollTo({ top: 0 });
  }

  const go = (n) => {
    if (location.hash === `#${n}`) {
      step = n;
      render(true);
    } else location.hash = String(n);
  };

  back.addEventListener('click', () => go(Math.max(1, step - 1)));
  next.addEventListener('click', () => go(Math.min(total(), step + 1)));
  window.addEventListener('hashchange', () => {
    step = fromHash() || 1;
    render(true);
  });

  function closeRail() {
    rail.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
  menu.addEventListener('click', () => {
    const open = !rail.classList.contains('open');
    rail.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
  });

  const closeLang = () => {
    langMenu.hidden = true;
    langButton.setAttribute('aria-expanded', 'false');
  };
  langButton.addEventListener('click', () => {
    const open = langMenu.hidden;
    langMenu.hidden = !open;
    langButton.setAttribute('aria-expanded', String(open));
    if (open) langMenu.querySelector(`[data-lang="${lang}"]`).focus();
  });
  langMenu.addEventListener('click', (e) => {
    const choice = e.target.closest('[data-lang]');
    if (!choice) return;
    lang = choice.dataset.lang;
    save('codelab-lang', lang);
    closeLang();
    langButton.focus();
    render(false);
  });
  langMenu.addEventListener('keydown', (e) => {
    const items = [...langMenu.querySelectorAll('button')];
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!langMenu.hidden) { closeLang(); langButton.focus(); }
    closeRail();
  });
  document.addEventListener('click', (e) => {
    if (rail.classList.contains('open') && !rail.contains(e.target) && !menu.contains(e.target)) closeRail();
    if (!langMenu.hidden && !langMenu.contains(e.target) && !langButton.contains(e.target)) closeLang();
  });

  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  function paintTheme() {
    const light = currentTheme() === 'light';
    root.classList.toggle('light-now', light);
    themeButton.setAttribute('aria-label', light ? ui().toDark : ui().toLight);
  }
  themeButton.addEventListener('click', () => {
    const theme = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    save('codelab-theme', theme);
    paintTheme();
  });
  systemDark.addEventListener('change', paintTheme);

  document.addEventListener('click', async (e) => {
    const button = e.target.closest('.copy');
    if (!button) return;
    const code = button.closest('.code').querySelector('code');
    try {
      await navigator.clipboard.writeText(code.textContent + '\n');
      button.textContent = ui().copied;
      button.classList.add('copied');
      setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = ui().copy;
      }, 1600);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      button.textContent = ui().copyFallback;
    }
  });

  step = fromHash() || Math.min(Number(load('codelab-step')) || 1, total());
  if (!fromHash()) history.replaceState(null, '', `${location.pathname}${location.search}#${step}`);
  render(false);
})();
