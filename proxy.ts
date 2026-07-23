import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, validSessionToken } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute =
    pathname === "/admin/login" || pathname === "/api/admin/login";

  if (isLoginRoute) return NextResponse.next();

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  const isValid = session === (await validSessionToken());

  if (!isValid) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
