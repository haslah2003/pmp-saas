'use client';

import { useState, useRef, useCallback, useEffect, type Dispatch, type SetStateAction, type DragEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/language-context';
import { dt, rtlDir, rtlClass } from '@/lib/i18n/dashboard-content';
import { EXAM_PATH_ORDER, EXAM_PATHS, getExamPathCopy, normalizeExamPath, type ExamPathId } from '@/lib/pmp/exam-paths';

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = 'single_response' | 'multiple_response' | 'pull_down' | 'matching' | 'ordering';

type MultipleResponseAnswerData = {
  select_count?: number;
  options?: Record<string, string>;
  correct?: string[];
};

type PullDownBlank = {
  id: string;
  prompt_before?: string;
  prompt_after?: string;
  options?: string[];
  correct?: string;
};

type PullDownAnswerData = {
  blanks?: PullDownBlank[];
};

type MatchingEntry = { id: string; text: string };
type MatchingCategory = { id: string; label: string };
type MatchingAnswerData = {
  items?: MatchingEntry[];
  categories?: MatchingCategory[];
  correct?: Record<string, string>; // itemId -> categoryId
};

type OrderingAnswerData = {
  items?: MatchingEntry[];
  correct_order?: string[]; // ordered item ids
};

type StructuredAnswerData =
  | MultipleResponseAnswerData
  | PullDownAnswerData
  | MatchingAnswerData
  | OrderingAnswerData
  | null;

interface Question {
  id: string;
  framework?: string;
  domain: string;
  subdomain: string;
  difficulty: string;
  question_text: string;
  question_text_ar?: string;
  option_a: string;
  option_a_ar?: string;
  option_b: string;
  option_b_ar?: string;
  option_c: string;
  option_c_ar?: string;
  option_d: string;
  option_d_ar?: string;
  correct_answer: string;
  question_type?: QuestionType;
  answer_data?: StructuredAnswerData;
  answer_data_ar?: StructuredAnswerData;
  explanation: string;
  explanation_ar?: string;
  rita_tip: string;
  rita_tip_ar?: string;
  pmbok_reference: string;
  eco_reference: string;
}

interface QuestionBankStatus {
  requestedFramework: ExamPathId;
  nativeFrameworksExpected: string[];
  nativeQuestionCount: number;
  fallbackFramework: string;
  fallbackQuestionCount: number;
  fallbackUsed: boolean;
  actualQuestionFrameworks: string[];
  message: string | null;
}

interface QuestionResult {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  ritaTip: string;
  domain: string;
  difficulty: string;
}

interface WrapUp {
  score_message: string;
  key_learnings: { concept: string; insight: string; source: string }[];
  rita_technique: string;
  mindmap_center: string;
  mindmap_branches: {
    label: string;
    color: string;
    children: { label: string; explanation: string }[];
  }[];
  next_focus: string;
}

interface StrategicReport {
  report_title: string;
  route_label: string;
  cycle_label: string;
  executive_summary: string;
  readiness_score: number;
  readiness_label: string;
  overall_score: {
    correct: number;
    total: number;
    pct: number;
  };
  domain_proficiency: {
    domain: string;
    correct: number;
    total: number;
    pct: number;
    status: string;
    insight: string;
  }[];
  growth_velocity: {
    value: string;
    insight: string;
  };
  mindset_gap: {
    label: string;
    risk_level: string;
    insight: string;
  };
  tailoring_decisiveness: {
    score: number | null;
    evidence_level: string;
    insight: string;
  };
  badges: {
    name: string;
    description: string;
    icon: string;
  }[];
  route_focus: {
    label: string;
    items: string[];
  };
  evidence: {
    question: string;
    selected: string;
    correct: string;
    domain: string;
    lesson: string;
  }[];
  next_actions: string[];
}

interface GuruReport {
  greeting: string;
  overall_assessment: string;
  strengths: { area: string; message: string }[];
  growth_areas: { area: string; priority: string; guidance: string; domain_link: string }[];
  wisdom_quote: string;
  next_session_focus: string;
  confidence_message: string;
}

interface Badge {
  id: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  score: number;
  earned_at: string;
}

interface Video {
  id: string;
  title: string;
  youtube_id: string;
  youtube_url: string;
  domain: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTIES = [
  { id: 'entry', label: 'Entry', emoji: '🟢', desc: 'Easy — Build your foundation' },
  { id: 'paced', label: 'Paced', emoji: '🟡', desc: 'Moderate — Apply your knowledge' },
  { id: 'difficult', label: 'Difficult', emoji: '🟠', desc: 'Real exam-style questions' },
  { id: 'challenging', label: 'Challenging', emoji: '🔴', desc: 'Professional level mastery' },
];

const DOMAINS = [
  { id: 'all', label: 'All Domains' },
  { id: 'people', label: 'People (42%)' },
  { id: 'process', label: 'Process (50%)' },
  { id: 'business-environment', label: 'Business Environment (8%)' },
];

const ANSWER_LABELS_EN: Record<string, string> = {
  a: 'A',
  b: 'B',
  c: 'C',
  d: 'D',
};

const ANSWER_LABELS_AR: Record<string, string> = {
  a: 'أ',
  b: 'ب',
  c: 'ج',
  d: 'د',
};

function answerLabel(key: string, isArabic: boolean) {
  return isArabic ? ANSWER_LABELS_AR[key] ?? key : ANSWER_LABELS_EN[key] ?? key;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatQuestionDomain(domain: string, isArabic: boolean) {
  const labels: Record<string, { en: string; ar: string }> = {
    people: { en: 'People', ar: 'الأفراد' },
    process: { en: 'Process', ar: 'العمليات' },
    'business-environment': { en: 'Business Environment', ar: 'بيئة الأعمال' },
  };

  const label = labels[domain];
  if (label) return isArabic ? label.ar : label.en;

  return domain.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function getFieldByLanguage(
  isArabic: boolean,
  englishValue: string,
  arabicValue?: string
) {
  if (isArabic && arabicValue && arabicValue.trim().length > 0) {
    return arabicValue;
  }

  return englishValue;
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'mindmap';
}

function wrapSvgText(
  value: string,
  maxCharsPerLine: number,
  maxLines: number,
  isArabic = false
) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];

  if (words.length === 0) return [''];

  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    // Important:
    // Do NOT split Arabic words character-by-character.
    // Keep the word whole on its own line.
    current = word;

    if (lines.length >= maxLines - 1) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  const consumed = lines.join(' ').trim();
  const original = words.join(' ').trim();

  if (original.length > consumed.length && lines.length > 0) {
    const lastIndex = lines.length - 1;
    const last = lines[lastIndex].replace(/…$/, '');
    lines[lastIndex] = `${last}…`;
  }

  // SVG multi-line Arabic text often appears visually reversed top-to-bottom.
  // Reverse the line stack for Arabic only.
  return isArabic ? [...lines].reverse() : lines;
}

// ─── Tree Mind Map (NotebookLM Style) ─────────────────────────────────────────

function TreeMindMap({
  center,
  branches,
  isArabic,
}: {
  center: string;
  branches: WrapUp['mindmap_branches'];
  isArabic: boolean;
}) {
  const [expandedBranches, setExpandedBranches] = useState<Set<number>>(new Set());
  const [activeLeaf, setActiveLeaf] = useState<{
    label: string;
    explanation: string;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const branchRefs = useRef<(HTMLButtonElement | null)[]>([]);
const leafRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleResize = () => forceUpdate({});
    window.addEventListener('resize', handleResize);
    const id = setTimeout(() => forceUpdate({}), 50);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(id);
    };
  }, [expandedBranches]);

  const toggleBranch = (index: number) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setTimeout(() => forceUpdate({}), 550);
  };

  const downloadPDF = async () => {
    const container = containerRef.current;
    if (!container || isExporting) return;
    setIsExporting(true);
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas').then((m) => m.default),
      ]);
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 36;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const imgRatio = canvas.width / canvas.height;
      let imgWidth = availableWidth;
      let imgHeight = imgWidth / imgRatio;
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight;
        imgWidth = imgHeight * imgRatio;
      }
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${sanitizeFileName(center)}.pdf`);
    } catch (error) {
      console.error('Mind map PDF export failed:', error);
      alert(isArabic ? 'تعذر تصدير الخريطة الذهنية بصيغة PDF.' : 'Could not export the mind map as PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const getBezierPath = (fromEl: HTMLElement, toEl: HTMLElement, container: HTMLElement) => {
    const containerRect = container.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    
    // Auto-detect connection sides based on actual element positions
    const fromCenterX = fromRect.left + fromRect.width / 2;
    const toCenterX = toRect.left + toRect.width / 2;
    const fromIsLeft = fromCenterX < toCenterX;
    
    const fromX = (fromIsLeft ? fromRect.right : fromRect.left) - containerRect.left;
    const toX = (fromIsLeft ? toRect.left : toRect.right) - containerRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
    const toY = toRect.top + toRect.height / 2 - containerRect.top;
    const midX = (fromX + toX) / 2;
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  };

  const connectors: { path: string; color: string; opacity: number }[] = [];
  if (containerRef.current && rootRef.current) {
    branchRefs.current.forEach((branchEl, branchIndex) => {
      if (branchEl && rootRef.current && containerRef.current) {
        connectors.push({
          path: getBezierPath(rootRef.current, branchEl, containerRef.current),
          color: '#a78bfa',
          opacity: 0.5,
        });
      }
      if (expandedBranches.has(branchIndex) && branchEl && containerRef.current) {
        const branch = branches[branchIndex];
        branch.children.forEach((child) => {
          const key = `${branchIndex}-${child.label}`;
          const leafEl = leafRefs.current.get(key);
          if (leafEl && containerRef.current) {
            connectors.push({
              path: getBezierPath(branchEl, leafEl, containerRef.current),
              color: '#34d399',
              opacity: 0.5,
            });
          }
        });
      }
    });
  }

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs text-gray-400 mb-3 text-center">
        {isArabic
          ? '🌀 اضغط على الفرع للتوسيع · اضغط على ورقة للتفاصيل'
          : '🌀 Click branch to expand · Click leaf for details'}
      </p>

      <div
        ref={containerRef}
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative w-full bg-gradient-to-br from-slate-50 to-white rounded-xl border border-gray-200 p-8 overflow-x-auto"
        style={{ minHeight: '450px' }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {connectors.map((c, i) => (
            <path
              key={i}
              d={c.path}
              stroke={c.color}
              strokeWidth="2"
              strokeOpacity={c.opacity}
              fill="none"
            />
          ))}
        </svg>

        <div className="relative flex items-center gap-16 min-w-fit">
          <div ref={rootRef} className="flex-shrink-0 self-center z-10">
            <div
              className="px-5 py-3 rounded-xl shadow-md text-white font-bold text-sm max-w-[220px] text-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
            >
              {center}
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-shrink-0">
            {branches.map((branch, branchIndex) => {
              const isExpanded = expandedBranches.has(branchIndex);
              const hasChildren = branch.children && branch.children.length > 0;

              return (
                <div
                  key={branchIndex}
                  className="flex items-center gap-12"
                >
                  <button
                    ref={(el) => {
                      branchRefs.current[branchIndex] = el;
                    }}
                    onClick={() => toggleBranch(branchIndex)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border bg-violet-50 hover:bg-violet-100 hover:shadow-sm transition-all text-sm font-semibold whitespace-nowrap text-violet-700 border-violet-200 z-10"
                  >
                    <span>{branch.label}</span>
                    {hasChildren && (
                      <span className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center bg-violet-600 text-white font-bold">
                        {isExpanded ? '−' : '+'}
                      </span>
                    )}
                  </button>

                  {hasChildren && (
                    <div
                      className="overflow-hidden transition-all duration-500 ease-out"
                      style={{
                        maxWidth: isExpanded ? '600px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        {branch.children.map((child, childIndex) => {
                          const isActive = activeLeaf?.label === child.label;
                          const key = `${branchIndex}-${child.label}`;
                          return (
                            <button
                              key={childIndex}
                              ref={(el) => {
                                leafRefs.current.set(key, el);
                              }}
                              onClick={() =>
                                setActiveLeaf(
                                  isActive
                                    ? null
                                    : { label: child.label, explanation: child.explanation }
                                )
                              }
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap border z-10 ${
                                isArabic ? 'text-right' : 'text-left'
                              } ${
                                isActive
                                  ? 'bg-emerald-600 text-white border-emerald-700'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {activeLeaf && (
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`mt-3 rounded-xl p-4 w-full max-w-2xl border-2 bg-amber-50 border-amber-200 ${
            isArabic ? 'text-right' : 'text-left'
          }`}
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <p className="font-semibold text-sm text-amber-800">📌 {activeLeaf.label}</p>
            <button
              onClick={() => setActiveLeaf(null)}
              className="text-amber-400 hover:text-amber-600 text-sm flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <p className="text-amber-900 text-sm leading-relaxed">{activeLeaf.explanation}</p>
        </div>
      )}

      <button
        onClick={downloadPDF}
        disabled={isExporting}
        className="mt-4 text-xs text-gray-500 hover:text-violet-600 border border-gray-200 hover:border-violet-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
      >
        {isExporting
          ? isArabic
            ? 'جارٍ تجهيز PDF…'
            : 'Preparing PDF…'
          : isArabic
            ? '⬇️ تحميل الخريطة الذهنية PDF'
            : '⬇️ Download Mind Map PDF'}
      </button>
    </div>
  );
}

// ─── Guru Panel ───────────────────────────────────────────────────────────────

function GuruPanel({
  report,
  onClose,
  onLinkClick,
  isArabic,
}: {
  report: GuruReport;
  onClose: () => void;
  onLinkClick: (domain: string) => void;
  isArabic: boolean;
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const text = `${report.greeting}\n\n${report.overall_assessment}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'guru-report.txt';
    a.click();

    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧙‍♂️</span>
            <div>
              <p className="text-white font-bold text-sm">Master Chen Wei</p>
              <p className="text-amber-100 text-xs">
                {isArabic ? 'مرشدك الشخصي لاختبار PMP' : 'Your Personal PMP Guru'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-all"
            >
              {saved ? (isArabic ? '✓ تم الحفظ' : '✓ Saved') : isArabic ? '⬇ حفظ' : '⬇ Save'}
            </button>

            <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-amber-900 text-sm leading-relaxed italic">
            &ldquo;{report.greeting}&rdquo;
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {isArabic ? 'التقييم العام' : 'Overall Assessment'}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">{report.overall_assessment}</p>
        </div>

        {report.strengths?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
              {isArabic ? '✅ نقاط قوتك' : '✅ Your Strengths'}
            </p>
            <div className="space-y-2">
              {report.strengths.map((strength, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <p className="text-green-800 font-semibold text-xs">{strength.area}</p>
                  <p className="text-green-700 text-xs mt-0.5">{strength.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.growth_areas?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
              {isArabic ? '🎯 مجالات التركيز' : '🎯 Focus Areas'}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              {isArabic
                ? 'اضغط على أي مجال لفتح تدريب موجّه في AiTuTorZ'
                : 'Click any area to load targeted practice in AiTuTorZ'}
            </p>

            <div className="space-y-2">
              {report.growth_areas.map((area, index) => (
                <button
                  key={index}
                  onClick={() => onLinkClick(area.domain_link)}
                  className="w-full text-left bg-red-50 border border-red-200 hover:border-red-400 hover:bg-red-100 rounded-lg p-2.5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-red-800 font-semibold text-xs">{area.area}</p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        area.priority === 'high'
                          ? 'bg-red-200 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {area.priority}
                    </span>
                  </div>

                  <p className="text-red-700 text-xs mt-0.5">{area.guidance}</p>
                  <p className="text-violet-600 text-xs mt-1 group-hover:underline">
                    {isArabic ? '← فتح في AiTuTorZ' : '→ Open in AiTuTorZ'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-violet-600 mb-1">
            {isArabic ? '💡 حكمة المرشد' : "💡 Master's Wisdom"}
          </p>
          <p className="text-violet-800 text-sm italic leading-relaxed">
            &ldquo;{report.wisdom_quote}&rdquo;
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {isArabic ? 'الجلسة التالية' : 'Next Session'}
          </p>
          <p className="text-gray-700 text-sm">{report.next_session_focus}</p>
        </div>

        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-3">
          <p className="text-violet-800 text-sm leading-relaxed">{report.confidence_message}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Practice Component ──────────────────────────────────────────────────


function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

const STRUCTURED_TYPES: QuestionType[] = ['multiple_response', 'pull_down', 'matching', 'ordering'];

function getQuestionType(question: Question): QuestionType {
  return STRUCTURED_TYPES.includes(question.question_type as QuestionType)
    ? (question.question_type as QuestionType)
    : 'single_response';
}

function getStructuredAnswerData(question: Question, isArabic: boolean): Record<string, unknown> {
  const arData = question.answer_data_ar;
  const enData = question.answer_data;

  if (isArabic && isPlainRecord(arData)) return arData;
  if (isPlainRecord(enData)) return enData;

  return {};
}

function getMultipleResponseData(question: Question, isArabic: boolean) {
  const data = getStructuredAnswerData(question, isArabic);
  const rawOptions = isPlainRecord(data.options) ? data.options : {};
  const options: Record<string, string> = {};

  Object.entries(rawOptions).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      options[key] = value;
    }
  });

  const rawSelectCount = Number(data.select_count ?? 2);
  const optionCount = Object.keys(options).length;
  const selectCount = Number.isFinite(rawSelectCount)
    ? Math.min(Math.max(rawSelectCount, 1), Math.max(optionCount, 1))
    : 2;

  const correct = Array.isArray(data.correct)
    ? data.correct.filter((key): key is string => typeof key === 'string' && key in options)
    : [];

  return { selectCount, options, correct };
}

function getPullDownData(question: Question, isArabic: boolean) {
  const data = getStructuredAnswerData(question, isArabic);
  const blanks = Array.isArray(data.blanks)
    ? data.blanks
        .map((item, index) => {
          const blank = isPlainRecord(item) ? item : {};
          const options = Array.isArray(blank.options)
            ? blank.options.filter((option): option is string => typeof option === 'string' && option.trim().length > 0)
            : [];

          return {
            id: typeof blank.id === 'string' && blank.id.trim().length > 0 ? blank.id : `b${index + 1}`,
            prompt_before: typeof blank.prompt_before === 'string' ? blank.prompt_before : '',
            prompt_after: typeof blank.prompt_after === 'string' ? blank.prompt_after : '',
            options,
            correct: typeof blank.correct === 'string' ? blank.correct : '',
          };
        })
        .filter((blank) => blank.options.length > 0)
    : [];

  return { blanks };
}

function sameAnswerSet(selected: string[], correct: string[]) {
  if (selected.length !== correct.length) return false;
  const selectedSet = new Set(selected);
  return correct.every((key) => selectedSet.has(key));
}

function formatMultipleAnswerSummary(keys: string[], options: Record<string, string>, isArabic: boolean) {
  return keys
    .map((key) => `${answerLabel(key, isArabic)}. ${options[key] ?? key}`)
    .join(' | ');
}

function formatPullDownSummary(blanks: ReturnType<typeof getPullDownData>['blanks'], answers: Record<string, string>) {
  return blanks
    .map((blank) => `${blank.prompt_before} [${answers[blank.id] || '—'}] ${blank.prompt_after}`.trim())
    .join(' | ');
}

function formatPullDownCorrectSummary(blanks: ReturnType<typeof getPullDownData>['blanks']) {
  return blanks
    .map((blank) => `${blank.prompt_before} [${blank.correct || '—'}] ${blank.prompt_after}`.trim())
    .join(' | ');
}

function getMatchingData(question: Question, isArabic: boolean) {
  const data = getStructuredAnswerData(question, isArabic);
  const items: MatchingEntry[] = Array.isArray(data.items)
    ? data.items
        .map((it, i) => (isPlainRecord(it) ? { id: typeof it.id === 'string' && it.id ? it.id : `m${i + 1}`, text: typeof it.text === 'string' ? it.text : '' } : null))
        .filter((it): it is MatchingEntry => !!it && it.text.trim().length > 0)
    : [];
  const categories: MatchingCategory[] = Array.isArray(data.categories)
    ? data.categories
        .map((c, i) => (isPlainRecord(c) ? { id: typeof c.id === 'string' && c.id ? c.id : `c${i + 1}`, label: typeof c.label === 'string' ? c.label : '' } : null))
        .filter((c): c is MatchingCategory => !!c && c.label.trim().length > 0)
    : [];
  const correct: Record<string, string> = isPlainRecord(data.correct)
    ? (Object.fromEntries(Object.entries(data.correct).filter(([, v]) => typeof v === 'string')) as Record<string, string>)
    : {};
  return { items, categories, correct };
}

function getOrderingData(question: Question, isArabic: boolean) {
  const data = getStructuredAnswerData(question, isArabic);
  const items: MatchingEntry[] = Array.isArray(data.items)
    ? data.items
        .map((it, i) => (isPlainRecord(it) ? { id: typeof it.id === 'string' && it.id ? it.id : `o${i + 1}`, text: typeof it.text === 'string' ? it.text : '' } : null))
        .filter((it): it is MatchingEntry => !!it && it.text.trim().length > 0)
    : [];
  const ids = new Set(items.map((i) => i.id));
  const correctOrder: string[] = Array.isArray(data.correct_order)
    ? data.correct_order.filter((id): id is string => typeof id === 'string' && ids.has(id))
    : [];
  return { items, correctOrder };
}

function shuffleIds(ids: string[]): string[] {
  const a = [...ids];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Avoid landing on the identical starting order for a 1-move feel.
  if (a.length > 1 && a.every((id, i) => id === ids[i])) return shuffleIds(ids);
  return a;
}

function formatMatchingSummary(items: MatchingEntry[], categories: MatchingCategory[], assign: Record<string, string>) {
  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label || '—';
  return items.map((it) => `${it.text} → ${catLabel(assign[it.id] || '')}`).join(' | ');
}

function formatOrderingSummary(order: string[], items: MatchingEntry[]) {
  const txt = (id: string) => items.find((i) => i.id === id)?.text || '—';
  return order.map((id, i) => `${i + 1}. ${txt(id)}`).join(' | ');
}

function MatchingQuestion({
  data,
  assignments,
  setAssignments,
  submitted,
  isArabic,
}: {
  data: ReturnType<typeof getMatchingData>;
  assignments: Record<string, string>;
  setAssignments: Dispatch<SetStateAction<Record<string, string>>>;
  submitted: boolean;
  isArabic: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  const assign = (itemId: string, catId: string) => {
    if (submitted) return;
    setAssignments((prev) => ({ ...prev, [itemId]: catId }));
    setPicked(null);
  };
  const unassign = (itemId: string) => {
    if (submitted) return;
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setPicked(null);
  };

  const unassigned = data.items.filter((it) => !assignments[it.id]);
  const itemsIn = (catId: string) => data.items.filter((it) => assignments[it.id] === catId);
  const onDropTo = (catId: string) => (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) assign(id, catId);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">
        {isArabic
          ? 'اسحب كل عنصر — أو انقره ثم انقر الفئة — لوضعه في الفئة الصحيحة.'
          : 'Drag each item — or tap it, then tap a category — into the correct category.'}
      </div>

      {!submitted && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            if (id) unassign(id);
          }}
          className="flex flex-wrap gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-3 min-h-[52px]"
        >
          {unassigned.length === 0 ? (
            <span className="text-xs text-gray-400">{isArabic ? 'تم توزيع كل العناصر' : 'All items placed'}</span>
          ) : (
            unassigned.map((it) => (
              <button
                key={it.id}
                type="button"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', it.id)}
                onClick={() => setPicked(picked === it.id ? null : it.id)}
                className={`rounded-lg border-2 px-3 py-2 text-sm transition-all cursor-grab active:cursor-grabbing ${
                  picked === it.id ? 'border-violet-500 bg-violet-100 text-violet-800' : 'border-gray-200 bg-white text-gray-800 hover:border-violet-300'
                }`}
              >
                {it.text}
              </button>
            ))
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {data.categories.map((cat) => (
          <div
            key={cat.id}
            onDragOver={(e) => !submitted && e.preventDefault()}
            onDrop={onDropTo(cat.id)}
            onClick={() => picked && assign(picked, cat.id)}
            className={`rounded-xl border-2 p-3 transition-all ${
              picked && !submitted ? 'border-violet-400 bg-violet-50/60 cursor-pointer' : 'border-gray-200 bg-white'
            }`}
          >
            <p className="mb-2 text-sm font-bold text-gray-800">{cat.label}</p>
            <div className="flex flex-wrap gap-2 min-h-[36px]">
              {itemsIn(cat.id).map((it) => {
                const correct = data.correct[it.id] === cat.id;
                const style = submitted
                  ? correct
                    ? 'border-green-400 bg-green-50 text-green-800'
                    : 'border-red-400 bg-red-50 text-red-800'
                  : 'border-violet-200 bg-violet-50 text-violet-800';
                return (
                  <button
                    key={it.id}
                    type="button"
                    draggable={!submitted}
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', it.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      unassign(it.id);
                    }}
                    disabled={submitted}
                    className={`rounded-lg border-2 px-2.5 py-1.5 text-xs transition-all ${style} ${!submitted ? 'cursor-grab' : ''}`}
                  >
                    {submitted && (correct ? '✓ ' : '✗ ')}
                    {it.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {submitted && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-700">{isArabic ? 'التوزيع الصحيح:' : 'Correct placement:'}</p>
          <ul className="mt-1 space-y-0.5">
            {data.items.map((it) => (
              <li key={it.id}>
                {it.text} → <span className="font-medium">{data.categories.find((c) => c.id === data.correct[it.id])?.label || '—'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function OrderingQuestion({
  data,
  order,
  setOrder,
  submitted,
  isArabic,
}: {
  data: ReturnType<typeof getOrderingData>;
  order: string[];
  setOrder: Dispatch<SetStateAction<string[]>>;
  submitted: boolean;
  isArabic: boolean;
}) {
  const text = (id: string) => data.items.find((i) => i.id === id)?.text || '—';
  const dragFrom = useRef<number | null>(null);
  const move = (from: number, to: number) => {
    if (submitted || to < 0 || to >= order.length) return;
    setOrder((prev) => {
      const a = [...prev];
      const [x] = a.splice(from, 1);
      a.splice(to, 0, x);
      return a;
    });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">
        {isArabic ? 'رتّب الخطوات بالترتيب الصحيح (اسحب أو استخدم الأسهم).' : 'Put the steps in the correct order (drag, or use the arrows).'}
      </div>
      <div className="space-y-2">
        {order.map((id, i) => {
          const correctHere = submitted && data.correctOrder[i] === id;
          const wrongHere = submitted && data.correctOrder[i] !== id;
          const style = correctHere ? 'border-green-400 bg-green-50' : wrongHere ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white';
          return (
            <div
              key={id}
              draggable={!submitted}
              onDragStart={() => {
                dragFrom.current = i;
              }}
              onDragOver={(e) => !submitted && e.preventDefault()}
              onDrop={() => {
                if (dragFrom.current !== null) move(dragFrom.current, i);
                dragFrom.current = null;
              }}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all ${style}`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  correctHere ? 'bg-green-500 text-white' : wrongHere ? 'bg-red-500 text-white' : 'bg-violet-600 text-white'
                }`}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-gray-800">{text(id)}</span>
              {!submitted && (
                <span className="flex flex-col gap-0.5">
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="px-2 leading-none text-gray-500 hover:text-violet-600 disabled:opacity-30" aria-label="Move up">
                    ▲
                  </button>
                  <button type="button" onClick={() => move(i, i + 1)} disabled={i === order.length - 1} className="px-2 leading-none text-gray-500 hover:text-violet-600 disabled:opacity-30" aria-label="Move down">
                    ▼
                  </button>
                </span>
              )}
            </div>
          );
        })}
      </div>
      {submitted && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-700">{isArabic ? 'الترتيب الصحيح:' : 'Correct order:'}</p>
          <ol className="mt-1 space-y-0.5 list-decimal list-inside">
            {data.correctOrder.map((id) => (
              <li key={id}>{text(id)}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

type PracticeClientProps = { initialFramework: ExamPathId };

export default function PracticeClient({ initialFramework }: PracticeClientProps) {
  const searchParams = useSearchParams();
  const debugQuestionId = searchParams.get('debugQuestionId')?.trim() || '';
  const { isArabic } = useLanguage();

  const [mode, setMode] = useState<'setup' | 'question' | 'wrapup' | 'loading'>('setup');
  const [difficulty, setDifficulty] = useState('entry');
  const [domain, setDomain] = useState('all');
  const [framework, setFramework] = useState<ExamPathId>(initialFramework);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState(1);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedMultiAnswers, setSelectedMultiAnswers] = useState<string[]>([]);
  const [selectedPullDownAnswers, setSelectedPullDownAnswers] = useState<Record<string, string>>({});
  const [matchingAssignments, setMatchingAssignments] = useState<Record<string, string>>({});
  const [orderingSequence, setOrderingSequence] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [blockResults, setBlockResults] = useState<QuestionResult[]>([]);
  const [cycleResults, setCycleResults] = useState<QuestionResult[]>([]);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);

  const [wrapUp, setWrapUp] = useState<WrapUp | null>(null);
  const [strategicReport, setStrategicReport] = useState<StrategicReport | null>(null);
  const [strategicReportId, setStrategicReportId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [blockScore, setBlockScore] = useState({ correct: 0, total: 0 });

  const [guruReport, setGuruReport] = useState<GuruReport | null>(null);
  const [showGuru, setShowGuru] = useState(false);
  const [badge, setBadge] = useState<Badge | null>(null);
  const [overallScore, setOverallScore] = useState<{ correct: number; total: number; pct: number } | null>(null);
  const [guruReportId, setGuruReportId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionBankStatus, setQuestionBankStatus] = useState<QuestionBankStatus | null>(null);

  // Use the learner-selected route for sessions, submissions, and question-bank selection.
  // The questions API remains responsible for transparent fallback only when native inventory is short.
  const practiceQuestionBankFramework = framework;

  const resetPracticeState = useCallback(() => {
    setMode('setup');
    setSessionId(null);
    setBlockNumber(1);
    setQuestions([]);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setSelectedMultiAnswers([]);
    setSelectedPullDownAnswers({});
    setMatchingAssignments({});
    setOrderingSequence([]);
    setSubmitted(false);
    setBlockResults([]);
    setCycleResults([]);
    setAnsweredIds([]);
    setWrapUp(null);
    setStrategicReport(null);
    setStrategicReportId(null);
    setVideos([]);
    setBlockScore({ correct: 0, total: 0 });
    setGuruReport(null);
    setShowGuru(false);
    setBadge(null);
    setOverallScore(null);
    setGuruReportId(null);
    setError(null);
    setQuestionBankStatus(null);
  }, []);

  const languageRef = useRef(isArabic);

  useEffect(() => {
    if (languageRef.current === isArabic) return;

    languageRef.current = isArabic;
    resetPracticeState();
  }, [isArabic, resetPracticeState]);

  // Initialize per-question interactive state when the current question changes:
  // clear matching assignments; seed ordering with a shuffled sequence.
  useEffect(() => {
    const q = questions[currentQ];
    if (!q) return;
    setMatchingAssignments({});
    if (getQuestionType(q) === 'ordering') {
      setOrderingSequence(shuffleIds(getOrderingData(q, isArabic).items.map((item) => item.id)));
    } else {
      setOrderingSequence([]);
    }
  }, [currentQ, questions, isArabic]);

  const startSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/practice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework: practiceQuestionBankFramework, activeFramework: framework, domain, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to start session');
      }

      setSessionId(data.session.id);
      await loadBlock(data.session.id, []);
    } catch {
      setError(dt('Failed to start session. Please try again.', isArabic));
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlock = useCallback(
    async (sid: string, exclude: string[]) => {
      setIsLoading(true);
      setMode('loading');

      try {
        const params = new URLSearchParams({
          domain,
          difficulty,
          framework,
          exclude: exclude.join(','),
          lang: isArabic ? 'ar' : 'en',
        });

        if (debugQuestionId) {
          params.set('debugQuestionId', debugQuestionId);
        }

        const res = await fetch(`/api/practice/questions?${params}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Could not load questions');
        }

        setQuestions(data.questions || []);
        setQuestionBankStatus(data.questionBankStatus || null);
        setCurrentQ(0);
        setSelectedAnswer(null);
    setSelectedMultiAnswers([]);
    setSelectedPullDownAnswers({});
    setMatchingAssignments({});
    setOrderingSequence([]);
        setSubmitted(false);
        setBlockResults([]);
        setMode('question');
      } catch {
        setError(dt('Could not load questions. Please check your connection.', isArabic));
        setMode('setup');
      } finally {
        setIsLoading(false);
      }
    },
    [domain, difficulty, framework, isArabic, debugQuestionId]
  );

  const handleSubmit = () => {
    const question = questions[currentQ];
    const questionType = getQuestionType(question);

    let selectedAnswerText = selectedAnswer || '';
    let correctAnswerText = question.correct_answer;
    let isCorrect = false;

    if (questionType === 'multiple_response') {
      const multipleData = getMultipleResponseData(question, isArabic);

      if (selectedMultiAnswers.length !== multipleData.selectCount) return;

      isCorrect = sameAnswerSet(selectedMultiAnswers, multipleData.correct);
      selectedAnswerText = formatMultipleAnswerSummary(selectedMultiAnswers, multipleData.options, isArabic);
      correctAnswerText = formatMultipleAnswerSummary(multipleData.correct, multipleData.options, isArabic);
    } else if (questionType === 'pull_down') {
      const pullDownData = getPullDownData(question, isArabic);
      const allBlanksAnswered =
        pullDownData.blanks.length > 0 &&
        pullDownData.blanks.every((blank) => selectedPullDownAnswers[blank.id]);

      if (!allBlanksAnswered) return;

      isCorrect = pullDownData.blanks.every((blank) => selectedPullDownAnswers[blank.id] === blank.correct);
      selectedAnswerText = formatPullDownSummary(pullDownData.blanks, selectedPullDownAnswers);
      correctAnswerText = formatPullDownCorrectSummary(pullDownData.blanks);
    } else if (questionType === 'matching') {
      const m = getMatchingData(question, isArabic);
      const allAssigned = m.items.length > 0 && m.items.every((it) => matchingAssignments[it.id]);
      if (!allAssigned) return;

      isCorrect = m.items.every((it) => matchingAssignments[it.id] === m.correct[it.id]);
      selectedAnswerText = formatMatchingSummary(m.items, m.categories, matchingAssignments);
      correctAnswerText = formatMatchingSummary(m.items, m.categories, m.correct);
    } else if (questionType === 'ordering') {
      const o = getOrderingData(question, isArabic);
      if (orderingSequence.length !== o.items.length || o.correctOrder.length !== o.items.length) return;

      isCorrect = o.correctOrder.every((id, i) => orderingSequence[i] === id);
      selectedAnswerText = formatOrderingSummary(orderingSequence, o.items);
      correctAnswerText = formatOrderingSummary(o.correctOrder, o.items);
    } else {
      if (!selectedAnswer) return;
      isCorrect = selectedAnswer === question.correct_answer;
    }

    const result: QuestionResult = {
      questionId: question.id,
      questionText: getFieldByLanguage(
        isArabic,
        question.question_text,
        question.question_text_ar
      ),
      selectedAnswer: selectedAnswerText,
      correctAnswer: correctAnswerText,
      isCorrect,
      explanation: getFieldByLanguage(isArabic, question.explanation, question.explanation_ar),
      ritaTip: getFieldByLanguage(isArabic, question.rita_tip, question.rita_tip_ar),
      domain: question.domain,
      difficulty: question.difficulty,
    };

    setBlockResults((previous) => [...previous, result]);
    setSubmitted(true);
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((previous) => previous + 1);
      setSelectedAnswer(null);
    setSelectedMultiAnswers([]);
    setSelectedPullDownAnswers({});
    setMatchingAssignments({});
    setOrderingSequence([]);
      setSubmitted(false);
      return;
    }

    setMode('loading');

    const finalResults = blockResults;
    const nextCycleResults = [...cycleResults, ...finalResults];
    const newAnsweredIds = [...answeredIds, ...questions.map((question) => question.id)];
    setAnsweredIds(newAnsweredIds);

    try {
      const res = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          blockNumber,
          results: finalResults,
          framework: practiceQuestionBankFramework,
          activeFramework: framework,
          language: isArabic ? 'ar' : 'en',
          cycleResults: nextCycleResults,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit block');
      }

      setWrapUp(data.wrapUp);
      setStrategicReport(data.strategicReport || null);
      setStrategicReportId(data.strategicReportId || null);
      setVideos(data.videos || []);
      setBlockScore({ correct: data.correct, total: data.total });
      setBlockNumber((previous) => previous + 1);
      setCycleResults(data.strategicReport ? [] : nextCycleResults);

      if (data.guruReport) {
        setGuruReport(data.guruReport);
        setShowGuru(true);
      }

      if (data.badge) {
        setBadge(data.badge);
      }

      if (data.overallScore) {
        setOverallScore(data.overallScore);
      }

      if (data.guruReportId) {
        setGuruReportId(data.guruReportId);
      }

      setMode('wrapup');
    } catch {
      setError(dt('Failed to submit block. Please try again.', isArabic));
      setMode('question');
    }
  };

  const handleGuruLink = (targetDomain: string) => {
    const msg = isArabic
      ? `أواجه صعوبة في "${targetDomain}" ضمن اختبار PMP. أريد شرحًا واضحًا ومبسطًا للمفاهيم الأساسية، وأهم أخطاء المتقدمين في هذا الموضوع، وطريقة ريتا للإجابة على هذا النوع من الأسئلة، مع سؤالين تدريبيين بشرح مفصل.`
      : `I am struggling with "${targetDomain}" in the PMP exam. Please help me with:

1. A clear, simple explanation of the key concepts in this area
2. The most common mistakes candidates make on exam questions about this topic
3. Rita Mulcahy's specific technique for answering these questions correctly
4. 2 practice questions with detailed explanations to test my understanding

Please be warm, encouraging, and focus on what I need to know to pass the exam.`;

    window.open(`/dashboard/tutor?q=${encodeURIComponent(msg)}`, '_blank');
  };

  const currentQuestion = questions[currentQ];
  const progress =
    questions.length > 0
      ? ((currentQ + (submitted ? 1 : 0)) / questions.length) * 100
      : 0;

  const selectedPathCopy = getExamPathCopy(framework, isArabic ? 'ar' : 'en');
  const selectedPathColor = EXAM_PATHS[framework].color;
  const effectivePracticeBankNotice = questionBankStatus?.message || null;

  function practiceDomainLabel(domainId: string) {
    if (isArabic) {
      if (domainId === 'all') {
        if (framework === 'pmbok8') return 'جميع مجالات ECO 2026';
        if (framework === 'bridge') return 'جميع مجالات الانتقال';
        return 'جميع المجالات';
      }

      if (framework === 'pmbok8') {
        const labels: Record<string, string> = {
          people: 'الأفراد (33%)',
          process: 'العمليات (41%)',
          'business-environment': 'بيئة الأعمال (26%)',
        };
        return labels[domainId] || domainId;
      }

      if (framework === 'bridge') {
        const labels: Record<string, string> = {
          people: 'الأفراد 42% ← 33%',
          process: 'العمليات 50% ← 41%',
          'business-environment': 'بيئة الأعمال 8% ← 26%',
        };
        return labels[domainId] || domainId;
      }
    }

    if (domainId === 'all') {
      if (framework === 'pmbok8') return 'All ECO 2026 Domains';
      if (framework === 'bridge') return 'All Transition Domains';
      return dt('All Domains', isArabic);
    }

    if (framework === 'pmbok8') {
      const labels: Record<string, string> = {
        people: 'People (33%)',
        process: 'Process (41%)',
        'business-environment': 'Business Environment (26%)',
      };
      return labels[domainId] || domainId;
    }

    if (framework === 'bridge') {
      const labels: Record<string, string> = {
        people: 'People 42% → 33%',
        process: 'Process 50% → 41%',
        'business-environment': 'Business Environment 8% → 26%',
      };
      return labels[domainId] || domainId;
    }

    return dt(DOMAINS.find((item) => item.id === domainId)?.label || domainId, isArabic);
  }

  const routeAwareDomains = DOMAINS.map((item) => ({ ...item, label: practiceDomainLabel(item.id) }));


  if (mode === 'setup') {
    return (
      <div dir={rtlDir(isArabic)} className={`max-w-2xl mx-auto py-8 px-4 ${rtlClass(isArabic)}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {dt('Practice Questions', isArabic)}
          </h1>
          <p className="text-gray-500">
            {isArabic ? 'محرك تدريب تكيفي مرتبط بمسارك المختار' : 'Adaptive practice engine aligned to your selected route'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {isArabic ? 'مسار التدريب' : 'Practice route'}
          </p>

          <div
            className="mb-3 rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: selectedPathColor + '33',
              backgroundColor: selectedPathColor + '08',
              color: selectedPathColor,
            }}
          >
            <p className="font-bold">{selectedPathCopy.label}</p>
            <p className="mt-1 text-xs leading-5 text-gray-600">{selectedPathCopy.description}</p>
          </div>

          {effectivePracticeBankNotice && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
              {effectivePracticeBankNotice}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {EXAM_PATH_ORDER.map((path) => {
              const copy = getExamPathCopy(path, isArabic ? 'ar' : 'en');
              const active = framework === path;
              const color = EXAM_PATHS[path].color;

              return (
                <button
                  key={path}
                  onClick={() => {
                    setFramework(path);
                    resetPracticeState();
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{
                    borderColor: active ? color : '#e5e7eb',
                    backgroundColor: active ? color + '10' : '#ffffff',
                    color: active ? color : '#6b7280',
                  }}
                >
                  <span className="block text-xs font-bold">{copy.badge}</span>
                  <span className="mt-1 block">{copy.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {dt('Choose your difficulty level', isArabic)}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {DIFFICULTIES.map((item) => (
              <button
                key={item.id}
                onClick={() => setDifficulty(item.id)}
                className={`p-4 rounded-xl border-2 ${rtlClass(isArabic)} transition-all ${
                  difficulty === item.id
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {dt(item.label, isArabic)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{dt(item.desc, isArabic)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {dt('Filter by domain', isArabic)}
          </p>

          <div className="flex flex-wrap gap-2">
            {routeAwareDomains.map((item) => (
              <button
                key={item.id}
                onClick={() => setDomain(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  domain === item.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startSession}
          disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 text-lg"
        >
          {isLoading ? dt('Starting…', isArabic) : dt('🚀 Start Practice Session', isArabic)}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          {dt(
            '5 questions per block · AI wrap-up after each block · Guru report after 15 questions',
            isArabic
          )}
        </p>
      </div>
    );
  }

  if (mode === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            {dt('Preparing your questions…', isArabic)}
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'question' && currentQuestion) {
    const questionType = getQuestionType(currentQuestion);
    const optionKeys = ['a', 'b', 'c', 'd'] as const;

    const optionTexts: Record<string, string> = {
      a: getFieldByLanguage(isArabic, currentQuestion.option_a, currentQuestion.option_a_ar),
      b: getFieldByLanguage(isArabic, currentQuestion.option_b, currentQuestion.option_b_ar),
      c: getFieldByLanguage(isArabic, currentQuestion.option_c, currentQuestion.option_c_ar),
      d: getFieldByLanguage(isArabic, currentQuestion.option_d, currentQuestion.option_d_ar),
    };

    const multipleResponseData = getMultipleResponseData(currentQuestion, isArabic);
    const pullDownData = getPullDownData(currentQuestion, isArabic);
    const matchingData = getMatchingData(currentQuestion, isArabic);
    const orderingData = getOrderingData(currentQuestion, isArabic);
    const canSubmitCurrentAnswer =
      questionType === 'multiple_response'
        ? selectedMultiAnswers.length === multipleResponseData.selectCount
        : questionType === 'pull_down'
          ? pullDownData.blanks.length > 0 &&
            pullDownData.blanks.every((blank) => selectedPullDownAnswers[blank.id])
          : questionType === 'matching'
            ? matchingData.items.length > 0 && matchingData.items.every((it) => matchingAssignments[it.id])
            : questionType === 'ordering'
              ? orderingData.items.length > 0 && orderingSequence.length === orderingData.items.length
              : Boolean(selectedAnswer);

    const toggleMultiAnswer = (key: string) => {
      if (submitted) return;

      setSelectedMultiAnswers((previous) => {
        if (previous.includes(key)) return previous.filter((item) => item !== key);
        if (previous.length >= multipleResponseData.selectCount) return previous;
        return [...previous, key];
      });
    };

    return (
      <div
        dir={rtlDir(isArabic)}
        className={`max-w-2xl mx-auto py-6 px-4 ${showGuru ? 'mr-96' : ''} transition-all ${rtlClass(isArabic)}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('setup')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              {isArabic ? 'رجوع ←' : '← Back'}
            </button>

            <span className="text-xs text-gray-400">
              {isArabic
                ? `البلوك ${blockNumber} · السؤال ${currentQ + 1}/5`
                : `Block ${blockNumber} · Q${currentQ + 1}/5`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                difficulty === 'entry'
                  ? 'bg-green-100 text-green-700'
                  : difficulty === 'paced'
                    ? 'bg-yellow-100 text-yellow-700'
                    : difficulty === 'difficult'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
              }`}
            >
              {DIFFICULTIES.find((item) => item.id === difficulty)?.emoji}{' '}
              {dt(DIFFICULTIES.find((item) => item.id === difficulty)?.label ?? '', isArabic)}
            </span>

            {guruReport && (
              <button
                onClick={() => setShowGuru(true)}
                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-1 rounded-full transition-all"
              >
                🧙‍♂️ Guru
              </button>
            )}
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div
            className="bg-violet-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {questionBankStatus?.fallbackUsed && questionBankStatus.message && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            <p className="font-semibold">
              {isArabic ? 'تنبيه بنك الأسئلة' : 'Question bank notice'}
            </p>
            <p className="mt-1">{questionBankStatus.message}</p>
            <p className="mt-1 text-[11px] text-amber-700">
              {isArabic
                ? `الأسئلة المعروضة حاليًا من: ${questionBankStatus.actualQuestionFrameworks.join(', ')}`
                : `Current questions loaded from: ${questionBankStatus.actualQuestionFrameworks.join(', ')}`}
            </p>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-medium">
            {formatQuestionDomain(currentQuestion.domain, isArabic)}
          </span>
          {currentQuestion.framework && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
              {currentQuestion.framework.toUpperCase()}
            </span>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4">
          <p className="text-gray-900 font-medium text-base leading-relaxed">
            {getFieldByLanguage(
              isArabic,
              currentQuestion.question_text,
              currentQuestion.question_text_ar
            )}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {questionType === 'multiple_response' ? (
            <>
              <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">
                {isArabic
                  ? `اختر ${multipleResponseData.selectCount} إجابة. يجب اختيار جميع الإجابات الصحيحة.`
                  : `Select ${multipleResponseData.selectCount} answers. All required selections must be correct.`}
              </div>

              {Object.entries(multipleResponseData.options).map(([key, text]) => {
                const isSelected = selectedMultiAnswers.includes(key);
                const isCorrect = multipleResponseData.correct.includes(key);

                let style = 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50';

                if (submitted) {
                  if (isCorrect) {
                    style = 'border-green-400 bg-green-50';
                  } else if (isSelected && !isCorrect) {
                    style = 'border-red-400 bg-red-50';
                  } else {
                    style = 'border-gray-100 bg-gray-50 opacity-60';
                  }
                } else if (isSelected) {
                  style = 'border-violet-500 bg-violet-50';
                }

                return (
                  <button
                    key={key}
                    onClick={() => toggleMultiAnswer(key)}
                    disabled={submitted}
                    className={`w-full ${isArabic ? 'text-right' : 'text-left'} p-4 rounded-xl border-2 transition-all ${style}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          submitted && isCorrect
                            ? 'bg-green-500 text-white'
                            : submitted && isSelected && !isCorrect
                              ? 'bg-red-500 text-white'
                              : isSelected
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {submitted && isCorrect
                          ? '✓'
                          : submitted && isSelected && !isCorrect
                            ? '✗'
                            : isSelected
                              ? '✓'
                              : answerLabel(key, isArabic)}
                      </span>

                      <span className="text-gray-800 text-sm leading-relaxed">
                        {text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </>
          ) : questionType === 'pull_down' ? (
            <div className="space-y-4">
              {pullDownData.blanks.map((blank) => {
                const selectedValue = selectedPullDownAnswers[blank.id] || '';
                const isCorrect = selectedValue === blank.correct;

                return (
                  <div
                    key={blank.id}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm leading-7 text-gray-800">
                      {blank.prompt_before && <span>{blank.prompt_before}</span>}

                      <select
                        value={selectedValue}
                        onChange={(event) =>
                          !submitted &&
                          setSelectedPullDownAnswers((previous) => ({
                            ...previous,
                            [blank.id]: event.target.value,
                          }))
                        }
                        disabled={submitted}
                        className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 outline-none focus:border-violet-500 disabled:opacity-70"
                      >
                        <option value="">{isArabic ? 'اختر...' : 'Choose...'}</option>
                        {blank.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      {blank.prompt_after && <span>{blank.prompt_after}</span>}
                    </div>

                    {submitted && (
                      <p
                        className={`mt-3 text-xs font-medium ${
                          isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {isCorrect
                          ? dt('Correct', isArabic)
                          : `${dt('Correct answer', isArabic)}: ${blank.correct}`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : questionType === 'matching' ? (
            <MatchingQuestion
              data={matchingData}
              assignments={matchingAssignments}
              setAssignments={setMatchingAssignments}
              submitted={submitted}
              isArabic={isArabic}
            />
          ) : questionType === 'ordering' ? (
            <OrderingQuestion
              data={orderingData}
              order={orderingSequence}
              setOrder={setOrderingSequence}
              submitted={submitted}
              isArabic={isArabic}
            />
          ) : (
            optionKeys.map((key) => {
              const isSelected = selectedAnswer === key;
              const isCorrect = key === currentQuestion.correct_answer;

              let style = 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50';

              if (submitted) {
                if (isCorrect) {
                  style = 'border-green-400 bg-green-50';
                } else if (isSelected && !isCorrect) {
                  style = 'border-red-400 bg-red-50';
                } else {
                  style = 'border-gray-100 bg-gray-50 opacity-60';
                }
              } else if (isSelected) {
                style = 'border-violet-500 bg-violet-50';
              }

              return (
                <button
                  key={key}
                  onClick={() => !submitted && setSelectedAnswer(key)}
                  disabled={submitted}
                  className={`w-full ${isArabic ? 'text-right' : 'text-left'} p-4 rounded-xl border-2 transition-all ${style}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        submitted && isCorrect
                          ? 'bg-green-500 text-white'
                          : submitted && isSelected && !isCorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {submitted && isCorrect
                        ? '✓'
                        : submitted && isSelected && !isCorrect
                          ? '✗'
                          : answerLabel(key, isArabic)}
                    </span>

                    <span className="text-gray-800 text-sm leading-relaxed">
                      {optionTexts[key]}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {submitted && (
          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                {dt('📖 Explanation', isArabic)}
              </p>
              <p className="text-blue-800 text-sm leading-relaxed">
                {getFieldByLanguage(
                  isArabic,
                  currentQuestion.explanation,
                  currentQuestion.explanation_ar
                )}
              </p>
            </div>

            {currentQuestion.rita_tip && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">
                  {isArabic ? '💡 نصيحة ريتا' : "💡 Rita\'s Tip"}
                </p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  {getFieldByLanguage(isArabic, currentQuestion.rita_tip, currentQuestion.rita_tip_ar)}
                </p>
              </div>
            )}

            <div className="flex gap-2 text-xs text-gray-400">
              <span>{currentQuestion.pmbok_reference}</span>
              <span>·</span>
              <span>{currentQuestion.eco_reference}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmitCurrentAnswer}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40"
            >
              {dt('Submit Answer', isArabic)}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {currentQ < questions.length - 1
                ? dt('Next Question →', isArabic)
                : dt('Complete Block →', isArabic)}
            </button>
          )}
        </div>

        {showGuru && guruReport && (
          <GuruPanel
            report={guruReport}
            onClose={() => setShowGuru(false)}
            onLinkClick={handleGuruLink}
            isArabic={isArabic}
          />
        )}
      </div>
    );
  }

  if (mode === 'wrapup' && wrapUp) {
    const pct = blockScore.total > 0 ? Math.round((blockScore.correct / blockScore.total) * 100) : 0;
    const displayPct = strategicReport ? strategicReport.overall_score.pct : pct;
    const displayCorrect = strategicReport ? strategicReport.overall_score.correct : blockScore.correct;
    const displayTotal = strategicReport ? strategicReport.overall_score.total : blockScore.total;
    const emoji = strategicReport ? '🏛️' : displayPct >= 80 ? '🎉' : displayPct >= 60 ? '👍' : '💪';
    const headerTitle = strategicReport
      ? isArabic
        ? `${strategicReport.cycle_label} اكتملت`
        : `${strategicReport.cycle_label} Complete`
      : isArabic
        ? `اكتمل البلوك ${blockNumber - 1}`
        : `Block ${blockNumber - 1} Complete`;
    const headerMessage = strategicReport ? strategicReport.readiness_label : wrapUp.score_message;
    const headerIconClass = strategicReport
      ? 'bg-violet-100 border border-violet-200 shadow-sm'
      : displayPct >= 80
        ? 'bg-green-100'
        : displayPct >= 60
          ? 'bg-yellow-100'
          : 'bg-orange-100';
    const headerScoreColor = strategicReport
      ? '#322057'
      : displayPct >= 80
        ? '#16a34a'
        : displayPct >= 60
          ? '#d97706'
          : '#ea580c';

    return (
      <div
        dir={rtlDir(isArabic)}
        className={`max-w-7xl mx-auto py-6 px-4 ${showGuru ? 'mr-96' : ''} transition-all ${rtlClass(isArabic)}`}
      >
        <div className="text-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 ${headerIconClass}`}
          >
            {emoji}
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            {headerTitle}
          </h2>

          <p
            className="text-4xl font-bold mt-1"
            style={{
              color: headerScoreColor,
            }}
          >
            {displayCorrect}/{displayTotal}
          </p>

          <p className="text-gray-500 text-sm mt-1">{headerMessage}</p>

          {overallScore && (
            <div className="mt-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2 inline-block">
              <p className="text-sm font-semibold text-violet-700">
                {isArabic
                  ? `📊 الإجمالي: ${overallScore.correct}/${overallScore.total} (${overallScore.pct}%) خلال آخر 15 سؤالًا`
                  : `📊 Overall: ${overallScore.correct}/${overallScore.total} (${overallScore.pct}%) across last 15 questions`}
              </p>
            </div>
          )}
        </div>

        {badge && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6 mb-4 text-center animate-pulse-once">
            <div className="text-5xl mb-3">{badge.badge_icon}</div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              {isArabic ? 'تم الحصول على شارة!' : 'Badge Earned!'}
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{badge.badge_name}</h3>
            <p className="text-sm text-gray-600">{badge.badge_description}</p>
            <div className="mt-3 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
              🎯 {badge.score}% {isArabic ? 'دقة' : 'accuracy'}
            </div>
          </div>
        )}

        {strategicReport ? (
          <div className="bg-white border border-violet-100 rounded-3xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500 mb-2">
                  {isArabic ? 'تقرير استراتيجي محفوظ' : 'Strategic report saved'}
                </p>
                <h3 className="text-2xl font-bold text-[#322057] mb-2">
                  {isArabic
                    ? 'تم إنشاء التقرير الاستراتيجي الكامل وحفظه بنجاح.'
                    : 'Your full strategic report has been generated and saved.'}
                </h3>
                <p className="text-sm text-gray-600 leading-6 max-w-3xl">
                  {isArabic
                    ? 'افتح التقرير الكامل للاطلاع على تحليل الجاهزية، قوة المجالات، الفجوات، وخطة التحسين. هذه الشاشة مختصرة حتى تبقى رحلة التدريب واضحة وغير مكررة.'
                    : 'Open the full report to review readiness analysis, domain strengths, gaps, and improvement guidance. This screen stays compact so the practice flow remains clear and non-duplicative.'}
                </p>
              </div>

              <div className="bg-violet-50 border border-violet-100 rounded-2xl px-5 py-4 text-center min-w-[180px]">
                <p className="text-xs font-semibold text-violet-500 mb-1">
                  {isArabic ? 'درجة جاهزية PMP' : 'PMP readiness score'}
                </p>
                <p className="text-3xl font-bold text-[#322057]">
                  {displayPct}%
                </p>
                <p className="text-xs text-violet-600 mt-1">
                  {headerMessage}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mt-6">
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  {isArabic ? 'المسار' : 'Route'}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {(
                    (strategicReport as { route_label?: string; active_route?: string; framework?: string }).route_label ||
                    (strategicReport as { route_label?: string; active_route?: string; framework?: string }).active_route ||
                    (strategicReport as { route_label?: string; active_route?: string; framework?: string }).framework ||
                    (isArabic ? 'مسار PMP المحدد' : 'Selected PMP route')
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  {isArabic ? 'نتيجة الدورة' : 'Cycle score'}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {displayCorrect}/{displayTotal} ({displayPct}%)
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  {isArabic ? 'الخطوة التالية' : 'Next step'}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {isArabic ? 'افتح التقرير الكامل أو تابع التدريب.' : 'Open the full report or continue practicing.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <WrapUpTabs wrapUp={wrapUp} videos={videos} isArabic={isArabic} />
        )}

        <div className="mt-6 space-y-3">
          {guruReport && !showGuru && (
            <button
              onClick={() => setShowGuru(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isArabic ? '🧙‍♂️ عرض تقرير المرشد' : '🧙‍♂️ View Your Guru Progress Report'}
            </button>
          )}

          {guruReportId && (
            <a
              href={`/dashboard/guru-report/${guruReportId}`}
              target="_blank"
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center"
            >
              {isArabic ? '📊 عرض التقرير التفاعلي الكامل' : '📊 View Full Interactive Report'}
            </a>
          )}

          {strategicReport && strategicReportId && (
            <div className="grid md:grid-cols-2 gap-3">
              <a
                href={`/dashboard/strategic-report/${strategicReportId}`}
                target="_blank"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                {isArabic ? '🏛️ فتح التقرير الاستراتيجي الكامل' : '🏛️ Open Full Strategic Report'}
              </a>

              <button
                type="button"
                onClick={() => {
                  const reportUrl = `${window.location.origin}/dashboard/strategic-report/${strategicReportId}`;
                  navigator.clipboard?.writeText(reportUrl);
                }}
                className="w-full bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                {isArabic ? '🔗 نسخ رابط التقرير' : '🔗 Copy Report Link'}
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setStrategicReport(null);
              setStrategicReportId(null);
              loadBlock(sessionId!, answeredIds);
            }}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {isArabic ? 'متابعة — البلوك التالي من 5 ←' : 'Continue — Next Block of 5 →'}
          </button>

          <button
            onClick={() => {
              setMode('setup');
              setBlockNumber(1);
              setAnsweredIds([]);
              setBlockResults([]);
              setCycleResults([]);
              setQuestions([]);
              setCurrentQ(0);
              setWrapUp(null);
              setStrategicReport(null);
              setStrategicReportId(null);
              setVideos([]);
              setBlockScore({ correct: 0, total: 0 });
              setGuruReport(null);
              setShowGuru(false);
              setBadge(null);
              setOverallScore(null);
              setGuruReportId(null);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all text-sm"
          >
            {isArabic ? 'بدء جلسة جديدة' : 'Start New Session'}
          </button>
        </div>

        {showGuru && guruReport && (
          <GuruPanel
            report={guruReport}
            onClose={() => setShowGuru(false)}
            onLinkClick={handleGuruLink}
            isArabic={isArabic}
          />
        )}
      </div>
    );
  }

  return null;
}


function WrapUpTabs({
  wrapUp,
  videos,
  isArabic,
}: {
  wrapUp: WrapUp;
  videos: Video[];
  isArabic: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'learnings' | 'rita' | 'mindmap' | 'videos'>('learnings');

  const tabs: { id: 'learnings' | 'rita' | 'mindmap' | 'videos'; label: string }[] = [
    {
      id: 'learnings',
      label: isArabic ? '📚 أهم ما تعلمته' : '📚 Key Learnings',
    },
    {
      id: 'rita',
      label: isArabic ? '🎯 تقنية ريتا' : '🎯 Rita Technique',
    },
    {
      id: 'mindmap',
      label: isArabic ? '🧠 الخريطة الذهنية' : '🧠 Mind Map',
    },
    ...(videos.length > 0
      ? [
          {
            id: 'videos' as const,
            label: isArabic ? '🎥 الفيديوهات' : '🎥 Videos',
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'text-violet-700 border-b-2 border-violet-600 bg-violet-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'learnings' && (
          <div className="space-y-3">
            {wrapUp.key_learnings.map((learning, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{learning.concept}</p>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    {learning.source}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{learning.insight}</p>
              </div>
            ))}

            <div className="bg-violet-50 rounded-xl p-3 mt-2">
              <p className="text-xs font-semibold text-violet-600 mb-1">
                {isArabic ? 'التركيز التالي' : 'Next Focus'}
              </p>
              <p className="text-violet-800 text-sm">{wrapUp.next_focus}</p>
            </div>
          </div>
        )}

        {activeTab === 'rita' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <p className="font-semibold text-amber-800">
                  {isArabic ? 'تقنية ريتا للإجابة في الاختبار' : 'Rita Mulcahy Exam Technique'}
                </p>
              </div>
              <p className="text-amber-900 text-sm leading-relaxed">
                {wrapUp.rita_technique}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {isArabic ? 'تذكيرات استراتيجية سريعة' : 'QUICK STRATEGY REMINDERS'}
              </p>

              {isArabic ? (
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li>• اقرأ الجملة الأخيرة أولًا لتعرف المطلوب بدقة.</li>
                  <li>• اسأل نفسك: ما الذي سيفعله مدير مشروع محترف؟</li>
                  <li>• استبعد الإجابات التي تحتوي على تعميمات مطلقة أو قرارات متسرعة.</li>
                  <li>• عند التردد، اختر الإجابة الأكثر استباقية وتواصلًا وتعاونًا.</li>
                  <li>• في أسئلة Agile، ابحث عن القيادة الخادمة وتمكين الفريق.</li>
                </ul>
              ) : (
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li>
                    • Read the <strong>last sentence first</strong> to know what&apos;s being asked.
                  </li>
                  <li>
                    • Ask: <strong>&quot;What would a GOOD PM do?&quot;</strong>
                  </li>
                  <li>
                    • Eliminate answers with <strong>&quot;always&quot;</strong> or{' '}
                    <strong>&quot;never&quot;</strong>.
                  </li>
                  <li>
                    • When in doubt: pick the most{' '}
                    <strong>proactive, communicative</strong> answer.
                  </li>
                  <li>
                    • Agile questions: look for <strong>servant leadership</strong>.
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'mindmap' && (
          <TreeMindMap
            center={wrapUp.mindmap_center}
            branches={wrapUp.mindmap_branches}
            isArabic={isArabic}
          />
        )}

        {activeTab === 'videos' && videos.length > 0 && (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="rounded-xl overflow-hidden border border-gray-200">
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    title={video.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm">{video.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{video.domain}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}