import Link from 'next/link'

import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import type { Dictionary } from '@/i18n'
import { formatDate, readingTimeLabel } from '@/lib/format'
import type { Locale } from '@/lib/options'
import { populated } from '@/lib/utils'
import type { Category, Post } from '@/payload-types'

import { StarOrnament } from '../art/Ornaments'

export function PostCover({ post, priority = false }: { post: Post; priority?: boolean }) {
  const cover = asMedia(post.cover)
  if (cover) return <MediaImage media={cover} priority={priority} />
  return (
    <div className="pattern-zellige flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary text-accent [--pattern-opacity:0.18] [--pattern-size:44px]">
      <StarOrnament className="size-14 opacity-90" />
    </div>
  )
}

export function PostCard({ post, locale, t }: { post: Post; locale: Locale; t: Dictionary }) {
  const category = populated<Category>(post.category)
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/9] overflow-hidden">
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
          <PostCover post={post} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {category && <p className="text-xs font-bold tracking-wide text-primary uppercase rtl:normal-case">{category.name}</p>}
        <h3 className="mt-2 text-lg leading-snug font-bold text-ink group-hover:text-primary-800">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-ink/75">{post.excerpt}</p>}
        <p className="mt-auto pt-5 text-xs text-muted">
          {formatDate(post.publishedAt, locale)}
          {post.readingTime ? ` · ${readingTimeLabel(post.readingTime, locale)}` : ''}
        </p>
      </div>
    </Link>
  )
}
