import { type ComponentProps } from 'react'

import { Copy } from '@/components/markdown/copy'

export function Pre({ children, raw, ...rest }: ComponentProps<'pre'> & { raw?: string }) {
  return (
    <div className="relative my-5 max-w-full min-w-0">
      <div className="absolute top-3 right-2.5 z-20">
        <Copy content={raw!} />
      </div>
      <div className="relative max-w-full overflow-x-auto">
        <pre {...rest}>{children}</pre>
      </div>
    </div>
  )
}
