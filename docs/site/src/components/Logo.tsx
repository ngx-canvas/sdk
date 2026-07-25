import clsx from 'clsx'

export function Logo({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white',
        className,
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          className="fill-emerald-500/10 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <circle cx="9" cy="9" r="2.5" className="fill-emerald-500" />
        <rect x="12.5" y="12" width="6" height="6" rx="1.5" className="fill-emerald-400/70" />
      </svg>
      <span>
        ngx<span className="text-emerald-500">-</span>canvas
      </span>
    </span>
  )
}
