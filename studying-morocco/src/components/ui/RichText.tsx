import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { LinkJSXConverter, RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import type { Locale } from '@/lib/options'
import { documentPath } from '@/lib/routes'
import { cn } from '@/lib/utils'

const converters =
  (locale: Locale): JSXConvertersFunction =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const doc = linkNode.fields.doc
        if (!doc || typeof doc.value !== 'object') return `/${locale}`
        const value = doc.value as { slug?: string }
        return documentPath(doc.relationTo, value.slug ?? '', locale)
      },
    }),
  })

export function RichText({
  data,
  locale,
  className,
}: {
  data: SerializedEditorState | Record<string, unknown> | null | undefined
  locale: Locale
  className?: string
}) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return <LexicalRichText data={data as SerializedEditorState} converters={converters(locale)} className={cn('prose-sim', className)} />
}
