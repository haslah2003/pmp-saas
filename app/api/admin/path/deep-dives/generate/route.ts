import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { auditLessonDeepDiveContent } from '@/lib/pmp-path/deep-dive-quality';
import { ALL_TRACKS } from '@/lib/pmp-path/tracks';
import { frameworkFromModuleId } from '@/lib/pmp-path/videos.server';
import type { LearningStep, Locale } from '@/lib/pmp-path/types';

export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-5';
const GENERATION_MAX_TOKENS = 2200;
const PROMPT_VERSION = 'rpath-learn-deep-dive-generator-v2-fast-canonical';
const SOURCE_VERSION = 'pmp-path-track-registry-v1';

function readText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function readBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
}

function normalizeLanguage(value: unknown): Locale {
  return value === 'ar' ? 'ar' : 'en';
}

function normalizeStep(value: unknown): LearningStep {
  return value === 'learn' ? 'learn' : 'learn';
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
- Target 2,800 to 3,800 characters total.
- Use exactly one substantial paragraph under each required ## heading.
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
- اجعل الطول الإجمالي بين 2800 و3800 حرف تقريباً.
- اكتب فقرة واحدة قوية تحت كل عنوان مطلوب فقط.
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
- Target 2,800 to 3,800 characters total.
- Write exactly one substantial paragraph under each required heading.
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

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .map((block) => (block.type === 'text' ? block.text ?? '' : ''))
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json(
      { error: 'Unable to verify admin profile', details: profileError.message },
      { status: 500 }
    );
  }

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const moduleId = readText(body.moduleId) || readText(body.module_id);
  const lessonId = readText(body.lessonId) || readText(body.lesson_id);
  const language = normalizeLanguage(body.language);
  const step = normalizeStep(body.step);
  const force = readBoolean(body.force);

  if (!moduleId) {
    return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
  }

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  if (step !== 'learn') {
    return NextResponse.json(
      { error: 'Only the learn step is supported by this generator endpoint.' },
      { status: 400 }
    );
  }

  const framework = frameworkFromModuleId(moduleId);

  if (!framework) {
    return NextResponse.json(
      { error: `Unable to detect framework from moduleId: ${moduleId}` },
      { status: 400 }
    );
  }

  const context = findLessonContext(moduleId, lessonId);

  if (!context) {
    return NextResponse.json(
      { error: 'Lesson not found in ALL_TRACKS', moduleId, lessonId },
      { status: 404 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured' },
      { status: 500 }
    );
  }

  const admin = createAdminClient();
  const trackId = context.track.meta.id;
  const title = context.lesson.title[language] || context.lesson.title.en;

  const existingQuery = admin
    .from('lesson_deep_dives')
    .select('id, title, content_version, quality_status, quality_score, is_active')
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

  const { data: existingApproved, error: existingError } = await existingQuery;

  if (existingError) {
    return NextResponse.json(
      { error: 'Unable to check existing approved content', details: existingError.message },
      { status: 500 }
    );
  }

  if (existingApproved && !force) {
    return NextResponse.json({
      skipped: true,
      reason: 'approved_content_exists',
      message: 'Approved canonical Learn content already exists. Use force=true to regenerate.',
      record: existingApproved,
    });
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
    return NextResponse.json(
      { error: 'Unable to calculate next content version', details: versionError.message },
      { status: 500 }
    );
  }

  const contentVersion = Number(latestVersion?.content_version ?? 0) + 1;

  const anthropic = new Anthropic({ apiKey });

  const trackName = context.track.meta.fullName[language] || context.track.meta.fullName.en;
  const phaseTitle = context.phase.title[language] || context.phase.title.en;
  const moduleTitle = context.module.title[language] || context.module.title.en;
  const moduleDescription = context.module.description[language] || context.module.description.en;
  const lessonTitle = context.lesson.title[language] || context.lesson.title.en;
  const lessonObjective = context.lesson.objective[language] || context.lesson.objective.en;

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

  const contentMarkdown = extractTextFromAnthropicResponse(response);

  if (contentMarkdown.length < 500) {
    return NextResponse.json(
      {
        error: 'Generated content is unexpectedly short',
        contentLength: contentMarkdown.length,
      },
      { status: 502 }
    );
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
    .select('id, title, content_version, quality_status, quality_score, is_active')
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: 'Unable to insert generated deep-dive content', details: insertError.message, audit },
      { status: 500 }
    );
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
      return NextResponse.json(
        {
          error: 'Generated content passed audit but previous active records could not be archived',
          details: archiveError.message,
          inserted,
          audit,
        },
        { status: 500 }
      );
    }

    const { data: activated, error: activateError } = await admin
      .from('lesson_deep_dives')
      .update({ is_active: true })
      .eq('id', inserted.id)
      .select('id, title, content_version, quality_status, quality_score, is_active')
      .single();

    if (activateError) {
      return NextResponse.json(
        {
          error: 'Generated content passed audit but could not be activated',
          details: activateError.message,
          inserted,
          audit,
        },
        { status: 500 }
      );
    }

    finalRecord = activated;
  }

  return NextResponse.json({
    generated: true,
    autoApproved: audit.autoApprove,
    record: finalRecord,
    audit,
  });
}
