import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const read = (cmd, args) => execFileSync(cmd, args, { cwd: root, encoding: 'utf8' }).trim();

run(process.execPath, [join(root, 'scripts/build.mjs')]);

const remote = read('git', ['remote', 'get-url', 'origin']);
const sha = read('git', ['rev-parse', '--short', 'HEAD']);
const site = mkdtempSync(join(tmpdir(), 'codelab-pages-'));

copyFileSync(join(root, 'dist/index.html'), join(site, 'index.html'));
writeFileSync(join(site, '.nojekyll'), '');

run('git', ['init', '-q', '-b', 'gh-pages'], site);
run('git', ['add', '-A'], site);
run('git', ['commit', '-q', '-m', `Deploy ${sha}`], site);
run('git', ['push', '-q', '-f', remote, 'gh-pages'], site);
rmSync(site, { recursive: true, force: true });

const [, owner, repo] = remote.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/) ?? [];
console.log(`\nPushed to gh-pages. Live in a minute at https://${owner}.github.io/${repo}/`);
