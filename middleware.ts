import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const JWT_SECRET = process.env.JWT_SECRET || "tessro-ultra-secure-jwt-secret-key-32-chars-min!";
const jwtKey = new TextEncoder().encode(JWT_SECRET);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Check if legacy Tessro session token is present
  const tessroToken =
    req.cookies.get("tessro_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  let tessroUser: any = null;
  if (tessroToken) {
    try {
      const { payload } = await jwtVerify(tessroToken, jwtKey, {
        algorithms: ["HS256"],
      });
      tessroUser = payload;
    } catch {
      // invalid token
    }
  }

  // Handle protected routes
  if (isProtectedRoute(req)) {
    // 1. If Tessro legacy session exists:
    if (tessroUser) {
      if (isAdminRoute(req) && tessroUser.role !== "admin" && tessroUser.role !== "staff") {
        const redirectUrl = new URL("/dashboard", req.url);
        redirectUrl.searchParams.set("error", "admin_required");
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.next();
    }

    // 2. Otherwise enforce Clerk authentication
    const session = await auth();
    if (!session.userId) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role check for Clerk in Admin routes
    if (isAdminRoute(req)) {
      const role = (session.sessionClaims?.metadata as any)?.role || (session.sessionClaims as any)?.role;
      if (role !== "admin" && role !== "staff") {
        const redirectUrl = new URL("/dashboard", req.url);
        redirectUrl.searchParams.set("error", "admin_required");
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
