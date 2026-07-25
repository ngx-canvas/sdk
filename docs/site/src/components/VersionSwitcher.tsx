'use client'

import { useRouter } from 'next/navigation'

import { useDocs } from '@/lib/docs'

export function VersionSwitcher({ className }: { className?: string }) {
  const { manifest, version, slug } = useDocs()
  const router = useRouter()

  if (!manifest) return null

  function onChange(next: string) {
    const isLatest = next === manifest!.latest
    const prefix = isLatest ? '' : `/${next}`
    router.push(`${prefix}/${slug}`.replace(/\/+$/, '') || '/')
  }

  return (
    <label className={className}>
      <span className="sr-only">Version</span>
      <select
        value={version ?? manifest.latest}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-900/10 bg-white/50 px-2 py-1 text-xs text-zinc-700 transition hover:border-zinc-900/20 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-white/20"
      >
        {manifest.versions.map((v) => (
          <option key={v} value={v}>
            v{v}
            {v === manifest.latest ? ' (latest)' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}
