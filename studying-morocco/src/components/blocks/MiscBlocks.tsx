import { ArrowRight, Quote, Star } from 'lucide-react'

import { PostCard } from '@/components/cards/PostCard'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { ProgramFinder } from '@/components/forms/ProgramFinder'
import { faqLD, FAQList } from '@/components/ui/Accordion'
import { LinkButton } from '@/components/ui/Button'
import { asMedia } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { Section, SectionHeading } from '@/components/ui/Section'
import { countries, optionLabel } from '@/lib/options'
import { getCities, getDisciplines, getFAQs, getPosts, getTestimonials } from '@/lib/queries'
import { localizeHref } from '@/lib/routes'
import { JsonLd } from '@/lib/seo'
import { cn } from '@/lib/utils'

import type { BlockProps } from './types'

export async function TestimonialsBlock({ block, locale, t }: BlockProps<'testimonials'>) {
  const items = await getTestimonials(locale)
  if (!items.length) return null
  return (
    <Section tone="surface">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const photo = asMedia(item.photo)
          return (
            <figure key={item.id} className="flex h-full flex-col rounded-card border border-line bg-surface p-card">
              <Quote className="size-8 text-primary rtl:-scale-x-100" aria-hidden="true" />
              <div className="mt-2 flex gap-0.5 text-cta" aria-label={`${item.rating ?? 5}/5`}>
                {Array.from({ length: item.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-body text-ink">{item.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                {photo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.url} alt="" className="size-11 rounded-full object-cover" />
                ) : (
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">{item.name.slice(0, 1)}</span>
                )}
                <span>
                  <span className="block font-semibold text-ink">{item.name}</span>
                  <span className="block text-small text-muted">
                    {[optionLabel(countries, item.country, locale), item.program, item.university].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </Section>
  )
}

export async function FAQBlock({ block, locale, t }: BlockProps<'faq'>) {
  const faqs = await getFAQs(locale, { category: block.category, limit: block.limit ?? 8 })
  if (!faqs.length) return null
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} className="lg:sticky lg:top-28" />
          <LinkButton href={`/${locale}/faq`} variant="secondary">
            {t.common.viewAll}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        </div>
        <FAQList items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
      </div>
      <JsonLd data={faqLD(faqs)} />
    </Section>
  )
}

export async function PostsFeedBlock({ block, locale, t }: BlockProps<'postsFeed'>) {
  const { docs } = await getPosts(locale, { limit: block.limit ?? 3 })
  if (!docs.length) return null
  return (
    <Section>
      <SectionHeading
        eyebrow={block.eyebrow}
        title={block.heading}
        intro={block.intro}
        action={
          <LinkButton href={`/${locale}/blog`} variant="secondary">
            {t.common.viewAll}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        }
      />
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {docs.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} t={t} />
        ))}
      </div>
    </Section>
  )
}

export function RichTextBlock({ block, locale }: BlockProps<'richText'>) {
  return (
    <section className="py-section">
      <div className={cn('container-page', block.narrow !== false && 'max-w-3xl')}>
        <RichText data={block.content} locale={locale} />
      </div>
    </section>
  )
}

export function CTABlock({ block, locale }: BlockProps<'cta'>) {
  const dark = block.variant !== 'light'
  return (
    <section className="py-section">
      <div className="container-page">
        <div
          className={cn(
            'flex flex-col gap-8 rounded-card p-card md:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12',
            dark ? 'on-dark bg-primary text-white' : 'border border-line bg-canvas',
          )}
        >
          <div className="max-w-2xl">
            <h2 className={cn(dark && 'text-white')}>{block.heading}</h2>
            {block.text && <p className={cn('mt-3 text-body', dark ? 'text-line' : 'text-ink')}>{block.text}</p>}
          </div>
          <div className="flex shrink-0 flex-col gap-3 md:flex-row">
            {block.primaryCta?.label && (
              <LinkButton href={localizeHref(block.primaryCta.href, locale)} size="lg">
                {block.primaryCta.label}
              </LinkButton>
            )}
            {block.secondaryCta?.label && (
              <LinkButton href={localizeHref(block.secondaryCta.href, locale)} variant={dark ? 'light' : 'secondary'} size="lg">
                {block.secondaryCta.label}
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function NewsletterBlock({ block, locale, t }: BlockProps<'newsletter'>) {
  return (
    <section className="py-section">
      <div className="container-page">
        <div className="grid items-center gap-8 rounded-card border border-line bg-canvas p-card md:p-10 lg:grid-cols-2 lg:p-12">
          <div>
            <h2>{block.heading || t.newsletter.title}</h2>
            <p className="mt-3 text-ink">{block.text || t.newsletter.text}</p>
          </div>
          <NewsletterForm locale={locale} t={t} />
        </div>
      </div>
    </section>
  )
}

export async function ProgramSearchBlock({ block, locale, t }: BlockProps<'programSearch'>) {
  const [disciplines, cities] = await Promise.all([getDisciplines(locale), getCities(locale)])
  return (
    <Section tone="canvas">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <ProgramFinder locale={locale} t={t} disciplines={disciplines} cities={cities} />
    </Section>
  )
}

export function ComparisonBlock({ block }: BlockProps<'comparison'>) {
  return (
    <Section tone="surface">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="max-w-4xl overflow-hidden rounded-card border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-start text-body">
            <thead>
              <tr className="bg-canvas">
                <th scope="col" className="px-5 py-4 text-start font-semibold text-muted" />
                <th scope="col" className="px-5 py-4 text-start font-semibold text-primary">{block.labelA}</th>
                <th scope="col" className="bg-primary px-5 py-4 text-start font-semibold text-white">{block.labelB}</th>
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={row.id ?? i} className="border-t border-line">
                  <th scope="row" className="px-5 py-4 text-start font-semibold text-ink">{row.label}</th>
                  <td className="px-5 py-4 text-ink">{row.a}</td>
                  <td className="bg-canvas px-5 py-4 font-medium text-primary">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.footnote && <p className="border-t border-line px-5 py-3 text-small text-muted">{block.footnote}</p>}
      </div>
    </Section>
  )
}
