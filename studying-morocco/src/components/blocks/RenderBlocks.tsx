import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'

import { AudiencesBlock } from './AudiencesBlock'
import { CitiesBlock } from './CitiesBlock'
import { CostComparisonBlock } from './CostComparisonBlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { HeroBlock } from './HeroBlock'
import {
  ComparisonBlock,
  CTABlock,
  FAQBlock,
  NewsletterBlock,
  PostsFeedBlock,
  ProgramSearchBlock,
  RichTextBlock,
  TestimonialsBlock,
} from './MiscBlocks'
import { ProcessBlock } from './ProcessBlock'
import { ServicesGridBlock } from './ServicesGridBlock'
import { StatsBlock } from './StatsBlock'
import type { LayoutBlock } from './types'
import { UniversitiesBlock } from './UniversitiesBlock'

export function RenderBlocks({ blocks, locale, t }: { blocks: LayoutBlock[] | null | undefined; locale: Locale; t: Dictionary }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} block={block} locale={locale} t={t} />
          case 'stats':
            return <StatsBlock key={key} block={block} locale={locale} t={t} />
          case 'featureGrid':
            return <FeatureGridBlock key={key} block={block} locale={locale} t={t} />
          case 'audiences':
            return <AudiencesBlock key={key} block={block} locale={locale} t={t} />
          case 'servicesGrid':
            return <ServicesGridBlock key={key} block={block} locale={locale} t={t} />
          case 'universitiesShowcase':
            return <UniversitiesBlock key={key} block={block} locale={locale} t={t} />
          case 'citiesShowcase':
            return <CitiesBlock key={key} block={block} locale={locale} t={t} />
          case 'processSteps':
            return <ProcessBlock key={key} block={block} locale={locale} t={t} />
          case 'costComparison':
            return <CostComparisonBlock key={key} block={block} locale={locale} t={t} />
          case 'comparison':
            return <ComparisonBlock key={key} block={block} locale={locale} t={t} />
          case 'testimonials':
            return <TestimonialsBlock key={key} block={block} locale={locale} t={t} />
          case 'faq':
            return <FAQBlock key={key} block={block} locale={locale} t={t} />
          case 'postsFeed':
            return <PostsFeedBlock key={key} block={block} locale={locale} t={t} />
          case 'programSearch':
            return <ProgramSearchBlock key={key} block={block} locale={locale} t={t} />
          case 'richText':
            return <RichTextBlock key={key} block={block} locale={locale} t={t} />
          case 'cta':
            return <CTABlock key={key} block={block} locale={locale} t={t} />
          case 'newsletter':
            return <NewsletterBlock key={key} block={block} locale={locale} t={t} />
          default:
            return null
        }
      })}
    </>
  )
}
