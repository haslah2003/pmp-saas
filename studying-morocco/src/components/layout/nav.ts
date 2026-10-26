import type { Dictionary } from '@/i18n'
import type { Navigation } from '@/payload-types'

export type NavItem = { label: string; href: string; description?: string | null; children?: NavItem[] }

/** Default menu, used until editors customise Admin → Menus. */
export const defaultNav = (t: Dictionary): NavItem[] => [
  {
    label: t.nav.study,
    href: '/universities',
    children: [
      { label: t.nav.universities, href: '/universities', description: t.nav.universitiesDesc },
      { label: t.nav.programs, href: '/programs', description: t.nav.programsDesc },
      { label: t.nav.cities, href: '/cities', description: t.nav.citiesDesc },
      { label: t.nav.scholarships, href: '/scholarships', description: t.nav.scholarshipsDesc },
      { label: t.nav.calculator, href: '/cost-calculator', description: t.nav.calculatorDesc },
    ],
  },
  { label: t.nav.services, href: '/services' },
  { label: t.nav.guides, href: '/blog' },
  { label: t.nav.about, href: '/about' },
  { label: t.nav.contact, href: '/contact' },
]

export const navFromCMS = (nav: Navigation | null | undefined, t: Dictionary): NavItem[] => {
  const items = nav?.header
  if (!items?.length) return defaultNav(t)
  return items.map((item) => ({
    label: item.label,
    href: item.href,
    children: item.children?.map((child) => ({ label: child.label, href: child.href, description: child.description })),
  }))
}
