import { type PropsWithChildren } from 'react'

export function Typography({ children }: PropsWithChildren) {
  return <article className="typography sm:max-w-full">{children}</article>
}
