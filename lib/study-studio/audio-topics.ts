// Study Studio audio/video topics per exam pathway.
// Shared by the learner Study Studio player and the admin media-mapping page so
// both sides key off the exact same (framework, topic id) list.
//
// pmbok8 + bridge are grounded in the verified PMBOK 8 (7 performance domains,
// 6 principles) and ECO 2026 (People 33 / Process 41 / Business Environment 26,
// with governance/compliance/change/risk moved into Business Environment).

export type AudioTopic = {
  id: string;
  title_en: string;
  title_ar: string;
  domain: string;
  icon: string;
};

export const AUDIO_TOPICS_BY_FRAMEWORK: Record<string, AudioTopic[]> = {
  pmbok7: [
    { id: '1', title_en: 'PMBOK 7 Overview — Principles & Domains', title_ar: 'نظرة عامة على PMBOK 7 — المبادئ والمجالات', domain: 'all', icon: '📘' },
    { id: '2', title_en: 'Stakeholder Engagement Strategies', title_ar: 'استراتيجيات تفاعل أصحاب المصلحة', domain: 'stakeholders', icon: '🤝' },
    { id: '3', title_en: 'Agile vs Predictive — When to Use What', title_ar: 'أجايل مقابل التنبؤي — متى تستخدم أي', domain: 'development-approach', icon: '🔄' },
    { id: '4', title_en: 'Earned Value Management Deep Dive', title_ar: 'غوص عميق في إدارة القيمة المكتسبة', domain: 'measurement', icon: '📊' },
    { id: '5', title_en: 'ECO People Domain — Task Walkthrough', title_ar: 'مجال الأشخاص ECO — شرح المهام', domain: 'people', icon: '👥' },
    { id: '6', title_en: 'Risk Management & Uncertainty', title_ar: 'إدارة المخاطر وعدم اليقين', domain: 'uncertainty', icon: '⚡' },
    { id: '7', title_en: 'Team Performance & Servant Leadership', title_ar: 'أداء الفريق والقيادة الخادمة', domain: 'team', icon: '👤' },
    { id: '8', title_en: 'Planning: Scope, Schedule & Budget', title_ar: 'التخطيط: النطاق والجدول الزمني والميزانية', domain: 'planning', icon: '📋' },
  ],
  pmbok8: [
    { id: '1', title_en: 'PMBOK 8 Overview — 6 Principles & 7 Performance Domains', title_ar: 'نظرة عامة على PMBOK 8 — 6 مبادئ و7 مجالات أداء', domain: 'all', icon: '📘' },
    { id: '2', title_en: 'Stakeholder Engagement & Alignment', title_ar: 'إشراك المعنيين ومواءمة التوقعات', domain: 'stakeholders', icon: '🤝' },
    { id: '3', title_en: 'Predictive, Agile & Hybrid — Tailoring the Approach', title_ar: 'التنبؤي والرشيق والهجين — تكييف المنهج', domain: 'development-approach', icon: '🔄' },
    { id: '4', title_en: 'Finance Fluency — EVM, NPV & Business Value', title_ar: 'الطلاقة المالية — القيمة المكتسبة وصافي القيمة الحالية وقيمة الأعمال', domain: 'finance', icon: '💰' },
    { id: '5', title_en: 'ECO 2026 People Domain — Leading & Empowering Teams', title_ar: 'مجال الأفراد ECO 2026 — قيادة الفرق وتمكينها', domain: 'people', icon: '👥' },
    { id: '6', title_en: 'Risk & Uncertainty in the Business Environment', title_ar: 'المخاطر وعدم اليقين في بيئة الأعمال', domain: 'risk', icon: '⚡' },
    { id: '7', title_en: 'Governance, Compliance & Integrated Change Control', title_ar: 'الحوكمة والامتثال والتحكم المتكامل في التغيير', domain: 'governance', icon: '⚖️' },
    { id: '8', title_en: 'AI-Augmented Delivery & Sustainability', title_ar: 'التسليم المعزّز بالذكاء الاصطناعي والاستدامة', domain: 'business-environment', icon: '🌱' },
  ],
  bridge: [
    { id: '1', title_en: 'What Changed — PMBOK 7→8 & ECO 2021→2026', title_ar: 'ما الذي تغيّر — PMBOK 7→8 و ECO 2021→2026', domain: 'all', icon: '🔀' },
    { id: '2', title_en: 'Performance Domains Restructured (8 → 7)', title_ar: 'إعادة هيكلة مجالات الأداء (8 → 7)', domain: 'all', icon: '📘' },
    { id: '3', title_en: 'Business Environment Rises: 8% → 26%', title_ar: 'صعود بيئة الأعمال: 8% → 26%', domain: 'business-environment', icon: '📈' },
    { id: '4', title_en: 'New Emphasis — Finance Fluency & Business Value', title_ar: 'تركيز جديد — الطلاقة المالية وقيمة الأعمال', domain: 'finance', icon: '💰' },
    { id: '5', title_en: 'New Emphasis — AI-Augmented Delivery', title_ar: 'تركيز جديد — التسليم المعزّز بالذكاء الاصطناعي', domain: 'process', icon: '🤖' },
    { id: '6', title_en: 'New Emphasis — Sustainability & ESG', title_ar: 'تركيز جديد — الاستدامة والحوكمة البيئية والاجتماعية', domain: 'business-environment', icon: '🌱' },
    { id: '7', title_en: 'ECO Domain Weights & Task Renumbering', title_ar: 'أوزان مجالات ECO وإعادة ترقيم المهام', domain: 'all', icon: '🔢' },
    { id: '8', title_en: 'Bridge Strategy — What to Re-study', title_ar: 'استراتيجية الجسر — ما الذي يجب إعادة دراسته', domain: 'all', icon: '🎯' },
  ],
};

const AUDIO_DOMAIN_LABELS: Record<string, { en: string; ar: string }> = {
  all: { en: 'all', ar: 'عام' },
  stakeholders: { en: 'stakeholders', ar: 'المعنيون' },
  'development-approach': { en: 'development approach', ar: 'منهج التطوير' },
  measurement: { en: 'measurement', ar: 'القياس' },
  people: { en: 'people', ar: 'الأشخاص' },
  uncertainty: { en: 'uncertainty', ar: 'عدم اليقين' },
  team: { en: 'team', ar: 'الفريق' },
  planning: { en: 'planning', ar: 'التخطيط' },
  finance: { en: 'finance', ar: 'المالية' },
  risk: { en: 'risk', ar: 'المخاطر' },
  governance: { en: 'governance', ar: 'الحوكمة' },
  process: { en: 'process', ar: 'العمليات' },
  'business-environment': { en: 'business environment', ar: 'بيئة الأعمال' },
};

export function getAudioDomainLabel(domain: string, isArabic: boolean) {
  const label = AUDIO_DOMAIN_LABELS[domain];
  if (!label) return domain;
  return isArabic ? label.ar : label.en;
}

export const FRAMEWORK_LABELS: Record<string, { en: string; ar: string }> = {
  pmbok7: { en: 'PMBOK 7 · ECO 2021', ar: 'PMBOK 7 · ECO 2021' },
  pmbok8: { en: 'PMBOK 8 · ECO 2026', ar: 'PMBOK 8 · ECO 2026' },
  bridge: { en: 'Bridge 7→8', ar: 'الجسر 7→8' },
};
