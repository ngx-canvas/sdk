# Documentation

The docs are **version-decoupled**: the SDK generates a versioned JSON artifact,
and the site in [`site/`](site/) is a static **shell** that renders that JSON at
runtime. Publishing a new SDK version drops a new JSON file into the deploy's
`/data/` dir — **the site is never rebuilt per version**.

```
scripts/generate-docs.mjs           gh-pages (deployed once)
  ├─ TypeDoc reflection (core+draw)    index.html   ← the shell
  ├─ docs/guides/*.md  → prose         404.html     ← boots the shell for deep links
  └─ → dist/docs/<version>.json        data/
        + versions.json                  versions.json   { latest, versions[] }
                                         0.8.63.json     ← add per release, NO rebuild
```

## Content sources

- **API reference** — extracted from source by TypeDoc (`typedoc --json` via the
  programmatic API). Descriptions and `@example` usage come from **JSDoc in the
  source**, so improving a doc means improving the code comment.
- **Guides** — hand-authored Markdown in [`guides/`](guides/) with frontmatter
  (`title`, `slug`, `navGroup`, `order`).

## Commands

```bash
# from the repo root
pnpm docs:json     # generate dist/docs/<version>.json + versions.json

# develop the site against the generated data
cp dist/docs/* docs/site/public/data/
cd docs/site && npm install && npm run dev
```

## Deploy

Two GitHub Actions (see `.github/workflows/`):

- **`docs-site.yml`** — builds the static shell and publishes it to the
  `gh-pages` branch. Runs only when `docs/site/**` changes (or manually via
  *Actions → Docs site → Run workflow*). `basePath` defaults to `/<repo>`
  (i.e. `/sdk`); override with the repo variable `DOCS_BASE_PATH` (set it empty
  for a custom-domain/root deploy).
- **`docs-data.yml`** — on each GitHub release, runs `pnpm docs:json` and
  publishes the new `<version>.json` + updated `versions.json` to
  `gh-pages/data/` (preserving the shell and older versions). No site rebuild.

Both use `keep_files: true`, so the shell deploy and the per-release data
publish never clobber each other, and `.nojekyll` is written so GitHub Pages
doesn't strip Next's `_next/` assets.

### One-time GitHub Pages setup (hosting at `ngx-canvas.github.io/sdk`)

1. Run the **Docs site** workflow once (*Actions → Docs site → Run workflow*) to
   create the `gh-pages` branch with the shell + baseline data.
2. In **Settings → Pages**, set **Source = Deploy from a branch**, **Branch =
   `gh-pages` / `(root)`**. The site publishes at `https://ngx-canvas.github.io/sdk/`.
3. Cut a release (or run **Docs data** manually) to publish additional versions —
   they appear in the version switcher with no site rebuild.

## URLs

- `/<slug>` renders the **latest** version (e.g. `/core/shapes/rectangle`).
- `/<version>/<slug>` pins a specific version (e.g. `/0.8.63/core/shapes/rectangle`).

The version switcher in the sidebar reads `versions.json`.
