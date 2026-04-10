/**
 * AiTuTorZ — Arabic Course Translation Script
 * Translates all 24 PMP lessons from English to Arabic
 * Grounded in PMBOK 7 Arabic + Rita Mulcahy Arabic official terminology
 *
 * Run once from Terminal:
 *   node scripts/translate-courses-ar.mjs
 */

import Anthropic from '@anthropic-ai/sdk'
import { execSync, spawnSync } from 'child_process'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Load .env.local
function loadEnv() {
  const envPath = path.join(projectRoot, '.env.local')
  if (!existsSync(envPath)) throw new Error('.env.local not found at ' + envPath)
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    process.env[key] = val
  }
}
loadEnv()

const PROGRESS_FILE = path.join(projectRoot, 'scripts', 'translate-progress-ar.json')
const OUTPUT_FILE   = path.join(projectRoot, 'lib', 'courses-data-ar.ts')
const EXTRACT_FILE  = path.join(projectRoot, 'scripts', '_extract-courses.ts')

const PMBOK_AR_TERMINOLOGY = `
OFFICIAL ARABIC PMI / PMBOK 7 TERMINOLOGY — use exactly these terms:

Performance Domains:
• Stakeholder Performance Domain       → مجال أداء المعنيين
• Team Performance Domain              → مجال أداء الفريق
• Development Approach & Life Cycle    → مجال أداء منهج التطوير ودورة الحياة
• Planning Performance Domain          → مجال أداء التخطيط
• Project Work Performance Domain      → مجال أداء عمل المشروع
• Delivery Performance Domain          → مجال أداء التسليم
• Measurement Performance Domain       → مجال أداء القياس
• Uncertainty Performance Domain       → مجال أداء عدم التيقن

Key Roles:
• Project Manager         → مدير المشروع
• Project Team            → فريق المشروع
• Stakeholders            → المعنيون
• Sponsor                 → الراعي
• Product Owner           → مالك المنتج
• PMO                     → مكتب إدارة المشاريع

Knowledge Areas:
• Scope                   → النطاق
• Schedule                → الجدول الزمني
• Cost                    → التكلفة
• Quality                 → الجودة
• Resource                → الموارد
• Communication           → التواصل
• Risk                    → المخاطر
• Procurement             → المشتريات
• Integration             → التكامل

Documents:
• Project Charter         → ميثاق المشروع
• Stakeholder Register    → سجل المعنيين
• Risk Register           → سجل المخاطر
• Issue Log               → سجل القضايا
• Change Request          → طلب التغيير
• Lessons Learned         → الدروس المستفادة
• WBS                     → هيكل تقسيم العمل (WBS)
• Project Management Plan → خطة إدارة المشروع

Techniques:
• Power/Interest Grid     → مصفوفة القدرة/الاهتمام
• Salience Model          → نموذج البروز
• Earned Value            → القيمة المكتسبة
• Critical Path           → المسار الحرج
• RACI Matrix             → مصفوفة RACI

Approaches:
• Predictive / Waterfall  → التنبؤية / الشلالية
• Agile                   → الرشيقة
• Hybrid                  → الهجينة
• Adaptive                → التكيفية
• Sprint                  → سبرينت
• Backlog                 → قائمة الأعمال المتراكمة
• Kanban                  → كانبان
• Scrum                   → سكرام
• Retrospective           → جلسة المراجعة الاسترجاعية

Engagement Levels:
• Unaware     → غير مُدرك
• Resistant   → مقاوم
• Neutral     → محايد
• Supportive  → داعم
• Leading     → قائد / رائد

Communication:
• Interactive → التواصل التفاعلي
• Push        → التواصل الدفعي
• Pull        → التواصل السحبي

Leadership:
• Servant Leadership    → القيادة الخادمة
• Emotional Intelligence → الذكاء العاطفي
• Active Listening       → الاستماع الفعّال
• Conflict Resolution   → حل النزاعات
• Coaching              → التدريب والإرشاد
`

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function extractCourses() {
  console.log('📖 Extracting English courses data...')
  writeFileSync(EXTRACT_FILE, `import { COURSES } from '../lib/courses-data'
process.stdout.write(JSON.stringify(COURSES))
`)
  const result = spawnSync('npx', ['tsx', '_extract-courses.ts'], {
    cwd: path.join(projectRoot, 'scripts'),
    encoding: 'utf8',
    shell: true
  })
  try { execSync('rm -f "' + EXTRACT_FILE + '"') } catch (_) {}
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error('Extraction failed:\n' + result.stderr)
  return JSON.parse(result.stdout)
}

async function translateCourseMeta(course) {
  const payload = {
    title: course.title,
    shortTitle: course.shortTitle,
    description: course.description,
    ecoMapping: course.ecoMapping,
  }
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    system: `You are a senior Arabic translator specializing in PMI/PMP certification content.
Translate English JSON fields into professional Modern Standard Arabic (الفصحى).
Use the official PMBOK 7 Arabic terminology below.
${PMBOK_AR_TERMINOLOGY}
RULES:
- Return ONLY valid JSON. No markdown, no backticks, no preamble.
- Keep abbreviations in English: PMP, PMBOK, ECO, PMI, EVM, WBS.
- Write fluent professional Arabic for senior professionals pursuing PMP certification.`,
    messages: [{ role: 'user', content: 'Translate to Arabic:\n' + JSON.stringify(payload, null, 2) }]
  })
  const raw = response.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(raw)
}

async function translateLesson(lesson) {
  const payload = {
    title: lesson.title,
    overview: lesson.overview,
    keyConcepts: lesson.keyConcepts,
    deepDive: lesson.deepDive,
    examTips: lesson.examTips,
    ritaInsight: lesson.ritaInsight,
    commonPitfalls: lesson.commonPitfalls,
  }
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: `You are a senior Arabic translator and PMP education expert.
Translate PMP lesson content to professional Modern Standard Arabic (الفصحى).
Grounded in official PMBOK 7 Arabic and Rita Mulcahy Arabic terminology.

${PMBOK_AR_TERMINOLOGY}

RULES:
1. Return ONLY a valid JSON object with EXACTLY the same structure. No markdown. No backticks.
2. Translate ALL text values. Keep exact same keys.
3. Use formal Arabic — professional, clear, accessible to Arabic-speaking PMP candidates.
4. Keep abbreviations in English: PMP, PMBOK, ECO, PMI, EVM, WBS, RACI, KPIs, etc.
5. Translate Rita Mulcahy name as: ريتا مولكاهي
6. Translate concept-for-concept — prioritize educational fluency over literal translation.
7. Exam tips: direct, actionable Arabic — coach tone.
8. Deep dives: professional Arabic training manual style.
9. Rita insights: preserve personal coaching tone in Arabic.
10. Keep same number of array elements as input.`,
    messages: [{ role: 'user', content: 'Translate this PMP lesson to Arabic. Return ONLY JSON:\n\n' + JSON.stringify(payload, null, 2) }]
  })
  const raw = response.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')
  const translated = JSON.parse(raw)
  return { slug: lesson.slug, estimatedMinutes: lesson.estimatedMinutes, ...translated }
}

function generateTsFile(courses) {
  const ts = `// ═══════════════════════════════════════════════════════════════════════
// AiTuTorZ — Arabic Course Content
// Auto-generated by scripts/translate-courses-ar.mjs
// Sources: PMBOK 7 Arabic Edition + Rita Mulcahy Arabic Edition
// DO NOT EDIT MANUALLY — re-run the script to regenerate
// ═══════════════════════════════════════════════════════════════════════

import type { Course } from './courses-data'

export const COURSES_AR: Course[] = ` + JSON.stringify(courses, null, 2) + `
`
  writeFileSync(OUTPUT_FILE, ts, 'utf8')
}

async function main() {
  console.log('\n🚀 AiTuTorZ Arabic Course Translation')
  console.log('══════════════════════════════════════')
  console.log('📚 Sources: PMBOK 7 Arabic + Rita Mulcahy Arabic')
  console.log('🤖 Model: claude-sonnet-4-20250514')
  console.log('══════════════════════════════════════\n')

  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not found in .env.local')

  mkdirSync(path.join(projectRoot, 'scripts'), { recursive: true })

  let progress = {}
  if (existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'))
    console.log(`📂 Resuming — ${Object.keys(progress).length} item(s) already translated\n`)
  }

  const courses = extractCourses()
  const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0)
  console.log(`✅ Found ${courses.length} courses with ${totalLessons} lessons\n`)

  const translatedCourses = []

  for (const course of courses) {
    console.log(`\n📘 Course: ${course.title}`)
    console.log('─'.repeat(50))

    const metaKey = `${course.slug}:meta`
    let meta = progress[metaKey]
    if (!meta) {
      process.stdout.write('  📝 Translating course metadata...')
      meta = await translateCourseMeta(course)
      progress[metaKey] = meta
      writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))
      console.log(' ✅')
      await sleep(800)
    } else {
      console.log('  ✅ Course metadata (cached)')
    }

    const translatedCourse = {
      slug: course.slug,
      title: meta.title,
      shortTitle: meta.shortTitle,
      icon: course.icon,
      gradient: course.gradient,
      lightBg: course.lightBg,
      borderColor: course.borderColor,
      textColor: course.textColor,
      badgeColor: course.badgeColor,
      description: meta.description,
      ecoMapping: meta.ecoMapping,
      lessons: [],
    }

    const translatedLessons = []
    for (let i = 0; i < course.lessons.length; i++) {
      const lesson = course.lessons[i]
      const lessonKey = `${course.slug}:${lesson.slug}`

      if (progress[lessonKey]) {
        console.log(`  ✅ Lesson ${i + 1}/${course.lessons.length}: ${lesson.title} (cached)`)
        translatedLessons.push(progress[lessonKey])
        continue
      }

      process.stdout.write(`  🔄 Lesson ${i + 1}/${course.lessons.length}: ${lesson.title}...`)
      try {
        const translated = await translateLesson(lesson)
        translatedLessons.push(translated)
        progress[lessonKey] = translated
        writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))
        console.log(' ✅')
        await sleep(1200)
      } catch (err) {
        console.log(' ❌')
        console.error(`\n  Error: ${err.message}`)
        console.log('  💾 Progress saved. Re-run to resume.\n')
        process.exit(1)
      }
    }

    translatedCourse.lessons = translatedLessons
    translatedCourses.push(translatedCourse)
  }

  console.log('\n\n📝 Generating lib/courses-data-ar.ts...')
  generateTsFile(translatedCourses)
  try { execSync('rm -f "' + PROGRESS_FILE + '"') } catch (_) {}

  console.log('✅ Done! lib/courses-data-ar.ts generated.')
  console.log('\nNext: wire Arabic courses into your course pages.')
  console.log('══════════════════════════════════════\n')
}

main().catch(err => { console.error('\n❌ Fatal:', err.message); process.exit(1) })
