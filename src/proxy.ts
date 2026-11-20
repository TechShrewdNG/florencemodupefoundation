import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic check only: bounce visitors without a session cookie to the login page.
 * Real authorization happens in requireUser() on every admin page and server action.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!request.cookies.has("fmf_session")) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
