import type { LayoutBlock } from '@/components/blocks/types'
import type { Dictionary } from '@/i18n'

/** Shown only until a page with slug "home" is published in the admin. */
export const fallbackHome = (t: Dictionary): LayoutBlock[] => [
  {
    blockType: 'hero',
    variant: 'home',
    eyebrow: t.home.heroEyebrow,
    heading: `${t.home.heroTitle} ${t.home.heroHighlight}`,
    subheading: t.home.heroSubtitle,
    primaryCta: { label: t.nav.apply, href: '/apply' },
    secondaryCta: { label: t.nav.consultation, href: '/consultation' },
    chips: t.home.chips.map((text) => ({ text })),
    showSearch: true,
  },
  { blockType: 'stats' },
  { blockType: 'universitiesShowcase', eyebrow: t.sections.universitiesEyebrow, heading: t.sections.universitiesTitle, limit: 6 },
  { blockType: 'servicesGrid', eyebrow: t.sections.servicesEyebrow, heading: t.sections.servicesTitle, onlyFeatured: true },
  { blockType: 'citiesShowcase', eyebrow: t.sections.citiesEyebrow, heading: t.sections.citiesTitle, limit: 3 },
  { blockType: 'costComparison', eyebrow: t.sections.costEyebrow, heading: t.sections.costTitle },
  { blockType: 'faq', eyebrow: t.sections.faqEyebrow, heading: t.sections.faqTitle, limit: 6 },
]
