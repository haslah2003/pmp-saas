import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, COURSES } from '@/lib/courses-data'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export function generateStaticParams() {
  return COURSES.map((c) => ({ courseSlug: c.slug }))
}

export default async function CoursePage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourseBySlug(courseSlug)
  if (!course) notFound()

  const totalMinutes = course.lessons.reduce((s, l) => s + l.estimatedMinutes, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <div className={`bg-gradient-to-br ${course.gradient} text-white`}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link href="/dashboard/course" className="hover:text-white transition-colors">
              Course Library
            </Link>
            <span>/</span>
            <span className="text-white">{course.shortTitle}</span>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-5xl">{course.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-white/80 mt-2 max-w-2xl leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center gap-5 mt-4">
                <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm font-medium">
                  {course.lessons.length} lessons
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm font-medium">
                  ~{totalMinutes} min total
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm font-medium">
                  📌 {course.ecoMapping}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-gray-900 mb-1">Lessons in this Domain</h2>
            {course.lessons.map((lesson, idx) => (
              <Link
                key={lesson.slug}
                href={`/dashboard/course/${course.slug}/${lesson.slug}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${course.badgeColor}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {lesson.overview.split('.')[0]}.
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>⏱ {lesson.estimatedMinutes} min</span>
                      <span>•</span>
                      <span>💡 {lesson.keyConcepts.length} key concepts</span>
                      <span>•</span>
                      <span>🎯 {lesson.examTips.length} exam tips</span>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${course.textColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0`}>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/practice?domain=${encodeURIComponent(course.shortTitle)}`}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r ${course.gradient} text-white text-sm font-semibold hover:opacity-90 transition-opacity`}
                >
                  <span>🎯</span>
                  <span>Practice This Domain</span>
                </Link>
                <Link
                  href="/dashboard/mindmap"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors"
                >
                  <span>🗺️</span>
                  <span>View Mind Map</span>
                </Link>
                <Link
                  href="/dashboard/tutor"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors"
                >
                  <span>🤖</span>
                  <span>Ask AiTuTorZ</span>
                </Link>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${course.lightBg} ${course.borderColor}`}>
              <h3 className={`text-sm font-bold mb-3 ${course.textColor}`}>
                What You&apos;ll Learn
              </h3>
              <ul className="space-y-2">
                {course.lessons.map((l) => (
                  <li key={l.slug} className="flex items-start gap-2">
                    <span className={`text-xs font-bold mt-0.5 ${course.textColor}`}>✓</span>
                    <span className="text-xs text-gray-600">{l.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3">All Domains</h3>
              <div className="space-y-1.5">
                {COURSES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/dashboard/course/${c.slug}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      c.slug === course.slug
                        ? `${c.badgeColor} font-bold`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.shortTitle}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}