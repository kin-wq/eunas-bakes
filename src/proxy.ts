import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  getAdminConfig,
  verifySessionToken,
} from "@/lib/admin-auth";

/**
 * Route guard for the admin area (Next.js 16 `proxy` convention).
 * `/admin/login` stays public; everything else under /admin requires a valid
 * signed session cookie. Admin pages also re-check auth server-side.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const { secret, enabled } = getAdminConfig();
  const valid =
    enabled && token
      ? await verifySessionToken(token, secret).catch(() => false)
      : false;

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
