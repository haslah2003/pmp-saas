export interface KeyConcept {
  term: string
  definition: string
}

export interface DeepDiveSection {
  heading: string
  content: string
}

export interface Lesson {
  slug: string
  title: string
  estimatedMinutes: number
  overview: string
  keyConcepts: KeyConcept[]
  deepDive: DeepDiveSection[]
  examTips: string[]
  ritaInsight: string
  commonPitfalls: string[]
}

export interface Course {
  slug: string
  title: string
  shortTitle: string
  icon: string
  gradient: string
  lightBg: string
  borderColor: string
  textColor: string
  badgeColor: string
  description: string
  ecoMapping: string
  lessons: Lesson[]
}

export const COURSES: Course[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. STAKEHOLDERS
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'stakeholders',
    title: 'Stakeholder Performance Domain',
    shortTitle: 'Stakeholders',
    icon: '🤝',
    gradient: 'from-blue-500 to-blue-700',
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: 'Master stakeholder identification, analysis, and engagement strategies to ensure project success and maintain strong relationships throughout the project life cycle.',
    ecoMapping: 'People Domain (42%)',
    lessons: [
      {
        slug: 'identifying-stakeholders',
        title: 'Identifying & Analyzing Stakeholders',
        estimatedMinutes: 20,
        overview: 'Effective stakeholder identification is the single most critical foundation for project success. On the PMP exam, questions will test your ability to identify ALL stakeholders — not just obvious ones — and understand how to analyze their power, interest, influence, and impact on the project.',
        keyConcepts: [
          { term: 'Stakeholder', definition: 'Any individual, group, or organization that may affect, be affected by, or perceive itself to be affected by a decision, activity, or outcome of a project.' },
          { term: 'Power/Interest Grid', definition: 'A tool used to classify stakeholders based on their level of authority (power) and concern (interest) for the project outcome. Determines engagement strategy.' },
          { term: 'Salience Model', definition: 'Classifies stakeholders by power, urgency, and legitimacy. Used for complex projects with many competing stakeholders.' },
          { term: 'Stakeholder Register', definition: 'A project document containing information about identified stakeholders including their classification, assessment, and engagement strategy.' },
          { term: 'Stakeholder Engagement Assessment Matrix', definition: 'Compares current and desired engagement levels (Unaware → Resistant → Neutral → Supportive → Leading) for each stakeholder.' },
        ],
        deepDive: [
          {
            heading: 'When to Identify Stakeholders',
            content: 'Stakeholder identification begins during project initiation and is a continuous activity. The PMP exam frequently tests that stakeholders must be identified early and continuously throughout the project. Missing a key stakeholder late in the project is a common and costly mistake. Always re-identify stakeholders when scope changes, new phases begin, or project circumstances shift.',
          },
          {
            heading: 'Stakeholder Analysis Techniques',
            content: 'The most tested techniques include: (1) Power/Interest Grid — place stakeholders in quadrants to determine strategy (High Power/High Interest = Manage Closely). (2) Stakeholder Cube — extends the grid with a third dimension. (3) Salience Model — for large programs with many stakeholders. (4) Mind Mapping — visually connects stakeholder relationships. Always document analysis results in the Stakeholder Register.',
          },
          {
            heading: 'Agile vs Predictive Approach',
            content: 'In agile environments, the product owner represents stakeholders and prioritizes the backlog. Stakeholder engagement is continuous, not periodic. The PMP exam increasingly tests agile stakeholder practices including sprint reviews as stakeholder engagement events, and the importance of frequent feedback loops over formal reporting.',
          },
        ],
        examTips: [
          'Always identify stakeholders as early as possible — the exam rewards early engagement.',
          'Remember: negative stakeholders (those who see the project as harmful) must still be managed, not ignored.',
          'The Power/Interest Grid is the most commonly tested analysis tool — know all four quadrants and their strategies.',
          'If asked what to do when you discover a new stakeholder mid-project, the answer is always: analyze and engage them immediately.',
          'Stakeholder identification is an iterative process — it never truly ends.',
        ],
        ritaInsight: 'Rita Mulcahy emphasizes: "The project manager must find ALL stakeholders, including those who are negative." She stresses that many PMs only focus on positive stakeholders, which is a critical mistake. On the exam, if you have to choose between engaging a resistant stakeholder vs. ignoring them, always choose engagement.',
        commonPitfalls: [
          'Assuming identification is a one-time activity done during initiation only.',
          'Overlooking internal stakeholders such as the PMO, functional managers, and operations teams.',
          'Confusing the Stakeholder Register (a project document) with the Stakeholder Engagement Plan (a component of the project management plan).',
        ],
      },
      {
        slug: 'engagement-strategies',
        title: 'Stakeholder Engagement Strategies',
        estimatedMinutes: 18,
        overview: 'Knowing who your stakeholders are is only half the battle — the PMP exam heavily tests HOW to engage them. This lesson covers the strategies, communication approaches, and engagement levels that ensure stakeholders remain supportive and aligned throughout the project.',
        keyConcepts: [
          { term: 'Engagement Level', definition: 'The five levels of stakeholder engagement: Unaware, Resistant, Neutral, Supportive, and Leading. The goal is to move stakeholders toward Supportive or Leading.' },
          { term: 'Stakeholder Engagement Plan', definition: 'A component of the project management plan that identifies the strategies and actions to promote stakeholder involvement.' },
          { term: 'Communication Methods', definition: 'Interactive (meetings, calls), Push (emails, reports), Pull (portals, wikis). Choice depends on stakeholder needs and urgency.' },
          { term: 'Active Listening', definition: 'A critical PM skill involving full attention, clarifying questions, and feedback to ensure accurate understanding of stakeholder concerns.' },
          { term: 'Expectation Management', definition: 'The process of continuously aligning stakeholder expectations with project reality through honest, transparent communication.' },
        ],
        deepDive: [
          {
            heading: 'The Engagement Spectrum',
            content: 'The five engagement levels form a spectrum from Unaware (stakeholder has no knowledge of the project) through Resistant (aware but opposed), Neutral (aware but neither supportive nor resistant), Supportive (aware and supportive), to Leading (actively engaged and promoting the project). Your strategy should be tailored to move each stakeholder toward at least Supportive. Never leave a Resistant stakeholder unaddressed.',
          },
          {
            heading: 'Tailoring Your Approach',
            content: 'High power/high interest stakeholders need frequent, detailed engagement. High power/low interest stakeholders need to be kept satisfied but not overwhelmed. Low power/high interest stakeholders should be kept informed. Low power/low interest stakeholders require minimal, periodic communication. The exam will present scenarios — choose the engagement approach that matches the stakeholder\'s position on the grid.',
          },
          {
            heading: 'Agile Engagement Practices',
            content: 'In agile, stakeholder engagement is embedded in the process. Sprint reviews, retrospectives, and daily stand-ups all serve as engagement mechanisms. The product owner is the primary stakeholder liaison. The exam tests that in agile, engagement is continuous and collaborative rather than planned and periodic.',
          },
        ],
        examTips: [
          'Know all five engagement levels and be able to identify the appropriate strategy for each.',
          'The Stakeholder Engagement Plan is part of the Project Management Plan — it is not a standalone document.',
          'When a stakeholder becomes resistant mid-project, the first action is always to meet with them and understand their concerns.',
          'Interactive communication (face-to-face or real-time) is always preferred for complex or sensitive stakeholder issues.',
          'Remember: engaging stakeholders is the PM\'s responsibility — it cannot be fully delegated.',
        ],
        ritaInsight: 'Rita says: "Managing stakeholders is not just about keeping them happy — it is about getting them to help you succeed." She emphasizes that the PM must proactively seek stakeholder input rather than waiting for issues to surface. On the exam, proactive engagement always beats reactive damage control.',
        commonPitfalls: [
          'Treating all stakeholders with the same engagement strategy regardless of their power and interest levels.',
          'Confusing the Stakeholder Engagement Plan with the Communications Management Plan — they are different documents.',
          'Failing to update the engagement strategy when project circumstances or stakeholder attitudes change.',
        ],
      },
      {
        slug: 'managing-expectations',
        title: 'Managing Stakeholder Expectations',
        estimatedMinutes: 15,
        overview: 'Unmanaged expectations are the root cause of most stakeholder conflicts. This lesson covers how to set, monitor, and adjust expectations across the project life cycle — a frequently tested competency on the PMP exam.',
        keyConcepts: [
          { term: 'Expectation', definition: 'An unstated assumption about a project outcome that a stakeholder holds. Unaddressed expectations become requirements or complaints.' },
          { term: 'Issue Log', definition: 'A project document used to track and manage issues including stakeholder concerns, disputes, and escalation items.' },
          { term: 'Change Request', definition: 'A formal request to modify any aspect of the project. Expectation mismatches often result in change requests.' },
          { term: 'Interpersonal Skills', definition: 'Skills including communication, negotiation, conflict resolution, and active listening essential for expectation management.' },
          { term: 'Status Reporting', definition: 'Regular communication about project performance that helps align stakeholder expectations with current reality.' },
        ],
        deepDive: [
          {
            heading: 'Identifying Hidden Expectations',
            content: 'The most dangerous expectations are the ones never spoken. Effective PMs use kickoff meetings, stakeholder interviews, and requirements workshops to surface unstated assumptions. Ask open-ended questions: "What does success look like to you?" "What concerns you most?" Document everything — expectations that are written down become manageable requirements.',
          },
          {
            heading: 'Expectation vs. Requirement',
            content: 'Expectations become requirements when they are formally documented and approved. On the exam, if a stakeholder raises a concern that was never documented, the correct action is to log it, analyze the impact, and process it through integrated change control — not to simply implement it or ignore it.',
          },
          {
            heading: 'When Expectations Conflict',
            content: 'Competing stakeholder expectations are among the most tested PMP scenarios. When two stakeholders want different outcomes, the PM\'s role is to facilitate resolution — not to take sides. Techniques include: facilitation meetings, mediation, escalation to the project sponsor, and formal change control. The project charter and approved project management plan are the reference points for resolving disputes.',
          },
        ],
        examTips: [
          'When a stakeholder says the deliverable is not what they expected, first investigate if their expectation was ever formally documented.',
          'Unmet expectations that were never documented are not scope creep — they require negotiation, not a change request.',
          'The Issue Log is the primary tool for tracking and resolving stakeholder expectation conflicts.',
          'Always involve the project sponsor when expectations conflict between senior stakeholders.',
          'Prevention beats cure — set clear expectations at project initiation using the project charter.',
        ],
        ritaInsight: 'Rita Mulcahy identifies expectation management as a core competency: "A project manager who cannot manage expectations will always be in firefighting mode." She recommends the PM personally verify stakeholder understanding rather than assuming clarity. When in doubt on the exam, choose the answer that involves direct, honest communication.',
        commonPitfalls: [
          'Waiting until a stakeholder complains before addressing expectation gaps — be proactive.',
          'Promising deliverables or timelines to satisfy stakeholders without checking project feasibility first.',
          'Assuming that once expectations are set at the start, they never need to be revisited.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. TEAM
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'team',
    title: 'Team Performance Domain',
    shortTitle: 'Team',
    icon: '👥',
    gradient: 'from-violet-500 to-violet-700',
    lightBg: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
    badgeColor: 'bg-violet-100 text-violet-700',
    description: 'Develop leadership skills, build high-performing teams, resolve conflict, and create an environment where every team member can do their best work.',
    ecoMapping: 'People Domain (42%)',
    lessons: [
      {
        slug: 'building-high-performing-teams',
        title: 'Building High-Performing Teams',
        estimatedMinutes: 22,
        overview: 'The PMP exam extensively tests your knowledge of team development models, motivation theories, and the PM\'s role in creating conditions for team success. This lesson covers Tuckman\'s model, motivation theories, and team charter development.',
        keyConcepts: [
          { term: 'Tuckman\'s Ladder', definition: 'Five stages of team development: Forming, Storming, Norming, Performing, and Adjourning. The PM\'s leadership style should adapt at each stage.' },
          { term: 'Team Charter', definition: 'A document that establishes team values, agreements, and operating guidelines. Created collaboratively by the team.' },
          { term: 'Ground Rules', definition: 'Clear expectations regarding acceptable behavior by project team members. Reduces interpersonal conflicts.' },
          { term: 'Maslow\'s Hierarchy', definition: 'Five-level pyramid of human needs: Physiological → Safety → Social → Esteem → Self-Actualization. People must satisfy lower needs before higher ones motivate.' },
          { term: 'Herzberg\'s Theory', definition: 'Distinguishes Hygiene Factors (prevent dissatisfaction: salary, conditions) from Motivators (create satisfaction: achievement, recognition, growth).' },
        ],
        deepDive: [
          {
            heading: 'Tuckman\'s Five Stages in Detail',
            content: 'Forming: Team meets, roles are unclear, PM takes a directing role. Storming: Conflict emerges as personalities clash — PM must facilitate, not avoid conflict. Norming: Team establishes working agreements, PM shifts to coaching. Performing: Team is self-organizing and highly productive, PM delegates and supports. Adjourning: Project closes, PM recognizes contributions and manages transition. The exam tests which PM behavior is appropriate at each stage.',
          },
          {
            heading: 'Motivation Theories You Must Know',
            content: 'Maslow (needs hierarchy), Herzberg (hygiene vs. motivators), McGregor (Theory X — people dislike work; Theory Y — people are self-motivated), McClelland (needs for Achievement, Affiliation, Power), Vroom (Expectancy Theory — motivation depends on expectation of success and value of reward). Exam questions often present a scenario and ask which theory applies.',
          },
          {
            heading: 'Virtual and Distributed Teams',
            content: 'Virtual teams are increasingly tested on the PMP exam. Key challenges include time zones, cultural differences, communication barriers, and trust-building. Best practices: establish team charter early, use video whenever possible, create social opportunities, ensure all members have equal access to information, and hold regular virtual retrospectives.',
          },
        ],
        examTips: [
          'Know Tuckman\'s five stages and the PM\'s appropriate leadership style at each stage.',
          'Herzberg\'s key insight: removing hygiene factors (fixing bad conditions) does NOT motivate — it only removes dissatisfaction.',
          'Theory X managers micromanage; Theory Y managers trust and empower. The exam favors Theory Y approaches.',
          'A Team Charter is created BY the team, not FOR the team — co-creation is essential.',
          'Conflict during Storming is NORMAL — the PM should facilitate, not eliminate it.',
        ],
        ritaInsight: 'Rita Mulcahy stresses: "The project manager is responsible for team development — it does not happen on its own." She emphasizes that many PMs skip the Storming stage by avoiding conflict, which prevents the team from ever reaching Performing. The exam rewards PMs who address conflict directly and constructively.',
        commonPitfalls: [
          'Assuming a team that skips Storming is healthy — conflict avoidance often masks deeper issues.',
          'Confusing Herzberg\'s Hygiene Factors (salary, working conditions) with Motivators (achievement, recognition).',
          'Treating remote team members as less important than co-located ones — the exam specifically tests equitable treatment.',
        ],
      },
      {
        slug: 'leadership-styles',
        title: 'Leadership Styles & Situational Leadership',
        estimatedMinutes: 18,
        overview: 'There is no single correct leadership style. The PMP exam tests your ability to identify which leadership approach is appropriate given the team\'s maturity, the situation, and the project context. This lesson covers all major leadership styles and when to apply each.',
        keyConcepts: [
          { term: 'Servant Leadership', definition: 'The leader\'s primary role is to serve the team — removing obstacles, providing resources, and enabling team members to do their best work. Core to agile approaches.' },
          { term: 'Situational Leadership', definition: 'Leadership style is adapted based on the team member\'s competence and commitment level. No single style fits all situations.' },
          { term: 'Directing', definition: 'High task, low relationship focus. Appropriate for new or inexperienced team members in Forming stage.' },
          { term: 'Coaching', definition: 'High task, high relationship focus. Appropriate for team members gaining competence but still needing guidance.' },
          { term: 'Transformational Leadership', definition: 'Inspiring followers to exceed expected performance through vision, motivation, and personal development. Creates high engagement.' },
        ],
        deepDive: [
          {
            heading: 'The Leadership Style Spectrum',
            content: 'From most directive to most delegative: Directing → Coaching → Supporting → Delegating. Match the style to the team member\'s development level. A new team member needs Directing (tell them what and how). A developing member needs Coaching (explain reasoning). A capable but insecure member needs Supporting (encourage and facilitate). A fully capable member needs Delegating (give responsibility and autonomy).',
          },
          {
            heading: 'Servant Leadership in Agile',
            content: 'Servant leadership is the dominant model in agile environments and is heavily tested on the PMP exam. The servant leader asks "How can I help?" rather than "What should you do?" Key behaviors: shielding the team from external interruptions, removing impediments, facilitating rather than directing, and putting team needs ahead of personal recognition.',
          },
          {
            heading: 'Leadership vs. Management',
            content: 'The PMP exam distinguishes leadership (influencing people toward a vision) from management (controlling processes and resources). Effective project managers do both. Leadership skills include vision, inspiration, and relationship-building. Management skills include planning, organizing, and monitoring. The exam increasingly emphasizes leadership competencies over pure management.',
          },
        ],
        examTips: [
          'Servant leadership is the preferred style in agile — when in doubt in an agile scenario, choose the servant leader answer.',
          'Situational leadership: match your style to the team member\'s competence AND commitment, not just their experience.',
          'Transformational leadership inspires change; Transactional leadership manages through rewards and penalties.',
          'A laissez-faire (hands-off) leadership style is rarely the right answer on the PMP exam.',
          'The PM is responsible for creating a psychologically safe environment where team members can take risks.',
        ],
        ritaInsight: 'Rita Mulcahy describes the ideal PM as "a leader first, a manager second." She emphasizes that the most important skill is knowing WHEN to apply each leadership style. On the exam, if the team is new or confused, choose directive answers. If the team is experienced and performing, choose delegating/supporting answers.',
        commonPitfalls: [
          'Applying a single leadership style to all team members regardless of their skill or motivation level.',
          'Confusing servant leadership with being passive — servant leaders are highly active in removing obstacles.',
          'Assuming that more experience always means a team member needs less direction — commitment matters too.',
        ],
      },
      {
        slug: 'conflict-resolution',
        title: 'Conflict Resolution Techniques',
        estimatedMinutes: 16,
        overview: 'Conflict is inevitable in projects and — when handled correctly — can lead to better decisions and stronger teams. The PMP exam tests your knowledge of conflict resolution techniques, when to use each, and the PM\'s appropriate role in conflict situations.',
        keyConcepts: [
          { term: 'Collaborating / Problem Solving', definition: 'All parties work together to find a win-win solution. Best long-term resolution. Recommended when the relationship and outcome both matter.' },
          { term: 'Compromising / Reconciling', definition: 'Both parties give up something to reach agreement. A lose-lose but acceptable outcome when time is limited.' },
          { term: 'Smoothing / Accommodating', definition: 'Emphasizing areas of agreement and minimizing conflict. Temporary fix — underlying issues remain.' },
          { term: 'Forcing / Directing', definition: 'One party imposes their view. Win-lose outcome. Used in emergencies or when a decision must be made immediately.' },
          { term: 'Withdrawing / Avoiding', definition: 'Retreating from conflict. Lowest ranked technique — the issue remains unresolved.' },
        ],
        deepDive: [
          {
            heading: 'Conflict Resolution Hierarchy',
            content: 'Ranked from best to worst: (1) Collaborating/Problem Solving — always the best when time permits. (2) Compromising — acceptable when collaboration is not possible. (3) Smoothing — temporary, use to buy time. (4) Forcing — use only in emergencies. (5) Withdrawing/Avoiding — almost never the right answer on the PMP exam. When the exam asks for the "best" technique, choose Collaborating unless there is a time or power constraint.',
          },
          {
            heading: 'Sources of Conflict in Projects',
            content: 'The seven most common conflict sources (per PMI research): (1) Schedules, (2) Project priorities, (3) Resources, (4) Technical opinions, (5) Administrative procedures, (6) Cost, (7) Personality. Schedule conflicts are the most common. Understanding the source helps choose the right resolution strategy.',
          },
          {
            heading: 'When to Escalate',
            content: 'Not all conflicts should be resolved by the PM directly. Conflicts between functional managers, unresolvable disputes, or conflicts involving the PM themselves should be escalated to the project sponsor. The exam tests that escalation is appropriate — not a sign of weakness — when the PM lacks the authority or neutrality to resolve the issue.',
          },
        ],
        examTips: [
          'Collaborating/Problem Solving is almost always the "best" answer unless there is a specific constraint.',
          'Withdrawing/Avoiding is almost always the "worst" answer — it solves nothing.',
          'Schedule is the #1 source of conflict on projects — know this for scenario questions.',
          'When two parties cannot resolve conflict themselves, the PM facilitates — not decides.',
          'If a conflict involves the PM personally, it must be escalated to the sponsor.',
        ],
        ritaInsight: 'Rita Mulcahy says: "Conflict is not bad — how you handle it determines whether it helps or hurts the project." She notes that PMs who avoid conflict are more dangerous than those who handle it directly. On the exam, never choose Avoiding/Withdrawing unless the scenario specifically states that time is needed to cool emotions.',
        commonPitfalls: [
          'Choosing "Smoothing" as a long-term solution — it only works temporarily.',
          'Using "Forcing" when you have the authority but not the urgency — it destroys trust.',
          'Forgetting that addressing conflict early prevents it from escalating into a crisis.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. DEVELOPMENT APPROACH & LIFE CYCLE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'development-approach',
    title: 'Development Approach & Life Cycle',
    shortTitle: 'Dev Approach',
    icon: '🔄',
    gradient: 'from-emerald-500 to-emerald-700',
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    description: 'Understand predictive, agile, and hybrid project approaches — the most heavily tested topic on the modern PMP exam — and learn how to select the right life cycle for any project.',
    ecoMapping: 'Process Domain (50%)',
    lessons: [
      {
        slug: 'predictive-agile-hybrid',
        title: 'Predictive, Agile & Hybrid Approaches',
        estimatedMinutes: 25,
        overview: 'The modern PMP exam is approximately 50% agile/hybrid. Understanding when to use predictive (waterfall), agile (iterative/incremental), or hybrid approaches is essential. This is one of the highest-value lessons for your exam preparation.',
        keyConcepts: [
          { term: 'Predictive (Waterfall)', definition: 'Requirements are fully defined upfront. Work follows sequential phases. Best when scope is well-defined and changes are unlikely.' },
          { term: 'Agile', definition: 'Iterative and incremental development with frequent delivery of value. Requirements emerge through collaboration. Best when requirements are uncertain or evolving.' },
          { term: 'Hybrid', definition: 'Combines predictive and agile elements. Some phases use waterfall, others use agile. Most real-world projects use hybrid approaches.' },
          { term: 'Scrum', definition: 'Most popular agile framework. Work organized in Sprints (1-4 weeks). Roles: Product Owner, Scrum Master, Development Team.' },
          { term: 'Kanban', definition: 'Visual workflow management system. Work limited by WIP (Work In Progress) limits. Focus on flow and continuous delivery.' },
        ],
        deepDive: [
          {
            heading: 'Choosing the Right Approach',
            content: 'Use predictive when: requirements are stable and well-understood, technology is mature, contract requires fixed scope, regulatory compliance demands documentation. Use agile when: requirements are unclear or evolving, rapid delivery of value is needed, customer can provide frequent feedback, team is experienced in agile. Use hybrid when: some deliverables are certain (plan predictively) and others are uncertain (deliver agilely).',
          },
          {
            heading: 'Scrum Framework Essentials',
            content: 'Product Backlog: prioritized list of all desired work. Sprint Planning: team selects items from backlog for the sprint. Daily Scrum: 15-minute standup — what did I do yesterday, what will I do today, any impediments? Sprint Review: demonstrate working software to stakeholders. Sprint Retrospective: team reflects on process improvements. Product Owner owns the WHAT; Scrum Master owns the HOW; Team owns the execution.',
          },
          {
            heading: 'Agile Principles for the Exam',
            content: 'The 12 Agile Manifesto principles are testable. Key ones: customer satisfaction through early and continuous delivery; welcome changing requirements even late in development; deliver working software frequently; business people and developers work together daily; motivated individuals given the environment and support they need; face-to-face conversation is the most efficient communication; working software is the primary measure of progress; simplicity — the art of maximizing work NOT done.',
          },
        ],
        examTips: [
          'When a scenario describes changing requirements, uncertain scope, or a need for fast feedback — choose agile or hybrid.',
          'When a scenario describes regulatory, safety, or fixed-contract environments — lean toward predictive.',
          'Know Scrum roles: Product Owner (what to build), Scrum Master (how to work), Development Team (who builds it).',
          'The Agile Manifesto values: Working software over comprehensive documentation; Customer collaboration over contract negotiation.',
          'Hybrid is often the "right" answer in real-world complex scenarios — acknowledge both certainty and uncertainty.',
        ],
        ritaInsight: 'Rita Mulcahy updated her materials to reflect the agile-heavy PMP: "The ability to choose the right approach for the right situation is what separates a competent PM from an exceptional one." On the exam, resist defaulting to predictive — analyze each scenario for indicators of uncertainty or evolving requirements before choosing.',
        commonPitfalls: [
          'Assuming agile means no planning — agile has rigorous planning, just at a different granularity.',
          'Confusing the Scrum Master as a traditional project manager — the SM is a facilitator and coach, not a director.',
          'Thinking hybrid is just "waterfall with some agile sprinkled in" — it requires deliberate design.',
        ],
      },
      {
        slug: 'phases-and-gates',
        title: 'Project Phases, Gates & Governance',
        estimatedMinutes: 18,
        overview: 'Project phases, phase gates, and governance structures define how work is organized and approved throughout the project life cycle. This lesson covers phase structures, go/no-go decisions, and the PM\'s governance responsibilities.',
        keyConcepts: [
          { term: 'Project Phase', definition: 'A collection of logically related project activities that culminates in the completion of one or more deliverables.' },
          { term: 'Phase Gate (Kill Point)', definition: 'A review point at the end of a phase where a decision is made to continue, modify, or terminate the project.' },
          { term: 'Project Life Cycle', definition: 'The series of phases a project passes through from initiation to closure. Can be predictive, iterative, incremental, or adaptive.' },
          { term: 'Milestone', definition: 'A significant point or event in the project. Milestones have zero duration and mark the completion of a major deliverable or phase.' },
          { term: 'PMO (Project Management Office)', definition: 'An organizational structure that standardizes project-related governance processes. Can be Supportive, Controlling, or Directive.' },
        ],
        deepDive: [
          {
            heading: 'Phase Gate Decision Criteria',
            content: 'At each phase gate, the project is evaluated against: business case validity, technical feasibility, resource availability, risk exposure, and alignment with organizational strategy. The outcomes are: Go (proceed as planned), Go with modifications (proceed but adjust approach), and No-Go (pause or terminate). The project sponsor and/or steering committee typically make phase gate decisions.',
          },
          {
            heading: 'Types of Project Life Cycles',
            content: 'Predictive: all phases planned upfront, sequential. Iterative: phases repeat with progressive elaboration — each iteration refines the deliverable. Incremental: each phase produces a working subset of the final deliverable. Adaptive (Agile): combines iterative and incremental with high stakeholder involvement and rapid response to change. Hybrid: mix of predictive for stable elements and adaptive for uncertain elements.',
          },
          {
            heading: 'PMO Types',
            content: 'Supportive PMO: provides templates, best practices, training, lessons learned — low control. Controlling PMO: requires compliance with frameworks, methods, and tools — moderate control. Directive PMO: directly manages projects and assigns PMs — high control. The exam tests which PMO type matches a given organizational scenario.',
          },
        ],
        examTips: [
          'Phase gates are decision points — not just reviews. A "No-Go" decision is a legitimate and sometimes correct outcome.',
          'Know the three PMO types and their control levels — frequently tested in organizational questions.',
          'Milestones have zero duration — they mark a point in time, not a period of work.',
          'In agile, iterations (sprints) serve as mini-phases with built-in review gates (sprint reviews).',
          'The project life cycle is NOT the same as the product life cycle — know the difference.',
        ],
        ritaInsight: 'Rita Mulcahy emphasizes: "Phase gates exist to protect the organization, not just the project." She notes that PMs who always recommend Go are not serving their organization well. On the exam, if a phase gate reveals that the project no longer aligns with business objectives, recommending termination can be the correct and ethical answer.',
        commonPitfalls: [
          'Confusing project phases with project management process groups (Initiating, Planning, Executing, etc.).',
          'Assuming that phase gate approval means no further changes are possible — baselines can still be updated.',
          'Thinking that a Directive PMO removes the PM\'s authority — the PM still makes day-to-day decisions.',
        ],
      },
      {
        slug: 'choosing-methodology',
        title: 'Choosing the Right Methodology',
        estimatedMinutes: 15,
        overview: 'One of the most practical and exam-tested skills is the ability to assess a project situation and determine the most appropriate methodology. This lesson provides a clear framework for methodology selection that applies directly to PMP exam scenarios.',
        keyConcepts: [
          { term: 'Tailoring', definition: 'Adapting the project management approach, processes, and tools to fit the specific needs of a project. Required by PMBOK 7 for all projects.' },
          { term: 'Complexity', definition: 'A project characteristic involving uncertainty, ambiguity, dynamic conditions, and interdependencies that resist simple analysis.' },
          { term: 'Uncertainty', definition: 'Lack of complete certainty about requirements, technology, or environment. High uncertainty favors agile approaches.' },
          { term: 'Organizational Culture', definition: 'The shared values, beliefs, and practices of an organization. Methodology must align with culture for adoption to succeed.' },
          { term: 'Delivery Cadence', definition: 'How often the project delivers value to stakeholders. Frequent delivery (sprints) vs. single delivery (waterfall).' },
        ],
        deepDive: [
          {
            heading: 'The Methodology Selection Framework',
            content: 'Ask five key questions: (1) How well-defined are the requirements? (2) How often will requirements change? (3) How often can stakeholders provide feedback? (4) What is the organization\'s agile maturity? (5) Are there regulatory or contractual constraints? High certainty → Predictive. High uncertainty + frequent feedback → Agile. Mixed → Hybrid.',
          },
          {
            heading: 'Tailoring in Practice',
            content: 'PMBOK 7 mandates that every project be tailored. Tailoring decisions include: which processes to use, which artifacts to create, which tools to apply, and how formal or informal governance should be. Tailoring is not optional — it demonstrates project management maturity. On the exam, "one size fits all" approaches are never the right answer.',
          },
          {
            heading: 'Organizational Constraints',
            content: 'Even if agile is technically ideal, organizational readiness matters. Constraints include: leadership support for agile, team experience, customer ability to engage frequently, contractual requirements, and regulatory frameworks. The exam tests that methodology must be feasible — not just theoretically optimal.',
          },
        ],
        examTips: [
          'When the exam describes stable requirements and a fixed contract, choose predictive.',
          'When the exam describes evolving requirements and customer involvement, choose agile.',
          'Tailoring is always correct — never select the approach that applies a methodology without adjustment.',
          'Organizational culture and leadership support are real constraints on methodology selection.',
          'A hybrid approach is often the most mature and realistic choice for complex enterprise projects.',
        ],
        ritaInsight: 'Rita Mulcahy: "The best methodology is the one that fits your project, your team, and your organization — not the one your company always uses." She warns against applying waterfall out of habit when agile would serve better, and vice versa. The exam rewards context-aware, tailored decision-making.',
        commonPitfalls: [
          'Applying the same methodology to every project because "that\'s how we do things here."',
          'Thinking that choosing agile means the team can self-organize without any PM oversight.',
          'Underestimating the organizational change required to successfully adopt agile in a traditional culture.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. PLANNING
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'planning',
    title: 'Planning Performance Domain',
    shortTitle: 'Planning',
    icon: '📋',
    gradient: 'from-amber-500 to-amber-700',
    lightBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-700',
    description: 'Master project planning — from scope and schedule to risk and budget — using both predictive and adaptive planning techniques tested on the PMP exam.',
    ecoMapping: 'Process Domain (50%)',
    lessons: [
      {
        slug: 'scope-and-wbs',
        title: 'Scope Definition & Work Breakdown Structure',
        estimatedMinutes: 22,
        overview: 'Scope management is the foundation of all other planning. Getting scope wrong derails schedules, budgets, and stakeholder relationships. This lesson covers the complete scope management process, WBS creation, and the critical distinction between product and project scope.',
        keyConcepts: [
          { term: 'Product Scope', definition: 'The features and functions that characterize a product, service, or result.' },
          { term: 'Project Scope', definition: 'The work that needs to be accomplished to deliver the product, service, or result with the specified features.' },
          { term: 'Work Breakdown Structure (WBS)', definition: 'A hierarchical decomposition of the total scope of work into smaller, more manageable components called work packages.' },
          { term: 'Work Package', definition: 'The lowest level of the WBS. Work packages are decomposed into activities for scheduling and cost estimation.' },
          { term: 'Scope Baseline', definition: 'The approved version of scope statement, WBS, and WBS dictionary. Changes require formal change control.' },
        ],
        deepDive: [
          {
            heading: 'The Scope Management Process',
            content: 'Plan Scope Management → Collect Requirements → Define Scope → Create WBS → Validate Scope → Control Scope. Validate Scope (getting customer acceptance of deliverables) is distinct from Control Scope (managing scope changes). On the exam, questions often test whether a scenario describes validation (customer sign-off) or control (preventing unauthorized changes).',
          },
          {
            heading: 'Creating an Effective WBS',
            content: 'The 100% Rule: the WBS must include 100% of the work — nothing more, nothing less. Decompose until work packages are small enough to estimate, assign, and monitor. Each WBS element should represent a tangible deliverable, not an activity. The WBS Dictionary provides detailed descriptions for each element. Never start scheduling without a completed WBS.',
          },
          {
            heading: 'Agile Scope Management',
            content: 'In agile, scope is managed through the Product Backlog. User stories replace traditional requirements documents. The product owner continuously prioritizes and refines the backlog. Scope changes are welcomed — they are incorporated into future sprints rather than processed through formal change control. The sprint scope (sprint backlog) is fixed during the sprint itself.',
          },
        ],
        examTips: [
          'Validate Scope = customer formally accepts deliverables. Control Scope = prevent unauthorized scope changes.',
          'The WBS represents DELIVERABLES, not activities. "Install database" is a deliverable; "Type SQL commands" is an activity.',
          'Remember the 100% Rule — the WBS must capture all work, including project management work.',
          'Scope creep happens when changes bypass the change control process — always process changes formally.',
          'In agile, the Product Backlog IS the scope document — it is always evolving.',
        ],
        ritaInsight: 'Rita Mulcahy: "Without a WBS, you are guessing at your schedule, budget, and risks." She emphasizes that the WBS is the most important planning tool because every other planning process depends on it. On the exam, if work is not in the WBS, it should not be done — and if it must be done, a change request is needed.',
        commonPitfalls: [
          'Building a WBS made of activities ("design," "code," "test") instead of deliverables ("Design Document," "Working Code," "Test Results").',
          'Forgetting to include project management activities (reports, meetings, reviews) in the WBS.',
          'Confusing Validate Scope (done by the customer) with Quality Control (done by the team).',
        ],
      },
      {
        slug: 'schedule-and-critical-path',
        title: 'Schedule Development & Critical Path Method',
        estimatedMinutes: 25,
        overview: 'Schedule management is one of the most calculation-heavy areas of the PMP exam. This lesson covers the full schedule development process, critical path method (CPM), and schedule compression techniques — all of which appear regularly in exam questions.',
        keyConcepts: [
          { term: 'Critical Path', definition: 'The longest path through the project network. Activities on the critical path have zero float — any delay causes a project delay.' },
          { term: 'Float (Slack)', definition: 'The amount of time an activity can be delayed without delaying the project or a subsequent activity. Critical path activities have zero float.' },
          { term: 'Fast Tracking', definition: 'Performing activities in parallel that were originally planned sequentially. Increases risk. Adds no cost.' },
          { term: 'Crashing', definition: 'Adding resources to critical path activities to shorten the schedule. Increases cost. Should crash activities with lowest cost slope first.' },
          { term: 'Schedule Baseline', definition: 'The approved version of the project schedule used to measure and report schedule performance.' },
        ],
        deepDive: [
          {
            heading: 'Critical Path Method Step by Step',
            content: 'Step 1: Sequence activities and create network diagram. Step 2: Estimate activity durations. Step 3: Forward pass — calculate Early Start (ES) and Early Finish (EF) for each activity. Step 4: Backward pass — calculate Late Start (LS) and Late Finish (LF). Step 5: Calculate Float = LS - ES (or LF - EF). Step 6: The critical path is the path(s) with zero float. On the exam, practice manual calculations with small networks.',
          },
          {
            heading: 'Schedule Compression Choices',
            content: 'When the schedule needs to be shortened: Fast Tracking — overlap activities that were planned sequentially. Example: begin construction while design is still in final review. Adds risk of rework. Crashing — add resources to critical path activities. Example: add a second team to database development. Adds cost. When the exam asks how to reduce schedule WITHOUT adding cost, choose Fast Tracking. When cost can be added, evaluate crashing first.',
          },
          {
            heading: 'Agile Schedule Management',
            content: 'In agile, schedule is managed through sprint planning and velocity. Velocity is the amount of work (story points) a team completes in a sprint. Release burndown charts show progress toward release goals. Velocity-based forecasting predicts when the backlog will be complete. The exam tests that agile schedules are adaptive — iterations are fixed in duration but scope within them is adjusted.',
          },
        ],
        examTips: [
          'Float = LS - ES = LF - EF. Zero float = critical path activity.',
          'Fast tracking adds RISK (activities done in parallel may need rework). Crashing adds COST.',
          'To crash: identify critical path activities and crash those with the lowest cost-per-time-unit saved first.',
          'Near-critical paths (very low float) need monitoring — they can become critical if delays occur.',
          'Mandatory dependencies (hard logic) cannot be changed. Discretionary dependencies (soft logic) can be fast tracked.',
        ],
        ritaInsight: 'Rita Mulcahy: "If you cannot identify the critical path, you cannot manage the project." She includes calculation exercises in her PMP prep materials and recommends practicing forward/backward pass manually until it becomes automatic. Expect 3-5 calculation-based questions on the exam.',
        commonPitfalls: [
          'Forgetting that a project can have multiple critical paths — all must be monitored.',
          'Crashing non-critical path activities — this wastes money without shortening the schedule.',
          'Confusing Free Float (delay without affecting the next activity) with Total Float (delay without affecting the project end).',
        ],
      },
      {
        slug: 'risk-planning',
        title: 'Risk Planning & Risk Responses',
        estimatedMinutes: 20,
        overview: 'Risk management is a high-frequency topic on the PMP exam. This lesson covers the complete risk management process from identification through response planning — with emphasis on the qualitative/quantitative distinction and response strategy selection.',
        keyConcepts: [
          { term: 'Risk', definition: 'An uncertain event or condition that, if it occurs, has a positive or negative effect on project objectives. Risks can be threats (negative) or opportunities (positive).' },
          { term: 'Risk Register', definition: 'A project document that records identified risks, analysis results, risk owners, and planned response strategies.' },
          { term: 'Probability x Impact Matrix', definition: 'A tool used in qualitative risk analysis to prioritize risks based on their probability of occurrence and impact if they occur.' },
          { term: 'Expected Monetary Value (EMV)', definition: 'Probability × Impact in monetary terms. Used in quantitative analysis and decision tree analysis.' },
          { term: 'Residual Risk', definition: 'The risk that remains after risk responses have been implemented. Requires contingency reserves.' },
        ],
        deepDive: [
          {
            heading: 'Risk Response Strategies',
            content: 'For THREATS: Avoid (change plan to eliminate risk), Transfer (shift impact to third party — insurance, contracts), Mitigate (reduce probability or impact), Accept (acknowledge and prepare contingency). For OPPORTUNITIES: Exploit (ensure it occurs), Share (partner to capture it), Enhance (increase probability/impact), Accept. The exam tests matching the right strategy to the scenario — and knowing that opportunities need responses too, not just threats.',
          },
          {
            heading: 'Qualitative vs. Quantitative Analysis',
            content: 'Qualitative: subjective prioritization using Probability × Impact matrix. Fast, inexpensive, always done. Quantitative: numerical analysis using techniques like Monte Carlo simulation, decision trees, and sensitivity analysis. Done only on high-priority risks when budget and time allow. On the exam, qualitative precedes quantitative — you cannot do quantitative risk analysis on all risks.',
          },
          {
            heading: 'Risk Reserves',
            content: 'Contingency reserves: budget held for identified risks (known unknowns). Controlled by the PM. Management reserves: budget held for unknown risks (unknown unknowns). Controlled by management — the PM must request approval to use them. On the exam, distinguish which reserve type applies based on whether the risk was identified and planned for.',
          },
        ],
        examTips: [
          'Risks can be positive (opportunities) — always consider both threats AND opportunities.',
          'Risk avoidance means changing the plan to eliminate the risk entirely — it does not mean ignoring it.',
          'Transfer does not eliminate risk — it moves the financial impact. The risk still exists.',
          'Residual risks need contingency reserves; secondary risks (created by responses) need new responses.',
          'In agile, risks are managed continuously through retrospectives, daily standups, and backlog refinement.',
        ],
        ritaInsight: 'Rita Mulcahy: "Risk management is not optional. A project manager who does not manage risks is not managing the project." She emphasizes that failing to plan for risks is itself a risk. On the exam, when a risk occurs that was not planned for, the first step is to assess the impact and create a workaround — not to immediately implement change control.',
        commonPitfalls: [
          'Forgetting that opportunities (positive risks) also need proactive management strategies.',
          'Confusing risk mitigation (reducing probability/impact) with risk acceptance (doing nothing).',
          'Using management reserves for identified risks — those should use contingency reserves.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. PROJECT WORK
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'project-work',
    title: 'Project Work Performance Domain',
    shortTitle: 'Project Work',
    icon: '⚙️',
    gradient: 'from-cyan-500 to-cyan-700',
    lightBg: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    description: 'Execute project work effectively by managing team performance, procurement, communications, and knowledge — the operational core of project management.',
    ecoMapping: 'Process Domain (50%)',
    lessons: [
      {
        slug: 'coordinating-work',
        title: 'Coordinating Work & Managing Team Performance',
        estimatedMinutes: 18,
        overview: 'Executing project work requires coordinating people, processes, and resources toward a common goal. This lesson covers performance management, issue resolution, and the PM\'s role in keeping project work on track.',
        keyConcepts: [
          { term: 'Work Performance Data', definition: 'Raw observations and measurements collected during project execution. Examples: % complete, start/finish dates, defect counts.' },
          { term: 'Work Performance Information', definition: 'Analyzed work performance data — variance reports, forecast data, status reports. Used in controlling processes.' },
          { term: 'Issue Log', definition: 'A document used to record and track issues that arise during project execution.' },
          { term: 'Corrective Action', definition: 'An intentional activity that realigns project performance with the project management plan.' },
          { term: 'Preventive Action', definition: 'An intentional activity that ensures future project performance aligns with the project management plan.' },
        ],
        deepDive: [
          {
            heading: 'Data → Information → Reports',
            content: 'Work Performance Data (raw) → Work Performance Information (analyzed) → Work Performance Reports (communicated to stakeholders). On the exam, understand which output belongs to which process. Execution generates Data. Monitoring & Controlling generates Information. Reporting communicates Information as Reports. Mixing these up is a common exam trap.',
          },
          {
            heading: 'Managing Team Performance',
            content: 'Monitor team performance through observation, feedback, performance reviews, and tracking deliverables. When performance gaps occur: first investigate root cause, then provide coaching or additional training, then document formally if needed. Reward and recognition systems reinforce desired behavior. Avoid public criticism — provide feedback privately and constructively.',
          },
          {
            heading: 'Impediment Management in Agile',
            content: 'In agile, the Scrum Master removes impediments that block the team. The daily standup (daily scrum) surfaces blockers quickly. An impediment board tracks current blockers and their resolution status. The PM/Scrum Master does not solve all problems — they empower team members to solve what they can and escalate only what they cannot resolve independently.',
          },
        ],
        examTips: [
          'Corrective action fixes current deviations; Preventive action prevents future deviations.',
          'Defect repair fixes something that does not meet requirements — it is different from corrective action.',
          'Work Performance Data is raw. Work Performance Information is analyzed. Know which process produces which.',
          'When a team member is underperforming, the first step is a private conversation — not a formal performance review.',
          'Issue logs must be actively monitored — an issue with no owner or due date will never be resolved.',
        ],
        ritaInsight: 'Rita Mulcahy: "Execution is where the project lives or dies." She emphasizes that PMs who spend all their time planning but fail to actively manage execution create projects that drift. The exam rewards PMs who proactively monitor performance, not just react to problems when they escalate.',
        commonPitfalls: [
          'Confusing Work Performance Data (raw facts) with Work Performance Information (analyzed results).',
          'Waiting for formal performance reviews to address performance issues — address them in real time.',
          'Treating all issues the same — prioritize by impact and urgency, not by who raised them.',
        ],
      },
      {
        slug: 'procurement-and-contracts',
        title: 'Procurement & Contract Types',
        estimatedMinutes: 20,
        overview: 'Procurement management is consistently tested on the PMP exam. This lesson covers contract types, source selection, and the PM\'s responsibilities when working with vendors and suppliers.',
        keyConcepts: [
          { term: 'Fixed Price (Lump Sum)', definition: 'Total price is fixed regardless of seller\'s actual costs. Seller bears cost risk. Best when scope is well-defined.' },
          { term: 'Cost Reimbursable', definition: 'Buyer pays all allowable costs plus a fee. Buyer bears cost risk. Used when scope is uncertain.' },
          { term: 'Time & Material (T&M)', definition: 'Hybrid contract: fixed rate per hour/unit, variable total cost. Used for staff augmentation or uncertain scope.' },
          { term: 'Statement of Work (SOW)', definition: 'A narrative description of products, services, or results to be supplied by a vendor.' },
          { term: 'Make-or-Buy Analysis', definition: 'A decision framework to determine whether to produce goods/services internally or purchase from a vendor.' },
        ],
        deepDive: [
          {
            heading: 'Contract Types and Risk',
            content: 'Fixed Price (FP): Seller has cost risk. Best for well-defined scope. Variations: Firm Fixed Price (FFP), Fixed Price Incentive Fee (FPIF), Fixed Price with Economic Price Adjustment (FP-EPA). Cost Reimbursable (CR): Buyer has cost risk. Best for uncertain scope. Variations: Cost Plus Fixed Fee (CPFF), Cost Plus Incentive Fee (CPIF), Cost Plus Award Fee (CPAF). T&M: Shared risk. Best for short duration or when scope cannot be defined.',
          },
          {
            heading: 'Source Selection Criteria',
            content: 'Evaluating potential vendors: Technical approach, management approach, past performance, price/cost, references, financial capacity, warranty provisions, and production capacity. The exam tests that lowest price is NOT always the winning criterion — value for money and technical capability often outweigh price. Weighted scoring models are used to evaluate multiple criteria objectively.',
          },
          {
            heading: 'PM Responsibilities in Procurement',
            content: 'The PM is responsible for: ensuring procurement requirements are defined in the project management plan, supporting contract negotiation, managing vendor relationships, monitoring vendor performance, processing invoices and change requests, and administering contract closure. Legal and contracts teams handle formal contract execution — the PM manages the relationship and performance.',
          },
        ],
        examTips: [
          'Risk is with the SELLER in Fixed Price contracts. Risk is with the BUYER in Cost Reimbursable contracts.',
          'Firm Fixed Price (FFP) = most common and lowest risk for the buyer.',
          'Cost Plus Percentage of Costs (CPPC) is illegal in US government contracts because it incentivizes sellers to increase costs.',
          'T&M contracts need a "not to exceed" clause to protect the buyer from runaway costs.',
          'The SOW must be clear and complete before issuing an RFP — ambiguity in the SOW leads to disputes.',
        ],
        ritaInsight: 'Rita Mulcahy: "The type of contract you choose determines who carries the risk — and risk allocation affects vendor behavior." She notes that PMs who choose the wrong contract type create adversarial vendor relationships. On the exam, match the contract type to the certainty of scope: clear scope = Fixed Price, unclear scope = Cost Reimbursable.',
        commonPitfalls: [
          'Assuming Fixed Price protects the buyer from all risk — if the SOW is poorly defined, the seller will claim extras.',
          'Using Cost Plus Percentage of Costs (CPPC) — it incentivizes sellers to inflate costs.',
          'Delegating all vendor management to procurement — the PM must stay actively engaged.',
        ],
      },
      {
        slug: 'knowledge-management',
        title: 'Knowledge Management & Lessons Learned',
        estimatedMinutes: 14,
        overview: 'Knowledge management ensures that insights gained during a project are captured, shared, and reused. The PMP exam tests knowledge transfer practices, lessons learned processes, and the PM\'s responsibility to organizational learning.',
        keyConcepts: [
          { term: 'Explicit Knowledge', definition: 'Knowledge that can be readily codified and shared — documents, databases, manuals, procedures.' },
          { term: 'Tacit Knowledge', definition: 'Personal knowledge that is difficult to articulate — expertise, judgment, intuition. Shared through mentoring and communities of practice.' },
          { term: 'Lessons Learned Register', definition: 'A project document used to record challenges, problems, realized risks, and successful practices throughout the project.' },
          { term: 'Organizational Process Assets (OPAs)', definition: 'Plans, processes, policies, procedures, and knowledge bases from the performing organization used to guide projects.' },
          { term: 'Communities of Practice', definition: 'Groups of people who share a common interest and develop expertise through regular interaction and knowledge sharing.' },
        ],
        deepDive: [
          {
            heading: 'When to Capture Lessons Learned',
            content: 'The biggest mistake is treating lessons learned as a closing activity only. PMBOK 7 and the PMP exam expect continuous lessons learned capture: at the end of each phase, after significant events or risks materialize, during retrospectives (agile), and as part of regular status reviews. Lessons learned captured only at project close are rarely actionable for the current project.',
          },
          {
            heading: 'Making Lessons Learned Useful',
            content: 'Lessons learned are only valuable if they are: stored in an accessible repository, indexed for searchability, reviewed at the start of similar projects, and updated regularly. The PM is responsible for ensuring lessons are captured AND applied. Common failure: capturing lessons in a document that no one reads.',
          },
          {
            heading: 'Agile Retrospectives',
            content: 'In agile, the Sprint Retrospective is the formal lessons-learned mechanism. The team reflects on three questions: What went well? What could be improved? What actions will we take? Action items from retrospectives become backlog items or process changes for the next sprint. The Scrum Master facilitates; the team owns the outcomes.',
          },
        ],
        examTips: [
          'Lessons learned are captured THROUGHOUT the project, not just at closure.',
          'Tacit knowledge is the hardest to transfer — it requires mentoring, shadowing, and communities of practice.',
          'OPAs are inputs from the organization to the project; lessons learned are outputs from the project to the organization.',
          'In agile, the retrospective IS the lessons learned process — held every sprint.',
          'Knowledge management failures often stem from poor repository design, not lack of knowledge.',
        ],
        ritaInsight: 'Rita Mulcahy: "A project manager who does not learn from the past is condemned to repeat its mistakes." She emphasizes that the PM has an obligation not just to the current project but to the organization\'s future projects. On the exam, choose answers that treat lessons learned as continuous and proactive, not as a one-time closing formality.',
        commonPitfalls: [
          'Waiting until project closure to document lessons learned — most value is lost by then.',
          'Treating tacit knowledge (expertise, judgment) as if it can be captured in a document.',
          'Capturing lessons without assigning responsibility for using them on future projects.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. DELIVERY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'delivery',
    title: 'Delivery Performance Domain',
    shortTitle: 'Delivery',
    icon: '📦',
    gradient: 'from-rose-500 to-rose-700',
    lightBg: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    badgeColor: 'bg-rose-100 text-rose-700',
    description: 'Ensure project deliverables meet quality standards, requirements are fulfilled, and value is delivered to stakeholders throughout the project life cycle.',
    ecoMapping: 'Process Domain (50%)',
    lessons: [
      {
        slug: 'requirements-management',
        title: 'Requirements Elicitation & Management',
        estimatedMinutes: 20,
        overview: 'Requirements are the foundation of what gets built. Poor requirements management is one of the top causes of project failure. This lesson covers elicitation techniques, requirements documentation, and traceability — all heavily tested on the PMP exam.',
        keyConcepts: [
          { term: 'Requirements', definition: 'A condition or capability needed by a stakeholder to solve a problem or achieve an objective. Can be functional, non-functional, or transitional.' },
          { term: 'Requirements Traceability Matrix (RTM)', definition: 'A grid that links product requirements from origin to deliverable. Ensures all requirements are addressed and prevents gold-plating.' },
          { term: 'Elicitation Techniques', definition: 'Methods to gather requirements: interviews, focus groups, workshops, prototyping, observation, questionnaires, document analysis.' },
          { term: 'Gold Plating', definition: 'Adding features or functionality beyond what was requested. Wastes resources and can introduce defects. Must be prevented.' },
          { term: 'User Story', definition: 'Agile format for requirements: "As a [role], I want [feature] so that [benefit]." Includes acceptance criteria.' },
        ],
        deepDive: [
          {
            heading: 'Requirements Elicitation Techniques',
            content: 'Interviews: one-on-one, structured or unstructured. Most effective for complex, sensitive requirements. Focus Groups: facilitated discussion with pre-qualified stakeholders. Joint Application Development (JAD): intensive workshop with all key stakeholders. Prototyping: create a model to elicit feedback. Observation (Job Shadowing): watch users work to discover unstated requirements. Document Analysis: review existing systems, contracts, and policies.',
          },
          {
            heading: 'Managing Requirements Changes',
            content: 'In predictive projects, requirements changes go through integrated change control. The PM evaluates impact on scope, schedule, cost, quality, and risk before approving. In agile projects, requirements changes are welcomed — they are added to the product backlog and prioritized by the product owner. The sprint backlog (committed sprint scope) is protected from change during a sprint.',
          },
          {
            heading: 'Requirements Traceability',
            content: 'The Requirements Traceability Matrix (RTM) links each requirement to its business need, design, development, test, and delivery. This ensures: no requirement is missed, no unauthorized requirement is added (gold plating), changes can be impact-analyzed, and acceptance testing covers all requirements. The RTM is maintained throughout the project and updated when requirements change.',
          },
        ],
        examTips: [
          'Gold plating (adding unrequested features) is always wrong — it wastes time and can introduce defects.',
          'Prototyping is excellent for eliciting requirements when stakeholders struggle to articulate their needs.',
          'Observation is best for discovering requirements that users cannot articulate because they are habitual.',
          'User stories must include acceptance criteria — "I want a report" is incomplete without "that shows X, Y, Z."',
          'In predictive projects, approved requirements are baselined and can only change through change control.',
        ],
        ritaInsight: 'Rita Mulcahy: "Requirements that are unclear will cost you 10x more to fix later than to clarify now." She recommends investing heavily in requirements elicitation upfront and using multiple techniques to surface hidden requirements. On the exam, when stakeholders disagree about requirements, the correct action is facilitation — not making a unilateral decision.',
        commonPitfalls: [
          'Relying on a single elicitation technique — different stakeholders respond to different methods.',
          'Treating signed requirements as final — requirements naturally evolve, especially in complex projects.',
          'Confusing scope validation (customer approves deliverables) with requirements management (PM tracks requirement fulfillment).',
        ],
      },
      {
        slug: 'quality-management',
        title: 'Quality Management & Continuous Improvement',
        estimatedMinutes: 18,
        overview: 'Quality management ensures project outputs satisfy requirements and are fit for use. The PMP exam tests both quality planning and quality control techniques, as well as the philosophical shift from inspection-based to prevention-based quality.',
        keyConcepts: [
          { term: 'Quality', definition: 'The degree to which a set of inherent characteristics fulfills requirements. Quality is planned, not inspected in.' },
          { term: 'Grade', definition: 'A category assigned to products with the same functional use but different technical characteristics. Low grade can be acceptable; low quality never is.' },
          { term: 'Cost of Quality (CoQ)', definition: 'All costs related to quality: Prevention Costs + Appraisal Costs + Internal Failure Costs + External Failure Costs.' },
          { term: 'Control Chart', definition: 'A graph used to study process variation over time. Shows upper/lower control limits — used to determine if a process is in control.' },
          { term: 'Kaizen', definition: 'A philosophy of continuous improvement through small, incremental changes. Core to agile retrospectives and lean practices.' },
        ],
        deepDive: [
          {
            heading: 'Cost of Quality',
            content: 'Prevention Costs: training, process design, quality planning. Appraisal Costs: inspection, testing, audits. Internal Failure: rework, defect correction before delivery. External Failure: warranty, customer complaints, recalls. The exam tests that prevention costs are the most cost-effective investment. Spending on prevention dramatically reduces internal and external failure costs. "Quality is free" — Crosby\'s philosophy.',
          },
          {
            heading: 'Quality Control Tools',
            content: 'Control Charts: monitor process stability over time. Cause and Effect (Fishbone/Ishikawa): identify root causes of defects. Pareto Chart: 80/20 rule — 80% of defects come from 20% of causes. Histograms: show frequency distribution of data. Scatter Diagrams: test relationships between two variables. Flow Charts: visualize process steps to identify waste and inefficiency.',
          },
          {
            heading: 'Quality in Agile',
            content: 'Agile builds quality in through: Definition of Done (DoD) — a shared checklist that every increment must satisfy. Test-Driven Development (TDD) — write tests before code. Continuous Integration — code is integrated and tested frequently. Refactoring — continuously improve code structure. Sprint retrospectives — teams improve their own quality processes every sprint.',
          },
        ],
        examTips: [
          'Low quality is never acceptable. Low grade can be acceptable if the customer knows and agrees.',
          'Prevention costs > Appraisal costs > Internal Failure costs > External Failure costs. Invest most in prevention.',
          'A process is "in control" when all data points fall within control limits — even if some are outside specification limits.',
          'Control Charts show process stability; they do NOT indicate whether the product meets customer specifications.',
          'Continuous improvement (Kaizen) is a philosophy, not a one-time event.',
        ],
        ritaInsight: 'Rita Mulcahy: "Quality must be planned into the project from the start — you cannot inspect it in at the end." She emphasizes the Cost of Quality as a critical exam concept. When asked which quality cost category is most important to invest in, always answer Prevention.',
        commonPitfalls: [
          'Confusing Quality Control (checking if outputs meet standards) with Quality Assurance (auditing processes).',
          'Assuming a process that is "in statistical control" automatically meets customer specifications — these are independent.',
          'Treating quality as the test team\'s responsibility — quality is everyone\'s responsibility, especially the PM\'s.',
        ],
      },
      {
        slug: 'change-control',
        title: 'Managing Scope Changes & Change Control',
        estimatedMinutes: 16,
        overview: 'Change is inevitable in projects. The PMP exam tests your knowledge of integrated change control — how changes are requested, evaluated, approved, and implemented. Mismanaging change is one of the most common causes of project failure.',
        keyConcepts: [
          { term: 'Integrated Change Control', definition: 'The process of reviewing all change requests, approving changes, and managing changes to deliverables, project documents, and the project management plan.' },
          { term: 'Change Control Board (CCB)', definition: 'A formally constituted group responsible for reviewing, evaluating, approving, deferring, or rejecting changes to the project.' },
          { term: 'Change Request', definition: 'A formal proposal to modify any document, deliverable, or baseline. Can be corrective action, preventive action, or defect repair.' },
          { term: 'Scope Creep', definition: 'The uncontrolled expansion of scope without adjustment to time, cost, or resources. Happens when changes bypass change control.' },
          { term: 'Configuration Management', definition: 'A system for ensuring the integrity of project baselines by identifying, documenting, and controlling changes to baseline items.' },
        ],
        deepDive: [
          {
            heading: 'The Change Control Process',
            content: 'Step 1: Identify the need for change. Step 2: Document a formal change request. Step 3: Analyze impact on scope, schedule, cost, quality, risk, and resources. Step 4: Submit to the Change Control Board (CCB) for decision. Step 5: If approved, update project management plan and communicate. Step 6: Implement the change. Step 7: Monitor and verify the change was effective. Never implement a change before it is formally approved — even if the sponsor requests it verbally.',
          },
          {
            heading: 'When the PM Can Approve Changes',
            content: 'The PM\'s change approval authority is defined in the project management plan. Some changes are within the PM\'s authority (minor schedule adjustments within float). Changes that affect baselines (scope, schedule, cost) typically require CCB or sponsor approval. Changes that affect the business case or strategic direction require executive approval. Know your authority level before making changes.',
          },
          {
            heading: 'Change in Agile vs. Predictive',
            content: 'Predictive: changes are controlled through formal change control to protect baselines. Change is managed as an exception. Agile: changes are welcomed through backlog management. The product owner adds, removes, and reprioritizes backlog items continuously. Sprint scope is protected — once a sprint begins, only the team can accept sprint scope changes (and only in emergencies). Hybrid: some elements are baselined (predictive), others are managed through backlogs (agile).',
          },
        ],
        examTips: [
          'All changes must go through integrated change control — verbal approval from a sponsor is NOT sufficient.',
          'Scope creep happens when changes bypass the change control process — prevention requires discipline.',
          'A change request can be approved, rejected, or deferred — all are valid CCB outcomes.',
          'If a customer requests an urgent change, the PM analyzes impact first before committing to anything.',
          'In agile, adding a user story to the backlog is NOT a change request — it is normal backlog management.',
        ],
        ritaInsight: 'Rita Mulcahy: "The project manager who allows informal changes destroys the project baseline." She emphasizes that even helpful, well-intentioned scope additions must go through change control. On the exam, when a stakeholder requests a change, the correct first action is always to document it as a change request and assess the impact — never to implement it immediately.',
        commonPitfalls: [
          'Implementing changes based on verbal instructions from sponsors or customers without formal documentation.',
          'Confusing defect repair (fixing something that does not work) with scope change (adding new functionality).',
          'Failing to update the project management plan after a change is approved — baseline drift leads to measurement errors.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. MEASUREMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'measurement',
    title: 'Measurement Performance Domain',
    shortTitle: 'Measurement',
    icon: '📊',
    gradient: 'from-indigo-500 to-indigo-700',
    lightBg: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    description: 'Master Earned Value Management, project metrics, forecasting, and performance reporting — the quantitative backbone of project control.',
    ecoMapping: 'Business Environment Domain (8%) + Process Domain (50%)',
    lessons: [
      {
        slug: 'earned-value-management',
        title: 'Earned Value Management (EVM)',
        estimatedMinutes: 28,
        overview: 'EVM is the most calculation-intensive topic on the PMP exam. Mastering Planned Value, Earned Value, Actual Cost, and their derived metrics is essential. Expect 5-8 EVM calculation questions on your exam.',
        keyConcepts: [
          { term: 'Planned Value (PV)', definition: 'The authorized budget assigned to scheduled work. Also called BCWS (Budgeted Cost of Work Scheduled).' },
          { term: 'Earned Value (EV)', definition: 'The measure of work performed expressed in terms of the budget authorized for that work. Also called BCWP.' },
          { term: 'Actual Cost (AC)', definition: 'The actual cost incurred for work performed during a specific time period. Also called ACWP.' },
          { term: 'Schedule Variance (SV)', definition: 'EV - PV. Negative = behind schedule. Positive = ahead of schedule. Zero = on schedule.' },
          { term: 'Cost Variance (CV)', definition: 'EV - AC. Negative = over budget. Positive = under budget. Zero = on budget.' },
        ],
        deepDive: [
          {
            heading: 'The Core EVM Formulas',
            content: 'VARIANCES: SV = EV - PV (schedule), CV = EV - AC (cost). INDICES: SPI = EV/PV (schedule efficiency), CPI = EV/AC (cost efficiency). A value > 1 is favorable for both indices. FORECASTS: EAC (Estimate at Completion) = BAC/CPI (most common), or AC + ETC. VAC (Variance at Completion) = BAC - EAC. ETC (Estimate to Complete) = EAC - AC. TCPI (To-Complete Performance Index) = (BAC - EV)/(BAC - AC) — efficiency needed to meet BAC.',
          },
          {
            heading: 'Interpreting EVM Results',
            content: 'SPI < 1 = behind schedule. SPI > 1 = ahead of schedule. CPI < 1 = over budget. CPI > 1 = under budget. The most important index is CPI — research shows that CPI at the 20% completion point is highly predictive of final project cost. If CPI = 0.85 at 20%, the project will likely finish approximately 15% over budget. TCPI > 1 means the team must work more efficiently than planned to meet the target — if significantly > 1, the target may be unrealistic.',
          },
          {
            heading: 'EVM in Agile',
            content: 'Traditional EVM is adapted for agile through: Story point velocity tracking, burndown charts (sprint and release), burnup charts, and cumulative flow diagrams. Agile EVM uses percent complete based on story points completed vs. total story points. The concept is the same — compare planned vs. actual vs. earned — but the measurement units differ.',
          },
        ],
        examTips: [
          'Memorize: SV = EV-PV, CV = EV-AC, SPI = EV/PV, CPI = EV/AC. EV is always in the middle.',
          'Negative SV or CV = BAD. SPI or CPI < 1 = BAD. Greater than 1 = GOOD.',
          'EAC = BAC/CPI assumes current cost performance continues. Most common EAC formula on the exam.',
          'TCPI = (BAC-EV)/(BAC-AC). If TCPI > 1.1 after significant project completion, the budget target is likely unachievable.',
          'VAC = BAC - EAC. A negative VAC means the project will finish over budget.',
        ],
        ritaInsight: 'Rita Mulcahy dedicates extensive coverage to EVM: "If you do not understand EVM, you will not pass the PMP exam." She recommends practicing calculations until you can do them without referring to formulas. The exam presents EVM scenarios where you must identify what is happening and recommend the appropriate action.',
        commonPitfalls: [
          'Confusing SV (time expressed in money) with actual days ahead/behind — SV is a dollar figure, not a time figure.',
          'Using the wrong EAC formula — EAC = BAC/CPI is the most common, but the exam may specify different assumptions.',
          'Forgetting that a positive CV means under budget (good) — the sign convention confuses many candidates.',
        ],
      },
      {
        slug: 'kpis-and-metrics',
        title: 'KPIs, Metrics & Dashboards',
        estimatedMinutes: 15,
        overview: 'Beyond EVM, project managers track a range of KPIs and metrics to monitor health and performance. This lesson covers metric selection, dashboard design, and reporting to stakeholders.',
        keyConcepts: [
          { term: 'KPI (Key Performance Indicator)', definition: 'A measurable value that demonstrates how effectively a project is achieving key objectives.' },
          { term: 'Dashboard', definition: 'A visual display of the most important information needed to achieve project objectives, consolidated on a single screen.' },
          { term: 'Burndown Chart', definition: 'Agile chart showing remaining work (story points or hours) over time. The ideal line slopes from total work to zero by sprint end.' },
          { term: 'Velocity', definition: 'The average amount of work completed per sprint, measured in story points. Used to forecast future sprint capacity.' },
          { term: 'Threshold', definition: 'A defined boundary for acceptable performance. Crossing a threshold triggers an escalation or action.' },
        ],
        deepDive: [
          {
            heading: 'Choosing the Right Metrics',
            content: 'Good metrics are: Specific (clearly defined), Measurable (quantifiable), Actionable (inform decisions), Relevant (aligned to objectives), Timely (available when needed). Avoid vanity metrics — measures that look good but do not drive decisions. Example: "100 meetings held" is a vanity metric; "decisions made per meeting" is actionable. Track 5-8 core metrics rather than 50 mediocre ones.',
          },
          {
            heading: 'Agile Metrics',
            content: 'Sprint velocity: average story points completed per sprint. Burndown chart: remaining work vs. time. Burnup chart: work completed vs. total scope (shows scope changes). Cumulative Flow Diagram: shows work in each state (backlog, in-progress, done) over time — reveals bottlenecks. Cycle time: how long a story takes from start to done. Lead time: how long from backlog entry to done.',
          },
          {
            heading: 'Reporting to Stakeholders',
            content: 'Tailor reports to the audience: Executives want summary dashboards with red/amber/green status. Technical leads want detailed variance reports. Team members need sprint burndown and velocity data. Sponsors need trend lines and forecast data. The exam tests that different stakeholders have different reporting needs — one report size does not fit all.',
          },
        ],
        examTips: [
          'Report what stakeholders need to know, not what is easiest to collect — tailor every report.',
          'A dashboard should enable action — if a metric does not drive decisions, remove it.',
          'Velocity is a planning tool for FUTURE sprints — it is not a performance measure for team comparison.',
          'Red/Amber/Green (RAG) status should be defined by objective thresholds, not subjective feelings.',
          'Trend analysis (is the project improving or worsening over time?) is more valuable than a single data point.',
        ],
        ritaInsight: 'Rita Mulcahy: "Metrics without action are just numbers." She emphasizes that the purpose of measurement is to enable better decisions — if you measure something and never act on it, the measurement has no value. On the exam, when a metric shows a problem, the correct action is always to investigate and take corrective action, not just to note it in the report.',
        commonPitfalls: [
          'Tracking too many metrics and losing sight of the critical few that actually matter.',
          'Sending the same report to all stakeholders regardless of their information needs.',
          'Confusing velocity (planning tool) with productivity (performance measure) — velocity varies and should not be used to compare teams.',
        ],
      },
      {
        slug: 'forecasting-and-variance',
        title: 'Forecasting & Variance Analysis',
        estimatedMinutes: 17,
        overview: 'Forecasting predicts future project performance based on current data. Variance analysis identifies deviations from the plan and drives corrective action. Both are tested extensively on the PMP exam.',
        keyConcepts: [
          { term: 'Variance Analysis', definition: 'A technique used to review differences between baseline and actual performance to understand causes and recommend actions.' },
          { term: 'Trend Analysis', definition: 'Examining project performance over time to determine whether performance is improving, degrading, or stable.' },
          { term: 'EAC (Estimate at Completion)', definition: 'The expected total cost of completing all work. Multiple formulas depending on whether past performance is expected to continue.' },
          { term: 'ETC (Estimate to Complete)', definition: 'The expected cost to finish all remaining project work.' },
          { term: 'Management Reserve', definition: 'Budget reserved for unknown unknowns — unidentified risks. Requires management approval to use.' },
        ],
        deepDive: [
          {
            heading: 'EAC Formula Selection Guide',
            content: 'EAC = BAC/CPI: assume current CPI continues for rest of project (most common). EAC = AC + ETC: use a new bottom-up estimate for remaining work. EAC = AC + (BAC - EV): assume remaining work at original budget rate (CPI problems are temporary). EAC = AC + (BAC - EV)/CPI: remaining work at current CPI (most pessimistic). The exam usually specifies which assumption to use — read carefully.',
          },
          {
            heading: 'Identifying Variance Root Causes',
            content: 'When variance is detected: First, determine if it is a one-time event or a trend. One-time events may self-correct. Trends require corrective action. Root cause analysis tools: 5 Whys (ask "why" repeatedly to get to root cause), Fishbone/Ishikawa Diagram, Pareto Analysis (focus on the vital few causes). Document findings in the issue log and implement corrective action through change control.',
          },
          {
            heading: 'Schedule Forecasting',
            content: 'SPI can forecast schedule completion: Estimated Duration at Completion = Planned Duration / SPI. However, SPI has a limitation — as the project nears completion, SPI approaches 1.0 even on late projects (because there is little planned work left). Schedule forecasting is better done using critical path analysis and float consumption trends than SPI alone.',
          },
        ],
        examTips: [
          'When EAC is asked without specifying assumptions, use EAC = BAC/CPI as the default.',
          'Trend analysis is more useful than snapshot analysis — always look at how performance is changing over time.',
          'A variance within acceptable thresholds does not require corrective action — check your management plan for thresholds.',
          'If the exam asks what to do when a variance exceeds the threshold, the answer is: analyze root cause, then implement corrective action through change control.',
          'Management reserves are for unknown unknowns — the PM cannot access them without management approval.',
        ],
        ritaInsight: 'Rita Mulcahy: "Forecasting is not just a math exercise — it requires judgment and context." She notes that EAC formulas give a number, but experienced PMs validate that number against qualitative knowledge of project conditions. On the exam, use the formula but also consider whether the scenario provides context that would change the interpretation.',
        commonPitfalls: [
          'Always using the same EAC formula regardless of what the scenario tells you about future performance assumptions.',
          'Confusing contingency reserves (for identified risks, PM controls) with management reserves (for unknown risks, management controls).',
          'Treating SPI as an accurate long-term schedule forecast when the project is near completion.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. UNCERTAINTY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'uncertainty',
    title: 'Uncertainty Performance Domain',
    shortTitle: 'Uncertainty',
    icon: '⚡',
    gradient: 'from-orange-500 to-orange-700',
    lightBg: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    badgeColor: 'bg-orange-100 text-orange-700',
    description: 'Navigate project risks, ambiguity, and complexity with proven identification, analysis, and response strategies from both predictive and agile frameworks.',
    ecoMapping: 'Business Environment Domain (8%) + People Domain (42%)',
    lessons: [
      {
        slug: 'risk-identification',
        title: 'Risk Identification & Qualitative Analysis',
        estimatedMinutes: 20,
        overview: 'Risk identification is where risk management begins. The quality of your risk register determines the quality of your entire risk management approach. This lesson covers identification techniques, qualitative analysis, and risk prioritization.',
        keyConcepts: [
          { term: 'Risk Identification', definition: 'The process of identifying and documenting individual project risks and sources of overall project risk.' },
          { term: 'Risk Breakdown Structure (RBS)', definition: 'A hierarchical representation of potential sources of project risk organized by category.' },
          { term: 'Qualitative Risk Analysis', definition: 'Prioritizing individual project risks by assessing probability and impact using subjective expert judgment.' },
          { term: 'Risk Appetite', definition: 'The degree of uncertainty an organization is willing to accept in anticipation of a reward.' },
          { term: 'Risk Threshold', definition: 'The level of risk exposure beyond which a risk must be addressed with a response strategy.' },
        ],
        deepDive: [
          {
            heading: 'Risk Identification Techniques',
            content: 'Brainstorming: group technique to generate many risks quickly. Interviews: one-on-one with experts and stakeholders. Delphi Technique: anonymous expert consensus — eliminates groupthink. SWOT Analysis: Strengths, Weaknesses, Opportunities, Threats. Checklist Analysis: use organizational risk templates. Root Cause Analysis: identify underlying causes. Assumption and Constraint Analysis: examine what could go wrong if assumptions prove false.',
          },
          {
            heading: 'Probability and Impact Assessment',
            content: 'Each identified risk is assessed for: Probability (likelihood of occurrence — High/Medium/Low or numeric scale) and Impact (effect on project objectives if it occurs — High/Medium/Low for scope, schedule, cost, quality). Risks are plotted on the Probability × Impact matrix. High probability + high impact = Priority 1 (must respond). Low probability + low impact = low priority (accept or monitor). The matrix is defined in the Risk Management Plan.',
          },
          {
            heading: 'Overall Project Risk',
            content: 'Beyond individual risks, PMBOK 7 distinguishes overall project risk — the effect of all uncertainty on the project as a whole. Overall risk is not just the sum of individual risks — it includes complexity, ambiguity, and interconnections. Assess overall risk using: expert judgment, risk data quality assessment, and assumption testing. High overall risk may justify changing the project approach entirely.',
          },
        ],
        examTips: [
          'Risk identification is iterative — new risks emerge throughout the project as conditions change.',
          'The Delphi Technique uses anonymous expert input to prevent groupthink and anchor bias.',
          'Both threats AND opportunities must be identified — do not focus only on negative risks.',
          'Document risks in the Risk Register as conditions that MAY happen, not certainties.',
          'Risk appetite (organizational) vs. risk threshold (project-level) — know the difference.',
        ],
        ritaInsight: 'Rita Mulcahy: "The more time you spend identifying risks upfront, the less time you spend managing crises later." She emphasizes using multiple identification techniques because different people see different risks. On the exam, when asked how to improve risk identification, the answer is usually to involve more stakeholders using more diverse techniques.',
        commonPitfalls: [
          'Identifying risks only during planning and never revisiting them as the project evolves.',
          'Writing risks as events that have already happened ("The database crashed") rather than future uncertainties.',
          'Focusing only on threats — missing opportunities means leaving value on the table.',
        ],
      },
      {
        slug: 'quantitative-risk-analysis',
        title: 'Quantitative Risk Analysis & Decision Trees',
        estimatedMinutes: 18,
        overview: 'Quantitative risk analysis provides numerical estimates of overall project risk exposure and probability of meeting objectives. This lesson covers Monte Carlo simulation, decision trees, and Expected Monetary Value — all PMP exam topics.',
        keyConcepts: [
          { term: 'Quantitative Risk Analysis', definition: 'Numerically analyzing the combined effect of identified individual project risks on overall project objectives.' },
          { term: 'Monte Carlo Simulation', definition: 'A computer simulation that runs thousands of iterations with random variable inputs to produce a probability distribution of outcomes.' },
          { term: 'Decision Tree Analysis', definition: 'A technique that models future decisions and their consequences, including chance events, costs, and benefits.' },
          { term: 'Expected Monetary Value (EMV)', definition: 'Probability × Monetary Impact. Positive EMV = opportunity value. Negative EMV = expected cost of a risk.' },
          { term: 'Sensitivity Analysis', definition: 'Identifies which risks have the most potential impact on project outcomes. Represented by a Tornado Diagram.' },
        ],
        deepDive: [
          {
            heading: 'Monte Carlo Simulation',
            content: 'Monte Carlo simulation creates a probability distribution for project outcomes (typically cost and schedule). Process: (1) Define probability distributions for uncertain variables (activity durations, costs). (2) Run thousands of simulations with randomly sampled inputs. (3) Analyze the output distribution — typical outputs include: probability of meeting target date, P80 (80% confidence date), and contingency reserve at desired confidence level. Used to determine: how likely the project is to finish on time/budget and how much contingency reserve to hold.',
          },
          {
            heading: 'Decision Tree Analysis',
            content: 'A decision tree shows: Decision nodes (squares — PM choices), Chance nodes (circles — uncertain outcomes), End values (results in money). To evaluate: calculate the EMV at each chance node (probability × outcome). Sum the EMVs for each path. Choose the decision branch with the best expected value. Example: Build in-house (EMV = -$120K) vs. Outsource (EMV = -$90K) → Choose outsource.',
          },
          {
            heading: 'Tornado Diagram',
            content: 'A tornado diagram shows sensitivity — which individual risks have the greatest impact on project outcomes. Risks are displayed as horizontal bars sorted by impact size (largest at top = tornado shape). The wider the bar, the more impact the risk has. Use tornado diagrams to prioritize which risks deserve quantitative analysis and which response strategies to invest in.',
          },
        ],
        examTips: [
          'Not all projects require quantitative analysis — only high-priority risks on large, complex projects.',
          'Monte Carlo output is a probability distribution, not a single answer — express results as "X% confident we will finish by date Y."',
          'In a decision tree, always calculate EMV at chance nodes first, then evaluate decision nodes.',
          'Positive EMV = the risk is an opportunity worth pursuing. Negative EMV = the risk is a threat.',
          'Quantitative analysis requires specialized tools and skills — it always comes AFTER qualitative analysis.',
        ],
        ritaInsight: 'Rita Mulcahy: "Quantitative analysis is not always required, but when it is used, it must be done rigorously." She notes that the PMP exam tests conceptual understanding of quantitative techniques, not advanced statistics. Focus on understanding what Monte Carlo and EMV tell you and when to use them.',
        commonPitfalls: [
          'Confusing qualitative (subjective priority matrix) with quantitative (numerical analysis) risk analysis.',
          'Thinking quantitative analysis replaces qualitative — quantitative analysis is always performed AFTER qualitative.',
          'Using a single-point estimate for Monte Carlo inputs — you need probability distributions, not single values.',
        ],
      },
      {
        slug: 'risk-responses',
        title: 'Risk Response Strategies & Contingency Planning',
        estimatedMinutes: 16,
        overview: 'Identifying and analyzing risks is only valuable if you respond effectively. This lesson covers all threat and opportunity response strategies, contingency planning, and the critical distinction between planned responses and workarounds.',
        keyConcepts: [
          { term: 'Risk Owner', definition: 'The person responsible for monitoring a risk and implementing the agreed response strategy if the risk occurs.' },
          { term: 'Trigger Condition', definition: 'An event or condition that indicates a risk is about to occur or has occurred. Also called a risk symptom or early warning sign.' },
          { term: 'Contingency Plan', definition: 'A planned response to be implemented if a risk occurs. Created during planning for high-priority identified risks.' },
          { term: 'Workaround', definition: 'An unplanned response to a risk or issue that was not identified or that has no contingency plan. Created in reaction to an event.' },
          { term: 'Secondary Risk', definition: 'A new risk that arises as a direct result of implementing a risk response strategy.' },
        ],
        deepDive: [
          {
            heading: 'Threat Response Strategies',
            content: 'Avoid: change the project plan to eliminate the risk entirely. Example: use proven technology instead of experimental. Transfer: shift the financial impact to a third party. Example: insurance, fixed-price contracts. Mitigate: reduce the probability or impact. Example: add testing cycles to reduce defect probability. Accept (Active): develop a contingency plan for when the risk occurs. Accept (Passive): acknowledge and monitor, but take no action. Decision: choose based on cost of response vs. expected impact.',
          },
          {
            heading: 'Opportunity Response Strategies',
            content: 'Exploit: ensure the opportunity definitely happens. Example: assign best resources to maximize the chance. Share: partner with another organization to capture the benefit. Example: joint venture. Enhance: increase the probability or impact of the opportunity. Example: add resources to a task that might finish early. Accept: be willing to take advantage if it occurs, but take no action to pursue it.',
          },
          {
            heading: 'Contingency vs. Workaround',
            content: 'Contingency plan: PRE-PLANNED response for an identified risk. Activated when a trigger condition occurs. Workaround: REACTIVE response for an unplanned event (risk that was not identified or not planned for). Workarounds are created in real time and should be followed by a change request to update project documents. The exam tests this distinction — if the risk was planned for, you use a contingency plan; if not, you create a workaround.',
          },
        ],
        examTips: [
          'Risk avoidance = changing the plan. It does NOT mean ignoring the risk.',
          'Risk transfer does NOT eliminate the risk — it moves the financial consequence to another party.',
          'Secondary risks (new risks created by responses) must be analyzed and responded to as well.',
          'Workarounds are for unplanned events. Contingency plans are for planned responses to identified risks.',
          'Residual risks (remaining after response) need contingency reserves. Document them in the Risk Register.',
        ],
        ritaInsight: 'Rita Mulcahy: "Every identified risk should have an owner and a response — a risk with no owner will not be managed." She emphasizes that residual and secondary risks are commonly overlooked. On the exam, when a risk response creates a new risk, the correct action is to document it, analyze it, and plan a response — not ignore it.',
        commonPitfalls: [
          'Treating risk transfer as risk elimination — the risk still exists, the financial burden has shifted.',
          'Forgetting to plan responses for opportunities — treating risk management as purely defensive.',
          'Creating contingency plans that are too vague to implement when the trigger occurs.',
        ],
      },
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug)
}

export function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string
): { course: Course; lesson: Lesson; index: number } | undefined {
  const course = getCourseBySlug(courseSlug)
  if (!course) return undefined
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index === -1) return undefined
  return { course, lesson: course.lessons[index], index }
}

export const TOTAL_LESSONS = COURSES.reduce(
  (sum, c) => sum + c.lessons.length,
  0
)