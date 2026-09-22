import { Link } from '@/lib/transition'
import { Settings } from '@/types/settings'

export function Logo() {
  return (
    <Link
      href="/"
      title={`${Settings.title} logo`}
      aria-label={`${Settings.title} logo`}
      className="flex items-center gap-2.5"
    >
      <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold shadow-xs">
        RLP
      </div>
    </Link>
  )
}
