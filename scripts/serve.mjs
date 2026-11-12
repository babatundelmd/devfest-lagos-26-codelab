import { execFileSync } from 'node:child_process';
import { readFileSync, watch } from 'node:fs';
import { createServer } from 'node:http';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const page = join(root, 'dist/index.html');

const build = () => {
  try {
    execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], { stdio: 'inherit' });
  } catch {
    console.error('Build failed. Fix the error and save again.');
  }
};

build();

let timer;
const rebuild = () => {
  clearTimeout(timer);
  timer = setTimeout(build, 100);
};
watch(root, (_, file) => file?.endsWith('.md') && rebuild());
watch(join(root, 'scripts'), (_, file) => file !== 'serve.mjs' && rebuild());

const server = createServer((req, res) => {
  if (req.url === '/' || req.url.startsWith('/index.html') || req.url.startsWith('/#')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(readFileSync(page));
  } else {
    res.writeHead(404).end();
  }
});

const listen = (port) =>
  server
    .once('error', (e) => (e.code === 'EADDRINUSE' ? listen(port + 1) : Promise.reject(e)))
    .listen(port, () => console.log(`\nCodelab running at http://localhost:${port}\nEdits to the Markdown rebuild the page. Refresh to see them.\n`));

listen(Number(process.env.PORT ?? 8080));
