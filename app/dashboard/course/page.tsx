import { redirect } from "next/navigation";

export default function LegacyCourseRedirectPage() {
  redirect("/dashboard/path");
}
