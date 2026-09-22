import clsx from 'clsx'
import Image from 'next/image'
import { type PropsWithChildren } from 'react'

import { Link } from '@/lib/transition'
import { iconMap } from '@/settings/icons'

interface CardProps extends PropsWithChildren {
  subtitle?: string
  title: string
  description?: string
  href?: string
  image?: string
  className?: string
  external?: boolean
  icon?: keyof typeof iconMap
  variant?: 'normal' | 'small' | 'image'
}

export function Card({
  subtitle,
  title,
  description,
  href,
  image,
  className,
  external = false,
  icon,
  variant = 'normal',
  children,
}: CardProps) {
  const IconComponent = icon ? iconMap[icon] : null
  const ExternalIcon = iconMap.arrowUpRight

  const content = (
    <div
      className={clsx(
        'group relative flex overflow-hidden rounded-lg border bg-card text-card-foreground transition-colors duration-150 ease-out hover:border-ring hover:bg-secondary',
        variant === 'small'
          ? 'items-center gap-2 p-3'
          : variant === 'image'
            ? 'h-full flex-col justify-between p-0'
            : 'h-full flex-col justify-between p-4',
        className
      )}
    >
      {external && href && variant !== 'image' && (
        <div
          className={clsx(
            'absolute top-2 transform text-muted-foreground transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground',
            variant === 'small' ? 'right-0' : 'right-2'
          )}
        >
          <ExternalIcon className="h-4 w-4" />
        </div>
      )}
      {IconComponent && (
        <IconComponent
          className={clsx(
            'text-muted-foreground',
            variant === 'small' ? 'h-4 w-4 flex-shrink-0' : 'h-6 w-6 mb-3'
          )}
        />
      )}
      <div>
        {subtitle && variant === 'normal' && (
          <p className="my-1! text-xs font-medium text-muted-foreground">{subtitle}</p>
        )}
        {image && variant === 'image' && (
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            className="m-0! h-45 w-full rounded-none! border-0 object-cover object-center"
          />
        )}
        <div
          className={clsx(
            'font-medium transition-colors duration-150 group-hover:text-accent-foreground',
            variant === 'small' ? 'text-sm' : variant === 'image' ? 'p-4 text-sm' : 'text-lg',
            className
          )}
        >
          {title}
        </div>
        {description && variant === 'normal' && (
          <p className="my-2! text-sm font-normal text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )

  return href ? (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="no-underline!"
    >
      {content}
    </Link>
  ) : (
    content
  )
}

export function CardGrid({ children }: PropsWithChildren) {
  return <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">{children}</div>
}
