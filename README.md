# DevFest Lagos 2026 codelab

**Signals, Resources, and Signal Forms: Composing Modern Angular End-to-End**

| File | What it is |
|---|---|
| `signals-resources-signal-forms.md` | The codelab. Edit this. It is in Google's codelab Markdown format, so `claat export` works on it too |
| `signals-resources-signal-forms.pcm.md`, `.yo.md` | Pidgin and Yoruba translations. Text only: every code block is written as `<<code>>` and filled in from the English file at build time |
| `dist/index.html` | The built page. Host it anywhere static (GitHub Pages, Firebase Hosting) |
| `scripts/check.mjs` | Pastes every code block into a copy of the starter, builds after each step and compares the result with the full app |

```bash
npm install
npm run build    # writes dist/index.html
npm run check    # needs ../devfest-lagos-26-starter
```

Code blocks are pasted by the check when the line above them reads
"Replace the contents of `path` with the code below." or "Create `path` with the code below."

## Translations

The language menu on the page switches between English, Pidgin and Yoruba, and remembers the choice.
Link to a language directly with `?lang=pcm` or `?lang=yo`.

Each translation must have the same 12 steps and one `<<code>>` line for every code block in the English
file, in the same order. `npm run build` and `npm run check` stop with an error if they don't match.
To add a language, copy a translation file, translate it, and add an entry to `LANGUAGES` in `scripts/build.mjs`.

## Deploying

The site is served by GitHub Pages from the `gh-pages` branch, which only ever holds the built `index.html`.
Live at https://babatundelmd.github.io/devfest-lagos-26-codelab/

There are two ways it gets updated:

* **Automatically.** Every push to `main` runs `.github/workflows/pages.yml`, which builds the page and force-pushes it to `gh-pages`.
* **By hand.** `npm run deploy` does the same from your machine, using your own git login. Use it if you want to publish without pushing `main`.

Either way, GitHub takes a minute or two to serve the new version.
