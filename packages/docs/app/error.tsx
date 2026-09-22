'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-8">
      <div className="flex max-w-lg flex-col items-start gap-4 rounded-lg border bg-card p-8">
        <div>
          <p className="mb-2 font-mono text-xs text-destructive">Runtime error</p>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Retry this page. If the problem continues, open the troubleshooting guide.
          </p>
        </div>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </section>
  )
}
