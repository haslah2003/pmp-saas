"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface CacheItem { sectionType: string; label: string; cacheKey: string; cached: boolean; content: Record<string, string> | string; }
interface LessonStats { courseSlug: string; courseName: string; lessonSlug: string; lessonTitle: string; domain: string; total: number; cached: number; items: CacheItem[]; }
interface DomainStats { courseName: string; courseSlug: string; total: number; cached: number; lessons: LessonStats[]; }
interface Stats { totalItems: number; totalCached: number; coveragePercent: number; domains: DomainStats[]; }

const SECTION_ICONS: Record<string, string> = { concept: "\u{1f4a1}", deepdive: "\u{1f52c}", tip: "\u{1f3af}", rita: "\u{1f4d6}", pitfall: "\u{26a0}\u{fe0f}" };
const SECTION_LABELS: Record<string, string> = { concept: "Key Concept", deepdive: "Deep Dive", tip: "Exam Tip", rita: "Rita Insight", pitfall: "Common Pitfall" };

export default function ContentManagerClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [genLang, setGenLang] = useState<"en" | "ar">("en");
  const [generating, setGenerating] = useState(false);
  const [genTarget, setGenTarget] = useState("");
  const [genProgress, setGenProgress] = useState(0);
  const [genTotal, setGenTotal] = useState(0);
  const [genCurrent, setGenCurrent] = useState("");
  const [genLog, setGenLog] = useState<string[]>([]);
  const [genErrors, setGenErrors] = useState<string[]>([]);
  const abortRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch(`/api/admin/content-manager?language=${genLang}`); if (res.ok) setStats(await res.json()); } catch (e) { console.error(e); }
    setLoading(false);
  }, [genLang]);

  useEffect(() => { fetchStats(); }, [fetchStats, genLang]);
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [genLog]);

  const generateItems = async (items: CacheItem[], lessonTitle: string, domain: string, targetLabel: string) => {
    const uncached = items.filter((i) => !i.cached);
    if (uncached.length === 0) return;
    setGenerating(true); setGenTarget(targetLabel); setGenProgress(0); setGenTotal(uncached.length); setGenLog([]); setGenErrors([]); abortRef.current = false;

    for (let i = 0; i < uncached.length; i++) {
      if (abortRef.current) { setGenLog((p) => [...p, "\u26d4 Generation stopped by admin."]); break; }
      const item = uncached[i];
      setGenCurrent(`${SECTION_ICONS[item.sectionType] || "\u{1f4c4}"} ${item.label}`);
      setGenLog((p) => [...p, `[${i + 1}/${uncached.length}] ${SECTION_LABELS[item.sectionType]} \u2014 ${item.label.slice(0, 50)}`]);
      try {
        const res = await fetch("/api/deeper", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sectionType: item.sectionType, content: item.content, lessonTitle, domain, framework: "pmbok7", language: genLang }) });
        if (res.ok) {
          const reader = res.body?.getReader(); if (reader) { let done = false; while (!done) { const r = await reader.read(); done = r.done; } }
          setGenLog((p) => [...p, "  \u2705 Cached successfully"]);
        } else { setGenLog((p) => [...p, `  \u274c Failed: ${res.status}`]); setGenErrors((p) => [...p, `${item.label}: HTTP ${res.status}`]); }
      } catch (err) { setGenLog((p) => [...p, `  \u274c Error: ${String(err)}`]); setGenErrors((p) => [...p, `${item.label}: ${String(err)}`]); }
      setGenProgress(i + 1);
      if (i < uncached.length - 1) await new Promise((r) => setTimeout(r, 1500));
    }
    setGenerating(false); setGenCurrent(""); await fetchStats();
  };

  const generateForLesson = (lesson: LessonStats) => { generateItems(lesson.items, lesson.lessonTitle, lesson.domain, `Lesson: ${lesson.lessonTitle}`); };

  const generateForDomain = async (domain: DomainStats) => {
    const groups: { items: CacheItem[]; lessonTitle: string; domain: string }[] = [];
    for (const lesson of domain.lessons) { const unc = lesson.items.filter((i) => !i.cached); if (unc.length > 0) groups.push({ items: unc, lessonTitle: lesson.lessonTitle, domain: lesson.domain }); }
    if (groups.length === 0) return;
    const totalUncached = groups.reduce((s, g) => s + g.items.length, 0);
    setGenerating(true); setGenTarget(`Domain: ${domain.courseName}`); setGenProgress(0); setGenTotal(totalUncached); setGenLog([]); setGenErrors([]); abortRef.current = false;
    let idx = 0;
    for (const group of groups) {
      if (abortRef.current) break;
      setGenLog((p) => [...p, `\n\u{1f4da} ${group.lessonTitle}`]);
      for (const item of group.items) {
        if (abortRef.current) { setGenLog((p) => [...p, "\u26d4 Generation stopped."]); break; }
        idx++;
        setGenCurrent(`${SECTION_ICONS[item.sectionType] || "\u{1f4c4}"} ${item.label}`);
        setGenLog((p) => [...p, `[${idx}/${totalUncached}] ${SECTION_LABELS[item.sectionType]} \u2014 ${item.label.slice(0, 50)}`]);
        try {
          const res = await fetch("/api/deeper", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sectionType: item.sectionType, content: item.content, lessonTitle: group.lessonTitle, domain: group.domain, framework: "pmbok7", language: genLang }) });
          if (res.ok) { const reader = res.body?.getReader(); if (reader) { let done = false; while (!done) { const r = await reader.read(); done = r.done; } } setGenLog((p) => [...p, "  \u2705 Cached"]); }
          else { setGenLog((p) => [...p, `  \u274c Failed: ${res.status}`]); setGenErrors((p) => [...p, `${item.label}: HTTP ${res.status}`]); }
        } catch (err) { setGenLog((p) => [...p, `  \u274c Error: ${String(err)}`]); setGenErrors((p) => [...p, `${item.label}: ${String(err)}`]); }
        setGenProgress(idx);
        if (idx < totalUncached) await new Promise((r) => setTimeout(r, 1500));
      }
    }
    setGenerating(false); setGenCurrent(""); await fetchStats();
  };

  const deleteCache = async (keys: string[]) => {
    if (!confirm(`Delete ${keys.length} cached item(s)?`)) return;
    await fetch("/api/admin/content-manager", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keys }) });
    await fetchStats();
  };

  const pct = (c: number, t: number) => t > 0 ? Math.round((c / t) * 100) : 0;

  if (loading && !stats) return (<div className="flex items-center justify-center h-64"><div className="text-center"><div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-gray-500">Loading cache statistics...</p></div></div>);
  if (!stats) return (<div className="text-center py-16"><p className="text-red-500">Failed to load.</p><button onClick={fetchStats} className="mt-4 text-sm text-violet-600 hover:underline">Retry</button></div>);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">{"\u26a1"}</span><h1 className="text-2xl font-bold text-gray-900">Content Manager</h1></div>
        <p className="text-gray-500 text-sm">Pre-generate AI content to eliminate API costs and deliver instant responses to users.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5"><p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total items</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalItems}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-5"><p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Cached</p><p className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalCached}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-5"><p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Remaining</p><p className="text-3xl font-bold text-amber-500 mt-1">{stats.totalItems - stats.totalCached}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-5"><p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Coverage</p><p className="text-3xl font-bold text-violet-600 mt-1">{stats.coveragePercent}%</p><div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{width:`${stats.coveragePercent}%`,background:stats.coveragePercent===100?"#10b981":"linear-gradient(90deg,#1AB0A2,#5B2D91)"}}/></div></div>
      </div>

      {/* Progress Panel */}
      {generating && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-sm font-semibold text-violet-900">Generating: {genTarget}</p><p className="text-xs text-violet-600 mt-0.5">{genCurrent}</p></div>
            <button onClick={() => { abortRef.current = true; }} className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Stop</button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-3 bg-violet-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-violet-500 rounded-full transition-all duration-300" style={{width:`${genTotal>0?(genProgress/genTotal)*100:0}%`}}/></div>
            <span className="text-sm font-mono font-semibold text-violet-700">{genProgress}/{genTotal}</span>
          </div>
          {genErrors.length > 0 && <p className="text-xs text-red-500 mt-1">{genErrors.length} error(s)</p>}
          <div className="mt-3 max-h-48 overflow-y-auto bg-white rounded-lg border border-violet-100 p-3 font-mono text-xs text-gray-600">
            {genLog.map((line, i) => (<div key={i} className={line.includes("\u2705")?"text-emerald-600":line.includes("\u274c")?"text-red-500":line.includes("\u26d4")?"text-red-600 font-bold":line.startsWith("\n")?"text-violet-700 font-semibold mt-2":""}>{line}</div>))}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* Language Toggle */}
      <div className="flex items-center gap-3 mb-6 bg-white rounded-xl border border-gray-100 p-4">
        <span className="text-sm font-medium text-gray-600">Generate for:</span>
        <button onClick={() => setGenLang("en")} className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition ${genLang === "en" ? "bg-violet-100 text-violet-700" : "text-gray-400 hover:text-gray-600"}`}>English</button>
        <button onClick={() => setGenLang("ar")} className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition ${genLang === "ar" ? "bg-violet-100 text-violet-700" : "text-gray-400 hover:text-gray-600"}`}>عربي</button>
      </div>

      {/* Domains */}
      <div className="space-y-3">
        {stats.domains.map((domain) => {
          const dp = pct(domain.cached, domain.total); const isExp = expandedDomain === domain.courseSlug; const du = domain.total - domain.cached;
          return (
            <div key={domain.courseSlug} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition" onClick={() => setExpandedDomain(isExp ? null : domain.courseSlug)}>
                <div className="flex items-center gap-3">
                  <span className={`text-lg transform transition-transform ${isExp ? "rotate-90" : ""}`}>{"\u25b6"}</span>
                  <div><p className="font-semibold text-gray-900">{domain.courseName}</p><p className="text-xs text-gray-400">{domain.lessons.length} lessons · {domain.total} items</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${dp}%`,background:dp===100?"#10b981":"linear-gradient(90deg,#1AB0A2,#5B2D91)"}}/></div><span className={`text-xs font-semibold ${dp===100?"text-emerald-600":"text-gray-500"}`}>{dp}%</span></div>
                  {du > 0 && <button disabled={generating} onClick={(e) => { e.stopPropagation(); generateForDomain(domain); }} className="text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition">Generate {du}</button>}
                  {dp === 100 && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">{"\u2713"} Complete</span>}
                </div>
              </div>
              {isExp && (
                <div className="border-t border-gray-50">
                  {domain.lessons.map((lesson) => {
                    const lp = pct(lesson.cached, lesson.total); const lk = `${lesson.courseSlug}/${lesson.lessonSlug}`; const le = expandedLesson === lk; const lu = lesson.total - lesson.cached;
                    return (
                      <div key={lk} className="border-b border-gray-50 last:border-b-0">
                        <div className="flex items-center justify-between px-5 py-3 pl-12 cursor-pointer hover:bg-gray-50 transition" onClick={() => setExpandedLesson(le ? null : lk)}>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs text-gray-400 transform transition-transform ${le ? "rotate-90" : ""}`}>{"\u25b6"}</span>
                            <div><p className="text-sm font-medium text-gray-800">{lesson.lessonTitle}</p><p className="text-xs text-gray-400">{lesson.total} items · {lesson.cached} cached</p></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${lp}%`,background:lp===100?"#10b981":"#1AB0A2"}}/></div><span className="text-xs text-gray-500">{lp}%</span></div>
                            {lu > 0 && <button disabled={generating} onClick={(e) => { e.stopPropagation(); generateForLesson(lesson); }} className="text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md disabled:opacity-50 transition">Generate {lu}</button>}
                            {lp === 100 && <span className="text-xs text-emerald-500">{"\u2713"}</span>}
                          </div>
                        </div>
                        {le && (
                          <div className="bg-gray-50 px-5 py-3 pl-16">
                            <div className="space-y-1.5">
                              {lesson.items.map((item) => (
                                <div key={item.cacheKey} className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg border border-gray-100">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm flex-shrink-0">{SECTION_ICONS[item.sectionType] || "\u{1f4c4}"}</span>
                                    <span className="text-xs text-gray-400 flex-shrink-0 w-20">{SECTION_LABELS[item.sectionType]}</span>
                                    <span className="text-xs text-gray-700 truncate">{item.label}</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {item.cached ? (<><span className="text-xs text-emerald-500 font-medium">Cached {"\u2713"}</span><button onClick={() => deleteCache([item.cacheKey])} className="text-xs text-red-400 hover:text-red-600 transition" title="Delete">{"\u{1f5d1}"}</button></>) : (<span className="text-xs text-amber-500 font-medium">Pending</span>)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {lesson.cached > 0 && (<div className="mt-3 pt-2 border-t border-gray-200"><button onClick={() => deleteCache(lesson.items.filter((i) => i.cached).map((i) => i.cacheKey))} className="text-xs text-red-500 hover:text-red-700 transition">Clear all cached ({lesson.cached})</button></div>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {stats.totalCached < stats.totalItems && (
        <div className="mt-8 text-center">
          <button disabled={generating} onClick={async () => { for (const d of stats.domains) { if (abortRef.current) break; if (d.cached < d.total) await generateForDomain(d); } }} className="text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-violet-200">{"\u{1f680}"} Generate All Remaining ({stats.totalItems - stats.totalCached} items)</button>
          <p className="text-xs text-gray-400 mt-2">Estimated time: ~{Math.ceil((stats.totalItems - stats.totalCached) * 25 / 60)} min · Cost: ~${((stats.totalItems - stats.totalCached) * 0.04).toFixed(2)}</p>
        </div>
      )}

      {stats.coveragePercent === 100 && (
        <div className="mt-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 p-6">
          <span className="text-4xl">{"\u{1f389}"}</span>
          <p className="text-lg font-bold text-emerald-800 mt-2">100% Coverage — All content pre-generated!</p>
          <p className="text-sm text-emerald-600 mt-1">Every Go Deeper click loads instantly with zero API cost.</p>
        </div>
      )}
    </div>
  );
}
