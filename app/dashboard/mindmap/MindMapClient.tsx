'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PMBOK7_DOMAINS, ECO_MINDMAP } from '@/lib/pmp-data';
import type { MindMapMode, MindMapNode } from '@/types';
import { getDomainColor } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/language-context';

type LocalizedValue = string | { en?: string; ar?: string } | null | undefined;

type RichMindMapNode = Omit<MindMapNode, 'children' | 'label' | 'description'> & {
  id: string;
  label: LocalizedValue;
  description?: LocalizedValue;
  children?: RichMindMapNode[];
  color?: string;
};

const BRAND = {
  plum: '#4b164c',
  plumDark: '#351036',
  plumSoft: '#f4edf6',
  purple: '#7c3aed',
  amber: '#f5b400',
  amberSoft: '#fff7d6',
  charcoal: '#2b2b2f',
  slate: '#5f6472',
  border: '#eadff0',
};

const AR: Record<string, string> = {
  'Mind Map Explorer': 'مستكشف الخريطة الذهنية',
  'Visualize and explore PMP knowledge as an expandable concept map.': 'استكشف معرفة PMP بصريًا عبر خريطة مفاهيمية قابلة للتوسع.',
  'PMBOK 7 Domains': 'مجالات PMBOK 7',
  'ECO 2021 Tasks': 'مهام ECO 2021',
  'Export PDF': 'تصدير PDF',
  'Reset': 'إعادة ضبط',
  'Click any node to expand the map and open the Zane explanation panel.': 'انقر على أي عقدة لتوسيع الخريطة وفتح لوحة شرح Zane.',
  'Zane Explanation': 'شرح Zane',
  'Select a concept': 'اختر مفهومًا',
  'Choose any node in the map to see the intro, advanced analysis, and related frameworks.': 'اختر أي عقدة في الخريطة لعرض المقدمة والتحليل المتقدم والنماذج المرتبطة.',
  'Short intro': 'مقدمة قصيرة',
  'Advanced Analysis': 'تحليل متقدم',
  'Additional Frameworks & Models': 'أطر ونماذج إضافية',
  'Zane Deep Dive': 'تحليل Zane المتعمق',
  'Generating focused explanation...': 'جاري توليد شرح مركز...',
  'Ask a follow-up question...': 'اكتب سؤال متابعة...',
  'Ask': 'اسأل',
  'Thinking...': 'جاري التفكير...',
  'PMP Knowledge Map': 'خريطة معرفة PMP',
  'Current-exam framework map': 'خريطة إطار الاختبار الحالي',
  'Exam Content Outline Map': 'خريطة مخطط محتوى الاختبار',
  'Domain / major branch': 'مجال / فرع رئيسي',
  'Sub-branch': 'فرع فرعي',
  'Detail branch': 'فرع تفصيلي',
  'Leaf concept': 'مفهوم نهائي',
  'Concept meaning': 'معنى المفهوم',
  'Exam reasoning': 'منطق الاختبار',
  'Practical application': 'التطبيق العملي',
  'Definition boundaries': 'حدود التعريف',
  'Why PMI tests it': 'لماذا تختبره PMI',
  'Common traps': 'الأخطاء الشائعة',
  'Decision signals': 'إشارات القرار',
  'Best response pattern': 'نمط الإجابة الأفضل',
  'Real project use': 'الاستخدام في مشروع حقيقي',
  'Stakeholder impact': 'أثر أصحاب المصلحة',
  'Value delivery link': 'الصلة بتسليم القيمة',
  'Team culture': 'ثقافة الفريق',
  'High-performing teams': 'الفرق عالية الأداء',
  'Team structures': 'هياكل الفريق',
  'Psychological safety': 'الأمان النفسي',
  'Working agreements': 'اتفاقيات العمل',
  'Shared accountability': 'المساءلة المشتركة',
  'Trust and collaboration': 'الثقة والتعاون',
  'Cross-functional ownership': 'الملكية متعددة الوظائف',
  'Conflict prevention': 'الوقاية من النزاعات',
  'Roles and responsibilities': 'الأدوار والمسؤوليات',
  'Decision rights': 'حقوق اتخاذ القرار',
  'Virtual team coordination': 'تنسيق الفرق الافتراضية',
  'Servant leadership': 'القيادة الخادمة',
  'Emotional intelligence': 'الذكاء العاطفي',
  'Facilitation and influence': 'التيسير والتأثير',
  'Remove impediments': 'إزالة العوائق',
  'Coach rather than command': 'التوجيه بدل إصدار الأوامر',
  'Empower team decisions': 'تمكين قرارات الفريق',
  'Self-awareness': 'الوعي الذاتي',
  'Empathy': 'التعاطف',
  'Conflict awareness': 'الوعي بالنزاع',
  'Consensus building': 'بناء التوافق',
  'Escalation judgment': 'حُسن تقدير التصعيد',
  'Stakeholder influence': 'التأثير على أصحاب المصلحة',
  'Capability growth': 'نمو القدرات',
  'Conflict management': 'إدارة النزاعات',
  'Collaboration maturity': 'نضج التعاون',
  'Mentoring': 'الإرشاد',
  'Training needs': 'احتياجات التدريب',
  'Feedback loops': 'حلقات التغذية الراجعة',
  'Root-cause conflict thinking': 'التفكير الجذري في النزاعات',
  'Resolution approaches': 'أساليب الحل',
  'Team charter discipline': 'انضباط ميثاق الفريق',
  'Knowledge sharing': 'مشاركة المعرفة',
  'Retrospectives': 'الاستعراضات التحسينية',
  'Stakeholder Performance Domain': 'مجال أداء أصحاب المصلحة',
  'Team Performance Domain': 'مجال أداء الفريق',
  'Development Approach & Life Cycle': 'نهج التطوير ودورة الحياة',
  'Planning Performance Domain': 'مجال أداء التخطيط',
  'Project Work Performance Domain': 'مجال أداء عمل المشروع',
  'Delivery Performance Domain': 'مجال أداء التسليم',
  'Measurement Performance Domain': 'مجال أداء القياس',
  'Uncertainty Performance Domain': 'مجال أداء عدم اليقين',
  'Stakeholder Engagement': 'إشراك أصحاب المصلحة',
  'Communication': 'التواصل',
  'Relationships': 'العلاقات',
  'Project Team Management': 'إدارة فريق المشروع',
  'Leadership Skills': 'مهارات القيادة',
  'Team Development': 'تطوير الفريق',
  'Estimating': 'التقدير',
  'Scheduling': 'الجدولة',
  'Budget': 'الميزانية',
  'Scope Planning': 'تخطيط النطاق',
  'What this concept includes and what it does not include': 'ما الذي يتضمنه هذا المفهوم وما الذي لا يتضمنه',
  'Attractive but weak interpretations to avoid in scenario questions.': 'تفسيرات تبدو جذابة لكنها ضعيفة ويجب تجنبها في الأسئلة الموقفية.',
};

const KNOWN_EXPANSIONS: Record<string, RichMindMapNode[]> = {
  'project team management': [
    {
      id: 'team-culture',
      label: 'Team culture',
      description: 'Norms, safety, agreements, and shared ways of working.',
      children: [
        { id: 'team-culture-psychological-safety', label: 'Psychological safety', description: 'People can raise risks, mistakes, and concerns without fear.' },
        { id: 'team-culture-working-agreements', label: 'Working agreements', description: 'Explicit expectations for communication, decision-making, and collaboration.' },
        { id: 'team-culture-shared-accountability', label: 'Shared accountability', description: 'The team owns outcomes, not only assigned tasks.' },
      ],
    },
    {
      id: 'high-performing-teams',
      label: 'High-performing teams',
      description: 'How teams move from coordination into ownership and sustained delivery.',
      children: [
        { id: 'high-performing-trust', label: 'Trust and collaboration', description: 'Trust reduces friction and improves speed of decision-making.' },
        { id: 'high-performing-cross-functional', label: 'Cross-functional ownership', description: 'Teams combine skills to solve problems without excessive handoffs.' },
        { id: 'high-performing-conflict-prevention', label: 'Conflict prevention', description: 'Healthy norms prevent destructive conflict before it escalates.' },
      ],
    },
    {
      id: 'team-structures',
      label: 'Team structures',
      description: 'How roles, authority, and coordination models shape performance.',
      children: [
        { id: 'team-structures-roles', label: 'Roles and responsibilities', description: 'Clear roles reduce ambiguity and duplicated effort.' },
        { id: 'team-structures-decision-rights', label: 'Decision rights', description: 'Teams know which decisions they can make and when to escalate.' },
        { id: 'team-structures-virtual', label: 'Virtual team coordination', description: 'Distributed teams need stronger communication rhythms and explicit norms.' },
      ],
    },
  ],
  'leadership skills': [
    {
      id: 'servant-leadership',
      label: 'Servant leadership',
      description: 'Leadership through enablement, support, and removing barriers.',
      children: [
        { id: 'servant-remove-impediments', label: 'Remove impediments', description: 'The project manager protects team flow by removing blockers.' },
        { id: 'servant-coach', label: 'Coach rather than command', description: 'The PMP mindset favors empowerment over micromanagement.' },
        { id: 'servant-empower', label: 'Empower team decisions', description: 'Authority is shared where the team has the best information.' },
      ],
    },
    {
      id: 'emotional-intelligence',
      label: 'Emotional intelligence',
      description: 'Reading emotions, motives, resistance, and team dynamics.',
      children: [
        { id: 'ei-self-awareness', label: 'Self-awareness', description: 'The leader recognizes personal bias and emotional triggers.' },
        { id: 'ei-empathy', label: 'Empathy', description: 'Stakeholder and team concerns are understood before action is taken.' },
        { id: 'ei-conflict-awareness', label: 'Conflict awareness', description: 'Early signs of conflict are addressed before they become performance risks.' },
      ],
    },
    {
      id: 'facilitation-influence',
      label: 'Facilitation and influence',
      description: 'Guiding decisions when formal authority is limited.',
      children: [
        { id: 'facilitation-consensus', label: 'Consensus building', description: 'The leader helps the group converge around a workable decision.' },
        { id: 'facilitation-escalation', label: 'Escalation judgment', description: 'Escalation is used when authority, risk, or impact requires it.' },
        { id: 'facilitation-stakeholder-influence', label: 'Stakeholder influence', description: 'Influence is built through trust, evidence, and value alignment.' },
      ],
    },
  ],
  'team development': [
    {
      id: 'capability-growth',
      label: 'Capability growth',
      description: 'Improving team capability through learning and support.',
      children: [
        { id: 'capability-mentoring', label: 'Mentoring', description: 'Experienced members help others improve judgment and delivery.' },
        { id: 'capability-training', label: 'Training needs', description: 'Skills gaps are identified and treated as project performance risks.' },
        { id: 'capability-feedback', label: 'Feedback loops', description: 'Regular feedback improves behavior, quality, and predictability.' },
      ],
    },
    {
      id: 'conflict-management',
      label: 'Conflict management',
      description: 'Addressing conflict constructively before it damages performance.',
      children: [
        { id: 'conflict-root-cause', label: 'Root-cause conflict thinking', description: 'The project manager looks beyond symptoms to the real source.' },
        { id: 'conflict-resolution', label: 'Resolution approaches', description: 'The response fits the conflict type, urgency, and relationship impact.' },
        { id: 'conflict-charter', label: 'Team charter discipline', description: 'Team norms become the reference point for behavior correction.' },
      ],
    },
    {
      id: 'collaboration-maturity',
      label: 'Collaboration maturity',
      description: 'How the team improves its ability to learn and work together.',
      children: [
        { id: 'collaboration-knowledge-sharing', label: 'Knowledge sharing', description: 'Knowledge is made visible and reusable across the team.' },
        { id: 'collaboration-retrospectives', label: 'Retrospectives', description: 'The team inspects and adapts its ways of working.' },
        { id: 'collaboration-value-delivery', label: 'Value delivery link', description: 'Collaboration is judged by its impact on outcomes and value.' },
      ],
    },
  ],
};

function translate(text: string, isArabic: boolean) {
  return isArabic ? AR[text] || text : text;
}

function textOf(value: LocalizedValue, isArabic: boolean, fallback = ''): string {
  if (!value) return fallback;
  if (typeof value === 'string') return translate(value, isArabic);
  return (isArabic ? value.ar || value.en : value.en || value.ar) || fallback;
}

function cleanText(value: string) {
  return value
    .replace(/undefined/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'node';
}

function nodeColor(node: RichMindMapNode, depth = 0) {
  const branded = [BRAND.plum, BRAND.purple, BRAND.amber, BRAND.charcoal, BRAND.slate];
  return node.color || getDomainColor(node.id) || branded[depth % branded.length];
}

function genericExpansion(node: RichMindMapNode): RichMindMapNode[] {
  const base = node.id || slugify(textOf(node.label, false, 'concept'));

  return [
    {
      id: `${base}-concept-meaning`,
      label: 'Concept meaning',
      description: 'Clarifies the concept boundary and why it matters.',
      children: [
        { id: `${base}-definition-boundaries`, label: 'Definition boundaries', description: 'What this concept includes and what it does not include.' },
        { id: `${base}-why-pmi-tests-it`, label: 'Why PMI tests it', description: 'The judgment pattern the exam expects candidates to recognize.' },
        { id: `${base}-common-traps`, label: 'Common traps', description: 'Attractive but weak interpretations to avoid in scenario questions.' },
      ],
    },
    {
      id: `${base}-exam-reasoning`,
      label: 'Exam reasoning',
      description: 'Connects the concept to PMP situational decision-making.',
      children: [
        { id: `${base}-decision-signals`, label: 'Decision signals', description: 'Clues in the scenario that point to the right action.' },
        { id: `${base}-best-response-pattern`, label: 'Best response pattern', description: 'The PMI-aligned response style for this concept.' },
        { id: `${base}-stakeholder-impact`, label: 'Stakeholder impact', description: 'How the decision affects people, value, risk, or governance.' },
      ],
    },
    {
      id: `${base}-practical-application`,
      label: 'Practical application',
      description: 'Shows how the concept behaves in a real project environment.',
      children: [
        { id: `${base}-real-project-use`, label: 'Real project use', description: 'How a capable project manager applies it in practice.' },
        { id: `${base}-value-delivery-link`, label: 'Value delivery link', description: 'How the concept protects or improves project value.' },
        { id: `${base}-common-traps-practice`, label: 'Common traps', description: 'Misapplications that create project friction or exam mistakes.' },
      ],
    },
  ];
}

function sourceToRichNode(source: MindMapNode): RichMindMapNode {
  const raw = source as unknown as {
    id?: string;
    label?: LocalizedValue;
    description?: LocalizedValue;
    children?: MindMapNode[];
    color?: string;
  };

  const label = raw.label || raw.id || 'Concept';
  const id = raw.id || slugify(textOf(label, false, 'concept'));

  return {
    ...(source as unknown as Record<string, unknown>),
    id,
    label,
    description: raw.description,
    color: raw.color,
    children: raw.children?.map(sourceToRichNode),
  } as RichMindMapNode;
}

function enrichNode(source: MindMapNode, depth = 0): RichMindMapNode {
  const node = sourceToRichNode(source);
  const ownChildren = node.children || [];

  if (ownChildren.length > 0) {
    node.children = ownChildren.map((child) => {
      const childAsSource = child as unknown as MindMapNode;
      return enrichNode(childAsSource, depth + 1);
    });
    return node;
  }

  if (depth >= 1) {
    const englishLabel = textOf(node.label, false, '').toLowerCase();
    const knownKey = Object.keys(KNOWN_EXPANSIONS).find((key) => englishLabel.includes(key));
    node.children = knownKey ? KNOWN_EXPANSIONS[knownKey] : genericExpansion(node);
  }

  return node;
}

function countNodes(node: RichMindMapNode): number {
  return 1 + (node.children || []).reduce((sum, child) => sum + countNodes(child), 0);
}

function findPath(node: RichMindMapNode, matcher: string, isArabic: boolean): RichMindMapNode[] | null {
  const label = textOf(node.label, isArabic, '').toLowerCase();
  const description = textOf(node.description, isArabic, '').toLowerCase();

  if (label.includes(matcher) || description.includes(matcher)) return [node];

  for (const child of node.children || []) {
    const childPath = findPath(child, matcher, isArabic);
    if (childPath) return [node, ...childPath];
  }

  return null;
}

function buildRoot(mode: MindMapMode, rawNodes: MindMapNode[]): RichMindMapNode {
  return {
    id: `mindmap-root-${mode}`,
    label: mode === 'pmbok7' ? 'PMP Knowledge Map' : 'Exam Content Outline Map',
    description: mode === 'pmbok7' ? 'Current-exam framework map' : 'Exam Content Outline Map',
    children: rawNodes.map((node) => enrichNode(node)),
  };
}

function localSections(node: RichMindMapNode, mode: MindMapMode, isArabic: boolean) {
  const title = cleanText(textOf(node.label, isArabic, 'Selected concept'));
  const description = cleanText(textOf(node.description, isArabic, ''));

  if (isArabic) {
    return [
      {
        title: 'Short intro',
        body: `${title} هو مفهوم داخل ${mode === 'pmbok7' ? 'خريطة مجالات الأداء في PMBOK 7' : 'خريطة مهام ECO 2021'}. ${description || 'يساعد المتعلم على رؤية العلاقة بين المفهوم والحكم المهني المطلوب في اختبار PMP.'}`,
      },
      {
        title: 'Advanced Analysis',
        body: `في اختبار PMP، لا يكفي حفظ تعريف ${title}. المطلوب هو فهم متى يُستخدم المفهوم، وما القرار المهني الأنسب عندما تتغير المعطيات، وكيف يحافظ مدير المشروع على القيمة والثقة والحوكمة دون ردود فعل متسرعة.`,
      },
      {
        title: 'Additional Frameworks & Models',
        body: `اربط هذا المفهوم بعقلية PMI، وإدارة أصحاب المصلحة، والتواصل، وإدارة المخاطر، والتكييف حسب البيئة التنبؤية أو الرشيقة أو الهجينة. الأسئلة القوية تختبر القدرة على اختيار التصرف الأنسب وليس تكرار المصطلحات.`,
      },
    ];
  }

  return [
    {
      title: 'Short intro',
      body: `${title} is a concept inside the ${mode === 'pmbok7' ? 'PMBOK 7 performance-domain map' : 'ECO 2021 task map'}. ${description || 'It helps the learner connect the topic to the professional judgment expected in PMP exam scenarios.'}`,
    },
    {
      title: 'Advanced Analysis',
      body: `For PMP preparation, ${title} should not be treated as a memorized term. The real exam value is knowing when it applies, what decision signals appear in the scenario, and how a project manager protects value, trust, governance, and team performance without jumping to a reactive answer.`,
    },
    {
      title: 'Additional Frameworks & Models',
      body: `Connect this concept with the PMI mindset, stakeholder engagement, communication discipline, risk thinking, and tailoring across predictive, agile, and hybrid environments. Strong exam questions test judgment and sequencing, not isolated terminology.`,
    },
  ];
}

function isMostlyLatinText(value: string) {
  const latinMatches = value.match(/[A-Za-z]{3,}/g) || [];
  const arabicMatches = value.match(/[\u0600-\u06FF]{2,}/g) || [];

  return latinMatches.length >= 8 && latinMatches.length > arabicMatches.length * 2;
}

function sanitizeAiText(raw: string) {
  return raw
    .replace(/I notice that the HEADING and CONTENT fields[\s\S]*?identified\./gi, '')
    .replace(/HEADING and CONTENT fields are listed as "?undefined"?/gi, '')
    .replace(/\bundefined\b/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function RenderText({ text, isArabic }: { text: string; isArabic: boolean }) {
  return (
    <div className={`space-y-2 text-sm leading-7 text-gray-700 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {text.split('\n').filter(Boolean).map((line, index) => {
        const clean = line.replace(/^#+\s*/, '').trim();
        if (!clean) return null;

        if (line.startsWith('#') || /^(Short intro|Advanced Analysis|Additional Frameworks|AiTutorZ|PMPeco|Zane)/i.test(clean)) {
          return <h4 key={index} className="pt-2 text-sm font-bold text-[#2b2b2f]">{clean}</h4>;
        }

        if (/^[-•]/.test(clean)) {
          return <p key={index} className="pl-3">{clean.replace(/^[-•]\s*/, '• ')}</p>;
        }

        return <p key={index}>{clean}</p>;
      })}
    </div>
  );
}

function ExplanationPanel({
  selectedNode,
  mode,
  isArabic,
}: {
  selectedNode: RichMindMapNode | null;
  mode: MindMapMode;
  isArabic: boolean;
}) {
  const [aiContent, setAiContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);

  const sections = useMemo(
    () => (selectedNode ? localSections(selectedNode, mode, isArabic) : []),
    [selectedNode, mode, isArabic]
  );

  useEffect(() => {
    if (!selectedNode) return;

    const node = selectedNode;
    let active = true;
    const heading = cleanText(textOf(node.label, isArabic, 'PMP concept'));
    const description = cleanText(textOf(node.description, isArabic, heading));
    const frameworkLabel = mode === 'pmbok7' ? 'PMBOK 7 / ECO 2021 current exam context' : 'ECO 2021 exam task context';

    async function loadExplanation() {
      setIsLoading(true);
      setAiContent('');
      setFollowUpContent('');

      try {
        const res = await fetch('/api/deeper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            heading,
            content: [
              `MindMap topic: ${heading}`,
              `Description: ${description}`,
              `Framework: ${frameworkLabel}`,
              'Write a learner-facing PMP explanation. Do not mention missing fields, undefined values, implementation details, JSON, or database fields.',
              'Use these sections: Short intro, Advanced Analysis, Additional Frameworks & Models.',
            ].join('\n'),
            domain: node.id,
            framework: 'pmbok7',
            locale: isArabic ? 'ar' : 'en',
          }),
        });

        if (!res.ok) throw new Error(`Deeper API failed: ${res.status}`);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let acc = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });
            if (active) setAiContent(sanitizeAiText(acc));
          }
        } else {
          acc = await res.text();
          if (active) setAiContent(sanitizeAiText(acc));
        }
      } catch {
        if (active) setAiContent('');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadExplanation();

    return () => {
      active = false;
    };
  }, [selectedNode, mode, isArabic]);

  async function askFollowUp() {
    if (!selectedNode || !followUp.trim()) return;

    const question = followUp.trim();
    const heading = cleanText(textOf(selectedNode.label, isArabic, 'PMP concept'));

    setFollowUpLoading(true);
    setFollowUpContent('');

    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heading: `${heading} — follow-up`,
          content: `Context: ${heading}\nPrevious explanation: ${aiContent.slice(0, 900)}\nLearner question: ${question}\nAnswer as a PMP mentor. Do not mention undefined fields or implementation details.`,
          domain: selectedNode.id,
          framework: mode === 'pmbok7' ? 'pmbok7' : 'eco2021',
          locale: isArabic ? 'ar' : 'en',
        }),
      });

      if (!res.ok) throw new Error(`Follow-up failed: ${res.status}`);

      const raw = await res.text();
      setFollowUpContent(sanitizeAiText(raw));
      setFollowUp('');
    } catch {
      setFollowUpContent(isArabic ? 'تعذر توليد الإجابة الآن. حاول مرة أخرى.' : 'Could not generate the answer now. Please try again.');
    } finally {
      setFollowUpLoading(false);
    }
  }

  if (!selectedNode) {
    return (
      <aside className="rounded-[2rem] border border-[#eadff0] bg-white p-6 shadow-sm">
        <p className={`text-xs font-bold uppercase text-[#4b164c] ${isArabic ? 'tracking-normal' : 'tracking-[0.2em]'}`}>{translate('Zane Explanation', isArabic)}</p>
        <h2 className="mt-3 text-xl font-black text-[#2b2b2f]">{translate('Select a concept', isArabic)}</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f6472]">{translate('Choose any node in the map to see the intro, advanced analysis, and related frameworks.', isArabic)}</p>
      </aside>
    );
  }

  const title = cleanText(textOf(selectedNode.label, isArabic, 'Selected concept'));
  const description = cleanText(textOf(selectedNode.description, isArabic, ''));
  const safeAiContent = isArabic && isMostlyLatinText(aiContent) ? '' : aiContent;

  return (
    <aside className="rounded-[2rem] border border-[#eadff0] bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className={isArabic ? 'text-right' : 'text-left'}>
        <p className={`text-xs font-bold uppercase text-[#4b164c] ${isArabic ? 'tracking-normal' : 'tracking-[0.2em]'}`}>{translate('Zane Explanation', isArabic)}</p>
        <h2 className="mt-2 text-xl font-black text-[#2b2b2f]">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-[#5f6472]">{description}</p>}
      </div>

      <div className="mt-5 space-y-3">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-[#eadff0] bg-[#fbf9fc] p-4">
            <h3 className={`text-sm font-black text-[#2b2b2f] ${isArabic ? 'text-right' : 'text-left'}`}>
              {translate(section.title, isArabic)}
            </h3>
            <p className={`mt-2 text-sm leading-7 text-gray-700 ${isArabic ? 'text-right' : 'text-left'}`}>
              {section.body}
            </p>
          </section>
        ))}

        {(isLoading || safeAiContent) && (
          <section className="rounded-2xl border border-[#eadff0] bg-[#f4edf6] p-4">
            <h3 className={`text-sm font-black text-[#2b2b2f] ${isArabic ? 'text-right' : 'text-left'}`}>
              {translate('Zane Deep Dive', isArabic)}
            </h3>
            {isLoading && !safeAiContent && (
              <p className={`mt-3 text-sm text-[#4b164c] ${isArabic ? 'text-right' : 'text-left'}`}>
                {translate('Generating focused explanation...', isArabic)}
              </p>
            )}
            {safeAiContent && <div className="mt-3"><RenderText text={safeAiContent} isArabic={isArabic} /></div>}
          </section>
        )}

        <section className="rounded-2xl border border-[#eadff0] bg-white p-3">
          <div className="flex gap-2">
            <input
              value={followUp}
              onChange={(event) => setFollowUp(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') askFollowUp();
              }}
              placeholder={translate('Ask a follow-up question...', isArabic)}
              className={`min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#f5b400] ${isArabic ? 'text-right' : 'text-left'}`}
            />
            <button
              type="button"
              onClick={askFollowUp}
              disabled={!followUp.trim() || followUpLoading}
              className="rounded-xl bg-[#4b164c] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {followUpLoading ? '...' : translate('Ask', isArabic)}
            </button>
          </div>

          {followUpLoading && !followUpContent && (
            <p className={`mt-3 text-xs text-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}>{translate('Thinking...', isArabic)}</p>
          )}

          {followUpContent && (
            <div className="mt-4 rounded-xl bg-[#fbf9fc] p-3">
              <RenderText text={followUpContent} isArabic={isArabic} />
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

function NodePill({
  node,
  depth,
  isArabic,
  isSelected,
  isExpanded,
  onClick,
}: {
  node: RichMindMapNode;
  depth: number;
  isArabic: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const color = nodeColor(node, depth);
  const title = cleanText(textOf(node.label, isArabic, 'Concept'));
  const description = cleanText(textOf(node.description, isArabic, ''));
  const hasChildren = Boolean(node.children?.length);

  const widthClass = depth === 0 ? 'min-w-[230px]' : depth === 1 ? 'min-w-[245px]' : depth === 2 ? 'min-w-[230px]' : 'min-w-[210px]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group relative z-10 rounded-xl border bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
        widthClass,
        isSelected ? 'border-purple-400 ring-4 ring-purple-100' : 'border-gray-200',
      ].join(' ')}
      style={{ borderColor: isSelected ? color : undefined }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-start gap-3 ${isArabic ? 'text-right' : 'text-left'}`}>
        <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-[#2b2b2f]">{title}</span>
          {description && depth < 4 && (
            <span className="mt-1 block line-clamp-2 text-[11px] leading-5 text-[#5f6472]">{description}</span>
          )}
          <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a7c8d]">
            {translate(depth === 0 ? 'Domain / major branch' : depth === 1 ? 'Sub-branch' : depth === 2 ? 'Detail branch' : 'Leaf concept', isArabic)}
          </span>
        </span>
        {hasChildren && (
          <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs font-black text-[#5f6472]">
            {isExpanded ? '−' : '+'}
          </span>
        )}
      </div>
    </button>
  );
}

function MapBranch({
  node,
  depth = 0,
  expandedIds,
  selectedId,
  isArabic,
  onNodeClick,
}: {
  node: RichMindMapNode;
  depth?: number;
  expandedIds: Set<string>;
  selectedId?: string;
  isArabic: boolean;
  onNodeClick: (node: RichMindMapNode) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expandedIds.has(node.id);
  const color = nodeColor(node, depth);

  return (
    <div className="flex items-center gap-10">
      <NodePill
        node={node}
        depth={depth}
        isArabic={isArabic}
        isSelected={selectedId === node.id}
        isExpanded={isExpanded}
        onClick={() => onNodeClick(node)}
      />

      {hasChildren && isExpanded && (
        <div className="relative flex flex-col gap-4">
          {node.children!.map((child) => (
            <div key={child.id} className="relative flex items-center">
              <svg className="absolute -left-10 top-1/2 h-12 w-10 -translate-y-1/2 overflow-visible" aria-hidden="true">
                <path d="M0 24 C14 24 22 24 40 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity="0.45" />
              </svg>
              <MapBranch
                node={child}
                depth={depth + 1}
                expandedIds={expandedIds}
                selectedId={selectedId}
                isArabic={isArabic}
                onNodeClick={onNodeClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function findNodePathById(node: RichMindMapNode, id?: string): RichMindMapNode[] | null {
  if (!id) return null;
  if (node.id === id) return [node];

  for (const child of node.children || []) {
    const childPath = findNodePathById(child, id);
    if (childPath) return [node, ...childPath];
  }

  return null;
}

type FocusMapItem = {
  node: RichMindMapNode;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isOnPath: boolean;
};

function FocusMapBubble({
  item,
  isArabic,
  onSelect,
}: {
  item: FocusMapItem;
  isArabic: boolean;
  onSelect: (node: RichMindMapNode) => void;
}) {
  const title = cleanText(textOf(item.node.label, isArabic, 'Concept'));
  const color = nodeColor(item.node, item.depth);
  const hasChildren = Boolean(item.node.children?.length);

  const bg =
    item.isSelected
      ? '#fff7d6'
      : item.isOnPath
        ? '#f4edf6'
        : item.depth === 0
          ? '#f4edf6'
          : '#ffffff';

  const border =
    item.isSelected
      ? BRAND.plum
      : item.isOnPath
        ? 'rgba(75,22,76,0.35)'
        : BRAND.border;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.node)}
      className="absolute z-10 flex items-center gap-2 rounded-xl border px-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        backgroundColor: bg,
        borderColor: border,
        boxShadow: item.isSelected
          ? '0 16px 34px rgba(75,22,76,0.18), 0 0 0 4px rgba(245,180,0,0.18)'
          : '0 8px 18px rgba(43,43,47,0.06)',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: item.isSelected ? BRAND.amber : color }}
      />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-[13px] font-black leading-snug text-[#2b2b2f]">
          {title}
        </span>
      </span>
      {hasChildren && (
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
          style={{
            backgroundColor: item.isSelected ? BRAND.plum : BRAND.plumSoft,
            color: item.isSelected ? '#ffffff' : BRAND.plum,
          }}
        >
          <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>
            {isArabic ? '←' : '→'}
          </span>
        </span>
      )}
    </button>
  );
}

function FocusMapCanvas({
  root,
  selectedNode,
  isArabic,
  zoom,
  onSelect,
}: {
  root: RichMindMapNode;
  selectedNode: RichMindMapNode | null;
  isArabic: boolean;
  zoom: number;
  onSelect: (node: RichMindMapNode) => void;
}) {
  const selectedPath = selectedNode ? findNodePathById(root, selectedNode.id) || [root] : [root];
  const pathIds = new Set(selectedPath.map((node) => node.id));
  const selectedId = selectedNode?.id || root.id;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const columns: { parent: RichMindMapNode | null; nodes: RichMindMapNode[] }[] = [
    { parent: null, nodes: [root] },
  ];

  for (const parent of selectedPath) {
    if (parent.children?.length) {
      columns.push({ parent, nodes: parent.children });
    }
  }

  const maxColumns = 6;
  const visibleColumns = columns.slice(0, maxColumns);
  const columnWidths = [220, 300, 300, 285, 270, 255];
  const columnGap = 82;
  const baseCenterY = 350;

  const items: FocusMapItem[] = [];
  const byId = new Map<string, FocusMapItem>();

  let x = 34;
  let canvasHeight = 720;

  visibleColumns.forEach((column, depth) => {
    const width = columnWidths[depth] || 260;
    const height = depth === 0 ? 64 : 50;
    const gap = depth === 0 ? 0 : 22;
    const totalHeight = column.nodes.length * height + Math.max(0, column.nodes.length - 1) * gap;
    const startY = Math.max(42, baseCenterY - totalHeight / 2);

    column.nodes.forEach((node, index) => {
      const y = startY + index * (height + gap);
      const item: FocusMapItem = {
        node,
        depth,
        x,
        y,
        width,
        height,
        isSelected: node.id === selectedId,
        isOnPath: pathIds.has(node.id),
      };

      items.push(item);
      byId.set(node.id, item);
      canvasHeight = Math.max(canvasHeight, y + height + 90);
    });

    x += width + columnGap;
  });

  const connections: { from: FocusMapItem; to: FocusMapItem; strong: boolean; color: string }[] = [];

  visibleColumns.slice(1).forEach((column, index) => {
    const parent = column.parent;
    if (!parent) return;

    const from = byId.get(parent.id);
    if (!from) return;

    column.nodes.forEach((child) => {
      const to = byId.get(child.id);
      if (!to) return;

      connections.push({
        from,
        to,
        strong: from.isOnPath && to.isOnPath,
        color: nodeColor(parent, index),
      });
    });
  });

  const canvasWidth = Math.max(1180, x + 60);

  if (isArabic) {
    items.forEach((item) => {
      item.x = canvasWidth - item.x - item.width;
    });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollLeft = isArabic ? el.scrollWidth : 0;
    });
  }, [isArabic, selectedId, zoom]);

  return (
    <div
      ref={scrollRef}
      className="h-[calc(100vh-13rem)] min-h-[620px] overflow-auto bg-[radial-gradient(circle_at_1px_1px,rgba(75,22,76,0.08)_1px,transparent_0)] [background-size:28px_28px]"
      dir="ltr"
    >
      <div style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}>
        <div
          className="relative"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          <svg className="absolute inset-0 z-0" width={canvasWidth} height={canvasHeight} aria-hidden="true">
            {connections.map((connection) => {
              const fromX = isArabic ? connection.from.x : connection.from.x + connection.from.width;
              const fromY = connection.from.y + connection.from.height / 2;
              const toX = isArabic ? connection.to.x + connection.to.width : connection.to.x;
              const toY = connection.to.y + connection.to.height / 2;
              const curve = Math.max(50, Math.abs(toX - fromX) * 0.48);
              const d = isArabic
                ? `M ${fromX} ${fromY} C ${fromX - curve} ${fromY}, ${toX + curve} ${toY}, ${toX} ${toY}`
                : `M ${fromX} ${fromY} C ${fromX + curve} ${fromY}, ${toX - curve} ${toY}, ${toX} ${toY}`;

              return (
                <path
                  key={`${connection.from.node.id}-${connection.to.node.id}`}
                  d={d}
                  fill="none"
                  stroke={connection.strong ? BRAND.plum : connection.color}
                  strokeWidth={connection.strong ? 2.4 : 1.7}
                  strokeLinecap="round"
                  opacity={connection.strong ? 0.72 : 0.24}
                />
              );
            })}
          </svg>

          {items.map((item) => (
            <FocusMapBubble
              key={item.node.id}
              item={item}
              isArabic={isArabic}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MindMapClient() {
  const [mode, setMode] = useState<MindMapMode>('pmbok7');
  const { isArabic } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<RichMindMapNode | null>(null);
  const [zoom, setZoom] = useState(1);

  const rawData = mode === 'pmbok7' ? PMBOK7_DOMAINS : ECO_MINDMAP;

  const root = useMemo(() => buildRoot(mode, rawData), [mode, rawData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic')?.toLowerCase().trim();
    let nextSelected: RichMindMapNode | null = null;

    if (topic) {
      const path = findPath(root, topic, isArabic);
      if (path) {
        nextSelected = path[path.length - 1];
      }
    }

    if (!nextSelected) {
      const firstMajor = root.children?.[1] || root.children?.[0] || null;
      const firstSub = firstMajor?.children?.[0] || null;

      nextSelected = firstSub || firstMajor || root;
    }

    setSelectedNode(nextSelected);
  }, [root, mode, isArabic]);

  function handleNodeClick(node: RichMindMapNode) {
    setSelectedNode(node);
  }

  const nodeTotal = countNodes(root);

  return (
    <div className="min-h-screen bg-[#fbf9fc] p-4 md:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className={isArabic ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-black text-[#2b2b2f]">{translate('Mind Map Explorer', isArabic)}</h1>
          <p className="mt-1 text-sm text-[#5f6472]">
            {translate('Visualize and explore PMP knowledge as an expandable concept map.', isArabic)}
          </p>
          <p className="mt-1 text-xs text-gray-400">{nodeTotal} concepts · {translate('Click any node to expand the map and open the Zane explanation panel.', isArabic)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'pmbok7' as MindMapMode, label: 'PMBOK 7 Domains' },
            { id: 'eco2021' as MindMapMode, label: 'ECO 2021 Tasks' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={[
                'rounded-2xl border px-4 py-2 text-sm font-bold transition',
                mode === item.id
                  ? 'border-[#4b164c] bg-[#4b164c] text-white shadow-sm'
                  : 'border-[#eadff0] bg-white text-[#5f6472] hover:border-[#f5b400] hover:text-[#4b164c]',
              ].join(' ')}
            >
              {translate(item.label, isArabic)}
            </button>
          ))}

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 hover:border-purple-200 hover:text-[#4b164c]"
          >
            {translate('Export PDF', isArabic)}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/90 p-1 shadow-sm backdrop-blur">
            <button type="button" onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.1).toFixed(1))))} className="h-8 w-8 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-100">−</button>
            <span className="w-12 text-center text-xs font-black text-[#5f6472]">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))} className="h-8 w-8 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-100">+</button>
            <button type="button" onClick={() => setZoom(1)} className="rounded-xl px-3 py-2 text-xs font-black text-gray-600 hover:bg-gray-100">{translate('Reset', isArabic)}</button>
          </div>

          <FocusMapCanvas
            root={root}
            selectedNode={selectedNode}
            isArabic={isArabic}
            zoom={zoom}
            onSelect={handleNodeClick}
          />
        </section>

        <ExplanationPanel selectedNode={selectedNode} mode={mode} isArabic={isArabic} />
      </div>
    </div>
  );
}
