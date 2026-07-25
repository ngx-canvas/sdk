'use client'

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'

/* ----------------------------------------------------------------- schema */

export interface DocSection {
  id: string
  title: string
  tag?: string
}

export interface PropertyItem {
  name: string
  type: string
  required?: boolean
  description?: string
}

export interface MethodItem {
  name: string
  signature: string
  description?: string
}

export type Block =
  | { type: 'prose'; html: string }
  | { type: 'code'; lang?: string; title?: string; code: string; html?: string }
  | {
      type: 'codegroup'
      title?: string
      tabs: Array<{ label: string; lang?: string; code: string; html?: string }>
    }
  | { type: 'properties'; title?: string; items: Array<PropertyItem> }
  | { type: 'methods'; title?: string; items: Array<MethodItem> }

export interface DocPageData {
  title: string
  description?: string
  kind: 'api' | 'guide'
  package?: string
  group?: string
  sections: Array<DocSection>
  blocks: Array<Block>
}

export interface DocNavGroup {
  title: string
  links: Array<{ title: string; slug: string }>
}

export interface DocArtifact {
  version: string
  generatedAt: string
  name: string
  nav: Array<DocNavGroup>
  pages: Record<string, DocPageData>
}

export interface VersionsManifest {
  latest: string
  versions: Array<string>
}

/* --------------------------------------------------------------- helpers */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
const dataUrl = (file: string) => `${BASE}/data/${file}`

/** Split a pathname into an optional pinned version + the page slug. */
export function parsePath(pathname: string): { version: string | null; slug: string } {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  let version: string | null = null
  if (parts[0] && /^v?\d+\.\d+\.\d+/.test(parts[0])) {
    version = parts[0].replace(/^v/, '')
    parts.shift()
  }
  return { version, slug: parts.join('/') }
}

/* --------------------------------------------------------------- context */

interface DocsContextValue {
  manifest: VersionsManifest | null
  doc: DocArtifact | null
  /** The version currently displayed (pinned from URL, else latest). */
  version: string | null
  /** True when the URL pins a specific (non-latest) version. */
  pinned: boolean
  slug: string
  page: DocPageData | null
  loading: boolean
  error: string | null
  /** Build an href for a slug, preserving a pinned version prefix. */
  hrefFor: (slug: string) => string
}

const DocsContext = createContext<DocsContextValue | null>(null)

const cache = new Map<string, Promise<DocArtifact>>()
function fetchDoc(version: string): Promise<DocArtifact> {
  let p = cache.get(version)
  if (!p) {
    p = fetch(dataUrl(`${version}.json`)).then((r) => {
      if (!r.ok) throw new Error(`Failed to load docs for v${version}`)
      return r.json() as Promise<DocArtifact>
    })
    cache.set(version, p)
  }
  return p
}

export function DocsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { version: pinnedVersion, slug } = parsePath(pathname)

  const [manifest, setManifest] = useState<VersionsManifest | null>(null)
  const [doc, setDoc] = useState<DocArtifact | null>(null)
  const [error, setError] = useState<string | null>(null)

  // load the manifest once
  useEffect(() => {
    let active = true
    fetch(dataUrl('versions.json'))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load versions'))))
      .then((m: VersionsManifest) => active && setManifest(m))
      .catch((e) => active && setError(String(e.message ?? e)))
    return () => {
      active = false
    }
  }, [])

  const targetVersion = pinnedVersion ?? manifest?.latest ?? null

  // load the target version's doc
  useEffect(() => {
    if (!targetVersion) return
    let active = true
    setError(null)
    fetchDoc(targetVersion)
      .then((d) => active && setDoc(d))
      .catch((e) => active && setError(String(e.message ?? e)))
    return () => {
      active = false
    }
  }, [targetVersion])

  // Only treat a URL as version-pinned once the manifest has loaded and the
  // pinned version differs from latest — otherwise hrefs would briefly gain a
  // redundant /<version> prefix before the manifest resolves.
  const pinned = Boolean(pinnedVersion) && manifest != null && pinnedVersion !== manifest.latest

  const value = useMemo<DocsContextValue>(() => {
    const hrefFor = (s: string) => {
      const prefix = pinned && targetVersion ? `/${targetVersion}` : ''
      const path = `${prefix}/${s}`.replace(/\/+$/, '')
      return path || '/'
    }
    return {
      manifest,
      doc: doc && doc.version === targetVersion ? doc : null,
      version: targetVersion,
      pinned,
      slug,
      page: doc && doc.version === targetVersion ? (doc.pages[slug] ?? null) : null,
      loading: !error && (!manifest || !doc || doc.version !== targetVersion),
      error,
      hrefFor,
    }
  }, [manifest, doc, targetVersion, pinned, slug, error])

  return createElement(DocsContext.Provider, { value }, children)
}

export function useDocs(): DocsContextValue {
  const ctx = useContext(DocsContext)
  if (!ctx) throw new Error('useDocs must be used within a DocsProvider')
  return ctx
}

/** The navigation groups with hrefs resolved for the current version. */
export function useNavigation(): Array<{ title: string; links: Array<{ title: string; href: string }> }> {
  const { doc, hrefFor } = useDocs()
  return useMemo(() => {
    if (!doc) return []
    return doc.nav.map((group) => ({
      title: group.title,
      links: group.links.map((l) => ({ title: l.title, href: hrefFor(l.slug) })),
    }))
  }, [doc, hrefFor])
}
