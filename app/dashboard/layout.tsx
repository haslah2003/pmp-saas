import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import React from "react";
import { DashboardLanguageWrapper } from "@/components/DashboardLanguageWrapper";
import Sidebar from "@/components/Sidebar";
import CompanionChat from "@/components/CompanionChat";
import { getAccess } from "@/lib/auth/access";
import type { Locale } from "@/lib/i18n/translations";
import { normalizeExamPath } from "@/lib/pmp/exam-paths";

function normalizeLayoutLocale(value: unknown): Locale | null {
  return value === "ar" || value === "en" ? value : null;
}

async function getBranding() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("branding_config")
    .select("*")
    .eq("id", 1)
    .single();

  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, language, active_framework")
    .eq("id", user.id)
    .single();

  // Source of truth for access = profiles.plan + plan_expires_at (see lib/auth/access).
  const { isAdmin, tier } = await getAccess();
  const branding = await getBranding();

  const headerStore = await headers();
  const explicitLocale = normalizeLayoutLocale(headerStore.get("x-pmp-explicit-locale"));
  const profileLocale = normalizeLayoutLocale(profile?.language);
  const locale: Locale = explicitLocale ?? profileLocale ?? "en";

  const primaryColor = branding?.primary_color ?? "#1a2f5e";
  const siteName = branding?.site_name ?? "PMP Expert";
  const logoUrl = branding?.logo_url;
  const activeFramework = normalizeExamPath(profile?.active_framework);

  const profileName = profile?.full_name || profile?.email || "User";
  const profileInitial = profileName[0].toUpperCase();

  return (
    <DashboardLanguageWrapper initialLocale={locale}>
      <Sidebar
        logoUrl={logoUrl}
        siteName={siteName}
        primaryColor={primaryColor}
        profileName={profileName}
        profileInitial={profileInitial}
        isAdmin={isAdmin}
        tier={tier}
        activeFramework={activeFramework}
      />

      <main data-protected-learning-content className="flex-1 overflow-y-auto p-8">{children}</main>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-2 right-3 z-[90] select-none rounded bg-white/70 px-2 py-1 text-[10px] font-semibold text-gray-500/70 backdrop-blur-sm"
      >
        © {new Date().getFullYear()} PMPeco · {profile?.email || user.id.slice(0, 8)} · Licensed for in-platform use only
      </div>

      <CompanionChat activeFramework={activeFramework} />
    </DashboardLanguageWrapper>
  );
}
