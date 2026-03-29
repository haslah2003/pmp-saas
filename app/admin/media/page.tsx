"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: "logo" | "favicon" | "sidebar_icon" | "course_image" | "banner" | "profile" | "video" | "other";
  tag: string;
  created_at: string;
};

const MEDIA_TYPES = [
  { value: "logo", label: "Logo" },
  { value: "favicon", label: "Favicon" },
  { value: "sidebar_icon", label: "Sidebar Icon" },
  { value: "course_image", label: "Course Image" },
  { value: "banner", label: "Banner" },
  { value: "profile", label: "Profile" },
  { value: "video", label: "Video" },
  { value: "other", label: "Other" },
];

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedType, setSelectedType] = useState<MediaItem["type"]>("other");
  const [selectedTag, setSelectedTag] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setLoading(true);
    const { data } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filename, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filename);

      await supabase.from("media_library").insert({
        name: file.name,
        url: urlData.publicUrl,
        type: selectedType,
        tag: selectedTag || file.name,
      });
      await loadMedia();
    } catch (err) {
      alert("Upload failed — check Supabase storage settings");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleExternalUrl() {
    if (!externalUrl.trim()) return;
    setUploading(true);
    try {
      await supabase.from("media_library").insert({
        name: selectedTag || externalUrl.split("/").pop() || "External",
        url: externalUrl.trim(),
        type: selectedType,
        tag: selectedTag || "external",
      });
      setExternalUrl("");
      setSelectedTag("");
      await loadMedia();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("media_library").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const filtered = filterType === "all" ? items : items.filter((i) => i.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage all images, icons, and videos for your app.</p>
      </div>

      {/* Upload panel */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab("upload")}
            className={`px-6 py-3 text-sm font-medium transition ${tab === "upload" ? "border-b-2 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            style={tab === "upload" ? { borderBottomColor: "var(--brand-primary, #1a2f5e)" } : {}}
          >
            📁 Upload File
          </button>
          <button
            onClick={() => setTab("url")}
            className={`px-6 py-3 text-sm font-medium transition ${tab === "url" ? "border-b-2 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            style={tab === "url" ? { borderBottomColor: "var(--brand-primary, #1a2f5e)" } : {}}
          >
            🔗 External URL
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Media Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MediaItem["type"])}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white"
              >
                {MEDIA_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Tag / Name</label>
              <input
                type="text"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                placeholder="e.g. Course 1 Image"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
              />
            </div>
          </div>

          {tab === "upload" ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition"
            >
              <div className="text-3xl mb-2">📤</div>
              <p className="text-sm font-medium text-gray-700">Click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, GIF, MP4 supported</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploading && <p className="text-xs text-blue-500 mt-2 font-medium">Uploading...</p>}
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
              />
              <button
                onClick={handleExternalUrl}
                disabled={uploading || !externalUrl.trim()}
                className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition"
                style={{ backgroundColor: uploading ? "#9ca3af" : "#1a2f5e" }}
              >
                {uploading ? "Saving..." : "Add URL"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...MEDIA_TYPES.map((t) => t.value)].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filterType === type
                ? "text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            style={filterType === type ? { backgroundColor: "#1a2f5e" } : {}}
          >
            {type === "all" ? "All" : MEDIA_TYPES.find((t) => t.value === type)?.label}
          </button>
        ))}
      </div>

      {/* Media grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading media...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-sm font-medium">No media yet</p>
          <p className="text-xs mt-1">Upload files or add external URLs above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
              <div className="h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
                {item.url.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={item.url} className="h-full w-full object-cover" />
                ) : (
                  <img src={item.url} alt={item.name} className="h-full w-full object-contain p-2" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-900 truncate">{item.tag || item.name}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {MEDIA_TYPES.find((t) => t.value === item.type)?.label}
                </span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="flex-1 text-[10px] py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium"
                  >
                    {copied === item.url ? "✓ Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-[10px] py-1 px-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}