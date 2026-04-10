import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { DashboardLanguageWrapper } from "@/components/DashboardLanguageWrapper";
import Sidebar from "@/components/Sidebar";
import CompanionChat from "@/components/CompanionChat";
import type { Locale } from "@/lib/i18n/translations";

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, language")
    .eq("id", user.id)
    .single();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const isPremium = isAdmin || (sub && sub.plan !== "free" && sub.status === "active");
  const branding = await getBranding();

  const primaryColor = branding?.primary_color ?? "#1a2f5e";
  const siteName = branding?.site_name ?? "PMP Expert";
  const logoUrl = branding?.logo_url;
  const locale = (profile?.language as Locale) || 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const profileName = profile?.full_name || profile?.email || "User";
  const profileInitial = profileName[0].toUpperCase();

  return (
    <DashboardLanguageWrapper initialLocale={locale}>
      <div className="flex h-screen bg-gray-50" dir={dir}>
        <Sidebar
          logoUrl={logoUrl}
          siteName={siteName}
          primaryColor={primaryColor}
          profileName={profileName}
          profileInitial={profileInitial}
          isAdmin={isAdmin}
          isPremium={!!isPremium}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>

        {/* PMP Companion */}
        <CompanionChat />
      </div>
    </DashboardLanguageWrapper>
  );
}
