import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { COURSES } from "@/lib/courses-data";

function buildCacheKey(sectionType: string, lessonTitle: string, contentRaw: string, language: string): string {
  const lp = language === "ar" ? "ar:" : "";
  return `deeper:${lp}${sectionType}:${lessonTitle}:${contentRaw}`
    .toLowerCase()
    .replace(/[^a-z0-9:]/g, "-")
    .slice(0, 190);
}

function enumerateAllItems(language: string) {
  const items: { courseSlug: string; courseName: string; lessonSlug: string; lessonTitle: string; domain: string; sectionType: string; label: string; cacheKey: string; content: Record<string, string> | string }[] = [];
  for (const course of COURSES) {
    for (const lesson of course.lessons) {
      for (const kc of lesson.keyConcepts) {
        const raw = JSON.stringify({ term: kc.term, definition: kc.definition });
        items.push({ courseSlug: course.slug, courseName: course.shortTitle, lessonSlug: lesson.slug, lessonTitle: lesson.title, domain: course.title, sectionType: "concept", label: kc.term, cacheKey: buildCacheKey("concept", lesson.title, raw, language), content: { term: kc.term, definition: kc.definition } });
      }
      for (const dd of lesson.deepDive) {
        const raw = JSON.stringify({ heading: dd.heading, content: dd.content });
        items.push({ courseSlug: course.slug, courseName: course.shortTitle, lessonSlug: lesson.slug, lessonTitle: lesson.title, domain: course.title, sectionType: "deepdive", label: dd.heading, cacheKey: buildCacheKey("deepdive", lesson.title, raw, language), content: { heading: dd.heading, content: dd.content } });
      }
      for (const tip of lesson.examTips) {
        items.push({ courseSlug: course.slug, courseName: course.shortTitle, lessonSlug: lesson.slug, lessonTitle: lesson.title, domain: course.title, sectionType: "tip", label: tip.slice(0, 60) + (tip.length > 60 ? "..." : ""), cacheKey: buildCacheKey("tip", lesson.title, tip, language), content: tip });
      }
      if (lesson.ritaInsight) {
        items.push({ courseSlug: course.slug, courseName: course.shortTitle, lessonSlug: lesson.slug, lessonTitle: lesson.title, domain: course.title, sectionType: "rita", label: "Rita Mulcahy Insight", cacheKey: buildCacheKey("rita", lesson.title, lesson.ritaInsight, language), content: lesson.ritaInsight });
      }
      for (const pitfall of lesson.commonPitfalls) {
        items.push({ courseSlug: course.slug, courseName: course.shortTitle, lessonSlug: lesson.slug, lessonTitle: lesson.title, domain: course.title, sectionType: "pitfall", label: pitfall.slice(0, 60) + (pitfall.length > 60 ? "..." : ""), cacheKey: buildCacheKey("pitfall", lesson.title, pitfall, language), content: pitfall });
      }
    }
  }
  return items;
}

export async function GET(req: NextRequest) {
  const language = new URL(req.url).searchParams.get("language") || "en";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const allItems = enumerateAllItems(language);

  // Fetch ALL deeper cache keys from Supabase in one shot
  const cachedKeys = new Set<string>();
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from("content_cache")
      .select("cache_key")
      .like("cache_key", language === "ar" ? "deeper:ar:%" : "deeper:%")
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      if (language === "en" && row.cache_key.startsWith("deeper:ar:")) continue;
      cachedKeys.add(row.cache_key);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  const lessonMap: Record<string, { courseSlug: string; courseName: string; lessonSlug: string; lessonTitle: string; domain: string; total: number; cached: number; items: { sectionType: string; label: string; cacheKey: string; cached: boolean; content: Record<string, string> | string }[] }> = {};
  for (const item of allItems) {
    const key = item.courseSlug + "/" + item.lessonSlug;
    if (!lessonMap[key]) lessonMap[key] = { courseSlug: item.courseSlug, courseName: item.courseName, lessonSlug: item.lessonSlug, lessonTitle: item.lessonTitle, domain: item.domain, total: 0, cached: 0, items: [] };
    const isCached = cachedKeys.has(item.cacheKey);
    lessonMap[key].total++;
    if (isCached) lessonMap[key].cached++;
    lessonMap[key].items.push({ sectionType: item.sectionType, label: item.label, cacheKey: item.cacheKey, cached: isCached, content: item.content });
  }

  const domainMap: Record<string, { courseName: string; courseSlug: string; total: number; cached: number; lessons: typeof lessonMap[string][] }> = {};
  for (const lesson of Object.values(lessonMap)) {
    if (!domainMap[lesson.courseSlug]) domainMap[lesson.courseSlug] = { courseName: lesson.courseName, courseSlug: lesson.courseSlug, total: 0, cached: 0, lessons: [] };
    domainMap[lesson.courseSlug].total += lesson.total;
    domainMap[lesson.courseSlug].cached += lesson.cached;
    domainMap[lesson.courseSlug].lessons.push(lesson);
  }

  const totalItems = allItems.length;
  const totalCached = allItems.filter(i => cachedKeys.has(i.cacheKey)).length;

  return NextResponse.json({ totalItems, totalCached, coveragePercent: totalItems > 0 ? Math.round((totalCached / totalItems) * 100) : 0, domains: Object.values(domainMap) });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { keys } = await req.json();
  if (!keys || !Array.isArray(keys)) return NextResponse.json({ error: "Keys array required" }, { status: 400 });
  for (const key of keys) await supabase.from("content_cache").delete().eq("cache_key", key);
  return NextResponse.json({ deleted: keys.length });
}
