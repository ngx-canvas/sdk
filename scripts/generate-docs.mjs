// Generate the versioned documentation JSON artifact consumed by the docs site
// shell. Source of truth = TypeDoc reflection of the public API (from source
// JSDoc) + hand-authored guides in docs/guides/*.md. Output:
//
//   dist/docs/<version>.json    the full doc for one SDK version
//   dist/docs/versions.json     { latest, versions[] } manifest (merged)
//
// Usage: node scripts/generate-docs.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname, basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Application, TSConfigReader } from 'typedoc'
import { marked } from 'marked'
import { createHighlighter } from 'shiki'

/** Shiki highlighter (initialized in main). Code cards are always dark. */
let highlighter = null
const LANG_ALIAS = { ts: 'typescript', js: 'javascript', sh: 'bash', shell: 'bash', yml: 'yaml' }

/** Syntax-highlight code to HTML at generation time (no runtime cost). */
function highlightCode(code, lang) {
  if (!highlighter) return null
  const requested = LANG_ALIAS[lang] ?? lang ?? 'text'
  const language = highlighter.getLoadedLanguages().includes(requested) ? requested : 'text'
  try {
    // Strip Shiki's own background so tokens sit on the card's zinc-900.
    return highlighter
      .codeToHtml(code, { lang: language, theme: 'github-dark' })
      .replace(/background-color:[^;"]*;?/g, '')
  } catch {
    return null
  }
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Translate a single `npm install …` line to another package manager. */
function translateInstall(line, mgr) {
  const m = line.match(/^(\s*)npm\s+(?:install|i)\s+(.*)$/)
  if (!m) return line
  const indent = m[1]
  const rest = m[2]
  const dev = /(^|\s)(-D|--save-dev|--dev)(\s|$)/.test(rest)
  const pkgs = rest
    .replace(/(^|\s)(-D|--save-dev|--dev|--save|-S)(\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  switch (mgr) {
    case 'pnpm': return `${indent}pnpm add${dev ? ' -D' : ''} ${pkgs}`
    case 'yarn': return `${indent}yarn add${dev ? ' -D' : ''} ${pkgs}`
    case 'bun': return `${indent}bun add${dev ? ' -d' : ''} ${pkgs}`
    default: return `${indent}npm install${dev ? ' -D' : ''} ${pkgs}`
  }
}

/** Expand an npm-install code block into npm/pnpm/yarn/bun tabs, else null. */
function installVariants(text) {
  if (!/^\s*npm\s+(install|i)\s+/m.test(text)) return null
  // pnpm first so it is the default-selected tab.
  return ['pnpm', 'npm', 'yarn', 'bun'].map((mgr) => {
    const code = text.split('\n').map((l) => translateInstall(l, mgr)).join('\n')
    return { label: mgr, lang: 'bash', code, html: highlightCode(code, 'bash') }
  })
}

/**
 * Split markdown into an ordered list of prose + code blocks so fenced code
 * renders in the same styled card as API `@example` usage (not a bare <pre>).
 */
function markdownToBlocks(md) {
  const tokens = marked.lexer(md)
  const links = tokens.links ?? {}
  const blocks = []
  let buffer = []
  const flushProse = () => {
    if (!buffer.length) return
    const arr = buffer
    arr.links = links
    blocks.push({ type: 'prose', html: marked.parser(arr) })
    buffer = []
  }
  for (const token of tokens) {
    if (token.type === 'code') {
      flushProse()
      const variants =
        token.lang === 'bash' || token.lang === 'sh' || !token.lang
          ? installVariants(token.text)
          : null
      if (variants) {
        blocks.push({ type: 'codegroup', tabs: variants })
      } else {
        blocks.push({
          type: 'code',
          lang: token.lang || undefined,
          code: token.text,
          html: highlightCode(token.text, token.lang),
        })
      }
    } else {
      buffer.push(token)
    }
  }
  flushProse()
  return blocks
}

// Emit heading ids so in-page anchors (sidebar sub-links) resolve; the ids
// match the `sections` slugs computed from the same headings.
marked.use({
  renderer: {
    heading(token) {
      const text = this.parser.parseInline(token.tokens)
      const id = slugify(token.text)
      return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`
    },
  },
})

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(repoRoot, 'dist/docs')
const version = JSON.parse(
  readFileSync(resolve(repoRoot, 'projects/core/package.json'), 'utf8'),
).version

/** Packages to document: label + TypeDoc entry point. */
const PACKAGES = [
  { key: 'core', entry: 'projects/core/src/index.ts' },
  { key: 'draw', entry: 'projects/draw/src/index.ts' },
]

/** ReflectionKind values we care about (TypeDoc numeric enum). */
const KIND = { Class: 128, Property: 1024, Method: 2048, Constructor: 512, Accessor: 262144 }

/* ------------------------------------------------------------------ helpers */

/** Render a TypeDoc serialized `type` object to a display string. */
function typeToString(t) {
  if (!t) return 'unknown'
  switch (t.type) {
    case 'intrinsic': return t.name
    case 'literal': return typeof t.value === 'string' ? `'${t.value}'` : String(t.value)
    case 'reference': return t.name + (t.typeArguments ? `<${t.typeArguments.map(typeToString).join(', ')}>` : '')
    case 'array': return `${typeToString(t.elementType)}[]`
    case 'union': return t.types.map(typeToString).join(' | ')
    case 'intersection': return t.types.map(typeToString).join(' & ')
    case 'tuple': return `[${(t.elements || []).map(typeToString).join(', ')}]`
    case 'reflection': return t.declaration?.signatures ? 'function' : 'object'
    case 'indexedAccess': return `${typeToString(t.objectType)}[${typeToString(t.indexType)}]`
    case 'query': return typeToString(t.queryType)
    case 'named-tuple-member': return `${t.name}: ${typeToString(t.element)}`
    default: return t.name || 'unknown'
  }
}

/** Join a TypeDoc comment `summary` part array into markdown text. */
function summaryToMarkdown(comment) {
  if (!comment?.summary) return ''
  // Each part's `text` already carries its own markdown (code parts include
  // their backticks), so parts join verbatim.
  return comment.summary
    .map((p) => p.text)
    .join('')
    .trim()
}

/** Extract the first @example block's code from a comment, if any. */
function exampleFromComment(comment) {
  const tag = comment?.blockTags?.find((b) => b.tag === '@example')
  if (!tag) return null
  const text = tag.content.map((p) => p.text).join('').trim()
  // strip a leading ```lang fence if the author wrote one
  const fenced = text.match(/^```[a-z]*\n([\s\S]*?)\n```$/)
  return fenced ? fenced[1] : text
}

/** Build a `name(params): ret` signature string for a method reflection. */
function methodSignature(method) {
  const sig = method.signatures?.[0]
  if (!sig) return method.name
  const params = (sig.parameters || [])
    .map((p) => `${p.flags?.isRest ? '...' : ''}${p.name}${p.flags?.isOptional ? '?' : ''}: ${typeToString(p.type)}`)
    .join(', ')
  return `${method.name}(${params}): ${typeToString(sig.type)}`
}

/** Slugify: package + folder group + kebab class name (e.g. core/shapes/rectangle). */
function pageSlug(pkg, group, name) {
  return `${pkg}/${group}/${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`
}

/** Title-case a folder group ("shapes" -> "Shapes"). */
const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/* ----------------------------------------------------------- api extraction */

function classToPage(pkg, cls) {
  // fileName may be src-relative ("shapes/rectangle/rectangle.ts") or
  // repo-relative ("projects/draw/src/tools/select/select.ts") depending on
  // where TypeDoc infers the source root — normalize both.
  const rel = (cls.sources?.[0]?.fileName || '').replace(/^projects\/[a-z-]+\/src\//, '')
  const parts = rel.split('/')
  const group = parts.length > 1 ? parts[0] : 'overview' // shapes | utilities | tools | overview
  const slug = pageSlug(pkg, group, cls.name)

  const properties = (cls.children || [])
    .filter((c) => c.kind === KIND.Property && !c.flags?.isPrivate && !c.flags?.isProtected)
    .map((p) => ({
      name: p.name,
      type: typeToString(p.type),
      required: !p.flags?.isOptional,
      description: summaryToMarkdown(p.comment),
    }))

  const methods = (cls.children || [])
    .filter((c) => c.kind === KIND.Method && !c.flags?.isPrivate && !c.flags?.isProtected)
    .map((m) => ({
      name: m.name,
      signature: methodSignature(m),
      description: summaryToMarkdown(m.signatures?.[0]?.comment || m.comment),
    }))

  const blocks = []
  const description = summaryToMarkdown(cls.comment)
  if (description) blocks.push({ type: 'prose', html: marked.parse(description) })

  const example = exampleFromComment(cls.comment)
  if (example) {
    blocks.push({
      type: 'code',
      lang: 'ts',
      title: 'Usage',
      code: example,
      html: highlightCode(example, 'ts'),
    })
  }

  if (properties.length) blocks.push({ type: 'properties', title: 'Properties', items: properties })
  if (methods.length) blocks.push({ type: 'methods', title: 'Methods', items: methods })

  const sections = []
  if (properties.length) sections.push({ id: 'properties', title: 'Properties' })
  if (methods.length) sections.push({ id: 'methods', title: 'Methods' })

  return {
    slug,
    page: {
      title: cls.name,
      description,
      kind: 'api',
      package: pkg,
      group: titleCase(group),
      sections,
      blocks,
    },
  }
}

async function extractPackage(pkg) {
  const app = await Application.bootstrapWithPlugins(
    {
      entryPoints: [resolve(repoRoot, pkg.entry)],
      tsconfig: resolve(repoRoot, 'tsconfig.base.json'),
      excludePrivate: true,
      excludeInternal: true,
      excludeExternals: true,
      readme: 'none',
      logLevel: 'Warn',
    },
    [new TSConfigReader()],
  )
  const project = await app.convert()
  if (!project) throw new Error(`TypeDoc failed to convert ${pkg.key}`)
  const json = app.serializer.projectToObject(project, repoRoot)
  return (json.children || [])
    .filter((c) => c.kind === KIND.Class)
    .map((cls) => classToPage(pkg.key, cls))
}

/* --------------------------------------------------------------- guides (md) */

function extractGuides() {
  const guidesDir = resolve(repoRoot, 'docs/guides')
  if (!existsSync(guidesDir)) return []
  return readdirSync(guidesDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = readFileSync(join(guidesDir, file), 'utf8')
      const fm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      const meta = {}
      let body = raw
      if (fm) {
        fm[1].split('\n').forEach((line) => {
          const m = line.match(/^(\w+):\s*(.*)$/)
          if (m) meta[m[1]] = m[2].trim()
        })
        body = fm[2]
      }
      const slug = meta.slug ?? basename(file, '.md')
      // section ids from ## headings for scroll-spy
      const sections = [...body.matchAll(/^##\s+(.+)$/gm)].map((h) => ({
        id: h[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: h[1].trim(),
      }))
      return {
        slug: slug === 'introduction' ? '' : slug,
        order: Number(meta.order ?? 100),
        navGroup: meta.navGroup ?? 'Guides',
        page: {
          title: meta.title ?? titleCase(slug),
          description: meta.description ?? '',
          kind: 'guide',
          sections,
          blocks: markdownToBlocks(body),
        },
      }
    })
    .sort((a, b) => a.order - b.order)
}

/* ------------------------------------------------------------------- build */

async function main() {
  highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript', 'javascript', 'tsx', 'jsx', 'bash', 'json', 'html', 'css'],
  })

  const guides = extractGuides()
  const core = await extractPackage(PACKAGES[0])
  const draw = await extractPackage(PACKAGES[1])
  const apiPages = [...core, ...draw]

  const pages = {}
  for (const g of guides) pages[g.slug] = g.page
  for (const a of apiPages) pages[a.slug] = a.page

  // navigation: Guides first, then "<Package> · <Group>" buckets
  const nav = []
  const guideLinks = guides.map((g) => ({ title: g.page.title, slug: g.slug }))
  if (guideLinks.length) nav.push({ title: 'Guides', links: guideLinks })

  const pkgOrder = { core: 0, draw: 1 }
  const groupOrder = { Overview: 0, Shapes: 1, Utilities: 2, Tools: 3 }
  const buckets = new Map()
  for (const a of apiPages) {
    const key = `${titleCase(a.page.package)} · ${a.page.group}`
    if (!buckets.has(key)) {
      buckets.set(key, { title: key, pkg: a.page.package, group: a.page.group, links: [] })
    }
    buckets.get(key).links.push({ title: a.page.title, slug: a.slug })
  }
  const ordered = [...buckets.values()].sort((x, y) => {
    const p = (pkgOrder[x.pkg] ?? 9) - (pkgOrder[y.pkg] ?? 9)
    if (p !== 0) return p
    return (groupOrder[x.group] ?? 9) - (groupOrder[y.group] ?? 9)
  })
  for (const b of ordered) {
    b.links.sort((x, y) => x.title.localeCompare(y.title))
    nav.push({ title: b.title, links: b.links })
  }

  const doc = { version, generatedAt: new Date().toISOString(), name: 'ngx-canvas', nav, pages }

  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, `${version}.json`), JSON.stringify(doc, null, 2))

  // merge versions manifest (tolerate a missing / empty / malformed seed file,
  // e.g. the first CI run before a gh-pages branch exists)
  const manifestPath = resolve(outDir, 'versions.json')
  let existing = []
  if (existsSync(manifestPath)) {
    try {
      const parsed = JSON.parse(readFileSync(manifestPath, 'utf8') || '{}')
      if (Array.isArray(parsed.versions)) existing = parsed.versions
    } catch {
      /* empty or invalid seed — start fresh */
    }
  }
  const set = new Set(existing)
  set.add(version)
  const versions = [...set].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
  writeFileSync(
    manifestPath,
    JSON.stringify({ latest: versions[0], versions, generatedAt: new Date().toISOString() }, null, 2),
  )

  console.log(`Generated docs for v${version}: ${Object.keys(pages).length} pages -> dist/docs/${version}.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
