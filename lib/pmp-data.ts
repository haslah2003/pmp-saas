// =============================================================================
// PMP Expert Tutor — PMBOK 7 & ECO 2021 Reference Data
// LOCKED SOURCES: PMBOK 7th Edition + ECO 2021 ONLY
// =============================================================================

import type { MindMapNode, QuizQuestion } from '@/types';

export interface ECOTask {
  id: string;
  domain: 'people' | 'process' | 'business-environment';
  task_number: number;
  title: string;
  enablers: string[];
}

// ── PMBOK 7 Performance Domains ─────────────────────────────────────────────
export const PMBOK7_DOMAINS: MindMapNode[] = [
  {
    id: 'stakeholders',
    label: 'Stakeholder Performance Domain',
    description: 'Activities and functions associated with stakeholders',
    color: '#2563EB',
    icon: 'Users',
    children: [
      { id: 'stk-engage', label: 'Stakeholder Engagement', description: 'Identify, understand, analyze, prioritize, and engage stakeholders' },
      { id: 'stk-comm', label: 'Communication', description: 'Effective information exchange with stakeholders' },
      { id: 'stk-relationships', label: 'Relationships', description: 'Building productive working relationships' },
    ],
  },
  {
    id: 'team',
    label: 'Team Performance Domain',
    description: 'Activities and functions associated with the project team',
    color: '#7C3AED',
    icon: 'UserCheck',
    children: [
      { id: 'team-mgmt', label: 'Project Team Management', description: 'Establishing team culture, high-performing teams' },
      { id: 'team-leadership', label: 'Leadership Skills', description: 'Servant leadership, emotional intelligence' },
      { id: 'team-dev', label: 'Team Development', description: 'Growing team capabilities and managing conflict' },
    ],
  },
  {
    id: 'development-approach',
    label: 'Development Approach & Life Cycle',
    description: 'Development approach, cadence, and life cycle phases',
    color: '#059669',
    icon: 'GitBranch',
    children: [
      { id: 'dev-approach', label: 'Development Approaches', description: 'Predictive, adaptive, hybrid approaches' },
      { id: 'dev-cadence', label: 'Delivery Cadence', description: 'Single delivery, multiple deliveries, periodic' },
      { id: 'dev-lifecycle', label: 'Life Cycle Phases', description: 'Feasibility, design, build, test, deploy, close' },
    ],
  },
  {
    id: 'planning',
    label: 'Planning Performance Domain',
    description: 'Activities and functions associated with planning',
    color: '#D97706',
    icon: 'ClipboardList',
    children: [
      { id: 'plan-est', label: 'Estimating', description: 'Effort, duration, cost, and resource estimating' },
      { id: 'plan-schedule', label: 'Scheduling', description: 'Developing and managing the project schedule' },
      { id: 'plan-budget', label: 'Budget', description: 'Establishing and managing the project budget' },
      { id: 'plan-scope', label: 'Scope Planning', description: 'Defining and managing project and product scope' },
    ],
  },
  {
    id: 'project-work',
    label: 'Project Work Performance Domain',
    description: 'Activities and functions associated with project processes and work',
    color: '#DC2626',
    icon: 'Wrench',
    children: [
      { id: 'pw-process', label: 'Project Processes', description: 'Establish processes to manage work' },
      { id: 'pw-physical', label: 'Physical Resources', description: 'Manage materials, equipment, supplies' },
      { id: 'pw-procurement', label: 'Procurement', description: 'Acquire resources from external sources' },
      { id: 'pw-knowledge', label: 'Knowledge Management', description: 'Manage tacit and explicit knowledge' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery Performance Domain',
    description: 'Activities and functions associated with delivering project value',
    color: '#0891B2',
    icon: 'PackageCheck',
    children: [
      { id: 'del-value', label: 'Value Delivery', description: 'Delivering business value throughout the project' },
      { id: 'del-quality', label: 'Quality', description: 'Meeting acceptance criteria and quality standards' },
      { id: 'del-scope', label: 'Scope Management', description: 'Managing deliverables, requirements, completion' },
    ],
  },
  {
    id: 'measurement',
    label: 'Measurement Performance Domain',
    description: 'Activities and functions associated with performance measurement',
    color: '#9333EA',
    icon: 'BarChart3',
    children: [
      { id: 'meas-kpi', label: 'KPIs & Metrics', description: 'Establishing performance measures' },
      { id: 'meas-evm', label: 'Earned Value Management', description: 'EVM concepts: PV, EV, AC, SPI, CPI' },
      { id: 'meas-dashboard', label: 'Dashboards & Reporting', description: 'Information radiators, status reports' },
    ],
  },
  {
    id: 'uncertainty',
    label: 'Uncertainty Performance Domain',
    description: 'Activities and functions associated with risk and uncertainty',
    color: '#E11D48',
    icon: 'AlertTriangle',
    children: [
      { id: 'unc-risk', label: 'Risk Management', description: 'Identify, analyze, plan, implement, monitor risks' },
      { id: 'unc-ambiguity', label: 'Ambiguity', description: 'Managing ambiguity with prototyping, experiments' },
      { id: 'unc-complexity', label: 'Complexity', description: 'Navigating project complexity and emergence' },
    ],
  },
];

// ── PMBOK 7 Principles ──────────────────────────────────────────────────────
export const PMBOK7_PRINCIPLES = [
  { id: 'P1', title: 'Be a Diligent, Respectful, and Caring Steward', domain: 'all' },
  { id: 'P2', title: 'Create a Collaborative Project Team Environment', domain: 'team' },
  { id: 'P3', title: 'Effectively Engage with Stakeholders', domain: 'stakeholders' },
  { id: 'P4', title: 'Focus on Value', domain: 'delivery' },
  { id: 'P5', title: 'Recognize, Evaluate, and Respond to System Interactions', domain: 'all' },
  { id: 'P6', title: 'Demonstrate Leadership Behaviors', domain: 'team' },
  { id: 'P7', title: 'Tailor Based on Context', domain: 'development-approach' },
  { id: 'P8', title: 'Build Quality into Processes and Deliverables', domain: 'delivery' },
  { id: 'P9', title: 'Navigate Complexity', domain: 'uncertainty' },
  { id: 'P10', title: 'Optimize Risk Responses', domain: 'uncertainty' },
  { id: 'P11', title: 'Embrace Adaptability and Resiliency', domain: 'all' },
  { id: 'P12', title: 'Enable Change to Achieve the Envisioned Future State', domain: 'all' },
];

// ── ECO 2021 Tasks ──────────────────────────────────────────────────────────
export const ECO_TASKS: ECOTask[] = [
  // People Domain (42%)
  { id: 'ECO-PPL-T1', domain: 'people', task_number: 1, title: 'Manage conflict', enablers: ['Interpret the source and stage of the conflict', 'Analyze the context for the conflict', 'Evaluate/recommend/reconcile the appropriate conflict resolution solution'] },
  { id: 'ECO-PPL-T2', domain: 'people', task_number: 2, title: 'Lead a team', enablers: ['Set a clear vision and mission', 'Support diversity and inclusion', 'Value servant leadership', 'Determine an appropriate leadership style'] },
  { id: 'ECO-PPL-T3', domain: 'people', task_number: 3, title: 'Support team performance', enablers: ['Appraise team member performance against KPIs', 'Support and recognize team member growth and development', 'Determine appropriate feedback approach'] },
  { id: 'ECO-PPL-T4', domain: 'people', task_number: 4, title: 'Empower team members and stakeholders', enablers: ['Organize around team strengths', 'Support team task accountability', 'Evaluate demonstration of task accountability'] },
  { id: 'ECO-PPL-T5', domain: 'people', task_number: 5, title: 'Ensure team members/stakeholders are adequately trained', enablers: ['Determine required competencies and elements of training', 'Determine training options based on needs', 'Allocate resources for training'] },
  { id: 'ECO-PPL-T6', domain: 'people', task_number: 6, title: 'Build a team', enablers: ['Appraise stakeholder skills', 'Deduce project resource requirements', 'Continuously assess and refresh team skills'] },
  { id: 'ECO-PPL-T7', domain: 'people', task_number: 7, title: 'Address and remove impediments, obstacles, and blockers', enablers: ['Determine critical impediments', 'Prioritize impediments', 'Use a network to implement solutions'] },
  { id: 'ECO-PPL-T8', domain: 'people', task_number: 8, title: 'Negotiate project agreements', enablers: ['Analyze the bounds of the negotiations', 'Assess priorities for all parties', 'Verify objectives of the agreement are met'] },
  { id: 'ECO-PPL-T9', domain: 'people', task_number: 9, title: 'Collaborate with stakeholders', enablers: ['Evaluate engagement needs', 'Optimize alignment between stakeholder needs', 'Build trust and influence stakeholders'] },
  { id: 'ECO-PPL-T10', domain: 'people', task_number: 10, title: 'Build shared understanding', enablers: ['Break down situation to identify root cause', 'Survey all necessary parties to reach consensus', 'Support outcome of agreement'] },
  { id: 'ECO-PPL-T11', domain: 'people', task_number: 11, title: 'Engage and support virtual teams', enablers: ['Examine virtual team member needs', 'Investigate alternatives for virtual team engagement', 'Implement options for virtual team engagement'] },
  { id: 'ECO-PPL-T12', domain: 'people', task_number: 12, title: 'Define team ground rules', enablers: ['Communicate organizational principles with team', 'Establish an environment that fosters adherence', 'Manage and rectify ground rule violations'] },
  { id: 'ECO-PPL-T13', domain: 'people', task_number: 13, title: 'Mentor relevant stakeholders', enablers: ['Allocate time to mentoring', 'Recognize and act on mentoring opportunities'] },
  { id: 'ECO-PPL-T14', domain: 'people', task_number: 14, title: 'Promote team performance through application of emotional intelligence', enablers: ['Assess behavior through EI indicators', 'Recognize, regulate, and manage potential issues'] },

  // Process Domain (50%)
  { id: 'ECO-PRC-T1', domain: 'process', task_number: 1, title: 'Execute project with urgency to deliver business value', enablers: ['Assess opportunities to deliver value incrementally', 'Examine the business value throughout the project', 'Support the team to subdivide tasks for MVP'] },
  { id: 'ECO-PRC-T2', domain: 'process', task_number: 2, title: 'Manage communications', enablers: ['Analyze communication needs', 'Determine communication methods', 'Monitor effectiveness of communications'] },
  { id: 'ECO-PRC-T3', domain: 'process', task_number: 3, title: 'Assess and manage risks', enablers: ['Determine risk management options', 'Iteratively assess and prioritize risks'] },
  { id: 'ECO-PRC-T4', domain: 'process', task_number: 4, title: 'Engage stakeholders', enablers: ['Analyze stakeholders', 'Categorize stakeholders', 'Engage stakeholders by category'] },
  { id: 'ECO-PRC-T5', domain: 'process', task_number: 5, title: 'Plan and manage budget and resources', enablers: ['Estimate budgetary needs', 'Anticipate future budget challenges', 'Monitor budget variations'] },
  { id: 'ECO-PRC-T6', domain: 'process', task_number: 6, title: 'Plan and manage schedule', enablers: ['Estimate project tasks', 'Utilize benchmarks and historical data', 'Prepare schedule based on methodology'] },
  { id: 'ECO-PRC-T7', domain: 'process', task_number: 7, title: 'Plan and manage quality of products/deliverables', enablers: ['Determine quality standard', 'Recommend options for improvement', 'Continually survey project deliverable quality'] },
  { id: 'ECO-PRC-T8', domain: 'process', task_number: 8, title: 'Plan and manage scope', enablers: ['Determine and prioritize requirements', 'Break down scope', 'Monitor and validate scope'] },
  { id: 'ECO-PRC-T9', domain: 'process', task_number: 9, title: 'Integrate project planning activities', enablers: ['Consolidate project plans', 'Assess consolidated plans for dependencies', 'Analyze data to inform project'] },
  { id: 'ECO-PRC-T10', domain: 'process', task_number: 10, title: 'Manage project changes', enablers: ['Anticipate and embrace the need for change', 'Determine strategy to handle change', 'Execute change management strategy'] },
  { id: 'ECO-PRC-T11', domain: 'process', task_number: 11, title: 'Plan and manage procurement', enablers: ['Define resource requirements and needs', 'Communicate resource requirements', 'Manage suppliers/contracts'] },
  { id: 'ECO-PRC-T12', domain: 'process', task_number: 12, title: 'Manage project artifacts', enablers: ['Determine requirements for managing artifacts', 'Validate the information is current', 'Make determinations on artifact updates'] },
  { id: 'ECO-PRC-T13', domain: 'process', task_number: 13, title: 'Determine appropriate project methodology/methods and practices', enablers: ['Assess project needs', 'Recommend project execution strategy', 'Recommend methodology based on requirements'] },
  { id: 'ECO-PRC-T14', domain: 'process', task_number: 14, title: 'Establish project governance structure', enablers: ['Determine appropriate governance for a project', 'Define escalation paths and thresholds'] },
  { id: 'ECO-PRC-T15', domain: 'process', task_number: 15, title: 'Manage project issues', enablers: ['Recognize when a risk becomes an issue', 'Attack the issue with the optimal action', 'Collaborate with relevant stakeholders'] },
  { id: 'ECO-PRC-T16', domain: 'process', task_number: 16, title: 'Ensure knowledge transfer for project continuity', enablers: ['Discuss project responsibilities within the team', 'Outline expectations for working environment', 'Confirm approach for knowledge transfer'] },
  { id: 'ECO-PRC-T17', domain: 'process', task_number: 17, title: 'Plan and manage project/phase closure', enablers: ['Determine criteria to close the project', 'Validate readiness for transition', 'Conclude activities to close out the project'] },

  // Business Environment Domain (8%)
  { id: 'ECO-BIZ-T1', domain: 'business-environment', task_number: 1, title: 'Plan and manage project compliance', enablers: ['Confirm compliance requirements', 'Classify compliance categories', 'Determine potential threats to compliance'] },
  { id: 'ECO-BIZ-T2', domain: 'business-environment', task_number: 2, title: 'Evaluate and deliver project benefits and value', enablers: ['Investigate benefits ownership', 'Document agreement on benefits ownership', 'Verify measurement system is in place'] },
  { id: 'ECO-BIZ-T3', domain: 'business-environment', task_number: 3, title: 'Evaluate and address external environment changes', enablers: ['Survey changes to external environment', 'Assess and prioritize impact on scope/backlog', 'Recommend options for changes'] },
  { id: 'ECO-BIZ-T4', domain: 'business-environment', task_number: 4, title: 'Support organizational change', enablers: ['Assess organizational culture', 'Evaluate impact of organizational change', 'Evaluate impact of the project on the organization'] },
];

// ── ECO Mind Map Structure ──────────────────────────────────────────────────
export const ECO_MINDMAP: MindMapNode[] = [
  {
    id: 'eco-people',
    label: 'People (42%)',
    description: '14 tasks focused on leading and managing project teams',
    color: '#2563EB',
    icon: 'Users',
    children: ECO_TASKS.filter(t => t.domain === 'people').map(t => ({
      id: t.id,
      label: `Task ${t.task_number}: ${t.title}`,
      description: t.enablers.join(' • '),
      children: t.enablers.map((e, i) => ({ id: `${t.id}-e${i}`, label: e })),
    })),
  },
  {
    id: 'eco-process',
    label: 'Process (50%)',
    description: '17 tasks covering project execution and management',
    color: '#059669',
    icon: 'Settings',
    children: ECO_TASKS.filter(t => t.domain === 'process').map(t => ({
      id: t.id,
      label: `Task ${t.task_number}: ${t.title}`,
      description: t.enablers.join(' • '),
      children: t.enablers.map((e, i) => ({ id: `${t.id}-e${i}`, label: e })),
    })),
  },
  {
    id: 'eco-biz',
    label: 'Business Environment (8%)',
    description: '4 tasks on organizational and external factors',
    color: '#D97706',
    icon: 'Building',
    children: ECO_TASKS.filter(t => t.domain === 'business-environment').map(t => ({
      id: t.id,
      label: `Task ${t.task_number}: ${t.title}`,
      description: t.enablers.join(' • '),
      children: t.enablers.map((e, i) => ({ id: `${t.id}-e${i}`, label: e })),
    })),
  },
];

// ── Sample Quiz Questions (PMBOK 7 + ECO 2021 aligned) ─────────────────────
export const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    stem: 'A project manager notices two team members are in disagreement about the technical approach. What should the PM do FIRST?',
    options: [
      { key: 'A', text: 'Escalate the issue to the project sponsor' },
      { key: 'B', text: 'Assess the source and stage of the conflict' },
      { key: 'C', text: 'Remove the team members from the project' },
      { key: 'D', text: 'Document the disagreement in the issue log' },
    ],
    correct_key: 'B',
    explanation: 'Per ECO Task People-T1 (Manage Conflict), the first step is to interpret the source and stage of the conflict before taking action. This aligns with PMBOK 7 Team Performance Domain.',
    domain: 'people',
    source: 'eco2021',
    difficulty: 'medium',
  },
  {
    id: 'q2',
    stem: 'Which PMBOK 7 principle emphasizes the need for project managers to act with integrity and care for stakeholder and organizational interests?',
    options: [
      { key: 'A', text: 'Focus on Value' },
      { key: 'B', text: 'Be a Diligent, Respectful, and Caring Steward' },
      { key: 'C', text: 'Navigate Complexity' },
      { key: 'D', text: 'Embrace Adaptability and Resiliency' },
    ],
    correct_key: 'B',
    explanation: 'PMBOK 7 Principle #1: Stewardship involves acting with integrity, care, trustworthiness, and compliance while being a responsible steward of organizational resources.',
    domain: 'stakeholders',
    source: 'pmbok7',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    stem: 'A project team is working on a complex product with unclear requirements. The sponsor wants frequent feedback. Which development approach is MOST appropriate?',
    options: [
      { key: 'A', text: 'Predictive with detailed planning upfront' },
      { key: 'B', text: 'Adaptive with iterative increments' },
      { key: 'C', text: 'Hybrid with predictive governance and adaptive execution' },
      { key: 'D', text: 'Rolling wave planning with predictive milestones' },
    ],
    correct_key: 'B',
    explanation: 'When requirements are unclear and frequent feedback is needed, an adaptive approach with iterative increments is most suitable (PMBOK 7 Development Approach & Life Cycle domain).',
    domain: 'development-approach',
    source: 'pmbok7',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    stem: 'During sprint planning, the team identifies that a new government regulation may impact the product. What should the project manager do?',
    options: [
      { key: 'A', text: 'Ignore it until the regulation is formally enacted' },
      { key: 'B', text: 'Add it to the risk register and assess the impact' },
      { key: 'C', text: 'Halt the project until regulatory clarity is achieved' },
      { key: 'D', text: 'Delegate the assessment to the legal department only' },
    ],
    correct_key: 'B',
    explanation: 'Per ECO Business Environment-T3 and PMBOK 7 Uncertainty domain, external environment changes should be surveyed, their impact assessed and prioritized, and recommendations made.',
    domain: 'business-environment',
    source: 'eco2021',
    difficulty: 'medium',
  },
  {
    id: 'q5',
    stem: 'A project\'s CPI is 0.85 and SPI is 1.1. What does this indicate?',
    options: [
      { key: 'A', text: 'The project is under budget and ahead of schedule' },
      { key: 'B', text: 'The project is over budget but ahead of schedule' },
      { key: 'C', text: 'The project is under budget but behind schedule' },
      { key: 'D', text: 'The project is over budget and behind schedule' },
    ],
    correct_key: 'B',
    explanation: 'CPI < 1.0 means over budget (spending more per unit of work). SPI > 1.0 means ahead of schedule (completing work faster than planned). This is from the PMBOK 7 Measurement Performance Domain.',
    domain: 'measurement',
    source: 'pmbok7',
    difficulty: 'hard',
  },
];

// ── Course Modules ──────────────────────────────────────────────────────────
export const COURSE_MODULES: { id: string; title: string; domain: string; lessons: number; hours: number; description: string }[] = [
  { id: 'mod-1', title: 'Project Management Foundations', domain: 'all', lessons: 8, hours: 3, description: 'PMBOK 7 principles, value delivery systems, and project management concepts' },
  { id: 'mod-2', title: 'Stakeholder Performance Domain', domain: 'stakeholders', lessons: 6, hours: 2.5, description: 'Stakeholder identification, engagement, and communication strategies' },
  { id: 'mod-3', title: 'Team Performance Domain', domain: 'team', lessons: 7, hours: 3, description: 'Team building, leadership, servant leadership, and conflict management' },
  { id: 'mod-4', title: 'Development Approach & Life Cycle', domain: 'development-approach', lessons: 5, hours: 2, description: 'Predictive, adaptive, hybrid approaches and delivery cadence' },
  { id: 'mod-5', title: 'Planning Performance Domain', domain: 'planning', lessons: 8, hours: 3.5, description: 'Scope, schedule, cost, resource, and quality planning' },
  { id: 'mod-6', title: 'Project Work & Delivery', domain: 'project-work', lessons: 7, hours: 3, description: 'Executing project work, procurement, knowledge management, quality delivery' },
  { id: 'mod-7', title: 'Measurement Performance Domain', domain: 'measurement', lessons: 6, hours: 2.5, description: 'KPIs, EVM, forecasting, dashboards, and reporting' },
  { id: 'mod-8', title: 'Uncertainty Performance Domain', domain: 'uncertainty', lessons: 5, hours: 2, description: 'Risk management, ambiguity, complexity, and resilience' },
  { id: 'mod-9', title: 'ECO People Domain Deep Dive', domain: 'people', lessons: 10, hours: 4, description: 'All 14 ECO People tasks with enablers and situational practice' },
  { id: 'mod-10', title: 'ECO Process Domain Deep Dive', domain: 'process', lessons: 12, hours: 5, description: 'All 17 ECO Process tasks with enablers and scenario-based learning' },
  { id: 'mod-11', title: 'ECO Business Environment', domain: 'business-environment', lessons: 4, hours: 1.5, description: 'Compliance, benefits, external changes, organizational change' },
  { id: 'mod-12', title: 'Mock Exam Preparation', domain: 'all', lessons: 5, hours: 4, description: 'Exam strategy, time management, question decoding techniques' },
];
