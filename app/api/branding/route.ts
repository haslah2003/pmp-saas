import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("branding_config")
    .select("*")
    .eq("id", 1)
    .single();

  return NextResponse.json(data || {});
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await request.json();

  const { error } = await supabase
    .from("branding_config")
    .upsert({
      id: 1,
      site_name: body.site_name,
      logo_url: body.logo_url,
      favicon_url: body.favicon_url,
      primary_color: body.primary_color,
      secondary_color: body.secondary_color,
      accent_color: body.accent_color,
      dark_mode_primary: body.dark_mode_primary,
      font_heading: body.font_heading,
      font_body: body.font_body,
      updated_at: new Date().toISOString(),
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
