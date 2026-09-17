import type { AssemblyItem } from './assembler';

export interface StoredDiagnosticItem extends AssemblyItem {
  stem: string;
  options: Array<{ id: string; text: string }>;
  stemAr?: string | null;
  optionsAr?: Array<{ id: string; text: string }> | null;
  itemType?: 'single_response' | 'multiple_response' | 'graphic_single_response';
  visualSpec?: {
    kind: 'bar_chart' | 'table';
    title?: string;
    labels?: string[];
    values?: number[];
    columns?: string[];
    rows?: Array<Array<string | number>>;
    unit?: string;
  } | null;
  visualSpecAr?: StoredDiagnosticItem['visualSpec'];
}

export function deterministicOptionOrder(itemId: string, formSeed: string): string[] {
  const values = ['A', 'B', 'C', 'D'];
  let state = 2166136261;
  for (const char of `${itemId}:${formSeed}`) {
    state ^= char.charCodeAt(0);
    state = Math.imul(state, 16777619) >>> 0;
  }
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

export function candidateItemPayload(item: StoredDiagnosticItem, optionOrder: string[], locale: 'en' | 'ar' = 'en') {
  if (locale === 'ar' && (!item.stemAr || !item.optionsAr?.length)) {
    throw new Error(`Arabic diagnostic content is incomplete for item ${item.id}`);
  }
  const localizedOptions = locale === 'ar' ? item.optionsAr! : item.options;
  const options = new Map(localizedOptions.map((option) => [option.id, option.text]));
  return {
    id: item.id,
    stem: locale === 'ar' ? item.stemAr! : item.stem,
    domain: item.domain,
    itemType: item.itemType || 'single_response',
    visualSpec: locale === 'ar' ? (item.visualSpecAr || null) : (item.visualSpec || null),
    positionOptions: optionOrder.map((id) => ({ id, text: options.get(id) || '' })),
  };
}

export function clampItemSeconds(value: unknown) {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.min(Math.max(Math.round(seconds), 0), 7200) : 0;
}
