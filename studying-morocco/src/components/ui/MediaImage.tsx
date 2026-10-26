import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

type Size = 'thumbnail' | 'card' | 'hero'

/** Renders an uploaded image, picking a pre-generated size when available. */
export function MediaImage({
  media,
  size = 'card',
  className,
  sizes = '(min-width: 1024px) 33vw, 100vw',
  priority = false,
  alt,
}: {
  media: Media
  size?: Size
  className?: string
  sizes?: string
  priority?: boolean
  alt?: string
}) {
  const variant = media.sizes?.[size]
  const src = variant?.url || media.url
  if (!src) return null
  const focal = media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined
  return (
    <Image
      src={src}
      alt={alt ?? media.alt ?? ''}
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
      style={focal ? { objectPosition: focal } : undefined}
    />
  )
}

export const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in (value as Media) ? (value as Media) : null
