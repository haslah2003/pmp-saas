import type { Metadata } from 'next'

import { faqLD, FAQList } from '@/components/ui/Accordion'
import { buttonClass, LinkButton } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { faqCategories } from '@/lib/options'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { getFAQs, getSettings } from '@/lib/queries'
import { buildMetadata, JsonLd } from '@/lib/seo'
import { whatsappLink } from '@/lib/utils'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/faq', title: t.faq.title, description: t.faq.intro })
}

export default async function FAQPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  const [faqs, settings] = await Promise.all([getFAQs(locale), getSettings(locale)])
  const groups = faqCategories.map((c) => ({ ...c, items: faqs.filter((f) => f.category === c.value) })).filter((g) => g.items.length)
  const wa = whatsappLink(settings.whatsapp, t.whatsapp.message)

  return (
    <>
      <PageHeader
        title={t.faq.title}
        intro={t.faq.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.faq, href: `/${locale}/faq` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page grid gap-10 lg:grid-cols-[16rem_1fr] py-section">
        <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:self-start" aria-label={t.faq.title}>
          {groups.map((g) => (
            <a key={g.value} href={`#${g.value}`} className="inline-flex min-h-11 shrink-0 items-center rounded-control px-4 text-small font-semibold text-ink hover:bg-canvas hover:text-primary">
              {g.label[locale]} <span className="text-muted">({g.items.length})</span>
            </a>
          ))}
        </nav>
        <div className="min-w-0 space-y-12">
          {groups.map((g) => (
            <section key={g.value} id={g.value} className="scroll-mt-28">
              <h2 className="mb-5">{g.label[locale]}</h2>
              <FAQList items={g.items.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
            </section>
          ))}
          <div className="on-dark flex flex-col gap-6 rounded-card bg-primary p-card text-white lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-h4 font-semibold text-white">{t.faq.stillQuestions}</p>
              <p className="mt-1 text-line">{t.faq.stillQuestionsText}</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" data-track="whatsapp_faq" className={buttonClass('light')}>
                  <SocialIcon name="whatsapp" className="size-5" /> {t.common.whatsappUs}
                </a>
              )}
              <LinkButton href={`/${locale}/consultation`}>
                {t.nav.consultation}
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
      <JsonLd data={faqLD(faqs)} />
    </>
  )
}
