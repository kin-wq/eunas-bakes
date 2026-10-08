import { connection } from "next/server";
import { AdminDashboard } from "@/app/admin/AdminDashboard";
import { requireAdmin } from "@/app/admin/actions";
import { getSiteContent } from "@/lib/content";

/**
 * Admin dashboard. Always rendered at request time (never prerendered) and
 * double-guarded: proxy redirects anonymous visitors, requireAdmin enforces
 * the session again before any content is read.
 */
export default async function AdminPage() {
  await connection();
  await requireAdmin();
  const content = await getSiteContent();
  return <AdminDashboard initial={content} />;
}
