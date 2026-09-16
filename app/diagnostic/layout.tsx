import { cookies, headers } from 'next/headers';
import { LanguageProvider } from '@/lib/i18n/language-context';

export default async function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const explicitLocale = headerStore.get('x-pmp-explicit-locale');
  const savedLocale = cookieStore.get('pmp_locale')?.value ?? cookieStore.get('lang')?.value;
  const initialLocale = explicitLocale === 'ar' || (explicitLocale !== 'en' && savedLocale === 'ar') ? 'ar' : 'en';

  return <LanguageProvider initialLocale={initialLocale}>{children}</LanguageProvider>;
}
