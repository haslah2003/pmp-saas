import type { Metadata } from 'next'
import Link from 'next/link'

import { PostCard, PostCover } from '@/components/cards/PostCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate, readingTimeLabel } from '@/lib/format'
import { param, resolveLocale, type LocaleParams, type SearchParams } from '@/lib/page'
import { getCategories, getPosts } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { cn, populated } from '@/lib/utils'
import type { Category } from '@/payload-types'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/blog', title: t.blog.title, description: t.blog.intro })
}

export default async function BlogPage({ params, searchParams }: { params: LocaleParams; searchParams: SearchParams }) {
  const { locale, t } = await resolveLocale(params)
  const category = param((await searchParams).category)
  const [{ docs }, categories] = await Promise.all([getPosts(locale, { category, limit: 30 }), getCategories(locale)])
  const [lead, ...rest] = docs
  const leadCategory = populated<Category>(lead?.category)

  return (
    <>
      <PageHeader
        title={t.blog.title}
        intro={t.blog.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.guides, href: `/${locale}/blog` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page py-section">
        <nav className="no-scrollbar mb-10 flex gap-2 overflow-x-auto" aria-label={t.blog.allCategories}>
          {[{ slug: undefined, name: t.blog.allCategories }, ...categories].map((c) => (
            <Link
              key={c.slug ?? 'all'}
              href={c.slug ? `/${locale}/blog?category=${c.slug}` : `/${locale}/blog`}
              className={cn(
 'shrink-0 rounded-full px-4 py-2 text-small font-semibold transition',
                category === c.slug ? 'bg-primary text-white' : 'border border-line bg-surface hover:border-primary',
              )}
            >
              {c.name}
            </Link>
          ))}
        </nav>
        {lead && (
          <Link href={`/${locale}/blog/${lead.slug}`} className="group mb-12 grid overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-primary lg:grid-cols-2">
            <div className="relative aspect-video bg-canvas lg:aspect-auto">
              <PostCover post={lead} priority />
            </div>
            <div className="flex flex-col justify-center p-card lg:p-12">
              {leadCategory && <p className="text-small font-semibold text-primary">{leadCategory.name}</p>}
              <h2 className="mt-3">{lead.title}</h2>
              {lead.excerpt && <p className="mt-4 text-body text-ink">{lead.excerpt}</p>}
              <p className="mt-6 text-small text-muted">
                {formatDate(lead.publishedAt, locale)}
                {lead.readingTime ? ` · ${readingTimeLabel(lead.readingTime, locale)}` : ''}
              </p>
            </div>
          </Link>
        )}
        <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} t={t} />
          ))}
        </div>
      </div>
    </>
  )
}
