'use client'

import { memo, useEffect, useMemo, useRef } from 'react'

import { cn } from '@/lib/utils'

interface MermaidClientProps {
  chart: string
  className?: string
}

const normalizeChart = (input: string): string => {
  return input
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

export const MermaidClient = memo(({ chart, className }: MermaidClientProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const normalizedChart = useMemo(() => normalizeChart(chart), [chart])

  useEffect(() => {
    const current = ref.current

    if (!current || !normalizedChart) return

    let cancelled = false

    const renderChart = async () => {
      try {
        current.innerHTML = ''
        const { default: mermaid } = await import('mermaid')

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#ffc400',
            primaryTextColor: '#261f08',
            primaryBorderColor: '#967100',
            lineColor: '#7a5d00',
            secondaryColor: '#fff3a8',
            tertiaryColor: '#fffdf0',
          },
          securityLevel: 'loose',
        })

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
        const { svg } = await mermaid.render(id, normalizedChart)

        if (cancelled) return
        current.innerHTML = svg
      } catch (err) {
        if (cancelled) return
        current.innerHTML = `<pre style="color:red;padding:1rem;background:#fee2e2;border:1px solid #fca5a5;border-radius:0.375rem;font-size:0.75rem;">Mermaid error: ${
          err instanceof Error ? err.message : String(err)
        }</pre>`
      }
    }

    void renderChart()
    return () => {
      cancelled = true
    }
  }, [normalizedChart])

  return (
    <div className={cn('my-8 overflow-x-auto rounded-lg border bg-card p-4', className)}>
      <div
        ref={ref}
        className="mx-auto flex min-w-fit justify-center [&>svg]:block [&>svg]:h-auto [&>svg]:max-w-full"
        data-mermaid-chart={normalizedChart ? 'ready' : 'empty'}
      />
    </div>
  )
})
