'use client';

import React, { useState } from 'react';
import { Card, Tabs, Button, Badge, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SAMPLE_QUESTIONS } from '@/lib/pmp-data';
import { useLanguage } from '@/lib/i18n/language-context';
import { createClient } from '@/lib/supabase/client';
import { normalizeExamPath } from '@/lib/pmp/exam-paths';
import { AUDIO_TOPICS_BY_FRAMEWORK, getAudioDomainLabel, type AudioTopic } from '@/lib/study-studio/audio-topics';
import type { StudyTab } from '@/types';

// Learner-facing label for the active exam pathway.
function frameworkLabel(framework: string): string {
  if (framework === 'pmbok8') return 'PMBOK 8 + ECO 2026';
  if (framework === 'bridge') return 'PMBOK 7→8 · ECO 2021→2026';
  return 'PMBOK 7 + ECO 2021';
}

// Resolves the learner's active exam pathway (same source of truth as Zane/dashboard).
function useActiveFramework(): string {
  const [framework, setFramework] = React.useState<string>('pmbok7');
  React.useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from('profiles')
          .select('active_framework')
          .eq('id', user.id)
          .single();
        setFramework(normalizeExamPath(profile?.active_framework));
      } catch {
        /* keep default */
      }
    })();
  }, []);
  return framework;
}

// ── Notes Tab ───────────────────────────────────────────────────────────────
function NotesTab() {
  const { t, isArabic } = useLanguage();
  const [note, setNote] = useState('');

  // Important: this is intentionally computed on every render.
  // Do not store language-dependent labels inside useState([...]),
  // because useState initializers do not re-run when the language changes.
  const savedNotes = [
    {
      id: '1',
      topic: isArabic ? 'استراتيجيات تفاعل أصحاب المصلحة' : 'Stakeholder Engagement',
      content: isArabic
        ? 'الاستراتيجيات الرئيسية: التحديد المبكر، تحليل القوة/الاهتمام، تطوير خطط التفاعل، والمراقبة المستمرة.'
        : 'Key strategies: identify early, analyze power/interest, develop engagement plans, monitor continuously.',
      tags: isArabic ? ['المعنيون', 'PMBOK7'] : ['stakeholders', 'pmbok7'],
      date: isArabic ? 'منذ ساعتين' : '2 hours ago',
    },
    {
      id: '2',
      topic: isArabic ? 'القيادة الخادمة' : 'Servant Leadership',
      content: isArabic
        ? 'التركيز على احتياجات الفريق، إزالة العوائق، والتوجيه بالتدريب بدلاً من الأوامر المباشرة.'
        : 'Focus on team needs, remove impediments, coaching over directing. Essential for agile environments.',
      tags: isArabic ? ['الفريق', 'القيادة'] : ['team', 'leadership'],
      date: isArabic ? 'منذ يوم' : '1 day ago',
    },
    {
      id: '3',
      topic: isArabic ? 'معادلات القيمة المكتسبة EVM' : 'EVM Formulas',
      content: 'CPI = EV/AC, SPI = EV/PV, EAC = BAC/CPI, ETC = EAC - AC, VAC = BAC - EAC, TCPI = (BAC-EV)/(BAC-AC)',
      tags: isArabic ? ['القياس', 'المعادلات'] : ['measurement', 'formulas'],
      date: isArabic ? 'منذ 3 أيام' : '3 days ago',
    },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Card padding="lg">
          <h3 className="font-bold mb-4">{t('studio.new_note')}</h3>
          <input
            type="text"
            placeholder={t('studio.topic_placeholder')}
            className="w-full px-4 py-2.5 rounded-lg border border-surface-200 text-sm mb-3 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('studio.note_placeholder')}
            className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm min-h-[200px] resize-y focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none"
          />
          <div className="flex items-center justify-between mt-4 gap-3">
            <input
              type="text"
              placeholder={t('studio.tags_placeholder')}
              className="px-3 py-2 rounded-lg border border-surface-200 text-xs w-60 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none"
            />
            <Button>{t('studio.save_note')}</Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h3 className="font-bold text-brand-900">{t('studio.saved_notes')}</h3>
        {savedNotes.map((n) => (
          <Card key={n.id} hover padding="sm" className="cursor-pointer">
            <h4 className="font-semibold text-sm">{n.topic}</h4>
            <p className="text-xs text-brand-900/50 mt-1 line-clamp-2">{n.content}</p>
            <div className="flex items-center gap-2 mt-3">
              {n.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
              <span className="text-[10px] text-brand-900/30 ml-auto">{n.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Audio Tab ────────────────────────────────────────────────────────────────

// Topic list + domain labels are shared with the admin media-mapping page.
// See lib/study-studio/audio-topics.ts (imported at the top of this file).


function AudioTab() {
  const { isArabic } = useLanguage();
  const framework = useActiveFramework();
  const language = isArabic ? 'ar' : 'en';
  const topics = AUDIO_TOPICS_BY_FRAMEWORK[framework] ?? AUDIO_TOPICS_BY_FRAMEWORK.pmbok7;
  const supabase = React.useMemo(() => createClient(), []);

  // Which topics have published media (for badges) — read straight from the
  // mapping table (RLS lets any signed-in learner read it). The playable URL
  // (signed, for private video) is fetched per-topic from /api/study-media.
  const [available, setAvailable] = React.useState<Record<string, 'audio' | 'video'>>({});
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [media, setMedia] = React.useState<
    { mediaType: 'audio' | 'video'; url: string; title: string | null; posterUrl: string | null } | null
  >(null);
  const [status, setStatus] = React.useState<'idle' | 'ready' | 'coming-soon'>('idle');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('topic_media')
        .select('topic_id, media_type')
        .eq('framework', framework)
        .eq('language', language);
      if (cancelled) return;
      const map: Record<string, 'audio' | 'video'> = {};
      (data as { topic_id: string; media_type: 'audio' | 'video' }[] | null)?.forEach((r) => {
        map[r.topic_id] = r.media_type;
      });
      setAvailable(map);
      setActiveId(null);
      setMedia(null);
      setStatus('idle');
      setError('');
    })();
    return () => {
      cancelled = true;
    };
  }, [framework, language, supabase]);

  async function openTopic(topic: AudioTopic) {
    setActiveId(topic.id);
    setMedia(null);
    setError('');
    setStatus('idle');
    setLoading(true);
    try {
      const res = await fetch(
        `/api/study-media?framework=${framework}&topicId=${topic.id}&language=${language}`
      );
      if (res.status === 403) {
        setError(isArabic ? 'يتطلب هذا المحتوى اشتراكًا مميزًا.' : 'This content requires a premium subscription.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!data?.found || !data?.url) {
        setStatus('coming-soon');
        setLoading(false);
        return;
      }
      setMedia({
        mediaType: data.mediaType,
        url: data.url,
        title: data.title ?? null,
        posterUrl: data.posterUrl ?? null,
      });
      setStatus('ready');
    } catch {
      setError(isArabic ? 'تعذّر تحميل الوسائط. حاول مرة أخرى.' : 'Could not load the media. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const activeTopic = topics.find((t) => t.id === activeId);
  const activeTopicTitle = activeTopic ? (isArabic ? activeTopic.title_ar : activeTopic.title_en) : '';

  return (
    <div className="space-y-4">
      {/* Player */}
      {activeId && !loading && status === 'ready' && media && (
        <Card padding="none">
          {media.mediaType === 'video' ? (
            <div className="overflow-hidden rounded-t-2xl bg-black">
              <video
                key={media.url}
                src={media.url}
                poster={media.posterUrl ?? undefined}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[70vh] bg-black"
              />
            </div>
          ) : (
            <div className="p-6 rounded-t-2xl" style={{ background: 'linear-gradient(135deg,#1AB0A2,#5B2D91)' }}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">🎧</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/70">
                    PMP<span className="font-bold">eco</span> · {frameworkLabel(framework)}
                  </p>
                  <p className="text-base font-bold truncate">{activeTopicTitle}</p>
                </div>
              </div>
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{activeTopicTitle}</p>
                <p className="text-xs text-gray-400">
                  {isArabic
                    ? `${media.mediaType === 'video' ? 'فيديو' : 'صوت'} — ${frameworkLabel(framework)}`
                    : `${media.mediaType === 'video' ? 'Video' : 'Audio'} lesson — ${frameworkLabel(framework)}`}
                </p>
              </div>
              <Badge variant="info">{getAudioDomainLabel(activeTopic?.domain || '', isArabic)}</Badge>
            </div>
            {media.mediaType === 'audio' && (
              <audio key={media.url} src={media.url} controls autoPlay className="w-full" />
            )}
          </div>
        </Card>
      )}

      {/* Loading */}
      {activeId && loading && (
        <Card padding="lg">
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-[#5B2D91] animate-spin" />
            <p className="text-sm text-gray-500">{isArabic ? 'جارٍ تحميل الوسائط…' : 'Loading media…'}</p>
          </div>
        </Card>
      )}

      {/* Coming soon */}
      {activeId && !loading && status === 'coming-soon' && (
        <Card padding="lg">
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🎬</div>
            <p className="text-sm font-semibold text-gray-900">{isArabic ? 'قريبًا' : 'Coming soon'}</p>
            <p className="text-xs text-gray-400 mt-1">
              {isArabic ? 'لم يتم نشر وسائط هذا الدرس بعد.' : 'Media for this lesson hasn’t been published yet.'}
            </p>
          </div>
        </Card>
      )}

      {error && !loading && (
        <Card padding="sm">
          <p className="text-sm text-red-600 text-center py-2">{error}</p>
        </Card>
      )}

      {/* Lesson list */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">{isArabic ? 'دروس الوسائط' : 'Media Lessons'}</h3>
          <Badge variant="info">{frameworkLabel(framework)}</Badge>
        </div>
        <p className="text-sm text-brand-900/50 mb-6">
          {isArabic
            ? 'انقر على أي درس لمشاهدة الفيديو أو الاستماع إلى الصوت.'
            : 'Click any lesson to watch the video or listen to the audio.'}
        </p>
        <div className="space-y-1">
          {topics.map((topic) => {
            const topicTitle = isArabic ? topic.title_ar : topic.title_en;
            const isActive = activeId === topic.id;
            const kind = available[topic.id];
            return (
              <button
                key={topic.id}
                onClick={() => openTopic(topic)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl transition-all',
                  isArabic ? 'text-right' : 'text-left',
                  isActive ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm',
                    isActive ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-500'
                  )}
                >
                  <span className="text-lg">{topic.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold truncate', isActive ? 'text-violet-700' : 'text-gray-900')}>
                    {topicTitle}
                  </p>
                  <p className="text-xs text-gray-400">
                    {kind === 'video'
                      ? isArabic
                        ? 'درس فيديو'
                        : 'Video lesson'
                      : kind === 'audio'
                        ? isArabic
                          ? 'درس صوتي'
                          : 'Audio lesson'
                        : isArabic
                          ? 'قريبًا'
                          : 'Coming soon'}
                  </p>
                </div>
                {kind ? (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                    style={{ background: kind === 'video' ? '#5B2D91' : '#1AB0A2' }}
                  >
                    {kind === 'video' ? (isArabic ? 'فيديو' : 'Video') : isArabic ? 'صوت' : 'Audio'}
                  </span>
                ) : (
                  <Badge variant="default">{getAudioDomainLabel(topic.domain, isArabic)}</Badge>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── Flashcards Tab ──────────────────────────────────────────────────────────
type Flashcard = { front: string; back: string };

// Framework-aware flashcards. pmbok8 + bridge grounded in verified PMBOK 8 (7 domains,
// 6 principles) and ECO 2026 (People 33 / Process 41 / BE 26) facts. CPI and conflict
// modes carry over unchanged across pathways.
function getFlashcards(framework: string, isArabic: boolean): Flashcard[] {
  const cpi: Flashcard = { front: isArabic ? 'عرّف CPI في إدارة القيمة المكتسبة' : 'Define CPI in Earned Value Management', back: isArabic ? 'مؤشر الأداء في الكلفة = EV / AC. CPI > 1.0 يعني أقل من الميزانية، CPI < 1.0 يعني أكثر من الميزانية.' : 'Cost Performance Index = EV / AC. CPI > 1.0 means under budget, CPI < 1.0 means over budget.' };
  const conflict: Flashcard = { front: isArabic ? 'اذكر 3 تقنيات لحل النزاعات' : 'Name 3 conflict resolution techniques', back: isArabic ? 'التعاون/حل المشاكل (الأفضل)، التسوية/المصالحة، الانسحاب/التجنب، التنعيم/الاستيعاب، الإجبار/التوجيه المباشر' : 'Collaborate/Problem Solve (best), Compromise/Reconcile, Withdraw/Avoid, Smooth/Accommodate, Force/Direct' };

  if (framework === 'pmbok8') {
    return [
      { front: isArabic ? 'ما مجالات الأداء السبعة في PMBOK 8؟' : 'What are the 7 Performance Domains in PMBOK 8?', back: isArabic ? 'الحوكمة، النطاق، الجدول الزمني، المالية، أصحاب المصلحة، الموارد، المخاطر' : 'Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk' },
      { front: isArabic ? 'ما أوزان مجالات امتحان ECO 2026؟' : 'What are the ECO 2026 exam domain weights?', back: isArabic ? 'الأفراد 33٪، العمليات 41٪، بيئة الأعمال 26٪' : 'People 33%, Process 41%, Business Environment 26%' },
      cpi,
      { front: isArabic ? 'اذكر مبادئ PMBOK 8 الستة' : 'Name the 6 PMBOK 8 principles', back: isArabic ? 'تبنّي نظرة شمولية؛ التركيز على القيمة؛ ترسيخ الجودة في العمليات والمخرجات؛ كن قائداً مسؤولاً؛ دمج الاستدامة في جميع مجالات المشروع؛ بناء ثقافة تمكينية' : 'Adopt a Holistic View; Focus on Value; Embed Quality Into Processes and Deliverables; Be an Accountable Leader; Integrate Sustainability Within All Project Areas; Build an Empowered Culture' },
      conflict,
    ];
  }
  if (framework === 'bridge') {
    return [
      { front: isArabic ? 'كان لدى PMBOK 7 ثمانية مجالات أداء — كم عددها في PMBOK 8؟' : 'PMBOK 7 had 8 performance domains — how many in PMBOK 8?', back: isArabic ? '7: الحوكمة، النطاق، الجدول الزمني، المالية، أصحاب المصلحة، الموارد، المخاطر. أُعيدت هيكلة الفريق والتخطيط وعمل المشروع والتسليم والقياس وعدم اليقين ونهج التطوير.' : '7: Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk. Team, Planning, Project Work, Delivery, Measurement, Uncertainty & Development Approach were restructured.' },
      { front: isArabic ? 'كيف تغيّر وزن بيئة الأعمال (2021 → 2026)؟' : 'How did the Business Environment weight change (2021 → 2026)?', back: isArabic ? '8٪ → 26٪. انتقلت الحوكمة والامتثال والتحكم في التغيير والعوائق والمخاطر إلى بيئة الأعمال.' : '8% → 26%. Governance, compliance, change control, impediments/issues and risk moved into Business Environment.' },
      { front: isArabic ? 'أوزان مجالات ECO 2026 مقابل 2021؟' : 'ECO 2026 domain weights vs ECO 2021?', back: isArabic ? '2026: الأفراد 33٪ / العمليات 41٪ / بيئة الأعمال 26٪. 2021: الأفراد 42٪ / العمليات 50٪ / بيئة الأعمال 8٪.' : '2026: People 33% / Process 41% / BE 26%. 2021 was People 42% / Process 50% / BE 8%.' },
      { front: isArabic ? 'ما التركيزات الجديدة التي أضافها ECO 2026؟' : 'What new emphases did ECO 2026 add?', back: isArabic ? 'الطلاقة المالية وقيمة الأعمال، والتسليم المعزّز بالذكاء الاصطناعي، والاستدامة والحوكمة البيئية والاجتماعية.' : 'Finance fluency & business value, AI-augmented delivery, and sustainability/ESG.' },
      { front: isArabic ? 'أي أساسيات تبقى دون تغيير من PMBOK 7 إلى 8؟' : 'Which fundamentals carry over unchanged from PMBOK 7 to 8?', back: isArabic ? 'صيغ القيمة المكتسبة (CPI/SPI/EAC)، وأنماط حل النزاعات، والقيادة الخادمة، ومراحل تطور الفريق (تاكمان).' : 'EVM formulas (CPI/SPI/EAC), conflict-resolution modes, servant leadership, and Tuckman team-development stages.' },
    ];
  }
  return [
    { front: isArabic ? 'ما هي المجالات الأداء الثمانية في PMBOK 7؟' : 'What are the 8 Performance Domains in PMBOK 7?', back: isArabic ? 'أصحاب المصلحة، الفريق، نهج التطوير ودورة الحياة، التخطيط، عمل المشروع، التسليم، القياس، عدم اليقين' : 'Stakeholders, Team, Development Approach & Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty' },
    { front: isArabic ? 'ما نسبة امتحان PMP التي تغطي مجال الأشخاص (ECO 2021)؟' : 'What percentage of the PMP exam covers the People domain (ECO 2021)?', back: isArabic ? '42٪ — 14 مهمة تغطي القيادة وإدارة الفريق وحل النزاعات والتعاون مع أصحاب المصلحة' : '42% — 14 tasks covering leadership, team management, conflict resolution, and stakeholder collaboration' },
    cpi,
    { front: isArabic ? 'ما هي القيادة الخادمة؟' : 'What is Servant Leadership?', back: isArabic ? 'فلسفة قيادية حيث يكون الهدف الأساسي للقائد هو خدمة الفريق. التركيز على إزالة العقبات والتدريب وتمكين أعضاء الفريق.' : 'A leadership philosophy where the leader\'s primary goal is to serve the team. Focus on removing impediments, coaching, and empowering team members.' },
    conflict,
  ];
}

function FlashcardsTab() {
  const { isArabic } = useLanguage();
  const framework = useActiveFramework();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = getFlashcards(framework, isArabic);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-brand-900/50">{isArabic ? `البطاقة ${currentIndex + 1} من ${cards.length}` : `Card ${currentIndex + 1} of ${cards.length}`}</span>
          <Progress value={currentIndex + 1} max={cards.length} className="w-40 mt-1" size="sm" />
        </div>
        <div className="flex gap-2">
          <Badge variant="success">{isArabic ? 'معروف: 12' : 'Know: 12'}</Badge>
          <Badge variant="danger">{isArabic ? 'مراجعة: 8' : 'Review: 8'}</Badge>
        </div>
      </div>
      <div onClick={() => setFlipped(!flipped)} className="relative cursor-pointer select-none" style={{ perspective: '1200px', minHeight: '320px' }}>
        <div className={cn('w-full min-h-[320px] rounded-2xl transition-all duration-500 flex items-center justify-center p-8 text-center',
          flipped ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-elevated' : 'bg-white border-2 border-surface-200 shadow-card'
        )} style={{ transformStyle: 'preserve-3d' }}>
          <div>
            <p className="text-xs font-semibold text-brand-900/30 mb-4 uppercase tracking-wider">{flipped ? (isArabic ? '✨ الإجابة' : '✨ Answer') : (isArabic ? 'السؤال' : 'Question')}</p>
            <p className={cn('text-lg font-semibold leading-relaxed', flipped ? 'text-white' : 'text-brand-900')}>{flipped ? cards[currentIndex].back : cards[currentIndex].front}</p>
            <p className="text-xs mt-6 opacity-50">{flipped ? (isArabic ? 'انقر لرؤية السؤال' : 'Click to see question') : (isArabic ? 'انقر للكشف عن الإجابة' : 'Click to reveal answer')}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button variant="danger" size="sm" onClick={() => { setFlipped(false); setCurrentIndex(Math.max(0, currentIndex - 1)); }}>{isArabic ? '← السابق' : '← Previous'}</Button>
        <Button variant="secondary" onClick={() => { setFlipped(false); setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); }}>{isArabic ? 'لا تزال تتعلم' : 'Still Learning'}</Button>
        <Button variant="primary" onClick={() => { setFlipped(false); setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); }}>{isArabic ? 'حصلت عليها! →' : 'Got It! →'}</Button>
      </div>
    </div>
  );
}

// ── Quiz Tab ────────────────────────────────────────────────────────────────
function QuizTab() {
  const { isArabic } = useLanguage();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const ARABIC_SAMPLE_QUESTIONS = [
    {
      source: 'ECO2021',
      difficulty: 'medium',
      stem: 'يلاحظ مدير المشروع وجود خلاف بين عضوين في الفريق حول النهج التقني. ما الذي ينبغي على مدير المشروع فعله أولًا؟',
      options: [
        { key: 'A', text: 'تصعيد المشكلة إلى راعي المشروع' },
        { key: 'B', text: 'تقييم مصدر الخلاف ومرحلته' },
        { key: 'C', text: 'إبعاد عضوي الفريق من المشروع' },
        { key: 'D', text: 'توثيق الخلاف في سجل المشكلات' },
      ],
      correct_key: 'B',
      explanation: 'ينبغي على مدير المشروع أولًا فهم مصدر الخلاف ومرحلته قبل اختيار أسلوب المعالجة المناسب. التصعيد أو الإبعاد أو التوثيق فقط لا يعالج السبب الجذري للخلاف.',
    },
    {
      source: 'PMBOK7',
      difficulty: 'easy',
      stem: 'ما الغرض الأساسي من تحديد أصحاب المصلحة في بداية المشروع؟',
      options: [
        { key: 'A', text: 'تحديد جميع الأشخاص أو الجهات التي قد تؤثر في المشروع أو تتأثر به' },
        { key: 'B', text: 'اختيار أعضاء فريق المشروع فقط' },
        { key: 'C', text: 'حصر الجهات التي تمول المشروع فقط' },
        { key: 'D', text: 'إلغاء الحاجة إلى خطة التواصل' },
      ],
      correct_key: 'A',
      explanation: 'تحديد أصحاب المصلحة يهدف إلى معرفة كل من يمكن أن يؤثر في المشروع أو يتأثر بنتائجه، حتى تتم إدارة توقعاتهم وتواصلهم بفعالية.',
    },
    {
      source: 'PMBOK7',
      difficulty: 'medium',
      stem: 'إذا كان مؤشر أداء التكلفة CPI أقل من 1.0، فماذا يعني ذلك غالبًا؟',
      options: [
        { key: 'A', text: 'المشروع أقل من الميزانية' },
        { key: 'B', text: 'المشروع أعلى من الميزانية' },
        { key: 'C', text: 'المشروع متقدم على الجدول الزمني' },
        { key: 'D', text: 'لا توجد علاقة بين CPI والتكلفة' },
      ],
      correct_key: 'B',
      explanation: 'عندما يكون CPI أقل من 1.0 فهذا يعني أن قيمة العمل المنجز أقل من التكلفة الفعلية، أي أن المشروع يتجاوز الميزانية.',
    },
    {
      source: 'ECO2021',
      difficulty: 'medium',
      stem: 'في بيئة أجايل، ما السلوك الأقرب إلى القيادة الخادمة؟',
      options: [
        { key: 'A', text: 'إعطاء أوامر تفصيلية للفريق يوميًا' },
        { key: 'B', text: 'إزالة العوائق وتمكين الفريق من اتخاذ القرار' },
        { key: 'C', text: 'التركيز فقط على التقارير الرسمية' },
        { key: 'D', text: 'تجنب التواصل مع الفريق' },
      ],
      correct_key: 'B',
      explanation: 'القيادة الخادمة تركز على دعم الفريق، إزالة العوائق، التمكين، والتوجيه بدل التحكم التفصيلي.',
    },
    {
      source: 'PMBOK7',
      difficulty: 'hard',
      stem: 'عند وجود حالة عدم يقين عالية في المشروع، ما التصرف الأفضل لمدير المشروع؟',
      options: [
        { key: 'A', text: 'تجاهل عدم اليقين حتى تظهر المشكلة' },
        { key: 'B', text: 'استخدام نهج تكيفي ومراجعة المخاطر بشكل مستمر' },
        { key: 'C', text: 'إغلاق المشروع فورًا' },
        { key: 'D', text: 'منع أصحاب المصلحة من تقديم ملاحظاتهم' },
      ],
      correct_key: 'B',
      explanation: 'عند ارتفاع عدم اليقين، يكون النهج التكيفي وإدارة المخاطر المستمرة أكثر ملاءمة من تجاهل المخاطر أو التعامل معها برد فعل متأخر.',
    },
  ];

  const questions = isArabic ? ARABIC_SAMPLE_QUESTIONS : SAMPLE_QUESTIONS;
  const q = questions[currentQ];

  const difficultyLabel = isArabic
    ? q.difficulty === 'easy'
      ? 'سهل'
      : q.difficulty === 'hard'
        ? 'صعب'
        : 'متوسط'
    : q.difficulty;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (selected === q.correct_key) setScore(score + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    setCurrentQ(Math.min(questions.length - 1, currentQ + 1));
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="info">
          {isArabic ? `السؤال ${currentQ + 1} من ${questions.length}` : `Question ${currentQ + 1} of ${questions.length}`}
        </Badge>
        <Badge variant={score > 0 ? 'success' : 'default'}>
          {isArabic ? `النتيجة: ${score}/${currentQ + (submitted ? 1 : 0)}` : `Score: ${score}/${currentQ + (submitted ? 1 : 0)}`}
        </Badge>
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default">{q.source.toUpperCase()}</Badge>
          <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}>
            {difficultyLabel}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-brand-900 mb-6 leading-relaxed text-center">
          {q.stem}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrect = submitted && opt.key === q.correct_key;
            const isWrong = submitted && isSelected && opt.key !== q.correct_key;

            return (
              <button
                key={opt.key}
                onClick={() => !submitted && setSelected(opt.key)}
                disabled={submitted}
                className={cn(
                  'quiz-option w-full flex items-center gap-3',
                  isArabic ? 'text-right' : 'text-left',
                  !submitted && isSelected && 'quiz-option-selected',
                  isCorrect && 'quiz-option-correct',
                  isWrong && 'quiz-option-incorrect'
                )}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                    isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isWrong
                        ? 'bg-red-400 text-white'
                        : isSelected
                          ? 'bg-brand-500 text-white'
                          : 'bg-surface-100 text-brand-900/50'
                  )}
                >
                  {opt.key}
                </span>
                <span className="text-sm flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div
            className={cn(
              'mt-6 p-4 rounded-xl',
              selected === q.correct_key
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
            )}
          >
            <p className="text-sm font-semibold mb-1">
              {selected === q.correct_key
                ? isArabic
                  ? '✅ صحيح!'
                  : '✅ Correct!'
                : isArabic
                  ? `❌ غير صحيح — الإجابة الصحيحة: ${q.correct_key}`
                  : `❌ Incorrect — Correct answer: ${q.correct_key}`}
            </p>
            <p className="text-sm text-brand-900/70 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        <div className="flex justify-end mt-6 gap-3">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!selected}>
              {isArabic ? 'إرسال الإجابة' : 'Submit Answer'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={currentQ >= questions.length - 1}>
              {isArabic ? 'السؤال التالي ←' : 'Next Question →'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}


// ── Study Studio Page ───────────────────────────────────────────────────────
export default function StudyStudioPage() {
  const { t, isArabic } = useLanguage();
  const [activeTab, setActiveTab] = useState<StudyTab>('notes');

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">{t('studio.title')}</h1>
        <p className="text-sm text-brand-900/50 mt-1">{t('studio.subtitle')}</p>
      </div>

      <Tabs
        tabs={[
          { id: 'notes', label: t('studio.notes'), icon: <span>📝</span> },
          { id: 'audio', label: t('studio.audio'), icon: <span>🎬</span> },
          { id: 'flashcards', label: t('studio.flashcards'), icon: <span>🃏</span> },
          { id: 'quiz', label: t('studio.quiz'), icon: <span>❓</span> },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as StudyTab)}
      />

      <div className="animate-fade-in">
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'audio' && <AudioTab />}
        {activeTab === 'flashcards' && <FlashcardsTab />}
        {activeTab === 'quiz' && <QuizTab />}
      </div>
    </div>
  );
}
