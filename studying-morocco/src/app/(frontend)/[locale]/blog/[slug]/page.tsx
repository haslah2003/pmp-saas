import type { Metadata } from 'next'

import { CTABlock } from '@/components/blocks/MiscBlocks'
import { PostCard, PostCover } from '@/components/cards/PostCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { RichText } from '@/components/ui/RichText'
import { formatDate, readingTimeLabel } from '@/lib/format'
import { redirectOrNotFound, resolveLocale, type SlugParams } from '@/lib/page'
import { getPostBySlug, getPosts } from '@/lib/queries'
import { buildMetadata, JsonLd } from '@/lib/seo'
import { absoluteURL, populated } from '@/lib/utils'
import type { Category, User } from '@/payload-types'

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const { slug } = await params
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}
  return buildMetadata({ locale, path: `/blog/${slug}`, title: post.title, description: post.excerpt, meta: post.meta, image: post.cover, type: 'article' })
}

export default async function PostPage({ params }: { params: SlugParams }) {
  const { locale, t } = await resolveLocale(params)
  const { slug } = await params
  const post = await getPostBySlug(slug, locale)
  if (!post) return redirectOrNotFound(`/${locale}/blog/${slug}`, locale)
  const category = populated<Category>(post.category)
  const author = populated<User>(post.author)
  const related = (await getPosts(locale, { limit: 3, exclude: post.id, category: category?.slug ?? undefined })).docs

  return (
    <>
      <article>
        <header className="container-page max-w-4xl pt-10 pb-8 text-center sm:pt-14">
          <div className="flex justify-center">
            <Breadcrumbs
              label={t.common.breadcrumb}
              items={[
                { name: t.nav.home, href: `/${locale}` },
                { name: t.nav.guides, href: `/${locale}/blog` },
                { name: post.title, href: `/${locale}/blog/${slug}` },
              ]}
            />
          </div>
          {category && <p className="mt-8 text-sm font-bold text-primary">{category.name}</p>}
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{post.excerpt}</p>}
          <p className="mt-6 text-sm text-muted">
            {author && `${t.blog.by} ${author.name} · `}
            {t.blog.published} {formatDate(post.publishedAt, locale)}
            {post.readingTime ? ` · ${readingTimeLabel(post.readingTime, locale)}` : ''}
          </p>
        </header>
        <div className="container-page max-w-5xl">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[2rem] shadow-soft">
            <PostCover post={post} priority />
          </div>
        </div>
        <div className="container-page max-w-3xl py-12 sm:py-16">
          <RichText data={post.content} locale={locale} />
        </div>
      </article>
      <CTABlock
        locale={locale}
        t={t}
        block={{ blockType: 'cta', heading: t.consultation.title, text: t.consultation.intro, primaryCta: { label: t.nav.consultation, href: '/consultation' }, variant: 'dark' }}
      />
      {related.length > 0 && (
        <section className="bg-sand py-16">
          <div className="container-page">
            <h2 className="mb-8 text-2xl sm:text-3xl">{t.blog.related}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt ?? undefined,
          datePublished: post.publishedAt ?? post.createdAt,
          dateModified: post.updatedAt,
          inLanguage: locale,
          mainEntityOfPage: absoluteURL(`/${locale}/blog/${slug}`),
          author: { '@type': author ? 'Person' : 'Organization', name: author?.name ?? t.meta.siteName },
          publisher: { '@type': 'Organization', name: t.meta.siteName, logo: { '@type': 'ImageObject', url: absoluteURL('/favicon.svg') } },
        }}
      />
    </>
  )
}
