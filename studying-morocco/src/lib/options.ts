/**
 * Shared, bilingual option lists. Used by the Payload schema (admin selects)
 * and by the public site (filters, badges), so values stay in one place.
 */

export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value)

export type Bilingual = { ar: string; en: string }
export type Option<V extends string = string> = { value: V; label: Bilingual }

/** Payload select options accept `{ en, ar }` label objects for the admin UI. */
export const toPayloadOptions = <V extends string>(options: readonly Option<V>[]) =>
  options.map((o) => ({ value: o.value, label: { en: o.label.en, ar: o.label.ar } }))

export const optionLabel = <V extends string>(
  options: readonly Option<V>[],
  value: string | null | undefined,
  locale: Locale,
): string => options.find((o) => o.value === value)?.label[locale] ?? value ?? ''

export const studyLevels = [
  { value: 'foundation', label: { en: 'Foundation year', ar: 'سنة تحضيرية' } },
  { value: 'language', label: { en: 'Language preparation', ar: 'تأهيل لغوي' } },
  { value: 'bachelor', label: { en: "Bachelor's", ar: 'إجازة / بكالوريوس' } },
  { value: 'master', label: { en: "Master's", ar: 'ماستر' } },
  { value: 'doctorate', label: { en: 'Doctorate (PhD)', ar: 'دكتوراه' } },
  { value: 'medicine', label: { en: 'Medicine & health', ar: 'الطب والعلوم الصحية' } },
  { value: 'executive', label: { en: 'Executive & professional', ar: 'تنفيذي ومهني' } },
] as const satisfies readonly Option[]

export const teachingLanguages = [
  { value: 'ar', label: { en: 'Arabic', ar: 'العربية' } },
  { value: 'fr', label: { en: 'French', ar: 'الفرنسية' } },
  { value: 'en', label: { en: 'English', ar: 'الإنجليزية' } },
] as const satisfies readonly Option[]

export const universityTypes = [
  { value: 'public', label: { en: 'Public university', ar: 'جامعة عمومية' } },
  { value: 'private', label: { en: 'Private non-profit', ar: 'خاصة غير ربحية' } },
  { value: 'partnership', label: { en: 'Private (state partnership)', ar: 'خاصة بشراكة مع الدولة' } },
  { value: 'traditional', label: { en: 'Traditional (Islamic sciences)', ar: 'تقليدية (علوم شرعية)' } },
] as const satisfies readonly Option[]

export const admissionChannels = [
  { value: 'direct', label: { en: 'Direct application', ar: 'ترشيح مباشر' } },
  { value: 'amci', label: { en: 'AMCI (diplomatic channel)', ar: 'الوكالة المغربية للتعاون الدولي' } },
  { value: 'exchange', label: { en: 'Exchange programmes', ar: 'برامج التبادل' } },
  { value: 'platform', label: { en: 'University online platform', ar: 'منصة الجامعة الإلكترونية' } },
] as const satisfies readonly Option[]

export const studyModes = [
  { value: 'full-time', label: { en: 'Full-time (on campus)', ar: 'دوام كامل حضوري' } },
  { value: 'flexible', label: { en: 'Flexible schedule (paid track)', ar: 'التوقيت الميسر (مؤدى عنه)' } },
] as const satisfies readonly Option[]

export const serviceKeys = [
  { value: 'placement', label: { en: 'University placement', ar: 'القبول الجامعي' } },
  { value: 'accommodation', label: { en: 'Accommodation', ar: 'السكن' } },
  { value: 'airport', label: { en: 'Airport pickup', ar: 'الاستقبال في المطار' } },
  { value: 'transport', label: { en: 'Daily transportation', ar: 'النقل اليومي' } },
  { value: 'academic', label: { en: 'Academic support & tutoring', ar: 'الدعم الأكاديمي' } },
  { value: 'language', label: { en: 'French / Arabic / English courses', ar: 'دورات لغوية' } },
  { value: 'residency', label: { en: 'Visa & residence card', ar: 'التأشيرة وبطاقة الإقامة' } },
  { value: 'equivalence', label: { en: 'Pre-approval & equivalence', ar: 'الموافقة المسبقة والمعادلة' } },
  { value: 'insurance', label: { en: 'Health insurance', ar: 'التأمين الصحي' } },
  { value: 'family', label: { en: 'Family relocation & schools', ar: 'انتقال الأسرة والمدارس' } },
  { value: 'guardianship', label: { en: 'Guardianship & welfare', ar: 'الرعاية والمتابعة' } },
  { value: 'career', label: { en: 'Internships & careers', ar: 'التدريب والتوظيف' } },
] as const satisfies readonly Option[]

export const applicationStatuses = [
  { value: 'new', label: { en: 'New', ar: 'جديد' } },
  { value: 'contacted', label: { en: 'Contacted', ar: 'تم التواصل' } },
  { value: 'qualified', label: { en: 'Qualified', ar: 'مؤهل' } },
  { value: 'documents', label: { en: 'Collecting documents', ar: 'تجميع الوثائق' } },
  { value: 'submitted', label: { en: 'Submitted to university', ar: 'أُرسل إلى الجامعة' } },
  { value: 'offer', label: { en: 'Offer received', ar: 'تم القبول' } },
  { value: 'visa', label: { en: 'Pre-approval & travel', ar: 'الموافقة المسبقة والسفر' } },
  { value: 'arrived', label: { en: 'Arrived in Morocco', ar: 'وصل إلى المغرب' } },
  { value: 'enrolled', label: { en: 'Enrolled', ar: 'مسجل نهائيًا' } },
  { value: 'on-hold', label: { en: 'On hold', ar: 'معلّق' } },
  { value: 'lost', label: { en: 'Closed / lost', ar: 'مغلق' } },
] as const satisfies readonly Option[]

/** Statuses shown, in order, on the public "track my application" timeline. */
export const trackableStatuses = [
  'new',
  'contacted',
  'documents',
  'submitted',
  'offer',
  'visa',
  'arrived',
  'enrolled',
] as const

export const inquiryTypes = [
  { value: 'consultation', label: { en: 'Free consultation', ar: 'استشارة مجانية' } },
  { value: 'contact', label: { en: 'General enquiry', ar: 'استفسار عام' } },
  { value: 'callback', label: { en: 'Call-back request', ar: 'طلب اتصال' } },
  { value: 'partnership', label: { en: 'Partnership', ar: 'شراكة' } },
] as const satisfies readonly Option[]

export const contactChannels = [
  { value: 'whatsapp', label: { en: 'WhatsApp', ar: 'واتساب' } },
  { value: 'phone', label: { en: 'Phone call', ar: 'مكالمة هاتفية' } },
  { value: 'video', label: { en: 'Video call (Zoom / Meet)', ar: 'مكالمة فيديو' } },
  { value: 'email', label: { en: 'Email', ar: 'البريد الإلكتروني' } },
] as const satisfies readonly Option[]

export const timeSlots = [
  { value: 'morning', label: { en: 'Morning (9:00–12:00 GMT+1)', ar: 'صباحًا (9:00–12:00 بتوقيت المغرب)' } },
  { value: 'afternoon', label: { en: 'Afternoon (12:00–17:00 GMT+1)', ar: 'بعد الظهر (12:00–17:00 بتوقيت المغرب)' } },
  { value: 'evening', label: { en: 'Evening (17:00–21:00 GMT+1)', ar: 'مساءً (17:00–21:00 بتوقيت المغرب)' } },
] as const satisfies readonly Option[]

export const budgetRanges = [
  { value: 'free', label: { en: 'Free public tuition only', ar: 'دراسة عمومية مجانية فقط' } },
  { value: 'under-5k', label: { en: 'Under $5,000 / year', ar: 'أقل من 5,000 دولار سنويًا' } },
  { value: '5k-10k', label: { en: '$5,000 – $10,000 / year', ar: '5,000 – 10,000 دولار سنويًا' } },
  { value: '10k-15k', label: { en: '$10,000 – $15,000 / year', ar: '10,000 – 15,000 دولار سنويًا' } },
  { value: 'over-15k', label: { en: 'Over $15,000 / year', ar: 'أكثر من 15,000 دولار سنويًا' } },
] as const satisfies readonly Option[]

export const languageLevels = [
  { value: 'none', label: { en: 'None', ar: 'لا يوجد' } },
  { value: 'basic', label: { en: 'Basic', ar: 'مبتدئ' } },
  { value: 'intermediate', label: { en: 'Intermediate (B1–B2)', ar: 'متوسط (B1–B2)' } },
  { value: 'advanced', label: { en: 'Advanced (C1+)', ar: 'متقدم (C1+)' } },
  { value: 'native', label: { en: 'Native', ar: 'لغة أم' } },
] as const satisfies readonly Option[]

export const faqCategories = [
  { value: 'general', label: { en: 'General', ar: 'عام' } },
  { value: 'admissions', label: { en: 'Admissions', ar: 'القبول والتسجيل' } },
  { value: 'costs', label: { en: 'Costs & scholarships', ar: 'التكاليف والمنح' } },
  { value: 'gcc', label: { en: 'Gulf students', ar: 'طلبة الخليج' } },
  { value: 'visa', label: { en: 'Entry & residence', ar: 'الدخول والإقامة' } },
  { value: 'living', label: { en: 'Housing & daily life', ar: 'السكن والحياة اليومية' } },
  { value: 'families', label: { en: 'Families', ar: 'العائلات' } },
] as const satisfies readonly Option[]

/** Priority markets first (as defined in the brief), then other common origins. */
export const countries = [
  { value: 'OM', label: { en: 'Oman', ar: 'عُمان' } },
  { value: 'AE', label: { en: 'United Arab Emirates', ar: 'الإمارات' } },
  { value: 'QA', label: { en: 'Qatar', ar: 'قطر' } },
  { value: 'SA', label: { en: 'Saudi Arabia', ar: 'السعودية' } },
  { value: 'KW', label: { en: 'Kuwait', ar: 'الكويت' } },
  { value: 'BH', label: { en: 'Bahrain', ar: 'البحرين' } },
  { value: 'JO', label: { en: 'Jordan', ar: 'الأردن' } },
  { value: 'LB', label: { en: 'Lebanon', ar: 'لبنان' } },
  { value: 'SY', label: { en: 'Syria', ar: 'سوريا' } },
  { value: 'IQ', label: { en: 'Iraq', ar: 'العراق' } },
  { value: 'PS', label: { en: 'Palestine', ar: 'فلسطين' } },
  { value: 'EG', label: { en: 'Egypt', ar: 'مصر' } },
  { value: 'YE', label: { en: 'Yemen', ar: 'اليمن' } },
  { value: 'LY', label: { en: 'Libya', ar: 'ليبيا' } },
  { value: 'SD', label: { en: 'Sudan', ar: 'السودان' } },
  { value: 'GB', label: { en: 'United Kingdom', ar: 'المملكة المتحدة' } },
  { value: 'FR', label: { en: 'France', ar: 'فرنسا' } },
  { value: 'DE', label: { en: 'Germany', ar: 'ألمانيا' } },
  { value: 'BE', label: { en: 'Belgium', ar: 'بلجيكا' } },
  { value: 'NL', label: { en: 'Netherlands', ar: 'هولندا' } },
  { value: 'ES', label: { en: 'Spain', ar: 'إسبانيا' } },
  { value: 'IT', label: { en: 'Italy', ar: 'إيطاليا' } },
  { value: 'SE', label: { en: 'Sweden', ar: 'السويد' } },
  { value: 'IE', label: { en: 'Ireland', ar: 'أيرلندا' } },
  { value: 'NG', label: { en: 'Nigeria', ar: 'نيجيريا' } },
  { value: 'SN', label: { en: 'Senegal', ar: 'السنغال' } },
  { value: 'CI', label: { en: "Côte d'Ivoire", ar: 'ساحل العاج' } },
  { value: 'ML', label: { en: 'Mali', ar: 'مالي' } },
  { value: 'GN', label: { en: 'Guinea', ar: 'غينيا' } },
  { value: 'MR', label: { en: 'Mauritania', ar: 'موريتانيا' } },
  { value: 'NE', label: { en: 'Niger', ar: 'النيجر' } },
  { value: 'TD', label: { en: 'Chad', ar: 'تشاد' } },
  { value: 'CM', label: { en: 'Cameroon', ar: 'الكاميرون' } },
  { value: 'GH', label: { en: 'Ghana', ar: 'غانا' } },
  { value: 'KE', label: { en: 'Kenya', ar: 'كينيا' } },
  { value: 'ET', label: { en: 'Ethiopia', ar: 'إثيوبيا' } },
  { value: 'SO', label: { en: 'Somalia', ar: 'الصومال' } },
  { value: 'GA', label: { en: 'Gabon', ar: 'الغابون' } },
  { value: 'TG', label: { en: 'Togo', ar: 'توغو' } },
  { value: 'BJ', label: { en: 'Benin', ar: 'بنين' } },
  { value: 'BF', label: { en: 'Burkina Faso', ar: 'بوركينا فاسو' } },
  { value: 'US', label: { en: 'United States', ar: 'الولايات المتحدة' } },
  { value: 'CA', label: { en: 'Canada', ar: 'كندا' } },
  { value: 'TR', label: { en: 'Türkiye', ar: 'تركيا' } },
  { value: 'MY', label: { en: 'Malaysia', ar: 'ماليزيا' } },
  { value: 'XX', label: { en: 'Other', ar: 'دولة أخرى' } },
] as const satisfies readonly Option[]

export const gccCountries = ['OM', 'AE', 'QA', 'SA', 'KW', 'BH'] as const

export const currencies = ['MAD', 'USD', 'EUR', 'GBP', 'OMR', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'JOD', 'IQD', 'XOF'] as const
export type CurrencyCode = (typeof currencies)[number]

export const iconKeys = [
  'graduation-cap',
  'building',
  'home',
  'plane',
  'bus',
  'book-open',
  'languages',
  'badge-check',
  'shield-check',
  'heart-pulse',
  'users',
  'briefcase',
  'scale',
  'stethoscope',
  'cpu',
  'landmark',
  'calculator',
  'globe',
  'wallet',
  'sun',
  'map-pin',
  'sparkles',
  'clock',
  'message-circle',
  'file-check',
  'moon-star',
  'palette',
  'leaf',
  'compass',
  'baby',
] as const
export type IconKey = (typeof iconKeys)[number]
