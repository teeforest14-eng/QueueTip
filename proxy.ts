import { auth } from "@/auth";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

/** NextAuth overloads collide with proxy's `(request)` signature; runtime passes through like middleware. */
type AuthWrappedProxy = (
  request: NextRequest,
  event?: NextFetchEvent,
) => Promise<Response | undefined>;

const withAuth = auth((req) => {
  const path = req.nextUrl.pathname;
  const isApp = path.startsWith("/app");
  const isAdmin = path.startsWith("/admin");

  if ((isApp || isAdmin) && !req.auth) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (isAdmin && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/app/dashboard", req.url));
  }

  return NextResponse.next();
}) as unknown as AuthWrappedProxy;

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  return withAuth(request, event);
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
