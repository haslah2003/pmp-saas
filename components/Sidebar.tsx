'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/DashboardLanguageWrapper'

interface SidebarProps {
  logoUrl: string | null
  siteName: string
  primaryColor: string
  profileName: string
  profileInitial: string
  isAdmin: boolean
  isPremium: boolean
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', key: 'nav.dashboard' as const },
  { href: '/dashboard/mindmap', icon: '🧠', key: 'nav.mindmap' as const },
  { href: '/dashboard/course', icon: '📚', key: 'nav.course' as const },
  { href: '/dashboard/study-studio', icon: '💡', key: 'nav.study_studio' as const },
  { href: '/dashboard/practice', icon: '✏️', key: 'nav.practice' as const },
  { href: '/dashboard/exam', icon: '⏱️', key: 'nav.mock_exam' as const },
  { href: '/dashboard/tutor', icon: '🤖', key: 'nav.tutor' as const },
  { href: '/dashboard/formulas', icon: '📐', key: 'nav.formulas' as const },
  { href: '/dashboard/processes', icon: '🔄', key: 'nav.processes' as const },
  { href: '/dashboard/artifacts', icon: '📋', key: 'nav.artifacts' as const },
  { href: '/dashboard/billing', icon: '💳', key: 'nav.billing' as const },
]

const ADMIN_ITEMS = [
  { href: '/admin/branding', icon: '🎨', key: 'nav.branding' as const },
  { href: '/admin/analytics', icon: '📊', key: 'nav.analytics' as const },
  { href: '/admin/media', icon: '🖼️', key: 'nav.media' as const },
  { href: '/admin/resources', icon: '📚', key: 'nav.resources' as const },
  { href: '/admin/questions', icon: '🧠', key: 'nav.questions' as const },
  { href: '/admin/billing', icon: '💰', key: 'nav.billing' as const },
]

export default function Sidebar({
  logoUrl, siteName, primaryColor, profileName, profileInitial, isAdmin, isPremium,
}: SidebarProps) {
  const { t, isArabic } = useLanguage()

  return (
    <aside className="w-60 bg-white flex flex-col shrink-0 border-r border-gray-100 rtl:border-r-0 rtl:border-l rtl:border-gray-100">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        {logoUrl ? (
          <img src={logoUrl} alt={siteName} className="h-10 object-contain" />
        ) : (
          <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              P
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{siteName}</div>
              <div className="text-[10px] text-gray-400">PMBOK 7 + ECO 2021</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
          {t('nav.learning')}
        </p>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group"
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-base group-hover:scale-110 transition-transform"
              style={{ backgroundColor: primaryColor + '15' }}
            >
              {item.icon}
            </span>
            <span>{t(item.key)}</span>
          </Link>
        ))}

        {isAdmin && (
          <div className="pt-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
              {t('nav.admin')}
            </p>
            {ADMIN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                  style={{ backgroundColor: primaryColor + '15' }}
                >
                  {item.icon}
                </span>
                <span>{t(item.key)}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Language Switcher */}
      <div className="px-3 py-2 border-t border-gray-100">
        <LanguageSwitcher />
      </div>

      {/* User area */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            {profileInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-900 truncate">{profileName}</div>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isAdmin ? '#fee2e2' : isPremium ? '#dcfce7' : '#fef9c3',
                color: isAdmin ? '#991b1b' : isPremium ? '#166534' : '#854d0e',
              }}
            >
              {isAdmin ? 'ADMIN' : isPremium ? 'PREMIUM' : 'FREE'}
            </span>
          </div>
        </div>
        {!isPremium && (
          <Link
            href="/dashboard/pricing"
            className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-white transition"
            style={{ backgroundColor: primaryColor }}
          >
            {t('nav.upgrade')}
          </Link>
        )}
        <form action="/api/auth/signout" method="post" className="mt-1">
          <button className="w-full text-xs text-gray-400 hover:text-gray-600 py-1.5 transition text-center">
            {t('nav.sign_out')}
          </button>
        </form>
      </div>
    </aside>
  )
}
