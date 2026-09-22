import { type ReactNode } from 'react'

import { MermaidClient } from '@/components/markdown/mermaid-client'

interface MermaidProps {
  chart?: string
  children?: ReactNode
  className?: string
}

const chartFromChildren = (children?: ReactNode): string => {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) {
    return children
      .map((child) => chartFromChildren(child))
      .filter(Boolean)
      .join('\n')
  }
  if (
    children &&
    typeof children === 'object' &&
    'props' in children &&
    children.props &&
    typeof children.props === 'object' &&
    'children' in children.props
  ) {
    return chartFromChildren(children.props.children as ReactNode)
  }
  return ''
}

export function Mermaid({ chart, children, className }: MermaidProps) {
  return <MermaidClient chart={chart ?? chartFromChildren(children)} className={className} />
}
