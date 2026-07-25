import type { DocArtifact } from '@/lib/docs'

export interface Result {
  url: string
  title: string
  pageTitle: string
  // Algolia autocomplete requires items to be indexable (BaseItem).
  [key: string]: unknown
}

interface Record_ extends Result {
  haystack: string
}

/**
 * Build a simple in-browser search over the loaded version's pages. Indexes
 * page titles, section titles and prose text; a linear scan is instant for the
 * doc's size and avoids shipping/configuring a heavier index.
 */
export function createSearch(
  doc: DocArtifact,
  hrefFor: (slug: string) => string,
): (query: string, opts?: { limit?: number }) => Array<Result> {
  const records: Array<Record_> = []

  for (const [slug, page] of Object.entries(doc.pages)) {
    const base = hrefFor(slug)
    records.push({
      url: base,
      title: page.title,
      pageTitle: page.title,
      haystack: `${page.title} ${page.description ?? ''}`.toLowerCase(),
    })
    for (const section of page.sections) {
      records.push({
        url: `${base}#${section.id}`,
        title: section.title,
        pageTitle: page.title,
        haystack: section.title.toLowerCase(),
      })
    }
    for (const block of page.blocks) {
      if (block.type === 'prose') {
        const text = block.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
        records.push({
          url: base,
          title: page.title,
          pageTitle: page.title,
          haystack: text.toLowerCase().slice(0, 2000),
        })
      }
    }
  }

  return function search(query, { limit = 5 } = {}) {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const seen = new Set<string>()
    const out: Array<Result> = []
    for (const record of records) {
      if (record.haystack.includes(q) && !seen.has(record.url)) {
        seen.add(record.url)
        out.push({ url: record.url, title: record.title, pageTitle: record.pageTitle })
        if (out.length >= limit) break
      }
    }
    return out
  }
}
