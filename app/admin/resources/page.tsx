"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Resource = {
  id: string;
  title: string;
  description: string;
  framework: string;
  tier: number;
  type: string;
  url: string | null;
  file_path: string | null;
  is_active: boolean;
  created_at: string;
};

const FRAMEWORK_LABELS: Record<string, { label: string; color: string }> = {
  pmbok7: { label: "PMBOK 7", color: "#1e40af" },
  pmbok8: { label: "PMBOK 8", color: "#0f766e" },
  both: { label: "Both", color: "#7c3aed" },
};

const TIER_LABELS: Record<number, { label: string; color: string; description: string }> = {
  1: { label: "Tier 1", color: "#15803d", description: "Primary PMI Sources" },
  2: { label: "Tier 2", color: "#b45309", description: "AI Models & Tools" },
  3: { label: "Tier 3", color: "#6b7280", description: "Supplementary" },
};

const TYPE_ICONS: Record<string, string> = {
  pdf: "📄",
  document: "📝",
  url: "🔗",
  ai_model: "🤖",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFramework, setFilterFramework] = useState("all");
  const [filterTier, setFilterTier] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    setLoading(true);
    const { data } = await supabase
      .from("resource_library")
      .select("*")
      .order("tier", { ascending: true })
      .order("framework", { ascending: true });
    setResources(data || []);
    setLoading(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase
      .from("resource_library")
      .update({ is_active: !current })
      .eq("id", id);
    setResources(resources.map((r) => r.id === id ? { ...r, is_active: !current } : r));
  }

  const filtered = resources.filter((r) => {
    if (filterFramework !== "all" && r.framework !== filterFramework) return false;
    if (filterTier !== 0 && r.tier !== filterTier) return false;
    return true;
  });

  const grouped = [1, 2, 3].map((tier) => ({
    tier,
    items: filtered.filter((r) => r.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the source documents that power AI Tutor and question generation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <span className="font-semibold text-gray-900">{resources.filter((r) => r.is_active).length}</span> active sources ·
          <span className="font-semibold text-gray-900">{resources.length}</span> total
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex bg-white border border-gray-200 rounded-xl p-1">
          {["all", "pmbok7", "pmbok8", "both"].map((fw) => (
            <button
              key={fw}
              onClick={() => setFilterFramework(fw)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={filterFramework === fw ? { backgroundColor: "#1e40af", color: "white" } : { color: "#6b7280" }}
            >
              {fw === "all" ? "All Frameworks" : FRAMEWORK_LABELS[fw]?.label}
            </button>
          ))}
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1">
          {[0, 1, 2, 3].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={filterTier === tier ? { backgroundColor: "#1e40af", color: "white" } : { color: "#6b7280" }}
            >
              {tier === 0 ? "All Tiers" : `Tier ${tier}`}
            </button>
          ))}
        </div>
      </div>

      {/* Resource groups */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading resources...</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ tier, items }) => (
            <div key={tier}>
              {/* Tier header */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: TIER_LABELS[tier]?.color }}
                >
                  {TIER_LABELS[tier]?.label}
                </span>
                <span className="text-sm font-semibold text-gray-700">{TIER_LABELS[tier]?.description}</span>
                <span className="text-xs text-gray-400">{items.length} sources</span>
              </div>

              {/* Resource cards */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {items.map((resource) => (
                  <div
                    key={resource.id}
                    className={`bg-white rounded-xl border overflow-hidden transition-all ${
                      resource.is_active ? "border-gray-200 shadow-sm" : "border-gray-100 opacity-50"
                    }`}
                  >
                    <div className="px-4 py-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{TYPE_ICONS[resource.type] || "📎"}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{resource.title}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: FRAMEWORK_LABELS[resource.framework]?.color }}
                              >
                                {FRAMEWORK_LABELS[resource.framework]?.label}
                              </span>
                              <span className="text-[10px] text-gray-400 uppercase font-semibold">{resource.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* Toggle */}
                        <button
                          onClick={() => toggleActive(resource.id, resource.is_active)}
                          className="flex-shrink-0 w-10 h-5 rounded-full transition-all relative"
                          style={{ backgroundColor: resource.is_active ? "#22c55e" : "#e5e7eb" }}
                        >
                          <div
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                            style={{ left: resource.is_active ? "calc(100% - 18px)" : "2px" }}
                          />
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed">{resource.description}</p>

                      {resource.file_path && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                          <span>📁</span>
                          <span className="truncate font-mono">{resource.file_path}</span>
                        </div>
                      )}
                      {resource.url && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-500">
                          <span>🔗</span>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                            {resource.url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}