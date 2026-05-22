import fs from 'node:fs';
import path from 'node:path';

import Anthropic from '@anthropic-ai/sdk';

import { createAdminClient } from '../lib/supabase/admin';
import { auditLessonDeepDiveContent } from '../lib/pmp-path/deep-dive-quality';
import { ALL_TRACKS } from '../lib/pmp-path/tracks';
import type { LearningStep, Locale } from '../lib/pmp-path/types';

const MODEL = process.env.RPATH_DEEP_DIVE_MODEL || 'claude-sonnet-4-5';
const GENERATION_MAX_TOKENS = Number(process.env.RPATH_DEEP_DIVE_MAX_TOKENS || 3200);
const PROMPT_VERSION = 'rpath-learn-deep-dive-local-generator-v2-readable';
const SOURCE_VERSION = 'pmp-path-track-registry-v1';

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.warn('[R-PATH GEN] .env.local not found. Using existing process.env only.');
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2] ?? '';

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function readCliArg(name: string, fallback = '') {
  const prefix = `--${name}=`;
  const direct = process.argv.find((arg) => arg.startsWith(prefix));

  if (direct) {
    return direct.slice(prefix.length).trim();
  }

  const index = process.argv.indexOf(`--${name}`);

  if (index >= 0) {
    return String(process.argv[index + 1] || '').trim();
  }

  return fallback;
}

function readBooleanArg(name: string, fallback = false) {
  const value = readCliArg(name);

  if (!value) return fallback;

  return value === 'true' || value === '1' || value === 'yes';
}

function normalizeLanguage(value: string): Locale {
  return value === 'ar' ? 'ar' : 'en';
}

function normalizeStep(value: string): LearningStep {
  return value === 'learn' ? 'learn' : 'learn';
}

function frameworkFromModuleId(moduleId: string) {
  if (moduleId.startsWith('pmbok8-')) return 'pmbok8';
  if (moduleId.startsWith('pmbok7-')) return 'pmbok7';
  if (moduleId.startsWith('bridge-')) return 'bridge';
  return null;
}

function findLessonContext(moduleId: string, lessonId: string) {
  for (const track of ALL_TRACKS) {
    for (const phase of track.phases) {
      const pathModule = phase.modules.find((item) => item.id === moduleId);
      if (!pathModule) continue;

      const lesson = pathModule.lessons.find((item) => item.id === lessonId);
      if (!lesson) continue;

      return { track, phase, module: pathModule, lesson };
    }
  }

  return null;
}

function frameworkSystemRules(framework: string) {
  if (framework === 'pmbok8') {
    return `Framework: PMBOK 8 + ECO 2026.

SOURCE-OF-TRUTH RULES:
- ECO 2026 exam domain weights: People 33%, Process 41%, Business Environment 26%.
- PMBOK 8 has six principles:
  1. Adopt a Holistic View
  2. Focus on Value
  3. Embed Quality Into Processes and Deliverables
  4. Be an Accountable Leader
  5. Integrate Sustainability Within All Project Areas
  6. Build an Empowered Culture
- PMBOK 8 has five Project Management Focus Areas:
  Initiating, Planning, Executing, Monitoring and Controlling, Closing.
- PMBOK 8 has seven Performance Domains:
  Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk.
- PMBOK 8 includes 40 nonprescriptive processes.

STRICT GUARDRAILS:
- Do NOT use PMBOK 7's 12 principles as PMBOK 8 principles.
- Do NOT use PMBOK 7's eight performance domains as PMBOK 8 performance domains.
- Do NOT describe People, Process, and Business Environment as PMBOK 8 Performance Domains. They are ECO exam domains.
- Do NOT invent page numbers, section numbers, task numbers, or exact PMI/Rita quotes.
- Do NOT claim guaranteed exam success.
- Use Rita-style exam reasoning carefully without claiming unsupported Rita 2026 references.`;
  }

  if (framework === 'bridge') {
    return `Framework: Bridge Mode from PMBOK 7 + ECO 2021 to PMBOK 8 + ECO 2026.

SOURCE-OF-TRUTH RULES:
- PMBOK 7 has 12 principles and 8 performance domains.
- PMBOK 8 has 6 principles, 5 Focus Areas, 7 Performance Domains, and 40 nonprescriptive processes.
- ECO 2021 weights: People 42%, Process 50%, Business Environment 8%.
- ECO 2026 weights: People 33%, Process 41%, Business Environment 26%.

STRICT GUARDRAILS:
- Clearly distinguish ECO exam domains from PMBOK Guide performance domains.
- Do NOT present PMBOK 7 structures as PMBOK 8 structures.
- Do NOT invent page numbers, section numbers, task numbers, or exact PMI/Rita quotes.
- Focus on transition judgment and updated exam thinking.`;
  }

  return `Framework: PMBOK 7 + ECO 2021.

SOURCE-OF-TRUTH RULES:
- ECO 2021 exam domain weights: People 42%, Process 50%, Business Environment 8%.
- PMBOK 7 has 12 principles.
- PMBOK 7 performance domains are:
  Stakeholders, Team, Development Approach and Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty.

STRICT GUARDRAILS:
- Do NOT introduce PMBOK 8/ECO 2026 unless making a careful comparison.
- Do NOT invent page numbers, section numbers, task numbers, or exact PMI/Rita quotes.
- Do NOT claim guaranteed exam success.`;
}

function requiredHeadings(framework: string, language: Locale) {
  const isAr = language === 'ar';

  const common = isAr
    ? [
        '## 🔬 تحليل متقدم',
        '## 📚 أطر ونماذج إضافية',
        '## 📋 دراسة حالة',
        '## 🔗 روابط مع مجالات الأداء',
        '## 🎯 أنماط متقدمة في الامتحان',
      ]
    : [
        '## 🔬 Advanced Analysis',
        '## 📚 Additional Frameworks & Models',
        '## 📋 Case Study',
        '## 🔗 Performance Domain Connections',
        '## 🎯 Advanced Exam Patterns',
      ];

  if (framework === 'pmbok8') {
    common.push(
      isAr
        ? '## 🆕 تحديثات PMBOK 8 و ECO 2026'
        : '## 🆕 PMBOK 8 & ECO 2026 Updates'
    );
  }

  return common;
}

function buildSystemPrompt(framework: string, language: Locale) {
  return `You are an elite PMP learning architect, PMP/PMI content auditor, and senior exam-preparation mentor.

${frameworkSystemRules(framework)}

Your output will become canonical Learn-step content in a commercial PMP SaaS platform.

QUALITY REQUIREMENTS:
- Produce complete, polished Markdown only.
- Target 3,800 to 5,200 characters total.
- Use exactly two concise paragraphs under each required ## heading.
- Do not add extra headings or subheadings.
- Do not output JSON.
- Do not include admin notes.
- Do not create empty headings.
- Every heading must contain substantial instructional content.
- Use practical PMP exam reasoning, realistic project situations, and decision logic.
- Keep paragraphs readable and learner-focused.
- End the response with this exact final line:
[END_OF_DEEP_DIVE]

${language === 'ar'
  ? 'LANGUAGE REQUIREMENT: Write the full instructional content in Modern Standard Arabic. Keep technical terms such as PMP, PMI, PMBOK, ECO, Agile, Hybrid, and Scrum in English when clearer. Use RTL-friendly Arabic structure.'
  : 'LANGUAGE REQUIREMENT: Write the full instructional content in professional English.'}`;
}

function buildUserPrompt({
  framework,
  language,
  trackName,
  phaseTitle,
  moduleCode,
  moduleTitle,
  moduleDescription,
  lessonCode,
  lessonTitle,
  lessonObjective,
  estimatedMinutes,
}: {
  framework: string;
  language: Locale;
  trackName: string;
  phaseTitle: string;
  moduleCode: string;
  moduleTitle: string;
  moduleDescription: string;
  lessonCode: string;
  lessonTitle: string;
  lessonObjective: string;
  estimatedMinutes: number;
}) {
  const headings = requiredHeadings(framework, language).join('\n');

  if (language === 'ar') {
    return `أنشئ محتوى Learn canonical عميق ومكتمل للدرس التالي في منصة PMP AiTutorZ.

المسار: ${trackName}
المرحلة: ${phaseTitle}
الوحدة: ${moduleCode} — ${moduleTitle}
وصف الوحدة: ${moduleDescription}
الدرس: ${lessonCode} — ${lessonTitle}
هدف الدرس: ${lessonObjective}
المدة التقديرية: ${estimatedMinutes} دقيقة

استخدم العناوين التالية بالضبط وبنفس الترتيب:

${headings}

متطلبات المحتوى:
- اجعل الطول الإجمالي بين 3800 و5200 حرف تقريباً.
- اكتب فقرتين موجزتين تحت كل عنوان مطلوب فقط، واجعل كل فقرة أقل من 650 حرفاً.
- اجعل المحتوى تعليمياً عميقاً وليس مجرد ملخص.
- اربط الدرس بمنطق امتحان PMP وبقرارات مدير المشروع في سيناريوهات واقعية.
- اشرح كيف يميّز المتعلم الإجابة الصحيحة من الإجابات الجذابة الخاطئة.
- لا تذكر أرقام صفحات أو أقسام أو مهام غير موثقة.
- لا تستخدم اقتباسات مباشرة من PMI أو Rita.
- لا تَعِد المتعلم بالنجاح المضمون.
- يجب أن يكون المحتوى كافياً لاعتماده كمرجع Learn رسمي داخل المنصة.
- اختم الرد بالسطر التالي فقط:
[END_OF_DEEP_DIVE]`;
  }

  return `Generate complete canonical Learn-step deep-dive content for this PMP AiTutorZ lesson.

Track: ${trackName}
Phase: ${phaseTitle}
Module: ${moduleCode} — ${moduleTitle}
Module description: ${moduleDescription}
Lesson: ${lessonCode} — ${lessonTitle}
Lesson objective: ${lessonObjective}
Estimated minutes: ${estimatedMinutes}

Use exactly these Markdown headings in exactly this order:

${headings}

Content requirements:
- Target 3,800 to 5,200 characters total.
- Write exactly two concise paragraphs under each required heading. Keep each paragraph below 650 characters.
- Make the content instructional, deep, and exam-focused, not a shallow summary.
- Connect the lesson to PMP exam reasoning and realistic project manager decisions.
- Explain how learners separate the best PMI-aligned answer from attractive wrong answers.
- Do not mention invented page numbers, section numbers, task numbers, or unsupported exact references.
- Do not quote PMI or Rita directly.
- Do not guarantee exam success.
- The content must be strong enough to serve as approved canonical Learn content in the platform.
- End with this exact final line:
[END_OF_DEEP_DIVE]`;
}

function extractTextFromAnthropicResponse(response: unknown) {
  const content = (response as {
    content?: Array<{ type?: string; text?: string }>;
  }).content;

  if (!Array.isArray(content)) return '';

  return content
    .map((block) => (block.type === 'text' ? block.text ?? '' : ''))
    .filter(Boolean)
    .join('\n\n')
    .trim();
}


function splitLongParagraph(paragraph: string, maxLength = 760) {
  const trimmed = paragraph.trim();

  if (trimmed.length <= maxLength) return trimmed;

  const sentences = trimmed
    .split(/(?<=[.!?؟])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return trimmed.replace(new RegExp(`(.{1,${maxLength}})(\\s+|$)`, 'g'), '$1\n\n').trim();
  }

  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;

    if (next.length > maxLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);

  return chunks.join('\n\n');
}

function normalizeGeneratedMarkdown(markdown: string) {
  return markdown
    .split(/\n\s*\n/g)
    .map((block) => {
      const trimmed = block.trim();

      if (!trimmed) return '';
      if (trimmed.startsWith('## ')) return trimmed;
      if (trimmed === '[END_OF_DEEP_DIVE]') return trimmed;

      return splitLongParagraph(trimmed);
    })
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

async function main() {
  loadEnvLocal();

  const moduleId = readCliArg('moduleId', 'pmbok8-eco2026-F1');
  const lessonId = readCliArg('lessonId', 'pmbok8-eco2026-F1.L3');
  const language = normalizeLanguage(readCliArg('language', 'en'));
  const step = normalizeStep(readCliArg('step', 'learn'));
  const force = readBooleanArg('force', false);

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is missing from .env.local or process.env.');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing from .env.local or process.env.');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from .env.local or process.env.');
  }

  if (step !== 'learn') {
    throw new Error('Only step=learn is supported.');
  }

  const framework = frameworkFromModuleId(moduleId);

  if (!framework) {
    throw new Error(`Unable to detect framework from moduleId: ${moduleId}`);
  }

  const context = findLessonContext(moduleId, lessonId);

  if (!context) {
    throw new Error(`Lesson not found in ALL_TRACKS: ${moduleId} / ${lessonId}`);
  }

  const admin = createAdminClient();
  const trackId = context.track.meta.id;
  const title = context.lesson.title[language] || context.lesson.title.en;

  console.log('[R-PATH GEN] Starting local generation...');
  console.log({
    trackId,
    framework,
    moduleId,
    lessonId,
    language,
    step,
    force,
    model: MODEL,
    maxTokens: GENERATION_MAX_TOKENS,
  });

  const { data: existingApproved, error: existingError } = await admin
    .from('lesson_deep_dives')
    .select('id, title, content_version, quality_status, quality_score, is_active, created_at')
    .eq('track_id', trackId)
    .eq('framework', framework)
    .eq('module_id', moduleId)
    .eq('lesson_id', lessonId)
    .eq('step', step)
    .eq('language', language)
    .eq('quality_status', 'approved')
    .eq('is_active', true)
    .order('content_version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Unable to check existing approved content: ${existingError.message}`);
  }

  if (existingApproved && !force) {
    console.log('[R-PATH GEN] Skipped: approved content already exists. Use --force=true to regenerate.');
    console.log(existingApproved);
    return;
  }

  const { data: latestVersion, error: versionError } = await admin
    .from('lesson_deep_dives')
    .select('content_version')
    .eq('track_id', trackId)
    .eq('framework', framework)
    .eq('module_id', moduleId)
    .eq('lesson_id', lessonId)
    .eq('step', step)
    .eq('language', language)
    .order('content_version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (versionError) {
    throw new Error(`Unable to calculate next content version: ${versionError.message}`);
  }

  const contentVersion = Number(latestVersion?.content_version ?? 0) + 1;

  const trackName = context.track.meta.fullName[language] || context.track.meta.fullName.en;
  const phaseTitle = context.phase.title[language] || context.phase.title.en;
  const moduleTitle = context.module.title[language] || context.module.title.en;
  const moduleDescription = context.module.description[language] || context.module.description.en;
  const lessonTitle = context.lesson.title[language] || context.lesson.title.en;
  const lessonObjective = context.lesson.objective[language] || context.lesson.objective.en;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.time('[R-PATH GEN] Anthropic generation');

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: GENERATION_MAX_TOKENS,
    temperature: 0.2,
    system: buildSystemPrompt(framework, language),
    messages: [
      {
        role: 'user',
        content: buildUserPrompt({
          framework,
          language,
          trackName,
          phaseTitle,
          moduleCode: context.module.code,
          moduleTitle,
          moduleDescription,
          lessonCode: context.lesson.code,
          lessonTitle,
          lessonObjective,
          estimatedMinutes: context.lesson.estimatedMinutes,
        }),
      },
    ],
  });

  console.timeEnd('[R-PATH GEN] Anthropic generation');

  const contentMarkdown = normalizeGeneratedMarkdown(extractTextFromAnthropicResponse(response));

  if (contentMarkdown.length < 500) {
    throw new Error(`Generated content is unexpectedly short: ${contentMarkdown.length} characters.`);
  }

  const audit = auditLessonDeepDiveContent({
    trackId,
    framework,
    moduleId,
    lessonId,
    step,
    language,
    title,
    contentMarkdown,
  });

  const qualityStatus = audit.autoApprove ? 'approved' : 'needs_human_review';

  console.log('[R-PATH GEN] Audit result:');
  console.log({
    autoApprove: audit.autoApprove,
    qualityStatus,
    qualityScore: audit.qualityScore,
    routeAlignmentScore: audit.routeAlignmentScore,
    completenessScore: audit.completenessScore,
    languageQualityScore: audit.languageQualityScore,
    hallucinationRiskScore: audit.hallucinationRiskScore,
    clarityScore: audit.clarityScore,
    errors: audit.errors,
    warnings: audit.warnings,
    sectionChecks: audit.sectionChecks,
  });

  const { data: inserted, error: insertError } = await admin
    .from('lesson_deep_dives')
    .insert({
      track_id: trackId,
      framework,
      module_id: moduleId,
      lesson_id: lessonId,
      step,
      language,
      title,
      content_markdown: contentMarkdown,
      content_version: contentVersion,
      source_version: SOURCE_VERSION,
      prompt_version: PROMPT_VERSION,
      quality_status: qualityStatus,
      quality_score: audit.qualityScore,
      is_active: false,
    })
    .select('id, title, content_version, quality_status, quality_score, is_active, created_at')
    .single();

  if (insertError) {
    throw new Error(`Unable to insert generated content: ${insertError.message}`);
  }

  let finalRecord = inserted;

  if (audit.autoApprove) {
    const { error: archiveError } = await admin
      .from('lesson_deep_dives')
      .update({ is_active: false })
      .eq('track_id', trackId)
      .eq('framework', framework)
      .eq('module_id', moduleId)
      .eq('lesson_id', lessonId)
      .eq('step', step)
      .eq('language', language)
      .eq('quality_status', 'approved')
      .eq('is_active', true);

    if (archiveError) {
      throw new Error(`Passed audit but failed to archive previous active records: ${archiveError.message}`);
    }

    const { data: activated, error: activateError } = await admin
      .from('lesson_deep_dives')
      .update({ is_active: true })
      .eq('id', inserted.id)
      .select('id, title, content_version, quality_status, quality_score, is_active, created_at')
      .single();

    if (activateError) {
      throw new Error(`Passed audit but failed to activate new record: ${activateError.message}`);
    }

    finalRecord = activated;
  }

  console.log('[R-PATH GEN] Final record:');
  console.log(finalRecord);

  if (!audit.autoApprove) {
    console.log('[R-PATH GEN] Inserted as needs_human_review and inactive. Review audit warnings before activation.');
  }
}

main().catch((error) => {
  console.error('[R-PATH GEN] Failed.');
  console.error(error);
  process.exit(1);
});
