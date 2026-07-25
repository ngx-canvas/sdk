/**
 * The docs site is a static "shell" that renders versioned documentation JSON
 * fetched at runtime from `${basePath}/data/`. It is built ONCE — new SDK
 * versions are published by dropping a new JSON file into that data dir, with
 * no site rebuild.
 *
 * Set NEXT_PUBLIC_BASE_PATH (e.g. "/docs") when deploying under a sub-path such
 * as GitHub Pages; leave empty for a root/custom-domain deploy.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only for production builds. In `next dev` we leave it off so
  // the catch-all route stays fully dynamic (export's dev-time validation would
  // otherwise demand every navigated slug be in generateStaticParams()).
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  // In production the shell renders one static entry; deep links are resolved
  // client-side via the 404.html fallback (see src/app/not-found.tsx).
}

export default nextConfig
