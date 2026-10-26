import Link from 'next/link'

import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import type { Dictionary } from '@/i18n'
import { formatDate, readingTimeLabel } from '@/lib/format'
import type { Locale } from '@/lib/options'
import { populated } from '@/lib/utils'
import type { Category, Post } from '@/payload-types'

export function PostCover({ post, priority = false, sizes }: { post: Post; priority?: boolean; sizes?: string }) {
  const cover = asMedia(post.cover)
  return cover ? <MediaImage media={cover} priority={priority} sizes={sizes} /> : null
}

export function PostCard({ post, locale, t }: { post: Post; locale: Locale; t: Dictionary }) {
  const category = populated<Category>(post.category)
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-primary"
    >
      {asMedia(post.cover) && (
        <div className="relative aspect-[4/3] bg-canvas">
          <PostCover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-card">
        {category && <p className="text-small font-semibold text-primary">{category.name}</p>}
        <h3 className="mt-2 text-h4">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-ink">{post.excerpt}</p>}
        <p className="mt-auto pt-5 text-small text-muted">
          {formatDate(post.publishedAt, locale)}
          {post.readingTime ? ` · ${readingTimeLabel(post.readingTime, locale)}` : ''}
        </p>
      </div>
    </Link>
  )
}
