import clsx from 'clsx'
import { type PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

interface NoteProps extends PropsWithChildren {
  title?: string
  type?: 'note' | 'success' | 'warning' | 'danger'
}

export function Note({ children, title = 'Note', type = 'note' }: NoteProps) {
  const noteClassNames = clsx({
    'border-border bg-secondary text-foreground': type === 'note',
    'border-success/30 bg-success-soft text-success': type === 'success',
    'border-warning/30 bg-warning-soft text-warning': type === 'warning',
    'border-destructive/30 bg-destructive/10 text-destructive': type === 'danger',
  })

  return (
    <div className={cn('rounded-lg border px-4 py-1 text-sm', noteClassNames)}>
      <p className="-mb-3 text-sm font-medium">{title}:</p>
      {children}
    </div>
  )
}
