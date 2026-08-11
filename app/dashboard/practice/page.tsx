import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PracticeClient from "./PracticeClient";
import { normalizeExamPath } from "@/lib/pmp/exam-paths";

// Practice Lab is the free-tier hook — available to every signed-in user.
export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("language, active_framework")
    .eq("id", user.id)
    .single();

  const activeFramework = normalizeExamPath(profile?.active_framework);

  return <PracticeClient initialFramework={activeFramework} />;
}
