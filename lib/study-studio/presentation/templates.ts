import type { DeckTemplateId } from './types';

export interface DeckTemplateOption {
  id: DeckTemplateId;
  name: string;
  description: string;
  preview: string;
  supportsArabic: boolean;
}

export const DECK_TEMPLATES: DeckTemplateOption[] = [
  {
    id: 'pmpeco-clean',
    name: 'PMPeco Clean',
    description: 'Original PMPeco template · light, minimal, illustrated',
    preview: '/presentation-templates/pmpeco-clean.png',
    supportsArabic: true,
  },
  {
    id: 'pmpeco-bold',
    name: 'PMPeco Bold',
    description: 'Dark navy · high-contrast cards and callouts',
    preview: '/presentation-templates/pmpeco-bold.png',
    supportsArabic: true,
  },
];
