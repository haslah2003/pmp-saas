export const DIAGNOSTIC_DOMAINS = ['people', 'process', 'business_environment'] as const;
export const DIAGNOSTIC_APPROACHES = ['predictive', 'agile', 'hybrid'] as const;
export const DIAGNOSTIC_COGNITIVE_LEVELS = ['recall', 'application', 'analysis'] as const;

export interface DiagnosticItemInput {
  trackId: string;
  stem: string;
  options: Array<{ id: string; text: string }>;
  key: string;
  domain: string;
  approach: string;
  ecoTask: string;
  cognitiveLevel: string;
  rationaleCorrect: string;
  rationaleDistractors: Record<string, string>;
  readabilityGrade: number;
}

export function validateDiagnosticItem(item: DiagnosticItemInput): string[] {
  const errors: string[] = [];
  const stemWords = item.stem.trim().split(/\s+/).filter(Boolean).length;
  if (stemWords < 40 || stemWords > 120) errors.push('Stem must contain 40-120 words.');
  if (!/\b(next|first|best)\b/i.test(item.stem)) errors.push('Stem must ask what to do next, first, or what is best.');
  if (/\b(which|what).{0,30}\bnot\b|\bexcept\b/i.test(item.stem)) errors.push('Negatively worded stems are prohibited.');
  if (item.options.length !== 4 || new Set(item.options.map((option) => option.id)).size !== 4) errors.push('Exactly four unique options are required.');
  if (item.options.some((option) => !option.text.trim())) errors.push('Every option must contain text.');
  if (item.options.some((option) => /\b(all|none) of the above\b/i.test(option.text))) errors.push('All/none of the above is prohibited.');
  if (!item.options.some((option) => option.id === item.key)) errors.push('The key must identify an option.');
  const keyedOption = item.options.find((option) => option.id === item.key);
  if (keyedOption && /\b(always|never|must)\b/i.test(keyedOption.text)) errors.push('The keyed option cannot contain an absolute qualifier.');
  const lengths = item.options.map((option) => option.text.trim().split(/\s+/).filter(Boolean).length);
  if (lengths.length && Math.max(...lengths) / Math.max(1, Math.min(...lengths)) > 1.75) errors.push('Option lengths are materially uneven.');
  if (!DIAGNOSTIC_DOMAINS.includes(item.domain as never)) errors.push('Invalid domain.');
  if (!DIAGNOSTIC_APPROACHES.includes(item.approach as never)) errors.push('Invalid approach.');
  if (!DIAGNOSTIC_COGNITIVE_LEVELS.includes(item.cognitiveLevel as never)) errors.push('Invalid cognitive level.');
  if (!item.ecoTask.trim()) errors.push('ECO task is required.');
  if (!item.rationaleCorrect.trim()) errors.push('Correct-answer rationale is required.');
  const distractorIds = item.options.filter((option) => option.id !== item.key).map((option) => option.id);
  if (!distractorIds.every((id) => item.rationaleDistractors[id]?.trim())) errors.push('Every distractor requires a misconception rationale.');
  if (!Number.isFinite(item.readabilityGrade) || item.readabilityGrade > 12) errors.push('Readability grade must be 12 or below.');
  return errors;
}

export function assertDiagnosticItemPublishable(item: DiagnosticItemInput) {
  const errors = validateDiagnosticItem(item);
  if (errors.length) throw new Error(`Diagnostic item is not publishable: ${errors.join(' ')}`);
}
