import type { SiteSetting } from '@/payload-types'

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
const keys = ['primary', 'secondary', 'accent', 'clay', 'ink', 'canvas'] as const

/** Injects the brand colours chosen in Site settings as CSS variables. */
export function BrandStyle({ brand }: { brand: SiteSetting['brand'] }) {
  const rules = keys
    .map((key) => {
      const value = brand?.[key]
      return value && HEX.test(value) ? `--color-${key}:${value};` : ''
    })
    .join('')
  if (!rules) return null
  return <style>{`:root{${rules}}`}</style>
}
