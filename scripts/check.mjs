import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { loadLanguages } from './build.mjs';
import { parseCodelab } from './parse.mjs';

const root = resolve(import.meta.dirname, '..');
const starter = resolve(process.argv[2] ?? join(root, '../devfest-lagos-26-starter'));
const full = resolve(process.argv[3] ?? join(root, '../devfest-lagos-26-crud-v1'));
const untilStep = process.env.UNTIL ? Number(process.env.UNTIL) : Infinity;

const { steps } = parseCodelab(readFileSync(join(root, 'signals-resources-signal-forms.md'), 'utf8'));
for (const lang of loadLanguages().slice(1)) {
  console.log(`Translation ${lang.label}: ${lang.doc.steps.length} steps, code blocks match English`);
}

const work = mkdtempSync(join(process.env.TMPDIR ?? tmpdir(), 'codelab-check-'));

cpSync(starter, work, {
  recursive: true,
  filter: (src) => !/node_modules|\.angular|dist/.test(relative(starter, src)),
});
symlinkSync(join(existsSync(join(starter, 'node_modules')) ? starter : full, 'node_modules'), join(work, 'node_modules'));

const sh = (cmd) => execSync(cmd, { cwd: work, stdio: 'pipe', encoding: 'utf8' });
const build = (label) => {
  try {
    sh('npx ng build --configuration development');
    console.log(`  build ok (${label})`);
  } catch (e) {
    console.error(`  BUILD FAILED (${label})\n${e.stdout}${e.stderr}`);
    process.exit(1);
  }
};
const test = () => {
  try {
    return { ok: true, out: sh('npx ng test --watch=false') };
  } catch (e) {
    return { ok: false, out: `${e.stdout}${e.stderr}` };
  }
};

console.log(`Starter: ${starter}\nWork dir: ${work}\n`);
build('starter as cloned');
const before = test();
const failed = before.out.match(/(\d+) failed/)?.[1];
console.log(`  tests on starter: ${before.ok ? 'PASS (expected failures!)' : `${failed} failed, as expected`}`);
if (before.ok) process.exit(1);

steps.forEach((step, i) => {
  const number = i + 1;
  if (number > untilStep) return;
  if (!step.pastes.length) return;
  console.log(`Step ${number}: ${step.title}`);
  for (const { file, code } of step.pastes) {
    writeFileSync(join(work, file), code);
    console.log(`  pasted ${file}`);
  }
  build(`after step ${number}`);
  if (/schema/i.test(step.title)) {
    const after = test();
    console.log(`  tests: ${after.ok ? 'all pass' : 'FAILED'}`);
    if (!after.ok) { console.error(after.out); process.exit(1); }
  }
});

if (untilStep !== Infinity) {
  console.log(`\nStopped after step ${untilStep}. App is in ${work}`);
  process.exit(0);
}

const list = (dir) => readdirSync(dir, { recursive: true }).filter((f) => !f.endsWith('.DS_Store')).map(String).sort();
const a = join(work, 'src/app');
const b = join(full, 'src/app');
const files = [...new Set([...list(a), ...list(b)])];
const diffs = files.filter((f) => {
  const pa = join(a, f), pb = join(b, f);
  if (!existsSync(pa) || !existsSync(pb)) return true;
  try { return readFileSync(pa, 'utf8') !== readFileSync(pb, 'utf8'); } catch { return false; }
});
if (diffs.length) {
  console.error(`\nFinished codelab differs from the full app in:\n${diffs.map((d) => `  src/app/${d}`).join('\n')}`);
  process.exit(1);
}
console.log('\nFinished codelab matches the full app exactly.');
rmSync(work, { recursive: true, force: true });
