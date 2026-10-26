import type { City } from '@/payload-types'

export type Housing = 'residence' | 'shared' | 'studio' | 'homestay'

export const housingRent = (city: Partial<City>, housing: Housing): number => {
  switch (housing) {
    case 'residence':
      return city.rentResidence ?? 1500
    case 'studio':
      return city.rentStudio ?? 4000
    case 'homestay':
      return city.homestay ?? 4200
    default:
      return city.rentShared ?? 2200
  }
}

/** Monthly living cost in MAD. Homestay includes most meals, so food is reduced. */
export const monthlyLiving = (city: Partial<City>, housing: Housing = 'shared', lifestyle = 1): number => {
  const food = (city.food ?? 1800) * (housing === 'homestay' ? 0.35 : 1)
  const discretionary = ((city.leisure ?? 700) + food) * lifestyle
  return Math.round(housingRent(city, housing) + discretionary + (city.transport ?? 300) + (city.utilities ?? 400))
}
