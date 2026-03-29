"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveBranding(data: {
  site_name?: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  dark_mode_primary?: string;
  font_heading?: string;
  font_body?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("branding_config")
    .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard", "layout");
  revalidatePath("/admin", "layout");
}   