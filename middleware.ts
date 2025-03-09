import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/marketing");

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/marketing/:path*"], // Protect dashboard pages
};
