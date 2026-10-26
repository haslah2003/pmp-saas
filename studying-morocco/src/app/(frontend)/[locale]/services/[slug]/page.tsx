import { Check } from 'lucide-react'
import type { Metadata } from 'next'

import { ServiceCard } from '@/components/cards/ServiceCard'
import { LinkButton } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { RichText } from '@/components/ui/RichText'
import { formatMoney, formatNumber } from '@/lib/format'
import { redirectOrNotFound, resolveLocale, type SlugParams } from '@/lib/page'
import { getServiceBySlug, getServices } from '@/lib/queries'
import { buildMetadata, JsonLd } from '@/lib/seo'
import { absoluteURL } from '@/lib/utils'

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const { slug } = await params
  const s = await getServiceBySlug(slug, locale)
  if (!s) return {}
  return buildMetadata({ locale, path: `/services/${slug}`, title: s.title, description: s.summary, meta: s.meta })
}

export default async function ServicePage({ params }: { params: SlugParams }) {
  const { locale, t } = await resolveLocale(params)
  const { slug } = await params
  const service = await getServiceBySlug(slug, locale)
  if (!service) return redirectOrNotFound(`/${locale}/services/${slug}`, locale)
  const others = (await getServices(locale, { featured: true })).filter((s) => s.id !== service.id).slice(0, 3)
  const applyHref = `/${locale}/apply${service.serviceKey ? `?service=${service.serviceKey}` : ''}`

  return (
    <>
      <PageHeader
        title={service.title}
        intro={service.summary}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.services, href: `/${locale}/services` },
          { name: service.title, href: `/${locale}/services/${slug}` },
        ]}
        crumbLabel={t.common.breadcrumb}
        aside={
          <span className="hidden size-28 items-center justify-center rounded-[2rem] bg-accent text-secondary-900 shadow-lift lg:inline-flex">
            <Icon name={service.icon} className="size-14" strokeWidth={1.5} />
          </span>
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LinkButton href={applyHref} variant="gold" size="lg">
            {t.services.request}
          </LinkButton>
          {service.priceFrom != null && (
            <p className="text-white/80">
              {t.services.priceFrom} <span className="text-xl font-bold text-white">{formatMoney(service.priceFrom, service.currency || 'USD', locale)}</span>
              {service.priceNote && <span className="text-sm"> · {service.priceNote}</span>}
            </p>
          )}
        </div>
      </PageHeader>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_22rem] lg:py-20">
        <div className="min-w-0 space-y-12">
          {service.description && <RichText data={service.description} locale={locale} />}
          {!!service.steps?.length && (
            <section>
              <h2 className="text-2xl sm:text-3xl">{t.services.howItWorks}</h2>
              <ol className="mt-6 space-y-4">
                {service.steps.map((step, i) => (
                  <li key={step.id ?? i} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-sans font-bold text-white">{formatNumber(i + 1, locale)}</span>
                    <div>
                      <h3 className="font-sans text-base font-bold">{step.title}</h3>
                      {step.text && <p className="mt-1 text-ink/75">{step.text}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
        {!!service.features?.length && (
          <aside className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-sans text-lg font-bold">{t.services.included}</h2>
            <ul className="mt-4 space-y-3">
              {service.features.map((f) => (
                <li key={f.id ?? f.text} className="flex items-start gap-2.5 text-[0.95rem]">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /> {f.text}
                </li>
              ))}
            </ul>
            <LinkButton href={applyHref} className="mt-6 w-full">
              {t.services.request}
            </LinkButton>
          </aside>
        )}
      </div>

      {others.length > 0 && (
        <section className="border-t border-line bg-sand py-16">
          <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => (
              <ServiceCard key={s.id} service={s} locale={locale} t={t} compact />
            ))}
          </div>
        </section>
      )}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.summary ?? undefined,
          url: absoluteURL(`/${locale}/services/${slug}`),
          provider: { '@type': 'EducationalOrganization', name: t.meta.siteName },
          areaServed: 'MA',
          ...(service.priceFrom != null ? { offers: { '@type': 'Offer', price: service.priceFrom, priceCurrency: service.currency || 'USD' } } : {}),
        }}
      />
    </>
  )
}
