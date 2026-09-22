import { type ReactNode } from 'react'

import { Sidebar } from '@/components/sidebar'

interface DocumentsProps {
  children: Readonly<ReactNode>
}

export default function Documents({ children }: DocumentsProps) {
  return (
    <div className="mx-auto flex w-full max-w-400 min-w-0 items-start">
      <Sidebar />
      <div className="min-w-0 flex-1 py-4 md:px-5 md:py-5 xl:px-6">{children}</div>
    </div>
  )
}
