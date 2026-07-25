'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { Heading } from '@/components/Heading'
import { Properties, Property } from '@/components/mdx'
import type { Block } from '@/lib/docs'

function CodeBody({ code, html }: { code: string; html?: string }) {
  return (
    <div className="group relative">
      {html ? (
        <div
          className="text-xs text-white [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-xs text-white">
          <code>{code}</code>
        </pre>
      )}
      <CopyButton code={code} />
    </div>
  )
}

function CodeGroupBlock({
  title,
  tabs,
}: {
  title?: string
  tabs: Array<{ label: string; lang?: string; code: string; html?: string }>
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl bg-zinc-900 shadow-md dark:ring-1 dark:ring-white/10">
      <TabGroup>
        <div className="not-prose">
          <div className="flex min-h-[calc(--spacing(12)+1px)] flex-wrap items-start gap-x-4 border-b border-zinc-700 bg-zinc-800 px-4 dark:border-zinc-800 dark:bg-transparent">
            {title && (
              <h3 className="mr-auto pt-3 text-xs font-semibold text-white">{title}</h3>
            )}
            <TabList className={clsx('-mb-px flex gap-4 text-xs font-medium', !title && 'mr-auto')}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.label}
                  className={({ selected }) =>
                    clsx(
                      'border-b py-3 transition focus:outline-none',
                      selected
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-300',
                    )
                  }
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
          </div>
          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.label}>
                <CodeBody code={tab.code} html={tab.html} />
              </TabPanel>
            ))}
          </TabPanels>
        </div>
      </TabGroup>
    </div>
  )
}

function CopyButton({ code }: { code: string }) {
  let [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    let t = setTimeout(() => setCopied(false), 1000)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <button
      type="button"
      onClick={() => {
        // clipboard is undefined on insecure origins / can reject on denial
        void window.navigator.clipboard?.writeText(code).then(
          () => setCopied(true),
          () => {},
        )
      }}
      className={clsx(
        'absolute top-3.5 right-4 rounded-full px-2 py-1 text-2xs font-medium opacity-0 backdrop-blur-sm transition group-hover:opacity-100 focus:opacity-100',
        copied
          ? 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 ring-inset'
          : 'bg-white/5 text-zinc-400 hover:bg-white/7.5',
      )}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function CodeBlock({
  code,
  title,
  lang,
  html,
}: {
  code: string
  title?: string
  lang?: string
  html?: string
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl bg-zinc-900 shadow-md dark:ring-1 dark:ring-white/10">
      <div className="not-prose">
        {(title || lang) && (
          <div className="flex min-h-[calc(--spacing(12)+1px)] flex-wrap items-start gap-x-4 border-b border-zinc-700 bg-zinc-800 px-4 dark:border-zinc-800 dark:bg-transparent">
            <h3 className="mr-auto pt-3 text-xs font-semibold text-white">
              {title ?? lang}
            </h3>
          </div>
        )}
        <CodeBody code={code} html={html} />
      </div>
    </div>
  )
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'prose':
      return <div dangerouslySetInnerHTML={{ __html: block.html }} />

    case 'code':
      return (
        <CodeBlock code={block.code} title={block.title} lang={block.lang} html={block.html} />
      )

    case 'codegroup':
      return <CodeGroupBlock title={block.title} tabs={block.tabs} />

    case 'properties':
      return (
        <>
          <Heading level={2} id="properties">
            {block.title ?? 'Properties'}
          </Heading>
          <Properties>
            {block.items.map((p) => (
              <Property key={p.name} name={p.name} type={p.type}>
                {p.description || <span className="text-zinc-400">—</span>}
              </Property>
            ))}
          </Properties>
        </>
      )

    case 'methods':
      return (
        <>
          <Heading level={2} id="methods">
            {block.title ?? 'Methods'}
          </Heading>
          <Properties>
            {block.items.map((m) => (
              <Property key={m.name} name={m.name} type={m.signature}>
                {m.description || <span className="text-zinc-400">—</span>}
              </Property>
            ))}
          </Properties>
        </>
      )

    default:
      return null
  }
}
