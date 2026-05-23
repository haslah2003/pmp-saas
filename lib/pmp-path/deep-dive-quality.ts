import type { LearningStep, Locale, TrackId } from '@/lib/pmp-path/types';

export type DeepDiveFramework = 'pmbok7' | 'pmbok8' | 'bridge';

export interface DeepDiveQualityInput {
  trackId: TrackId | string;
  framework: DeepDiveFramework | string;
  moduleId: string;
  lessonId: string;
  step: LearningStep | string;
  language: Locale | string;
  title?: string | null;
  contentMarkdown: string;
}

export interface DeepDiveSectionCheck {
  label: string;
  passed: boolean;
}

export interface DeepDiveQualityAudit {
  passed: boolean;
  autoApprove: boolean;
  recommendedStatus: 'approved' | 'needs_human_review';
  qualityScore: number;
  routeAlignmentScore: number;
  completenessScore: number;
  hallucinationRiskScore: number;
  languageQualityScore: number;
  clarityScore: number;
  errors: string[];
  warnings: string[];
  sectionChecks: DeepDiveSectionCheck[];
  metadata: {
    contentLength: number;
    paragraphCount: number;
    language: string;
    framework: string;
    trackId: string;
    moduleId: string;
    lessonId: string;
    step: string;
  };
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[*_#`>"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

function hasAny(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value));
}

function countParagraphs(markdown: string) {
  return markdown
    .split(/\n\s*\n/g)
    .map((part) => part.trim())
    .filter((part) => part.length >= 80).length;
}

function requiredSectionPatterns(framework: string, language: string): Array<{ label: string; patterns: RegExp[] }> {
  const isAr = language === 'ar';

  const common = isAr
    ? [
        { label: 'تحليل متقدم', patterns: [/تحليل\s+متقدم/] },
        { label: 'أطر ونماذج إضافية', patterns: [/أطر\s+ونماذج/, /نماذج\s+إضافية/] },
        { label: 'دراسة حالة', patterns: [/دراسة\s+حالة/] },
        { label: 'روابط مع مجالات الأداء', patterns: [/مجالات\s+الأداء/, /روابط\s+مع/] },
        { label: 'أنماط متقدمة في الامتحان', patterns: [/أنماط\s+متقدمة/, /الامتحان/] },
      ]
    : [
        { label: 'Advanced Analysis', patterns: [/advanced\s+analysis/i] },
        { label: 'Additional Frameworks & Models', patterns: [/additional\s+frameworks/i, /frameworks\s+&\s+models/i, /frameworks\s+and\s+models/i] },
        { label: 'Case Study', patterns: [/case\s+study/i] },
        { label: 'Performance Domain Connections', patterns: [/performance\s+domain\s+connections/i, /domain\s+connections/i] },
        { label: 'Advanced Exam Patterns', patterns: [/advanced\s+exam\s+patterns/i, /exam\s+patterns/i] },
      ];

  if (framework === 'pmbok8') {
    common.push(
      isAr
        ? { label: 'تحديثات PMBOK 8 و ECO 2026', patterns: [/PMBOK\s*8/i, /ECO\s*2026/i] }
        : { label: 'PMBOK 8 & ECO 2026 Updates', patterns: [/PMBOK\s*8/i, /ECO\s*2026/i] }
    );
  }

  return common;
}

function routeAlignment(input: DeepDiveQualityInput, normalized: string) {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  const framework = input.framework;

  if (framework === 'pmbok8') {
    if (!/pmbok\s*8/i.test(input.contentMarkdown)) {
      warnings.push('PMBOK 8 is not explicitly referenced.');
      score -= 8;
    }

    if (!/eco\s*2026/i.test(input.contentMarkdown)) {
      warnings.push('ECO 2026 is not explicitly referenced.');
      score -= 8;
    }

    const pmbok8TwelvePrincipleMatch = input.contentMarkdown.match(
      /pmbok\s*8[^.\n]{0,180}(12\s+principles|twelve\s+principles|١٢\s+مبدأ|12\s+مبدأ)/i
    );

    const pmbok8TwelvePrincipleContext = pmbok8TwelvePrincipleMatch?.[0] ?? '';

    const legitimatePrincipleComparison =
      /pmbok\s*7|six\s+principles|6\s+principles|٦\s+مبادئ|6\s+مبادئ|from\s+12\s+principles\s+to\s+6|consolidat|streamlin|shift|transition|evolv|reduc|compare|comparison|rather\s+than|instead\s+of|من\s+12|من\s+١٢|إلى\s+6|إلى\s+٦|تحول|انتقال|مقارنة/.test(
        pmbok8TwelvePrincipleContext.toLowerCase()
      );

    const wrongPmbok8Principles = Boolean(
      pmbok8TwelvePrincipleMatch && !legitimatePrincipleComparison
    );

    const wrongPmbok8Domains =
      /pmbok\s*8[^.\n]{0,140}(8\s+performance\s+domains|eight\s+performance\s+domains|ثمانية\s+مجالات)/i.test(input.contentMarkdown);

    const ecoAsPerformanceDomains =
      /(people|process|business\s+environment)[^.\n]{0,120}performance\s+domains/i.test(input.contentMarkdown);

    if (wrongPmbok8Principles) {
      errors.push('Route conflict: PMBOK 8 is described with PMBOK 7 principle structure.');
      score -= 35;
    }

    if (wrongPmbok8Domains) {
      errors.push('Route conflict: PMBOK 8 is described with PMBOK 7 performance-domain structure.');
      score -= 35;
    }

    if (ecoAsPerformanceDomains) {
      errors.push('Route conflict: ECO domains are being described as PMBOK performance domains.');
      score -= 30;
    }

    if (/current\s+pmp\s+exam[^.\n]{0,120}pmbok\s*7/i.test(normalized)) {
      errors.push('Route conflict: PMBOK 8 route content says the current PMP exam basis is PMBOK 7.');
      score -= 35;
    }
  }

  if (framework === 'pmbok7') {
    if (/eco\s*2026|pmbok\s*8/i.test(input.contentMarkdown)) {
      warnings.push('PMBOK 7 route content mentions PMBOK 8/ECO 2026; verify this is intentional comparison.');
      score -= 10;
    }

    if (/pmbok\s*7[^.\n]{0,160}(governance|scope|schedule|finance|resources|risk)[^.\n]{0,160}performance\s+domains/i.test(input.contentMarkdown)) {
      errors.push('Route conflict: PMBOK 7 content appears to use PMBOK 8 performance-domain structure.');
      score -= 30;
    }
  }

  if (framework === 'bridge') {
    if (!/pmbok\s*7/i.test(input.contentMarkdown) || !/pmbok\s*8/i.test(input.contentMarkdown)) {
      warnings.push('Bridge content should clearly mention both PMBOK 7 and PMBOK 8.');
      score -= 12;
    }
  }

  return { score: clampScore(score), errors, warnings };
}

function completeness(input: DeepDiveQualityInput) {
  const sectionSpecs = requiredSectionPatterns(String(input.framework), String(input.language));
  const sectionChecks = sectionSpecs.map((section) => ({
    label: section.label,
    passed: hasAny(input.contentMarkdown, section.patterns),
  }));

  const missing = sectionChecks.filter((section) => !section.passed);
  const paragraphCount = countParagraphs(input.contentMarkdown);
  const contentLength = input.contentMarkdown.trim().length;

  const errors: string[] = [];
  const warnings: string[] = [];

  let score = 100;

  if (missing.length > 0) {
    score -= missing.length * 12;
    warnings.push(`Missing or unclear required sections: ${missing.map((section) => section.label).join(', ')}`);
  }

  if (contentLength < 2200) {
    warnings.push('Content is short for a canonical Learn deep dive.');
    score -= 15;
  }

  if (paragraphCount < 6) {
    warnings.push('Content has too few substantial paragraphs.');
    score -= 10;
  }

  if (/##\s*[^\n]+\n\s*(##|$)/.test(input.contentMarkdown)) {
    errors.push('One or more markdown headings appear to be empty.');
    score -= 25;
  }

  return {
    score: clampScore(score),
    errors,
    warnings,
    sectionChecks,
    paragraphCount,
    contentLength,
  };
}

function languageQuality(input: DeepDiveQualityInput) {
  const language = String(input.language);
  const content = input.contentMarkdown;
  const arabicChars = countMatches(content, /[\u0600-\u06FF]/g);
  const latinChars = countMatches(content, /[A-Za-z]/g);

  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (language === 'ar') {
    if (arabicChars < 500) {
      errors.push('Arabic content does not contain enough Arabic instructional text.');
      score -= 45;
    }

    if (latinChars > arabicChars * 0.75) {
      warnings.push('Arabic content contains a high proportion of Latin-script text.');
      score -= 12;
    }

    if (!/[؀-ۿ]/.test(content)) {
      errors.push('Arabic route requested but Arabic script was not detected.');
      score -= 60;
    }
  }

  if (language === 'en') {
    if (arabicChars > 80) {
      warnings.push('English content contains a noticeable amount of Arabic text.');
      score -= 15;
    }

    if (latinChars < 800) {
      errors.push('English content does not contain enough English instructional text.');
      score -= 35;
    }
  }

  return { score: clampScore(score), errors, warnings };
}

function hallucinationRisk(input: DeepDiveQualityInput) {
  const errors: string[] = [];
  const warnings: string[] = [];
  let risk = 0;

  const forbiddenPatterns: Array<{ label: string; pattern: RegExp; severity: number; error?: boolean }> = [
    { label: 'fake PMI page reference', pattern: /\b(page|p\.|pp\.)\s*\d+\b/i, severity: 12, error: true },
    { label: 'fake PMI section or task number', pattern: /\b(section|task)\s+\d+(\.\d+)*\b/i, severity: 8 },
    { label: 'unsupported exact quote claim', pattern: /\b(PMI|Rita)\s+(states|says|writes|confirms)\s+["“]/i, severity: 10 },
    { label: 'unverifiable Rita 2026 claim', pattern: /rita[^.\n]{0,80}2026/i, severity: 10 },
    { label: 'guaranteed exam claim', pattern: /guarantee(d)?\s+(pass|success|exam)/i, severity: 10, error: true },
  ];

  for (const item of forbiddenPatterns) {
    if (item.pattern.test(input.contentMarkdown)) {
      risk += item.severity;
      const message = `Hallucination-risk pattern detected: ${item.label}.`;
      if (item.error) errors.push(message);
      else warnings.push(message);
    }
  }

  if (/\bmust\s+always\b/i.test(input.contentMarkdown)) {
    risk += 3;
    warnings.push('Absolute wording detected; verify it is not overgeneralized.');
  }

  return { score: clampScore(risk), errors, warnings };
}

function clarity(input: DeepDiveQualityInput) {
  const content = input.contentMarkdown;
  let score = 100;
  const warnings: string[] = [];

  const veryLongParagraphs = content
    .split(/\n\s*\n/g)
    .filter((paragraph) => paragraph.trim().length > 900).length;

  if (veryLongParagraphs > 0) {
    warnings.push('Some paragraphs are very long and may reduce readability.');
    score -= Math.min(20, veryLongParagraphs * 8);
  }

  if (!/[.!؟?]/.test(content)) {
    warnings.push('Sentence punctuation appears weak or missing.');
    score -= 20;
  }

  return { score: clampScore(score), warnings };
}

export function auditLessonDeepDiveContent(input: DeepDiveQualityInput): DeepDiveQualityAudit {
  const normalized = normalize(input.contentMarkdown);
  const route = routeAlignment(input, normalized);
  const complete = completeness(input);
  const language = languageQuality(input);
  const risk = hallucinationRisk(input);
  const readability = clarity(input);

  const errors = [
    ...route.errors,
    ...complete.errors,
    ...language.errors,
    ...risk.errors,
  ];

  const warnings = [
    ...route.warnings,
    ...complete.warnings,
    ...language.warnings,
    ...risk.warnings,
    ...readability.warnings,
  ];

  const qualityScore = clampScore(
    route.score * 0.34 +
      complete.score * 0.25 +
      language.score * 0.18 +
      readability.score * 0.18 -
      risk.score * 0.20
  );

  const autoApprove =
    errors.length === 0 &&
    qualityScore >= 92 &&
    route.score >= 94 &&
    complete.score >= 90 &&
    language.score >= 90 &&
    risk.score <= 8;

  return {
    passed: errors.length === 0,
    autoApprove,
    recommendedStatus: autoApprove ? 'approved' : 'needs_human_review',
    qualityScore,
    routeAlignmentScore: route.score,
    completenessScore: complete.score,
    hallucinationRiskScore: risk.score,
    languageQualityScore: language.score,
    clarityScore: readability.score,
    errors,
    warnings,
    sectionChecks: complete.sectionChecks,
    metadata: {
      contentLength: complete.contentLength,
      paragraphCount: complete.paragraphCount,
      language: String(input.language),
      framework: String(input.framework),
      trackId: String(input.trackId),
      moduleId: input.moduleId,
      lessonId: input.lessonId,
      step: String(input.step),
    },
  };
}
