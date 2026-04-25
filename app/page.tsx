import { cookies } from "next/headers";
import LandingPageClient from "@/components/LandingPageClient";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ar" ? "ar" : "en";
  return <LandingPageClient lang={lang} />;
}
