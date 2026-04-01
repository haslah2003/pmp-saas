import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Key required" }, { status: 400 });
  const supabase = await createClient();
  const { data } = await supabase.from("content_cache").select("content, content_type, created_at").eq("cache_key", key).single();
  if (!data) return NextResponse.json({ cached: false });
  return NextResponse.json({ cached: true, content: data.content, type: data.content_type });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key, content, type } = await request.json();
  if (!key || !content) return NextResponse.json({ error: "Key and content required" }, { status: 400 });
  await supabase.from("content_cache").upsert({ cache_key: key, content, content_type: type || "text", created_at: new Date().toISOString() }, { onConflict: "cache_key" });
  return NextResponse.json({ cached: true });
}
