# DevFest Lagos 2026 codelab

**Signals, Resources, and Signal Forms: Composing Modern Angular End-to-End**

| File | What it is |
|---|---|
| `signals-resources-signal-forms.md` | The codelab. Edit this. It is in Google's codelab Markdown format, so `claat export` works on it too |
| `dist/index.html` | The built page. Host it anywhere static (GitHub Pages, Firebase Hosting) |
| `scripts/check.mjs` | Pastes every code block into a copy of the starter, builds after each step and compares the result with the full app |

```bash
npm install
npm run build    # writes dist/index.html
npm run check    # needs ../devfest-lagos-26-starter
```

Code blocks are pasted by the check when the line above them reads
"Replace the contents of `path` with the code below." or "Create `path` with the code below."

## Deploying

Every push to `main` rebuilds the page and publishes it to the `gh-pages` branch
(`.github/workflows/pages.yml`). Live at https://babatundelmd.github.io/devfest-lagos-26-codelab/
