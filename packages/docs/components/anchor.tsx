'use client'

import { usePathname } from 'next/navigation'
import { type ComponentProps } from 'react'

import { Link } from '@/lib/transition'
import { cn } from '@/lib/utils'

type AnchorProps = ComponentProps<typeof Link> & {
  absolute?: boolean
  activeClassName?: string
  disabled?: boolean
}

export function Anchor({
  absolute,
  className = '',
  activeClassName = '',
  disabled,
  children,
  ...props
}: AnchorProps) {
  const path = usePathname()

  const hrefPath = props.href.toString().split(/[?#]/)[0].replace(/\/$/, '') || '/'
  const currentPath = path.replace(/\/$/, '') || '/'
  let isMatch = absolute
    ? currentPath === hrefPath || currentPath.startsWith(`${hrefPath}/`)
    : currentPath === hrefPath

  if (props.href.toString().includes('http')) isMatch = false

  if (disabled) return <div className={cn(className, 'cursor-not-allowed')}>{children}</div>

  return (
    <Link
      className={cn(className, isMatch && activeClassName)}
      aria-current={isMatch ? 'page' : undefined}
      {...props}
    >
      {children}
    </Link>
  )
}
