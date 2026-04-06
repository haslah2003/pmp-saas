'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────

const PROCESS_GROUPS = [
  {
    id: 'initiating',
    name: 'Initiating',
    icon: '🚀',
    color: '#7c3aed',
    description: 'Defining and authorizing the project or phase. Obtaining approval to start.',
    keyActivities: [
      'Develop Project Charter',
      'Identify Stakeholders',
      'Determine high-level scope, risks, assumptions',
      'Assign Project Manager',
      'Create Assumption Log',
    ],
    keyOutputs: ['Project Charter', 'Stakeholder Register', 'Assumption Log'],
    examTip: 'The PM is assigned during Initiating. The charter authorizes the project. Without a signed charter, the project cannot proceed.',
  },
  {
    id: 'planning',
    name: 'Planning',
    icon: '📋',
    color: '#2563eb',
    description: 'Establishing the scope, refining objectives, and defining the course of action to achieve objectives.',
    keyActivities: [
      'Create Project Management Plan (all subsidiary plans)',
      'Define Scope, Create WBS',
      'Develop Schedule, Estimate Costs',
      'Plan Quality, Resources, Communications',
      'Plan Risk Management, Identify Risks',
      'Plan Procurement, Stakeholder Engagement',
    ],
    keyOutputs: ['Project Management Plan', 'Scope Baseline', 'Schedule Baseline', 'Cost Baseline', 'Risk Register'],
    examTip: 'Planning has the MOST processes. All knowledge areas have planning processes. You can return to planning from executing when changes occur.',
  },
  {
    id: 'executing',
    name: 'Executing',
    icon: '⚡',
    color: '#059669',
    description: 'Completing the work defined in the project management plan to satisfy project requirements.',
    keyActivities: [
      'Direct and Manage Project Work',
      'Manage Quality (QA)',
      'Acquire, Develop, and Manage Team',
      'Manage Communications',
      'Implement Risk Responses',
      'Conduct Procurements',
      'Manage Stakeholder Engagement',
    ],
    keyOutputs: ['Deliverables', 'Work Performance Data', 'Change Requests', 'Issue Log updates'],
    examTip: 'The team executes the plan. The PM spends most TIME here. This is where change requests originate. Scope, Schedule, and Cost have NO executing processes — the team does the work.',
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Controlling',
    icon: '👁️',
    color: '#d97706',
    description: 'Tracking, reviewing, and regulating progress. Identifying changes needed and initiating them.',
    keyActivities: [
      'Monitor and Control Project Work',
      'Perform Integrated Change Control',
      'Validate & Control Scope',
      'Control Schedule, Control Costs',
      'Control Quality, Monitor Resources',
      'Monitor Communications & Risks',
      'Control Procurements',
      'Monitor Stakeholder Engagement',
    ],
    keyOutputs: ['Work Performance Reports', 'Change Requests', 'Approved/Rejected Changes', 'Updated Project Documents'],
    examTip: 'M&C runs THROUGHOUT the entire project — from start to finish. ALL knowledge areas have M&C processes. The CCB (Change Control Board) operates here.',
  },
  {
    id: 'closing',
    name: 'Closing',
    icon: '✅',
    color: '#dc2626',
    description: 'Finalizing all activities to formally close the project or phase.',
    keyActivities: [
      'Close Project or Phase',
      'Final product/service/result transition',
      'Collect Lessons Learned',
      'Release resources',
      'Archive project documents',
      'Obtain formal acceptance from sponsor/customer',
    ],
    keyOutputs: ['Final Product/Deliverable', 'Lessons Learned Register', 'Organizational Process Assets updates'],
    examTip: 'Lessons learned are collected throughout but formally compiled during Closing. Even cancelled projects must go through Closing. Procurement closure happens before project closure.',
  },
]

const KNOWLEDGE_AREAS = [
  {
    id: 'integration',
    name: 'Integration',
    icon: '🔗',
    color: '#7c3aed',
    description: 'Coordinates all aspects of project management. The ONLY knowledge area with processes in ALL 5 process groups.',
    processGroups: ['initiating', 'planning', 'executing', 'monitoring', 'closing'],
    keyProcesses: ['Develop Charter', 'Develop PM Plan', 'Direct Work', 'Monitor Work', 'Perform Change Control', 'Close Project'],
    examTip: 'Integration is the PM\'s primary responsibility. It\'s about making trade-offs and balancing competing constraints.',
  },
  {
    id: 'scope',
    name: 'Scope',
    icon: '🎯',
    color: '#2563eb',
    description: 'Ensuring the project includes all required work — and ONLY the required work.',
    processGroups: ['planning', 'monitoring'],
    keyProcesses: ['Plan Scope', 'Collect Requirements', 'Define Scope', 'Create WBS', 'Validate Scope', 'Control Scope'],
    examTip: 'No executing process for Scope — the TEAM executes the scope work. Validate Scope = formal acceptance. Control Scope = preventing scope creep.',
  },
  {
    id: 'schedule',
    name: 'Schedule',
    icon: '📅',
    color: '#0891b2',
    description: 'Managing timely completion of the project.',
    processGroups: ['planning', 'monitoring'],
    keyProcesses: ['Plan Schedule', 'Define Activities', 'Sequence Activities', 'Estimate Durations', 'Develop Schedule', 'Control Schedule'],
    examTip: 'Critical Path Method (CPM) is key. Float = 0 means critical path. PERT uses beta distribution for estimates.',
  },
  {
    id: 'cost',
    name: 'Cost',
    icon: '💰',
    color: '#059669',
    description: 'Planning, estimating, budgeting, and controlling costs.',
    processGroups: ['planning', 'monitoring'],
    keyProcesses: ['Plan Cost', 'Estimate Costs', 'Determine Budget', 'Control Costs (EVM)'],
    examTip: 'Earned Value Management (EVM) lives here. Know CPI, SPI, EAC, ETC, VAC, TCPI formulas.',
  },
  {
    id: 'quality',
    name: 'Quality',
    icon: '✨',
    color: '#d97706',
    description: 'Managing quality of both the product and the project processes.',
    processGroups: ['planning', 'executing', 'monitoring'],
    keyProcesses: ['Plan Quality', 'Manage Quality (QA)', 'Control Quality (QC)'],
    examTip: 'Manage Quality = prevention (proactive). Control Quality = inspection (reactive). Quality is planned in, not inspected in.',
  },
  {
    id: 'resources',
    name: 'Resources',
    icon: '👥',
    color: '#dc2626',
    description: 'Identifying, acquiring, and managing project resources.',
    processGroups: ['planning', 'executing', 'monitoring'],
    keyProcesses: ['Plan Resources', 'Estimate Activities', 'Acquire Resources', 'Develop Team', 'Manage Team', 'Control Resources'],
    examTip: 'Tuckman model: Forming → Storming → Norming → Performing → Adjourning. Servant leadership is key in agile.',
  },
  {
    id: 'communications',
    name: 'Communications',
    icon: '💬',
    color: '#6366f1',
    description: 'Ensuring timely and appropriate generation, collection, and distribution of project information.',
    processGroups: ['planning', 'executing', 'monitoring'],
    keyProcesses: ['Plan Communications', 'Manage Communications', 'Monitor Communications'],
    examTip: 'Communication channels = n(n-1)/2. Adding one person adds many channels. 90% of PM time is spent communicating.',
  },
  {
    id: 'risk',
    name: 'Risk',
    icon: '⚠️',
    color: '#ea580c',
    description: 'Maximizing probability of positive events and minimizing probability of negative events.',
    processGroups: ['planning', 'executing', 'monitoring'],
    keyProcesses: ['Plan Risk Mgmt', 'Identify Risks', 'Qualitative Analysis', 'Quantitative Analysis', 'Plan Responses', 'Implement Responses', 'Monitor Risks'],
    examTip: 'Risk has the most Planning processes (5). Strategies: Avoid, Mitigate, Transfer, Accept (threats). Exploit, Enhance, Share, Accept (opportunities).',
  },
  {
    id: 'procurement',
    name: 'Procurement',
    icon: '📝',
    color: '#0d9488',
    description: 'Purchasing or acquiring products, services, or results from outside the project team.',
    processGroups: ['planning', 'executing', 'monitoring'],
    keyProcesses: ['Plan Procurement', 'Conduct Procurements', 'Control Procurements'],
    examTip: 'Contract types: FFP (Fixed-Price), T&M (Time & Materials), CPFF (Cost-Plus). Seller risk is highest in FFP. Buyer risk is highest in Cost-Plus.',
  },
  {
    id: 'stakeholders',
    name: 'Stakeholders',
    icon: '🤝',
    color: '#a855f7',
    description: 'Identifying and engaging people who could affect or be affected by the project.',
    processGroups: ['initiating', 'planning', 'executing', 'monitoring'],
    keyProcesses: ['Identify Stakeholders', 'Plan Engagement', 'Manage Engagement', 'Monitor Engagement'],
    examTip: 'Stakeholder identification is continuous. Power/Interest grid determines engagement strategy. No Closing process for stakeholders.',
  },
]

// ─── Flow Arrow SVG ───────────────────────────────────────────────
function FlowArrow() {
  return (
    <div className="flex items-center justify-center py-1">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

// ─── Process Group Card ───────────────────────────────────────────
function ProcessGroupCard({ group, isActive, onClick }: {
  group: typeof PROCESS_GROUPS[0]; isActive: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all hover:shadow-md ${
        isActive
          ? 'border-2 shadow-md'
          : 'border-gray-100 bg-white'
      }`}
      style={isActive ? { borderColor: group.color, backgroundColor: group.color + '08' } : {}}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: group.color + '15' }}>
          {group.icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{group.name}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{group.description}</p>
        </div>
      </div>
    </button>
  )
}

// ─── Knowledge Area Badge ─────────────────────────────────────────
function KaBadge({ ka, isActive, onClick }: {
  ka: typeof KNOWLEDGE_AREAS[0]; isActive: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
        isActive
          ? 'text-white shadow-md'
          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
      }`}
      style={isActive ? { backgroundColor: ka.color, borderColor: ka.color } : {}}
    >
      {ka.icon} {ka.name}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────
export default function ProcessesPage() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [activeKA, setActiveKA] = useState<string | null>(null)

  const selectedGroup = PROCESS_GROUPS.find(g => g.id === activeGroup)
  const selectedKA = KNOWLEDGE_AREAS.find(k => k.id === activeKA)

  // For the matrix view - which KAs appear in which process groups
  const getKAsForGroup = (groupId: string) =>
    KNOWLEDGE_AREAS.filter(ka => ka.processGroups.includes(groupId))

  const getGroupsForKA = (kaId: string) => {
    const ka = KNOWLEDGE_AREAS.find(k => k.id === kaId)
    return PROCESS_GROUPS.filter(g => ka?.processGroups.includes(g.id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔄 Process Relationships</h1>
            <p className="text-sm text-gray-500 mt-0.5">Interactive map of how PMP processes connect and flow</p>
          </div>
          <Link href="/dashboard" className="text-sm text-violet-600 hover:underline font-medium">← Dashboard</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Process Flow — Visual Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Process Group Flow</h2>
          <p className="text-xs text-gray-400 mb-4">Click any process group to explore its activities, outputs, and exam tips.</p>

          {/* Flow diagram */}
          <div className="flex flex-col items-center">
            {PROCESS_GROUPS.map((group, i) => (
              <div key={group.id} className="w-full max-w-md">
                <ProcessGroupCard
                  group={group}
                  isActive={activeGroup === group.id}
                  onClick={() => setActiveGroup(activeGroup === group.id ? null : group.id)}
                />
                {i < PROCESS_GROUPS.length - 1 && <FlowArrow />}
              </div>
            ))}
          </div>

          {/* Bidirectional note */}
          <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
            <p className="text-xs text-violet-700">
              ↔️ <strong>Dynamic flow:</strong> Planning, Executing, and M&C have bidirectional arrows — changes in execution often require re-planning. M&C runs throughout the entire project.
            </p>
          </div>
        </div>

        {/* Expanded Process Group Detail */}
        {selectedGroup && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: selectedGroup.color + '40' }}>
            <div className="px-6 py-4 border-b" style={{ backgroundColor: selectedGroup.color + '08', borderColor: selectedGroup.color + '20' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedGroup.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedGroup.name}</h2>
                  <p className="text-sm text-gray-500">{selectedGroup.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Activities */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">📌 Key Activities</h3>
                <div className="space-y-2">
                  {selectedGroup.keyActivities.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-violet-400 mt-0.5 text-xs">▸</span>
                      <span className="text-sm text-gray-700">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Outputs */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">📤 Key Outputs</h3>
                <div className="space-y-2">
                  {selectedGroup.keyOutputs.map((o, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">{o}</div>
                  ))}
                </div>

                {/* Knowledge Areas in this group */}
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">🔗 Knowledge Areas</h3>
                <div className="flex flex-wrap gap-1.5">
                  {getKAsForGroup(selectedGroup.id).map(ka => (
                    <span key={ka.id} className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: ka.color + '15', color: ka.color }}>
                      {ka.icon} {ka.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exam Tip */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎯 Exam Tip</h3>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-amber-800 leading-relaxed">{selectedGroup.examTip}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Areas Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Knowledge Areas</h2>
          <p className="text-xs text-gray-400 mb-4">Click any knowledge area to see which process groups it spans and its key processes.</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {KNOWLEDGE_AREAS.map(ka => (
              <KaBadge
                key={ka.id}
                ka={ka}
                isActive={activeKA === ka.id}
                onClick={() => setActiveKA(activeKA === ka.id ? null : ka.id)}
              />
            ))}
          </div>

          {/* Expanded KA detail */}
          {selectedKA && (
            <div className="border rounded-xl overflow-hidden mt-4" style={{ borderColor: selectedKA.color + '40' }}>
              <div className="px-5 py-3 border-b" style={{ backgroundColor: selectedKA.color + '08', borderColor: selectedKA.color + '20' }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedKA.icon}</span>
                  <h3 className="text-sm font-bold text-gray-900">{selectedKA.name} Management</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">{selectedKA.description}</p>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Process Groups */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Active In</h4>
                  <div className="space-y-1.5">
                    {getGroupsForKA(selectedKA.id).map(g => (
                      <div key={g.id} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                        <span className="text-gray-700 font-medium">{g.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Processes */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Processes</h4>
                  <div className="space-y-1.5">
                    {selectedKA.keyProcesses.map((p, i) => (
                      <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5">{p}</div>
                    ))}
                  </div>
                </div>

                {/* Exam Tip */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🎯 Exam Tip</h4>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-sm text-amber-800 leading-relaxed">{selectedKA.examTip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Matrix */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Process Group × Knowledge Area Matrix</h2>
          <p className="text-xs text-gray-400 mb-4">Shows which knowledge areas have processes in each process group.</p>

          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 text-gray-500 font-bold uppercase tracking-wider">Knowledge Area</th>
                {PROCESS_GROUPS.map(g => (
                  <th key={g.id} className="text-center px-3 py-2 font-bold uppercase tracking-wider" style={{ color: g.color }}>
                    {g.icon}<br/>{g.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KNOWLEDGE_AREAS.map(ka => (
                <tr key={ka.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 font-semibold text-gray-700">{ka.icon} {ka.name}</td>
                  {PROCESS_GROUPS.map(g => {
                    const active = ka.processGroups.includes(g.id)
                    return (
                      <td key={g.id} className="text-center px-3 py-2.5">
                        {active ? (
                          <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: g.color }}>✓</span>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-violet-800 mb-1">🔗 Integration is King</p>
            <p className="text-xs text-violet-700 leading-relaxed">Integration Management is the ONLY knowledge area with processes in ALL 5 process groups. It\'s the PM\'s core job.</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-amber-800 mb-1">👁️ M&C is Everywhere</p>
            <p className="text-xs text-amber-700 leading-relaxed">Monitoring & Controlling runs throughout the entire project. ALL knowledge areas have M&C processes.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-emerald-800 mb-1">📋 Planning is Biggest</p>
            <p className="text-xs text-emerald-700 leading-relaxed">Planning has the most processes. ALL knowledge areas have Planning processes. Planning is iterative, not a one-time event.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white text-center">
          <p className="text-sm font-bold mb-1">Test your process knowledge!</p>
          <p className="text-xs text-violet-200 mb-3">Practice questions that test process group and knowledge area relationships.</p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/practice"
              className="bg-white text-violet-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
              🎯 Practice Now
            </Link>
            <Link href="/dashboard/formulas"
              className="bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors">
              📐 Formulas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
