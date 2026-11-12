(() => {
  const steps = [...document.querySelectorAll('.step')];
  const links = [...document.querySelectorAll('.steps a')];
  const back = document.getElementById('back');
  const next = document.getElementById('next');
  const remaining = document.getElementById('remaining');
  const bar = document.getElementById('bar');
  const rail = document.getElementById('steps');
  const menu = document.querySelector('.menu');
  const total = steps.length;
  const KEY = 'codelab-step';

  const store = {
    get() { try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; } },
    set(n) { try { localStorage.setItem(KEY, String(n)); } catch {} },
  };

  const fromHash = () => {
    const n = Number(location.hash.slice(1));
    return Number.isInteger(n) && n >= 1 && n <= total ? n : 0;
  };

  function show(n, scroll) {
    steps.forEach((s, i) => (s.hidden = i + 1 !== n));
    links.forEach((a, i) => {
      a.classList.toggle('done', i + 1 < n);
      if (i + 1 === n) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    const left = steps.slice(n - 1).reduce((sum, s) => sum + Number(s.dataset.minutes), 0);
    remaining.textContent = `${left} min${left === 1 ? '' : 's'} remaining`;
    bar.style.width = `${((n - 1) / (total - 1)) * 100}%`;
    back.hidden = n === 1;
    next.textContent = n === total ? 'Done' : 'Next';
    next.hidden = n === total;
    store.set(n);
    closeRail();
    if (scroll) window.scrollTo({ top: 0 });
  }

  const go = (n) => {
    if (location.hash === `#${n}`) show(n, true);
    else location.hash = String(n);
  };

  back.addEventListener('click', () => go(Math.max(1, fromHash() - 1)));
  next.addEventListener('click', () => go(Math.min(total, (fromHash() || 1) + 1)));
  window.addEventListener('hashchange', () => show(fromHash() || 1, true));

  function closeRail() {
    rail.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
  menu.addEventListener('click', () => {
    const open = !rail.classList.contains('open');
    rail.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRail();
  });
  document.addEventListener('click', (e) => {
    if (rail.classList.contains('open') && !rail.contains(e.target) && !menu.contains(e.target)) closeRail();
  });

  document.addEventListener('click', async (e) => {
    const button = e.target.closest('.copy');
    if (!button) return;
    const code = button.closest('.code').querySelector('code');
    const done = () => {
      button.textContent = 'Copied';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('copied');
      }, 1600);
    };
    try {
      await navigator.clipboard.writeText(code.textContent + '\n');
      done();
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      button.textContent = 'Press ⌘C / Ctrl+C';
    }
  });

  show(fromHash() || store.get() || 1, false);
  if (!fromHash()) history.replaceState(null, '', `#${store.get() || 1}`);
})();
