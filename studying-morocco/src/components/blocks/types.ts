import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'
import type { Page } from '@/payload-types'

export type LayoutBlock = NonNullable<Page['layout']>[number]
export type BlockOf<T extends LayoutBlock['blockType']> = Extract<LayoutBlock, { blockType: T }>
export type BlockProps<T extends LayoutBlock['blockType']> = { block: BlockOf<T>; locale: Locale; t: Dictionary }
