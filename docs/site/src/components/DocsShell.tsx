'use client'

import { DocPage } from '@/components/DocPage'
import { Prose } from '@/components/Prose'
import { useDocs } from '@/lib/docs'

function Centered({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col pt-16 pb-10">
      <Prose className="flex-auto">
        <h1>{title}</h1>
        <p>{children}</p>
      </Prose>
    </div>
  )
}

export function DocsShell() {
  const { page, loading, error, slug, version } = useDocs()

  if (error) {
    return (
      <Centered title="Couldn’t load documentation">
        {error}. Make sure the version data is available under <code>/data</code>.
      </Centered>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col pt-16 pb-10">
        <Prose className="flex-auto">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-6 h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
        </Prose>
      </div>
    )
  }

  if (!page) {
    return (
      <Centered title="Page not found">
        There is no documentation page at{' '}
        <code>/{slug || ''}</code>
        {version ? ` for v${version}` : ''}.
      </Centered>
    )
  }

  return <DocPage page={page} />
}
