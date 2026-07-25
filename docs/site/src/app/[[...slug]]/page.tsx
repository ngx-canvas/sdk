import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { DocsShell } from '@/components/DocsShell'

// Prerender a static entry for every known page slug (from the baseline data in
// public/data) so Next does client-side *soft* navigation between them — no full
// page reload. Every page renders the same shell, which fetches + renders the
// right content at runtime. Slugs added by a later version (published to /data
// without a rebuild) aren't prerendered and fall back to 404.html.
export function generateStaticParams() {
  const params: Array<{ slug: Array<string> }> = [{ slug: [] }]
  try {
    const dir = join(process.cwd(), 'public', 'data')
    const manifest = JSON.parse(readFileSync(join(dir, 'versions.json'), 'utf8'))
    for (const version of manifest.versions as Array<string>) {
      const doc = JSON.parse(readFileSync(join(dir, `${version}.json`), 'utf8'))
      const isLatest = version === manifest.latest
      for (const slug of Object.keys(doc.pages)) {
        if (!slug) continue
        const parts = slug.split('/')
        if (isLatest) params.push({ slug: parts }) // clean, unversioned URL
        params.push({ slug: [version, ...parts] }) // version-pinned URL
      }
    }
  } catch {
    // no baseline data — only the root is prerendered
  }
  return params
}

export const dynamicParams = false

export default function Page() {
  return <DocsShell />
}
