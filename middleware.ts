// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signInUrl } from "./lib/signInUrl";

// Define routes that require authentication
export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/protected/:path*"],
};

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("AUTH_SESSION"); // use actual cookie name

  if (!sessionCookie) {
    return NextResponse.redirect(signInUrl(req.url));
  }

  return NextResponse.next();
}
