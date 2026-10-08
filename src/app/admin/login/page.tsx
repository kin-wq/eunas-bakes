import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/LoginForm";
import {
  ADMIN_COOKIE,
  getAdminConfig,
  verifySessionToken,
} from "@/lib/admin-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  // Already signed in → straight to the dashboard.
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const { secret, enabled } = getAdminConfig();
  if (enabled && token && (await verifySessionToken(token, secret).catch(() => false))) {
    redirect(from && from.startsWith("/admin") ? from : "/admin");
  }

  return (
    <div className="mx-auto max-w-md">
      <LoginForm from={from ?? "/admin"} />
      {!enabled ? (
        <p className="mt-4 rounded-2xl bg-gold-400/10 px-4 py-3 text-xs leading-relaxed text-gold-400 ring-1 ring-gold-400/25">
          Admin access is disabled: set EUNAS_ADMIN_PASSWORD (min 8 characters)
          in the environment to enable it.
        </p>
      ) : null}
    </div>
  );
}
