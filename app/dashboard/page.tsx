import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const PMBOK_MODULES = [
  { id: 1, title: "Project Management Foundations", description: "PMBOK 7 principles, value delivery systems, and project management concepts.", lessons: 8, hours: 3, color: "#22c55e", progress: 100, emoji: "🏗️" },
  { id: 2, title: "Stakeholder Performance Domain", description: "Stakeholder identification, engagement, and communication strategies.", lessons: 6, hours: 2.5, color: "#3b82f6", progress: 50, emoji: "🤝" },
  { id: 3, title: "Team Performance Domain", description: "Team building, leadership, servant leadership, and conflict management.", lessons: 7, hours: 3, color: "#8b5cf6", progress: 15, emoji: "👥" },
  { id: 4, title: "Development Approach & Life Cycle", description: "Predictive, adaptive, hybrid approaches and delivery cadence.", lessons: 5, hours: 2, color: "#10b981", progress: 0, emoji: "🔄" },
  { id: 5, title: "Planning Performance Domain", description: "Scope, schedule, cost, resource, and quality planning.", lessons: 8, hours: 3.5, color: "#f59e0b", progress: 0, emoji: "📋" },
  { id: 6, title: "Project Work & Delivery", description: "Executing project work, procurement, knowledge management, quality delivery.", lessons: 7, hours: 3, color: "#ef4444", progress: 0, emoji: "🚀" },
  { id: 7, title: "Measurement Performance Domain", description: "KPIs, EVM, forecasting, dashboards, and reporting.", lessons: 6, hours: 2.5, color: "#6366f1", progress: 0, emoji: "📊" },
  { id: 8, title: "Uncertainty Performance Domain", description: "Risk management, ambiguity, complexity, and resilience.", lessons: 5, hours: 2, color: "#ec4899", progress: 0, emoji: "⚡" },
];

const ECO_MODULES = [
  { id: 9, title: "ECO People Domain", description: "All 14 ECO People tasks with enablers and situational practice. Covers conflict, leadership, collaboration, and team building.", lessons: 10, hours: 4, color: "#14b8a6", progress: 0, emoji: "👤", tasks: 14, domain: "People — 42%" },
  { id: 10, title: "ECO Process Domain", description: "All 17 ECO Process tasks with enablers and scenario-based learning. Covers scope, schedule, risk, procurement, and stakeholders.", lessons: 12, hours: 5, color: "#f97316", progress: 0, emoji: "⚙️", tasks: 17, domain: "Process — 50%" },
  { id: 11, title: "ECO Business Environment", description: "All 4 ECO Business Environment tasks. Covers compliance, benefits realization, external changes, and organizational change.", lessons: 4, hours: 1.5, color: "#a855f7", progress: 0, emoji: "🌐", tasks: 4, domain: "Business — 8%" },
];

function StatusBadge({ progress }: { progress: number }) {
  if (progress === 100) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Complete</span>
  );
  if (progress > 0) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Progress</span>
  );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Not Started</span>
  );
}

export default async function CoursePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const overallProgress = Math.round(
    [...PMBOK_MODULES, ...ECO_MODULES].reduce((sum, m) => sum + m.progress, 0) /
    (PMBOK_MODULES.length + ECO_MODULES.length)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course</h1>
          <p className="text-sm text-gray-500 mt-1">PMBOK 7 Performance Domains + ECO 2021 — your complete PMP prep curriculum.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-gray-400">Overall Progress</p>
            <p className="text-xl font-bold text-gray-900">{overallProgress}%</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#3b82f6 ${overallProgress * 3.6}deg, #e5e7eb 0deg)` }}>
            <div className="w-8 h-8 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Tab 1 — PMBOK 7 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">7</div>
          <div>
            <h2 className="text-base font-bold text-gray-900">PMBOK 7 — Performance Domains</h2>
            <p className="text-xs text-gray-500">8 domains covering the full project management framework</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PMBOK_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
              style={{ borderColor: mod.progress > 0 ? mod.color : '#e5e7eb' }}
            >
              <div className="px-5 pt-5 pb-3 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: mod.color }}>
                  {mod.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight" style={{ color: mod.progress > 0 && mod.progress < 100 ? mod.color : undefined }}>
                      {mod.title}
                    </h3>
                    <StatusBadge progress={mod.progress} />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{mod.description}</p>
                </div>
              </div>
              <div className="mx-5 rounded-xl flex items-center justify-center text-5xl py-4 mb-3" style={{ backgroundColor: mod.color + '15' }}>
                {mod.emoji}
              </div>
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>{mod.lessons} lessons · {mod.hours}h</span>
                  <span className="font-semibold" style={{ color: mod.color }}>{mod.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${mod.progress}%`, backgroundColor: mod.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Tab 2 — ECO 2021 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-bold">ECO</div>
          <div>
            <h2 className="text-base font-bold text-gray-900">ECO 2021 — Examination Content Outline</h2>
            <p className="text-xs text-gray-500">3 domains · 35 tasks · People 42% · Process 50% · Business 8%</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {ECO_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
              style={{ borderColor: mod.progress > 0 ? mod.color : '#e5e7eb' }}
            >
              <div className="px-5 pt-5 pb-3 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: mod.color }}>
                  {mod.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{mod.title}</h3>
                    <StatusBadge progress={mod.progress} />
                  </div>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white mt-1" style={{ backgroundColor: mod.color }}>
                    {mod.domain}
                  </span>
                </div>
              </div>
              <div className="mx-5 rounded-xl flex items-center justify-center text-5xl py-4 mb-3" style={{ backgroundColor: mod.color + '15' }}>
                {mod.emoji}
              </div>
              <div className="px-5 pb-3">
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{mod.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>{mod.tasks} tasks · {mod.lessons} lessons · {mod.hours}h</span>
                  <span className="font-semibold" style={{ color: mod.color }}>{mod.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${mod.progress}%`, backgroundColor: mod.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 