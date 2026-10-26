import { slugField } from 'payload'

/** Latin, lowercase, hyphenated slugs. Arabic titles produce no slug, so editors type one. */
export const toSlug = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const slug = value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return slug || undefined
}

export const slug = (useAsSlug = 'title') =>
  slugField({
    useAsSlug,
    slugify: ({ valueToSlugify }) => toSlug(valueToSlugify),
    overrides: (field) => {
      const [, slugInput] = field.fields
      if (slugInput && 'admin' in slugInput) {
        slugInput.admin = {
          ...slugInput.admin,
          description: {
            en: 'URL part in English: lowercase letters, numbers and hyphens.',
            ar: 'جزء الرابط بالإنجليزية: أحرف صغيرة وأرقام وشرطات.',
          },
        }
      }
      return field
    },
  })
