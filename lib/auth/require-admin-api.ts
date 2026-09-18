import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Require an authenticated administrator for sensitive API diagnostics.
 *
 * Returns a ready-to-send error response when access is denied, or `null`
 * when the caller is an administrator.
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
