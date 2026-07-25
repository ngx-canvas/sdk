'use client'

import { BlockRenderer } from '@/components/BlockRenderer'
import { Feedback } from '@/components/Feedback'
import { Prose } from '@/components/Prose'
import { Tag } from '@/components/Tag'
import type { DocPageData } from '@/lib/docs'

export function DocPage({ page }: { page: DocPageData }) {
  return (
    <article className="flex h-full flex-col pt-16 pb-10">
      <Prose className="flex-auto">
        {page.kind === 'api' && (
          <>
            {(page.package || page.group) && (
              <div className="mb-3 flex items-center gap-x-3">
                {page.package && <Tag color="emerald">{page.package}</Tag>}
                {page.group && <span className="text-xs text-zinc-400">{page.group}</span>}
              </div>
            )}
            <h1>{page.title}</h1>
          </>
        )}
        {page.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </Prose>
      <footer className="mx-auto mt-16 w-full max-w-2xl lg:max-w-5xl">
        <Feedback />
      </footer>
    </article>
  )
}
