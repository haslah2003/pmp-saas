import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getBranding() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("branding_config")
    .select("*")
    .eq("id", 1)
    .single();
  return data;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const branding = await getBranding();
  const primaryColor = branding?.primary_color ?? "#1a2f5e";
  const siteName = branding?.site_name ?? "PMP Expert";
  const logoUrl = branding?.logo_url;

  const ADMIN_NAV = [
    { href: "/admin/analytics", icon: "📊", label: "Analytics" },
    { href: "/admin/branding", icon: "🎨", label: "Branding" },
    { href: "/admin/media", icon: "🖼️", label: "Media Library" },
    { href: "/admin/resources", icon: "📚", label: "Resource Library" },
  ];

  const LEARN_NAV = [
    { href: "/dashboard", icon: "🏠", label: "Dashboard" },
    { href: "/dashboard/mindmap", icon: "🧠", label: "Mind Map" },
    { href: "/dashboard/course", icon: "📚", label: "Course" },
    { href: "/dashboard/study-studio", icon: "💡", label: "Study Studio" },
    { href: "/dashboard/practice", icon: "✏️", label: "Practice" },
    { href: "/dashboard/exam", icon: "⏱️", label: "Mock Exam" },
    { href: "/dashboard/tutor", icon: "🤖", label: "AiTuTorZ" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-white flex flex-col shrink-0 border-r border-gray-100">

        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-10 object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                P
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{siteName}</div>
                <div className="text-[10px] text-gray-400">Admin Panel</div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Admin</p>
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group"
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                style={{ backgroundColor: primaryColor + '15' }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Learning</p>
            {LEARN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                  style={{ backgroundColor: primaryColor + '15' }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User area */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {(profile?.full_name || profile?.email || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate">
                {profile?.full_name || profile?.email}
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                ADMIN
              </span>
            </div>
          </div>
          <form action="/api/auth/signout" method="post" className="mt-1">
            <button className="w-full text-xs text-gray-400 hover:text-gray-600 py-1.5 transition text-center">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}