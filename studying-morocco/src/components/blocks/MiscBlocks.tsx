import { ArrowRight, Quote, Star } from 'lucide-react'

import { StarOrnament } from '@/components/art/Ornaments'
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
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const photo = asMedia(item.photo)
          return (
            <figure key={item.id} className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-canvas p-7">
              <Quote className="size-8 text-accent rtl:-scale-x-100" aria-hidden="true" />
              <div className="mt-2 flex gap-0.5 text-accent" aria-label={`${item.rating ?? 5}/5`}>
                {Array.from({ length: item.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed text-ink/85">{item.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                {photo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.url} alt="" className="size-11 rounded-full object-cover" />
                ) : (
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{item.name.slice(0, 1)}</span>
                )}
                <span>
                  <span className="block font-semibold text-ink">{item.name}</span>
                  <span className="block text-sm text-muted">
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
          <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} align="start" className="lg:sticky lg:top-28" />
          <LinkButton href={`/${locale}/faq`} variant="outline" className="-mt-4">
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
        align="start"
        action={
          <LinkButton href={`/${locale}/blog`} variant="outline">
            {t.common.viewAll}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} t={t} />
        ))}
      </div>
    </Section>
  )
}

export function RichTextBlock({ block, locale }: BlockProps<'richText'>) {
  return (
    <section className="py-12 sm:py-16">
      <div className={cn('container-page', block.narrow !== false && 'max-w-3xl')}>
        <RichText data={block.content} locale={locale} />
      </div>
    </section>
  )
}

export function CTABlock({ block, locale }: BlockProps<'cta'>) {
  const dark = block.variant !== 'light'
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div
          className={cn(
            'relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-16',
            dark ? 'pattern-zellige bg-secondary text-white [--pattern-opacity:0.09]' : 'border border-line bg-accent-50',
          )}
        >
          <div className="pointer-events-none absolute -bottom-32 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/50 blur-3xl" aria-hidden="true" />
          <StarOrnament className={cn('relative mx-auto size-8', dark ? 'text-accent' : 'text-primary')} />
          <h2 className={cn('relative mx-auto mt-5 max-w-2xl text-3xl sm:text-4xl', dark && 'text-white')}>{block.heading}</h2>
          {block.text && <p className={cn('relative mx-auto mt-4 max-w-xl text-lg', dark ? 'text-white/75' : 'text-ink/75')}>{block.text}</p>}
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {block.primaryCta?.label && (
              <LinkButton href={localizeHref(block.primaryCta.href, locale)} variant={dark ? 'gold' : 'primary'} size="lg">
                {block.primaryCta.label}
              </LinkButton>
            )}
            {block.secondaryCta?.label && (
              <LinkButton href={localizeHref(block.secondaryCta.href, locale)} variant={dark ? 'light' : 'outline'} size="lg">
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
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid items-center gap-8 rounded-[2rem] border border-line bg-surface p-8 shadow-soft sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl">{block.heading || t.newsletter.title}</h2>
            <p className="mt-3 text-ink/75">{block.text || t.newsletter.text}</p>
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
    <Section tone="sand">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <ProgramFinder locale={locale} t={t} disciplines={disciplines} cities={cities} />
    </Section>
  )
}

export function ComparisonBlock({ block }: BlockProps<'comparison'>) {
  return (
    <Section tone="surface">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-start text-[0.95rem]">
            <thead>
              <tr className="bg-sand">
                <th scope="col" className="px-5 py-4 text-start font-semibold text-muted" />
                <th scope="col" className="px-5 py-4 text-start font-semibold">{block.labelA}</th>
                <th scope="col" className="bg-primary px-5 py-4 text-start font-semibold text-white">{block.labelB}</th>
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={row.id ?? i} className="border-t border-line">
                  <th scope="row" className="px-5 py-4 text-start font-semibold text-ink">{row.label}</th>
                  <td className="px-5 py-4 text-ink/75">{row.a}</td>
                  <td className="bg-primary-50 px-5 py-4 font-medium text-primary-900">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.footnote && <p className="border-t border-line px-5 py-3 text-xs text-muted">{block.footnote}</p>}
      </div>
    </Section>
  )
}
